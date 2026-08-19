(function () {
  var route = new URLSearchParams(window.location.search).get("p");
  var segments = window.location.pathname.split("/").filter(Boolean);
  var appRoutes = ["home", "about", "admin"];
  var isProjectPage = window.location.hostname.endsWith(".github.io") && segments.length > 0 && !appRoutes.includes(segments[0]);
  var basePath = isProjectPage ? "/" + segments[0] : "";

  if (route) {
    window.history.replaceState(null, "", (basePath || "") + route);
  }

  if (window.location.pathname === "/" || (basePath && window.location.pathname === basePath + "/")) {
    document.documentElement.classList.add("isth-landing-boot");
  }
})();
