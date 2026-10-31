(function () {
  // Older deployments added this class for the retired red intro. Remove it
  // before the current app paints, including when a browser restores cached DOM.
  document.documentElement.classList.remove("isth-landing-boot");
  if (document.body) document.body.classList.remove("isth-landing-boot");

  var route = new URLSearchParams(window.location.search).get("p");
  var segments = window.location.pathname.split("/").filter(Boolean);
  var appRoutes = ["home", "about", "admin"];
  var isProjectPage = window.location.hostname.endsWith(".github.io") && segments.length > 0 && !appRoutes.includes(segments[0]);
  var basePath = isProjectPage ? "/" + segments[0] : "";

  if (route) {
    window.history.replaceState(null, "", (basePath || "") + route);
  }

  if (window.location.pathname === "/home/" || window.location.pathname === "/about/") {
    window.history.replaceState(null, "", window.location.pathname.slice(0, -1) + window.location.search + window.location.hash);
  }
})();
