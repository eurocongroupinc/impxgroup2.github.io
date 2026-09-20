# IMPX Global Traders — corporate website

A complete, production-ready B2B corporate website for **IMPX GLOBAL TRADERS PRIVATE LIMITED**.

Built as plain HTML, CSS and JavaScript with **no build step and no dependencies**, so it can be
hosted on GitHub Pages (or any static host) by uploading the folder as-is. There is nothing to
compile, install or configure before it works.

- 18 pages, fully responsive, keyboard accessible
- 24-product catalogue with search, five filter groups and detail pages
- Enquiry list ("add to enquiry") that carries products through to the quote form
- Four validated forms with spam protection
- Original SVG logo and 34 original illustrations — no stock photography, no third-party marks
- SEO metadata, Open Graph tags, sitemap, robots.txt and Organization/FAQ structured data

---

## 1. Run it locally

**Option A — no tools at all.** Double-click `index.html`. Everything works except the pages that
read the data files over `fetch` (there are none — data is loaded as plain scripts), so this is
genuinely fine for a quick look.

**Option B — a local server** (closer to how it behaves when hosted):

```bash
# Python (already installed on macOS and most Linux systems)
python3 -m http.server 8000

# or Node
npx serve .
```

Then open <http://localhost:8000>.

There are no dependencies to install. `package.json` exists only to provide the `npm start`
shortcut; the site does not need Node to run.

---

## 2. Deploy to GitHub Pages

1. Create a new repository on GitHub (public or private — Pages works with both on paid plans;
   public repos get Pages on the free plan).
2. Upload the **contents** of this folder to the repository root, so that `index.html` sits at the
   top level. Either drag the files into the GitHub web uploader, or:

   ```bash
   git init
   git add .
   git commit -m "IMPX Global Traders website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```

3. In the repository, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Select branch `main`, folder `/ (root)`, then **Save**.
6. Wait a minute or two. Your site appears at `https://YOUR-USERNAME.github.io/YOUR-REPO/`.

The `.nojekyll` file in this folder is deliberate — it stops GitHub's Jekyll processor from
interfering with the `assets` folder. Do not delete it.

**Custom domain.** Settings → Pages → Custom domain, enter `www.impxgroup.com`, and add a CNAME
record at your DNS provider pointing to `YOUR-USERNAME.github.io`. GitHub writes a `CNAME` file
into the repo automatically. Then update the three places listed in section 6 below.

**Other hosts.** Netlify, Vercel, Cloudflare Pages and standard cPanel hosting all work the same
way: upload the folder, no build command, publish directory is the folder itself.

---

## 3. Update company information

Everything about the company lives in **`data/company.js`**. Edit that one file and the change
appears on every page.

```js
phone: "",                    // empty  → the field is hidden site-wide
phone: "+91 22 0000 0000",    // filled → it appears in the header, contact page and footer
```

Fields left as `""` are **hidden, not printed empty**. That is intentional: the site never shows an
invented address or phone number. Fill them in as you verify them.

The same file holds `cin`, `gstin`, `iec`, `registeredAddress`, `businessHours`, `certifications`
and the social profile links.

---

## 4. Update products

Products live in **`data/products.js`** as a plain array. Copy an existing entry, change the
values, and it appears in the catalogue, the filters, the search index and its own detail page
automatically.

Required keys: `id`, `slug`, `name`, `category`, `subcategory`, `short`, `full`, `image`,
`imageAlt`, `status`, `sourcingType`, `applications`, `specs`, `packaging`, `moq`, `leadTime`,
`origin`, `compliance`, `customization`, `related`.

- `slug` must be unique — it is the URL (`product.html?p=your-slug`).
- `status` must be one of: `Available on Request`, `Sourcing in Progress`, `Custom Sourcing`,
  `Indicative Listing`, `To Be Confirmed`.
- `sourcingType` must be one of: `Third-Party Sourcing`, `Sourced from Partner`, `Custom Sourcing`,
  `Available on Request`, `Manufactured by IMPX`.
