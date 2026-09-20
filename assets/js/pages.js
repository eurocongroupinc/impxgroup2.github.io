/* ---------------------------------------------------------------------------
   pages.js — renders the target-market list and the office directory from
   data/markets.js. Empty office fields are hidden rather than filled in.
--------------------------------------------------------------------------- */
(function () {
  "use strict";

  var IMPX = window.IMPX || {};
  var MARKETS = IMPX.markets || [];
  var OFFICES = IMPX.offices || [];

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ------------------------------------------------------- market detail */
  var wrap = document.getElementById("market-list");
  if (wrap) {
    wrap.innerHTML = MARKETS.map(function (m) {
      var rows = [
        ["Product focus", m.productFocus],
        ["Sourcing considerations", m.sourcing],
        ["Logistics considerations", m.logistics],
        ["Regulatory considerations", m.regulatory]
      ].filter(function (r) { return r[1]; }).map(function (r) {
        return "<div><dt>" + esc(r[0]) + "</dt><dd>" + esc(r[1]) + "</dd></div>";
      }).join("");

      return (
        '<article class="card" id="market-' + esc(m.id) + '">' +
          '<div class="tag-row" style="margin-bottom:.7rem">' +
            '<span class="tag tag--sourcing">' + esc(m.status) + "</span>" +
            '<span class="tag tag--tbc">' + esc(m.region) + "</span>" +
          "</div>" +
          "<h3>" + esc(m.name) + "</h3>" +
          "<p>" + esc(m.description) + "</p>" +
          '<dl class="datalist" style="margin-top:1rem">' + rows + "</dl>" +
        "</article>"
      );
    }).join("");
  }

  /* ---------------------------------------------------------- map nodes */
  var mapNodes = document.getElementById("map-nodes");
  if (mapNodes) {
    var W = 100, H = 100;
    var plotted = MARKETS.filter(function (m) { return m.id !== "other"; });
    var home = plotted.filter(function (m) { return m.id === "india"; })[0];

    var lines = home ? plotted.filter(function (m) { return m.id !== "india"; }).map(function (m) {
      var mx = (home.x + m.x) / 2, my = (home.y + m.y) / 2 - 6;
      return '<path d="M' + home.x + " " + home.y + " Q" + mx.toFixed(1) + " " + my.toFixed(1) +
        " " + m.x + " " + m.y + '" fill="none" stroke="#D4922B" stroke-width="0.45" stroke-dasharray="1.6 1.6" opacity="0.8"/>';
    }).join("") : "";

    var dots = plotted.map(function (m) {
      var isHome = m.id === "india";
      var shape = isHome
        ? '<rect x="' + (m.x - 1.7) + '" y="' + (m.y - 1.7) + '" width="3.4" height="3.4" rx="0.6" fill="#FFFFFF"/>'
        : '<circle cx="' + m.x + '" cy="' + m.y + '" r="1.7" fill="#E9B865"/>';
      return (
        '<a class="market-node" href="#market-' + esc(m.id) + '" aria-label="' + esc(m.name) + " — " + esc(m.status) + '">' +
          '<circle cx="' + m.x + '" cy="' + m.y + '" r="3.6" fill="#FFFFFF" opacity="0.08"/>' +
          shape +
          '<text x="' + m.x + '" y="' + (m.y - 3.4) + '" text-anchor="middle" font-size="2.9" fill="#DCE7F2" font-family="IBM Plex Sans, sans-serif">' + esc(m.name) + "</text>" +
        "</a>"
      );
    }).join("");

    mapNodes.innerHTML = lines + dots;
  }

  /* --------------------------------------------------- office directory */
  var officeWrap = document.getElementById("office-list");
  if (officeWrap) {
    officeWrap.innerHTML = OFFICES.map(function (o) {
      var rows = [
        ["Address", o.address],
        ["Phone", o.phone],
        ["Email", o.email],
        ["Operating hours", o.hours]
      ].filter(function (r) { return r[1]; }).map(function (r) {
        var val = r[0] === "Email"
          ? '<a href="mailto:' + esc(r[1]) + '">' + esc(r[1]) + "</a>"
          : esc(r[1]);
        return "<div><dt>" + esc(r[0]) + "</dt><dd>" + val + "</dd></div>";
      }).join("");

      var pending = rows
        ? ""
        : '<p class="muted">Address and direct contact details for this location are not published yet. Enquiries for this city are handled on the main company email.</p>';

      return (
        '<article class="card">' +
          "<h3>" + esc(o.city) + "</h3>" +
          '<p style="margin-bottom:.8rem">' + esc(o.role) + "</p>" +
          '<div class="tag-row" style="margin-bottom:.8rem"><span class="tag tag--sourcing">' + esc(o.status) + "</span></div>" +
          (rows ? '<dl class="datalist">' + rows + "</dl>" : pending) +
          (o.mapUrl ? '<p style="margin-top:.8rem"><a href="' + esc(o.mapUrl) + '" rel="noopener">Open in maps</a></p>' : "") +
        "</article>"
      );
    }).join("");
  }
})();
