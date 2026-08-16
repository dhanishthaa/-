import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import http from "node:http";

const baseUrl = "http://127.0.0.1:3000/home";
const outputDir = "/home/ubuntu/screenshots";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (response) => {
      let body = "";
      response.on("data", (chunk) => { body += chunk; });
      response.on("end", () => resolve(JSON.parse(body)));
    }).on("error", reject);
  });
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });
  const chrome = spawn("/usr/bin/chromium", [
    "--headless=new", "--no-sandbox", "--disable-gpu", "--remote-debugging-port=9225", "--user-data-dir=/tmp/isth-modal-cdp",
  ], { stdio: "ignore" });

  try {
    let target;
    for (let attempt = 0; attempt < 30; attempt += 1) {
      try {
        const targets = await getJson("http://127.0.0.1:9225/json/list");
        target = targets.find((candidate) => candidate.type === "page");
        if (target) break;
      } catch {
        await sleep(100);
      }
    }
    if (!target) throw new Error("Chrome DevTools endpoint did not start");

    const socket = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", reject, { once: true });
    });

    let sequence = 0;
    const pending = new Map();
    socket.addEventListener("message", ({ data }) => {
      const message = JSON.parse(data);
      const resolve = pending.get(message.id);
      if (resolve) { pending.delete(message.id); resolve(message.result); }
    });
    const send = (method, params = {}) => new Promise((resolve) => {
      const id = ++sequence;
      pending.set(id, resolve);
      socket.send(JSON.stringify({ id, method, params }));
    });

    await send("Page.enable");
    await send("Runtime.enable");

    const capture = async (name, width, height, mobile) => {
      await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile });
      await send("Page.navigate", { url: baseUrl });
      await sleep(1200);
      await send("Runtime.evaluate", { expression: "document.querySelector('.product-visual')?.click()" });
      await sleep(500);
      const inspection = await send("Runtime.evaluate", { expression: `(() => {
        const dialog = document.querySelector('.product-dialog');
        const close = document.querySelector('.dialog-close');
        const rect = dialog?.getBoundingClientRect();
        const closeRect = close?.getBoundingClientRect();
        return JSON.stringify({
          dialogExists: Boolean(dialog), closeExists: Boolean(close),
          viewport: { width: innerWidth, height: innerHeight },
          computed: dialog && { left: getComputedStyle(dialog).left, top: getComputedStyle(dialog).top, transform: getComputedStyle(dialog).transform },
          inViewport: Boolean(rect && rect.left >= 0 && rect.top >= 0 && rect.right <= innerWidth && rect.bottom <= innerHeight),
          closeInViewport: Boolean(closeRect && closeRect.left >= 0 && closeRect.top >= 0 && closeRect.right <= innerWidth && closeRect.bottom <= innerHeight),
          dialog: rect && { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
        });
      })()` , returnByValue: true });
      const shot = await send("Page.captureScreenshot", { format: "png" });
      await fs.writeFile(`${outputDir}/${name}.png`, Buffer.from(shot.data, "base64"));
      await send("Runtime.evaluate", { expression: "document.querySelector('.dialog-close')?.click()" });
      await sleep(400);
      const dismissed = await send("Runtime.evaluate", { expression: "!document.querySelector('.product-dialog')", returnByValue: true });
      return { name, ...JSON.parse(inspection.result.value), dismissed: dismissed.result.value };
    };

    const results = [
      await capture("product-modal-desktop", 1280, 900, false),
      await capture("product-modal-mobile", 375, 812, true),
    ];
    await fs.writeFile(`${outputDir}/product-modal-verification.json`, JSON.stringify(results, null, 2));
    console.log(JSON.stringify(results));
    socket.close();
  } finally {
    chrome.kill("SIGTERM");
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
