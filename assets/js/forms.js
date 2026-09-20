/* ---------------------------------------------------------------------------
   forms.js — validation, spam protection and submission for every form.

   IMPORTANT: this is a static website. Until an endpoint is configured in
   data/company.js (window.IMPX.site.formEndpoint), the form CANNOT send email.
   In that case it does not pretend to: it tells the visitor plainly and opens
   a pre-filled email instead. See README.md → "Configure email".
--------------------------------------------------------------------------- */
(function () {
  "use strict";

  var IMPX = window.IMPX || {};
  var site = IMPX.site || {};
  var company = IMPX.company || {};

  function reference() {
    var d = new Date();
    var stamp = d.getFullYear().toString().slice(2) +
      String(d.getMonth() + 1).padStart(2, "0") +
      String(d.getDate()).padStart(2, "0");
    var rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    return (site.inquiryReferencePrefix || "REF") + "-" + stamp + "-" + rand;
  }

  function setError(field, message) {
    var box = field.closest(".field");
    if (!box) return;
    var out = box.querySelector(".error-text");
    if (!out) return;
    out.textContent = message || "";
    field.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function validate(form) {
    var firstBad = null;
    form.querySelectorAll("input, select, textarea").forEach(function (field) {
      if (field.type === "hidden" || field.closest(".hp")) return;
      var message = "";
      var value = (field.value || "").trim();

      if (field.required && !value && field.type !== "checkbox") {
        message = "Enter " + (field.dataset.label || "this detail") + ".";
      } else if (field.required && field.type === "checkbox" && !field.checked) {
        message = "Tick this box to continue.";
      } else if (field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        message = "Enter a valid business email address.";
      } else if (field.type === "tel" && value && !/^[0-9+()\-.\s]{6,24}$/.test(value)) {
        message = "Enter a phone number using digits, spaces, + ( ) or -.";
      } else if (field.type === "number" && value && Number(value) <= 0) {
        message = "Enter a quantity greater than zero.";
      }

      setError(field, message);
      if (message && !firstBad) firstBad = field;
    });
    return firstBad;
  }

  function payload(form) {
    var data = {};
    new FormData(form).forEach(function (v, k) {
      if (k === "company_website") return;               // honeypot
      data[k] = typeof v === "string" ? v : v.name || "";
    });
    return data;
  }

  function mailtoFor(form, ref) {
    var data = payload(form);
    var lines = Object.keys(data).map(function (k) {
      return k.replace(/_/g, " ") + ": " + data[k];
    });
    lines.unshift("Reference: " + ref, "");
    return "mailto:" + (site.formRecipient || company.email) +
      "?subject=" + encodeURIComponent((form.dataset.subject || "Website enquiry") + " — " + ref) +
      "&body=" + encodeURIComponent(lines.join("\n"));
  }

  function show(status, kind, title, body) {
    status.hidden = false;
    status.className = "form-status form-status--" + kind;
    status.innerHTML = "<strong>" + title + "</strong>" + body;
    status.setAttribute("role", "status");
    status.focus && status.focus();
    status.scrollIntoView({ block: "nearest" });
  }

  document.querySelectorAll("form[data-impx-form]").forEach(function (form) {
    var status = form.querySelector(".form-status");
    var started = Date.now();

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Spam checks: hidden field must stay empty, and a real person takes
      // more than three seconds to complete a B2B enquiry form.
      var hp = form.querySelector('input[name="company_website"]');
      if ((hp && hp.value) || Date.now() - started < 3000) {
        show(status, "err", "This submission was blocked.",
          "<p>The form was completed unusually fast or triggered the spam check. Please review the details and submit again.</p>");
        return;
      }

      var bad = validate(form);
      if (bad) {
        show(status, "err", "Some details still need attention.",
          "<p>The highlighted fields below need to be completed before this enquiry can be sent.</p>");
        bad.focus();
        return;
      }

      var ref = reference();
      var refField = form.querySelector('[name="reference"]');
      if (refField) refField.value = ref;

      var endpoint = site.formEndpoint;

      if (!endpoint) {
        // No backend configured. Do not claim anything was sent.
        var href = mailtoFor(form, ref);
        show(status, "err", "This form is not connected to an email service yet.",
          "<p>Nothing has been sent. Your reference is <strong>" + ref + "</strong>. " +
          'Use <a href="' + href + '">this pre-filled email</a> to send the same details to ' +
          '<a href="mailto:' + (site.formRecipient || company.email) + '">' + (site.formRecipient || company.email) + "</a>, " +
          "or copy them across manually.</p>" +
          "<p>Site owner: configure <code>formEndpoint</code> in <code>data/company.js</code> to switch this on.</p>");
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending…"; }

      fetch(endpoint, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(Object.assign({ reference: ref }, payload(form)))
      }).then(function (res) {
        if (!res.ok) throw new Error("Request failed with status " + res.status);
        show(status, "ok", "Enquiry sent.",
          "<p>Your reference is <strong>" + ref + "</strong>. Keep it for any follow-up. " +
          "A reply usually needs the product, quantity and destination, all of which you have already provided.</p>");
        form.reset();
      }).catch(function () {
        var href = mailtoFor(form, ref);
        show(status, "err", "The enquiry could not be sent.",
          "<p>The form service did not accept the submission, so nothing was delivered. " +
          'Send the same details by <a href="' + href + '">email instead</a>, or try again in a few minutes.</p>');
      }).finally(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = form.dataset.submitLabel || "Send enquiry"; }
      });
    });

    form.addEventListener("reset", function () {
      form.querySelectorAll(".error-text").forEach(function (e) { e.textContent = ""; });
      form.querySelectorAll("[aria-invalid]").forEach(function (e) { e.setAttribute("aria-invalid", "false"); });
      if (status) status.hidden = true;
      started = Date.now();
    });

    form.addEventListener("input", function (e) {
      if (e.target.getAttribute("aria-invalid") === "true") setError(e.target, "");
    });
  });

  /* Pre-fill the product field when arriving from a product page. */
  var params = new URLSearchParams(window.location.search);
  var productParam = params.get("product");
  var categoryParam = params.get("category");
  if (productParam) {
    var pf = document.getElementById("product-name");
    if (pf && !pf.value) pf.value = productParam;
  }
  if (categoryParam) {
    var cf = document.getElementById("product-category");
    if (cf) {
      Array.prototype.slice.call(cf.options).forEach(function (o) {
        if (o.value === categoryParam) cf.value = categoryParam;
      });
    }
  }

  /* Copy-email button on the contact page. */
  document.querySelectorAll("[data-copy-email]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var email = (IMPX.company && IMPX.company.email) || "";
      var done = function (ok) {
        btn.textContent = ok ? "Email address copied" : "Press Ctrl+C to copy";
        window.setTimeout(function () { btn.textContent = "Copy email address"; }, 2500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () { done(true); }, function () { done(false); });
      } else {
        done(false);
      }
    });
  });
})();
