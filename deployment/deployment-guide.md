# Deployment guide

The site is static: HTML, CSS, JavaScript, SVG. No build step, no server, no database, no
dependencies. Whatever you upload is exactly what visitors receive.

---

## GitHub Pages (recommended for this project)

1. Create a repository on GitHub.
2. Upload the **contents** of `IMPX_Global_Traders_Website/` so `index.html` is at the repository
   root — not inside a subfolder.
3. Settings → Pages → Build and deployment → Source: **Deploy from a branch**.
4. Branch `main`, folder `/ (root)` → Save.
5. The site is live at `https://USERNAME.github.io/REPO/` within a couple of minutes.

### Things specific to GitHub Pages

- **Keep `.nojekyll`.** Without it, Jekyll runs over the repository and can drop or mangle files.
- **404 page.** GitHub Pages serves `404.html` automatically for unknown paths. Already included.
- **Project-site paths.** All internal links are relative (`about.html`, `assets/css/style.css`),
  so the site works at both `username.github.io/repo/` and a root domain without edits.
- **Custom domain.** Settings → Pages → Custom domain → `www.impxgroup.com`. At your DNS provider,
  add a CNAME record for `www` pointing to `USERNAME.github.io`. Tick "Enforce HTTPS" once the
  certificate is issued (usually under an hour).

---

## Other hosts

| Host | Setup |
|---|---|
| **Netlify** | Drag the folder onto the deploy area, or connect the repo. Build command: none. Publish directory: `/` |
| **Vercel** | Import the repo. Framework preset: **Other**. Build command: none. Output directory: `/` |
| **Cloudflare Pages** | Connect the repo. Build command: none. Output directory: `/` |
| **cPanel / shared hosting** | Upload the folder contents into `public_html` over FTP or the file manager |
| **Amazon S3 + CloudFront** | Upload as a static website. Index document `index.html`, error document `404.html` |

---

## Test before going live

Run through this on a desktop browser and on a real phone.

1. Every page opens and the navigation highlights the current page.
2. The mobile menu opens, closes on link click, and closes with the Escape key.
3. Catalogue: search returns results, each of the five filter groups narrows the list, "Clear all
   filters" resets it, and an impossible combination shows the empty state rather than a blank page.
4. Product links open `product.html` with the right product; an invalid slug shows the
   "not in the catalogue" message rather than an error.
5. "Add to enquiry list" changes its label, the floating counter increments, and the items appear
   on the quote page and pre-fill the product field.
6. All four forms: submit empty (field-level errors appear and focus moves to the first problem),
   then submit complete. With no endpoint configured, the form must say nothing was sent and offer
   the email fallback — that is correct behaviour, not a bug.
7. No broken images anywhere. Open DevTools → Console and confirm there are no errors.
8. Tab through a page with the keyboard: focus is always visible and never trapped.
9. Zoom to 200% and check nothing overlaps or gets cut off.
10. Check the footer year updates automatically and the copyright line is correct.

### Checks that need a live URL

- `https://yourdomain.com/sitemap.xml` loads and lists the right domain
- `https://yourdomain.com/robots.txt` loads
- Google Rich Results Test accepts the Organization and FAQPage structured data
- A shared link shows the right title and description on WhatsApp or LinkedIn
- PageSpeed Insights — the site should score high; it ships no framework and no tracking scripts

---

## Post-launch

1. Update the domain in `sitemap.xml`, `robots.txt` and the canonical tags in each page `<head>`.
2. Submit the sitemap in Google Search Console and Bing Webmaster Tools.
3. Configure the form endpoint and send a real test enquiry end to end.
4. Work through the pre-launch checklist in `CONTENT.md`.
5. If you add analytics, update the cookies section of `privacy.html` **before** it goes live.

---

## Updating a live site

Edit the relevant file, commit and push. GitHub Pages redeploys in under a minute. Most content
changes touch only `data/company.js`, `data/products.js` or `data/markets.js` — no HTML editing
needed.

If a change does not appear, it is almost always browser cache. Hard-refresh with
Ctrl+Shift+R (Cmd+Shift+R on macOS).