- **Use `Manufactured by IMPX` only where in-house production is genuinely verified.** No product
  currently uses it, by design.

Markets and offices work the same way, in **`data/markets.js`**.

---

## 5. Replace images

All illustrations are original SVG files created for this project, stored in
`assets/images/`. They are drawings, not photographs, and they contain no logos, no recognisable
people and no third-party content.

To swap in real photography:

1. Drop your file into the matching folder, e.g.
   `assets/images/products/industrial/my-photo.jpg`.
2. Point the product's `image` key at it in `data/products.js`.
3. Update `imageAlt` to describe what the photo actually shows.
4. Record the source and licence in `assets/image-sources.md`.

Recommended: 4:3 ratio, at least 1200px wide, WebP or optimised JPEG, under 200 KB each.
Lazy loading and responsive sizing are already handled in the markup.

---

## 6. Configure email (important)

**Out of the box the forms cannot send email, and they say so.** A static site has no server, so
there is nothing to send with. Rather than pretend, each form shows a message saying nothing was
sent and offers a pre-filled email link instead.

To switch on real submissions, set one value in `data/company.js`:

```js
window.IMPX.site = {
  formEndpoint: "https://formspree.io/f/xxxxxxxx",   // ← your endpoint
  formRecipient: "contact@impxgroup.com",
  ...
};
```

Any service that accepts a JSON `POST` works — Formspree, Web3Forms, Getform, Basin, or your own
API. The site posts a JSON object containing every form field plus a generated `reference`.

Once configured, a successful submission shows a confirmation with its reference number. If the
service rejects the request, the form says so and falls back to email. It never claims a message
was delivered when it was not.

**If you add your own backend**, validate and sanitise every field server-side, rate-limit the
endpoint, and keep credentials in environment variables — never in this repository. See
`.env.example`.

---

## 7. Before commercial launch

Work through **`CONTENT.md`**. It lists every placeholder, every unverified claim and every item
needing legal review, with the exact file and line to change. The short version:

- Confirm the 2011 establishment year against incorporation documents
- Add CIN, GSTIN, IEC and the registered address once documents are on hand
- Add verified office addresses and phone numbers, or leave them blank
- Have the privacy policy and terms reviewed by a lawyer
- Replace illustrations with real product photography where available
- Update the domain in `sitemap.xml`, `robots.txt` and the canonical tags

---

## 8. Project structure

```
.
├── index.html … 404.html        18 pages, flat at the root for GitHub Pages
├── .nojekyll                    stops Jekyll processing — keep it
├── robots.txt / sitemap.xml
├── README.md / CONTENT.md
├── package.json / .env.example
├── assets/
│   ├── css/style.css            all styling, one file
│   ├── js/
│   │   ├── main.js              navigation, company data binding, enquiry list
│   │   ├── catalog.js           catalogue, filters, search, product detail
│   │   ├── pages.js             markets and office directory
│   │   └── forms.js             validation, spam protection, submission
│   ├── images/                  logo, hero, company scenes, 24 product illustrations
│   └── image-sources.md         image inventory and licence record
├── data/
│   ├── company.js               company profile + site configuration
│   ├── products.js              catalogue + categories
│   └── markets.js               target markets + office directory
└── deployment/
    └── deployment-guide.md      hosting notes and pre-launch checklist
```

---

## 9. Browser support

Tested against current Chrome, Firefox, Safari and Edge, and their mobile equivalents. Uses
`CustomEvent`, `URLSearchParams`, `fetch` and CSS Grid — all standard since 2017. Internet
Explorer is not supported.

---

## 10. Accessibility notes

Semantic landmarks, a skip link, visible focus rings, labelled form fields with programmatic error
messages, `aria-current` on the active nav item, alt text on every image, `prefers-reduced-motion`
respected, and no information carried by colour alone — status tags always show their label as
text, and the market map labels every marker and repeats the list below it.
