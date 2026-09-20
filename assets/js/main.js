/* ---------------------------------------------------------------------------
   main.js — navigation, company data binding, inquiry list, back-to-top.
   Runs on every page. No dependencies.
--------------------------------------------------------------------------- */
(function () {
  "use strict";

  var IMPX = window.IMPX || {};
  var company = IMPX.company || {};

  /* ------------------------------------------------------------ mobile nav */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.querySelector(".nav-toggle__label").textContent = open ? "Close" : "Menu";
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.querySelector(".nav-toggle__label").textContent = "Menu";
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ----------------------------------------------- company data injection */
  function valueFor(key) {
    if (key === "year") return String(new Date().getFullYear());
    if (key === "emailLink") return "mailto:" + (company.email || "");
    return company[key] != null ? String(company[key]) : "";
  }

  document.querySelectorAll("[data-company]").forEach(function (el) {
    var key = el.getAttribute("data-company");
    var value = valueFor(key);
    if (!value) {
      // Never print an empty or invented value — remove the holder instead.
      var hideTarget = el.closest("[data-company-hide]") || el;
      hideTarget.hidden = true;
      return;
    }
    if (el.tagName === "A" && key === "email") {
      el.href = "mailto:" + value;
      if (!el.textContent.trim()) el.textContent = value;
      else el.textContent = value;
    } else if (el.hasAttribute("data-company-attr")) {
      el.setAttribute(el.getAttribute("data-company-attr"), value);
    } else {
      el.textContent = value;
    }
  });

  /* -------------------------------------------------------- inquiry list */
  var STORE = "impx.inquiry.v1";

  function readList() {
    try {
      var raw = window.localStorage.getItem(STORE);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function writeList(list) {
    try {
      window.localStorage.setItem(STORE, JSON.stringify(list));
    } catch (e) {
      /* storage unavailable — the list simply does not persist */
    }
    paintTray();
    document.dispatchEvent(new CustomEvent("impx:inquirychange", { detail: list }));
  }

  function paintTray() {
    var list = readList();
    document.querySelectorAll("[data-tray]").forEach(function (el) {
      el.setAttribute("data-count", String(list.length));
      var c = el.querySelector(".tray__count");
      if (c) c.textContent = String(list.length);
      var l = el.querySelector(".tray__label");
      if (l) l.textContent = list.length === 1 ? "1 item in your enquiry" : list.length + " items in your enquiry";
    });
    document.querySelectorAll("[data-add-inquiry]").forEach(function (btn) {
      var slug = btn.getAttribute("data-add-inquiry");
      var inList = list.some(function (i) { return i.slug === slug; });
      btn.textContent = inList ? "In your enquiry list" : "Add to enquiry list";
      btn.setAttribute("aria-pressed", String(inList));
    });
  }

  window.IMPXInquiry = {
    all: readList,
    add: function (item) {
      var list = readList();
      if (!list.some(function (i) { return i.slug === item.slug; })) list.push(item);
      writeList(list);
    },
    remove: function (slug) {
      writeList(readList().filter(function (i) { return i.slug !== slug; }));
    },
    toggle: function (item) {
      var list = readList();
      if (list.some(function (i) { return i.slug === item.slug; })) this.remove(item.slug);
      else this.add(item);
    },
    clear: function () { writeList([]); }
  };

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-add-inquiry]");
    if (!btn) return;
    e.preventDefault();
    window.IMPXInquiry.toggle({
      slug: btn.getAttribute("data-add-inquiry"),
      name: btn.getAttribute("data-inquiry-name") || btn.getAttribute("data-add-inquiry")
    });
  });

  paintTray();

  /* -------------------------------------------------------- back to top */
  var toTop = document.querySelector(".to-top");
  if (toTop) {
    var onScroll = function () {
      toTop.classList.toggle("is-visible", window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    toTop.addEventListener("click", function () {
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      var first = document.querySelector("main h1, main");
      if (first) { first.setAttribute("tabindex", "-1"); first.focus({ preventScroll: true }); }
    });
  }

  /* ------------------------------------------------------------- footer */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
