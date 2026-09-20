/* ---------------------------------------------------------------------------
   catalog.js — builds the product catalogue, the filters and the detail page
   from data/products.js. Add products in that file, not here.
--------------------------------------------------------------------------- */
(function () {
  "use strict";

  var IMPX = window.IMPX || {};
  var PRODUCTS = IMPX.products || [];
  var CATEGORIES = IMPX.categories || [];

  var STATUS_CLASS = {
    "Available on Request": "tag--request",
    "Sourcing in Progress": "tag--progress",
    "Custom Sourcing": "tag--custom",
    "Indicative Listing": "tag--tbc",
    "To Be Confirmed": "tag--tbc"
  };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function catName(id) {
    var c = CATEGORIES.filter(function (x) { return x.id === id; })[0];
    return c ? c.name : id;
  }

  function unique(list) {
    return list.filter(function (v, i, a) { return v && a.indexOf(v) === i; }).sort();
  }

  function productCard(p) {
    return (
      '<article class="product-card">' +
        '<div class="product-card__media">' +
          '<img src="' + esc(p.image) + '" alt="' + esc(p.imageAlt) + '" loading="lazy" width="800" height="600">' +
        "</div>" +
        '<div class="product-card__body">' +
          '<p class="product-card__sub">' + esc(catName(p.category)) + " · " + esc(p.subcategory) + "</p>" +
          "<h3><a href=\"product.html?p=" + encodeURIComponent(p.slug) + '">' + esc(p.name) + "</a></h3>" +
          '<p class="product-card__desc">' + esc(p.short) + "</p>" +
          '<div class="tag-row">' +
            '<span class="tag ' + (STATUS_CLASS[p.status] || "tag--tbc") + '">' + esc(p.status) + "</span>" +
            '<span class="tag tag--sourcing">' + esc(p.sourcingType) + "</span>" +
          "</div>" +
          '<div class="product-card__foot">' +
            '<a class="btn btn--ink btn--sm" href="quote.html?product=' + encodeURIComponent(p.name) + '">Request a quote</a>' +
            '<button class="link-btn" type="button" data-add-inquiry="' + esc(p.slug) + '" data-inquiry-name="' + esc(p.name) + '">Add to enquiry list</button>' +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  /* ====================================================== catalogue page */
  var grid = document.getElementById("product-grid");
  if (grid) {
    var form = document.getElementById("filter-form");
    var searchInput = document.getElementById("product-search");
    var countEl = document.getElementById("result-count");
    var params = new URLSearchParams(window.location.search);

    function buildFilterGroup(legend, name, values) {
      return (
        "<fieldset>" +
          "<legend>" + esc(legend) + "</legend>" +
          values.map(function (v) {
            return (
              "<label><input type=\"checkbox\" name=\"" + name + '" value="' + esc(v) + '"> <span>' + esc(v) + "</span></label>"
            );
          }).join("") +
        "</fieldset>"
      );
    }

    // Build the filter controls from the data so they never fall out of sync.
    form.insertAdjacentHTML("beforeend",
      buildFilterGroup("Category", "category", CATEGORIES.map(function (c) { return c.name; })) +
      buildFilterGroup("Subcategory", "subcategory", unique(PRODUCTS.map(function (p) { return p.subcategory; }))) +
      buildFilterGroup("Availability", "status", unique(PRODUCTS.map(function (p) { return p.status; }))) +
      buildFilterGroup("Sourcing type", "sourcingType", unique(PRODUCTS.map(function (p) { return p.sourcingType; }))) +
      buildFilterGroup("Application", "application", unique([].concat.apply([], PRODUCTS.map(function (p) { return p.applications || []; })))) +
      '<button type="button" class="btn btn--outline btn--sm btn--block" id="clear-filters">Clear all filters</button>'
    );

    // Deep links such as products.html?category=Electronics pre-select a filter.
    ["category", "subcategory", "status", "sourcingType", "application"].forEach(function (key) {
      var wanted = params.getAll(key);
      if (!wanted.length) return;
      form.querySelectorAll('input[name="' + key + '"]').forEach(function (input) {
        if (wanted.indexOf(input.value) > -1) input.checked = true;
      });
    });
    if (params.get("q")) searchInput.value = params.get("q");

    function checkedValues(name) {
      return Array.prototype.slice
        .call(form.querySelectorAll('input[name="' + name + '"]:checked'))
        .map(function (i) { return i.value; });
    }

    function matches(p, term) {
      var cats = checkedValues("category");
      if (cats.length && cats.indexOf(catName(p.category)) === -1) return false;
      var subs = checkedValues("subcategory");
      if (subs.length && subs.indexOf(p.subcategory) === -1) return false;
      var sts = checkedValues("status");
      if (sts.length && sts.indexOf(p.status) === -1) return false;
      var src = checkedValues("sourcingType");
      if (src.length && src.indexOf(p.sourcingType) === -1) return false;
      var apps = checkedValues("application");
      if (apps.length && !(p.applications || []).some(function (a) { return apps.indexOf(a) > -1; })) return false;

      if (term) {
        var haystack = [
          p.name, p.short, p.full, p.subcategory, catName(p.category),
          p.sourcingType, p.status, (p.applications || []).join(" "),
          (p.specs || []).map(function (s) { return s.label + " " + s.value; }).join(" ")
        ].join(" ").toLowerCase();
        if (haystack.indexOf(term) === -1) return false;
      }
      return true;
    }

    function render() {
      var term = (searchInput.value || "").trim().toLowerCase();
      var visible = PRODUCTS.filter(function (p) { return matches(p, term); });

      countEl.textContent = visible.length === 1
        ? "1 product matches"
        : visible.length + " products match";

      grid.innerHTML = visible.length
        ? visible.map(productCard).join("")
        : '<div class="empty-state"><h3>No products match these filters</h3>' +
          "<p>Try removing a filter, or send the requirement directly — items outside the published catalogue are sourced on request.</p>" +
          '<a class="btn btn--primary" href="custom-sourcing.html">Send a custom requirement</a></div>';

      document.dispatchEvent(new CustomEvent("impx:inquirychange"));
      if (window.IMPXInquiry) {
        // repaint add/remove button labels for the newly drawn cards
        var list = window.IMPXInquiry.all();
        grid.querySelectorAll("[data-add-inquiry]").forEach(function (btn) {
          var inList = list.some(function (i) { return i.slug === btn.getAttribute("data-add-inquiry"); });
          btn.textContent = inList ? "In your enquiry list" : "Add to enquiry list";
          btn.setAttribute("aria-pressed", String(inList));
        });
      }
    }

    form.addEventListener("change", render);
    searchInput.addEventListener("input", render);
    document.getElementById("clear-filters").addEventListener("click", function () {
      form.querySelectorAll("input[type=checkbox]").forEach(function (i) { i.checked = false; });
      searchInput.value = "";
      render();
    });
    document.addEventListener("impx:inquirychange", function () { /* labels repainted by main.js */ });

    render();
  }

  /* ================================================== product detail page */
  var detail = document.getElementById("product-detail");
  if (detail) {
    var slug = new URLSearchParams(window.location.search).get("p");
    var product = PRODUCTS.filter(function (p) { return p.slug === slug; })[0];

    if (!product) {
      detail.innerHTML =
        '<div class="empty-state" style="grid-column:1/-1">' +
          "<h3>That product is not in the catalogue</h3>" +
          "<p>The link may be out of date. Browse the full catalogue, or send the requirement and it will be sourced directly.</p>" +
          '<div class="btn-row" style="justify-content:center">' +
            '<a class="btn btn--ink" href="products.html">Browse products</a>' +
            '<a class="btn btn--outline" href="custom-sourcing.html">Send a requirement</a>' +
          "</div>" +
        "</div>";
      return;
    }

    document.title = product.name + " | IMPX Global Traders Private Limited";
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", product.short);

    var crumbName = document.getElementById("crumb-product");
    if (crumbName) crumbName.textContent = product.name;

    var specRows = (product.specs || []).map(function (s) {
      return "<tr><th scope=\"row\">" + esc(s.label) + "</th><td>" + esc(s.value) + "</td></tr>";
    }).join("");

    var supplyRows = [
      ["Supply type", product.sourcingType],
      ["Product status", product.status],
      ["Packaging", product.packaging],
      ["Minimum order quantity", product.moq],
      ["Lead time", product.leadTime],
      ["Origin", product.origin],
      ["Customisation", product.customization],
      ["Compliance and documentation", product.compliance]
    ].map(function (r) {
      return "<tr><th scope=\"row\">" + esc(r[0]) + "</th><td>" + esc(r[1]) + "</td></tr>";
    }).join("");

    detail.innerHTML =
      '<div class="product-detail__media">' +
        '<img src="' + esc(product.image) + '" alt="' + esc(product.imageAlt) + '" width="800" height="600">' +
      "</div>" +
      "<div>" +
        '<p class="muted">' + esc(catName(product.category)) + " · " + esc(product.subcategory) + " · " + esc(product.id) + "</p>" +
        "<h1>" + esc(product.name) + "</h1>" +
        '<div class="tag-row" style="margin-bottom:1.1rem">' +
          '<span class="tag ' + (STATUS_CLASS[product.status] || "tag--tbc") + '">' + esc(product.status) + "</span>" +
          '<span class="tag tag--sourcing">' + esc(product.sourcingType) + "</span>" +
        "</div>" +
        "<p>" + esc(product.full) + "</p>" +
        '<div class="detail-actions">' +
          '<p class="price-note">Request a quote</p>' +
          '<p class="muted">Prices depend on specification, quantity, destination and the supplier selected, so no price is published for this item.</p>' +
          '<div class="btn-row">' +
            '<a class="btn btn--primary" href="quote.html?product=' + encodeURIComponent(product.name) + '">Request a quote</a>' +
            '<button class="btn btn--outline" type="button" data-add-inquiry="' + esc(product.slug) + '" data-inquiry-name="' + esc(product.name) + '">Add to enquiry list</button>' +
          "</div>" +
        "</div>" +
        '<table class="spec-table"><caption>Key specifications</caption><tbody>' + specRows + "</tbody></table>" +
        '<table class="spec-table"><caption>Supply information</caption><tbody>' + supplyRows + "</tbody></table>" +
        "<h2>Applications</h2>" +
        "<ul>" + (product.applications || []).map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ul>" +
        '<div class="notice"><p><strong>Specification note.</strong> Values shown as “to be confirmed” are settled in writing before quotation. Nothing on this page is a binding offer, and availability, price and lead time are confirmed per enquiry.</p></div>' +
      "</div>";

    // related products
    var relatedWrap = document.getElementById("related-products");
    if (relatedWrap) {
      var related = (product.related || [])
        .map(function (s) { return PRODUCTS.filter(function (p) { return p.slug === s; })[0]; })
        .filter(Boolean);
      if (related.length) {
        relatedWrap.innerHTML = related.map(productCard).join("");
      } else {
        relatedWrap.closest("section").hidden = true;
      }
    }

    if (window.IMPXInquiry) {
      var list = window.IMPXInquiry.all();
      document.querySelectorAll("[data-add-inquiry]").forEach(function (btn) {
        var inList = list.some(function (i) { return i.slug === btn.getAttribute("data-add-inquiry"); });
        btn.textContent = inList ? "In your enquiry list" : "Add to enquiry list";
        btn.setAttribute("aria-pressed", String(inList));
      });
    }
  }

  /* ============================================ homepage featured products */
  var featured = document.getElementById("featured-products");
  if (featured) {
    var picks = ["industrial-fasteners-and-bolts", "industrial-control-panels", "rice-and-rice-based-products",
                 "industrial-valves", "led-lighting-products", "pulses-and-legumes"];
    featured.innerHTML = picks
      .map(function (s) { return PRODUCTS.filter(function (p) { return p.slug === s; })[0]; })
      .filter(Boolean).map(productCard).join("");
  }

  /* =================================================== category card grid */
  var catGrid = document.getElementById("category-grid");
  if (catGrid) {
    catGrid.innerHTML = CATEGORIES.map(function (c) {
      return (
        '<article class="cat-card">' +
          '<img src="' + esc(c.image) + '" alt="' + esc(c.imageAlt) + '" loading="lazy" width="640" height="420">' +
          '<div class="cat-card__body">' +
            "<h3>" + esc(c.name) + "</h3>" +
            "<p>" + esc(c.blurb) + "</p>" +
            '<div class="btn-row">' +
              '<a class="btn btn--ink btn--sm" href="products.html?category=' + encodeURIComponent(c.name) + '">View products</a>' +
              '<a class="btn btn--outline btn--sm" href="quote.html?category=' + encodeURIComponent(c.name) + '">Request a quote</a>' +
            "</div>" +
          "</div>" +
        "</article>"
      );
    }).join("");
  }

  /* ======================================================= enquiry basket */
  var basket = document.getElementById("inquiry-basket");
  if (basket && window.IMPXInquiry) {
    var paint = function () {
      var list = window.IMPXInquiry.all();
      if (!list.length) {
        basket.innerHTML = '<p class="muted">Your enquiry list is empty. Add products from the catalogue and they will appear here, ready to send with one request.</p>';
        return;
      }
      basket.innerHTML =
        '<ul class="inquiry-list">' +
          list.map(function (i) {
            return "<li><span>" + esc(i.name) + '</span><button class="link-btn" type="button" data-remove-inquiry="' + esc(i.slug) + '">Remove</button></li>';
          }).join("") +
        "</ul>" +
        '<button class="link-btn" type="button" id="clear-inquiry">Clear the whole list</button>';
    };
    basket.addEventListener("click", function (e) {
      var rm = e.target.closest("[data-remove-inquiry]");
      if (rm) { window.IMPXInquiry.remove(rm.getAttribute("data-remove-inquiry")); paint(); syncField(); }
      if (e.target.id === "clear-inquiry") { window.IMPXInquiry.clear(); paint(); syncField(); }
    });
    var syncField = function () {
      var field = document.getElementById("product-name");
      if (!field) return;
      var list = window.IMPXInquiry.all();
      if (list.length && !field.value) field.value = list.map(function (i) { return i.name; }).join(", ");
    };
    paint();
    syncField();
  }
})();
