import { useEffect, useRef, useState, type RefObject } from "react";
import { ImagePlus, Save, Trash2, Upload, X } from "lucide-react";
import {
  DEFAULT_ATELIER,
  DEFAULT_WEBSITE_CONTENT,
  deletePublicAsset,
  fetchPublicAtelier,
  fetchWebsiteContent,
  sanitizeRichText,
  saveAtelier,
  saveWebsiteContent,
  type AtelierMedia,
  type WebsiteContentItem,
  uploadPublicAsset,
} from "@/lib/supabase";

export const EDITOR_FONTS = ["Italiana", "Manrope"];

function RichToolbar({ editorRef }: { editorRef: RefObject<HTMLDivElement | null> }) {
  const command = (name: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(name, false, value);
  };
  const color = () => {
    const value = window.prompt("HEX color", "#810100");
    if (value && /^#[0-9a-f]{6}$/i.test(value)) command("foreColor", value);
  };

  return (
    <div className="rich-toolbar">
      <button type="button" onClick={() => command("bold")}>B</button>
      <button type="button" onClick={() => command("italic")}><i>I</i></button>
      <button type="button" onClick={() => command("underline")}><u>U</u></button>
      <label title="Font preview">
        <select onChange={(event) => command("fontName", event.target.value)} defaultValue="Manrope">
          {EDITOR_FONTS.map((font) => <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>)}
        </select>
      </label>
      <select onChange={(event) => command("fontSize", event.target.value)} defaultValue="3">
        <option value="1">Small</option><option value="3">Medium</option><option value="5">Large</option><option value="7">Huge</option>
      </select>
      <input type="color" defaultValue="#810100" onChange={(event) => command("foreColor", event.target.value)} aria-label="Choose text color" />
      <button type="button" onClick={color}>HEX</button>
    </div>
  );
}

export function AtelierAdmin({ onStatus }: { onStatus: (message: string) => void }) {
  const [items, setItems] = useState<AtelierMedia[]>(DEFAULT_ATELIER);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;
    void fetchPublicAtelier().then((remote) => {
      if (mounted && remote !== null) setItems(remote);
    }).catch(() => undefined);
    return () => { mounted = false; };
  }, []);

  const update = (id: string, patch: Partial<AtelierMedia>) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item));
  };

  const upload = async (id: string, file: File | undefined, target: "largeUrl" | "smallUrl") => {
    if (!file) return;
    setBusy(true);
    onStatus(`Uploading ${target === "largeUrl" ? "large-screen" : "small-screen"} media…`);
    const kind = file.type.startsWith("video/") ? "video" : "image";
    const url = await uploadPublicAsset(file, target === "largeUrl" ? "atelier-large" : "atelier-small");
    setBusy(false);
    if (!url) return onStatus("Upload failed. Check file type, size, storage policy, and secure session.");
    update(id, { [target]: url, kind });
    onStatus("Uploaded. Save Atelier to publish it.");
  };

  const addItem = () => setItems((current) => [
    ...current,
    { id: crypto.randomUUID(), kind: "image", largeUrl: "", smallUrl: "", caption: "", description: "New Atelier composition" },
  ]);

  const save = async () => {
    setBusy(true);
    const valid = items
      .filter((item) => item.largeUrl && item.smallUrl)
      .map((item) => ({
        ...item,
        caption: item.caption?.trim().slice(0, 80) || "",
        description: sanitizeRichText(item.description),
      }));
    const ok = await saveAtelier(valid);
    setBusy(false);
    onStatus(ok ? "Atelier saved and published." : "Atelier save failed. Check that the Atelier Supabase migration is applied and your secure session is active.");
    if (ok) setItems(valid);
  };

  const remove = async (item: AtelierMedia) => {
    const next = items.filter((entry) => entry.id !== item.id);
    const ok = await saveAtelier(next);
    if (!ok) return onStatus("Delete was not published; the item remains active.");
    await Promise.all([item.largeUrl, item.smallUrl]
      .filter((url) => url.includes("/storage/v1/object/public/"))
      .map(deletePublicAsset));
    setItems(next);
    onStatus("Atelier item deleted and stored media removed.");
  };

  const move = (index: number, direction: -1 | 1) => {
    const next = [...items];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
  };

  return (
    <section className="admin-feature-panel">
      <div className="admin-section-head">
        <div>
          <p className="eyebrow">Atelier</p>
          <h2>Media &amp; descriptions</h2>
          <p className="admin-panel-note">Each item keeps its media, caption, responsive versions, order, and description together.</p>
        </div>
        <div className="admin-inline-actions">
          <button className="outline-button dark" onClick={addItem}><ImagePlus size={14} /> Add item</button>
          <button className="cherry-button" onClick={() => void save()} disabled={busy}><Save size={14} /> Save Atelier</button>
        </div>
      </div>
      {items.length === 0 ? <p className="admin-panel-note">No Atelier items are published. Add an item to begin.</p> : (
        <div className="atelier-admin-list">
          {items.map((item, index) => (
            <article className="atelier-admin-card" key={item.id}>
              <div className="atelier-admin-preview">
                {item.largeUrl ? item.kind === "video"
                  ? <video src={item.largeUrl} controls muted preload="metadata" />
                  : <img src={item.largeUrl} alt={item.caption || `Atelier item ${index + 1}`} />
                  : <div className="atelier-empty">Upload media</div>}
              </div>
              <div className="atelier-admin-fields">
                <div className="atelier-admin-row">
                  <strong>Item {index + 1}</strong>
                  <div className="admin-row-actions">
                    <button onClick={() => move(index, -1)} disabled={index === 0}>↑</button>
                    <button onClick={() => move(index, 1)} disabled={index === items.length - 1}>↓</button>
                    <button onClick={() => void remove(item)} aria-label="Delete Atelier item"><Trash2 size={14} /></button>
                  </div>
                </div>
                <label>Large-screen image/video<label className="upload-control"><Upload size={13} /> Replace large<input type="file" accept="image/*,video/mp4,video/webm" onChange={(event) => { void upload(item.id, event.target.files?.[0], "largeUrl"); event.currentTarget.value = ""; }} /></label></label>
                <label>Small-screen image/video<label className="upload-control"><Upload size={13} /> Replace small<input type="file" accept="image/*,video/mp4,video/webm" onChange={(event) => { void upload(item.id, event.target.files?.[0], "smallUrl"); event.currentTarget.value = ""; }} /></label></label>
                <label>Photo caption<input maxLength={80} value={item.caption ?? ""} onChange={(event) => update(item.id, { caption: event.target.value })} placeholder="e.g. SACRÉE MARINE" /></label>
                <label>Description</label>
                <RichTextField value={item.description} onChange={(html) => update(item.id, { description: html })} />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function RichTextField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  useEffect(() => {
    if (ref.current && !initialized.current) {
      ref.current.innerHTML = value;
      initialized.current = true;
    }
  }, [value]);
  return (
    <div className="rich-editor">
      <RichToolbar editorRef={ref} />
      <div ref={ref} contentEditable suppressContentEditableWarning onInput={(event) => onChange(sanitizeRichText(event.currentTarget.innerHTML))} className="rich-editor-canvas" />
    </div>
  );
}

export function WebsiteContentAdmin({ onStatus }: { onStatus: (message: string) => void }) {
  const [items, setItems] = useState<WebsiteContentItem[]>(DEFAULT_WEBSITE_CONTENT);
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState<WebsiteContentItem | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void fetchWebsiteContent().then((remote) => { if (remote?.length) setItems(remote); });
  }, []);

  const filtered = items.filter((item) => `${item.page} ${item.section} ${item.label} ${item.html}`.toLowerCase().includes(query.toLowerCase()));
  const update = (id: string, html: string) => setItems((current) => current.map((item) => item.id === id ? { ...item, html } : item));
  const save = async () => {
    setBusy(true);
    const ok = await saveWebsiteContent(items.map((item) => ({ ...item, html: sanitizeRichText(item.html) })));
    setBusy(false);
    onStatus(ok ? "Website Content saved and published." : "Website Content save failed. Apply the Supabase migration and check your secure session.");
  };

  return (
    <section className="admin-feature-panel">
      <div className="admin-section-head">
        <div>
          <p className="eyebrow">Website Content / Master Editor</p>
          <h2>Every visible word, in one room.</h2>
          <p className="admin-panel-note">Search by page or section. Select individual words or letters to style them, preview, save, or restore originals.</p>
        </div>
        <button className="cherry-button" onClick={() => void save()} disabled={busy}><Save size={14} /> Save content</button>
      </div>
      <input className="content-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find Home, About, Quote, heading…" />
      <div className="content-editor-list">
        {filtered.map((item) => (
          <article className={`content-editor-card ${item.deleted ? "is-deleted" : ""}`} key={item.id}>
            <div><span className="eyebrow">{item.page} / {item.section}</span><h3>{item.label}</h3></div>
            <RichTextField value={item.html} onChange={(html) => update(item.id, html)} />
            <div className="content-card-actions">
              <button className="outline-button dark" onClick={() => setPreview(item)}>Preview</button>
              <button className="plain-button" onClick={() => update(item.id, "")}>Delete text</button>
              <button className="plain-button" onClick={() => update(item.id, item.originalHtml)}>Restore original</button>
            </div>
          </article>
        ))}
      </div>
      {preview && (
        <div className="content-preview">
          <button onClick={() => setPreview(null)} aria-label="Close preview"><X size={16} /></button>
          <span className="eyebrow">Preview</span>
          <div dangerouslySetInnerHTML={{ __html: sanitizeRichText(preview.html) }} />
        </div>
      )}
    </section>
  );
}
