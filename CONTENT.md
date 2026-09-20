# Content status and verification checklist

This file exists so nobody has to guess which parts of the website are confirmed fact and which
are waiting on documents. Work through it before commercial launch.

The site was built on a strict rule: **nothing is stated as verified unless it was supplied as
verified.** No registration numbers, certifications, customer names, revenue figures, employee
counts, capacities, testimonials or street addresses were invented to fill space. Where a detail
was unavailable, the field is left blank and hidden, or labelled as pending.

---

## 1. Company details that must be verified

| Detail | Current state | Where to change | Action |
|---|---|---|---|
| Legal name | Published as supplied | `data/company.js` → `legalName` | Confirm exact registered spelling |
| Year established (2011) | **Supplied by the company, not verified** | `data/company.js` → `establishedYear` | Check incorporation certificate. It is labelled as unverified on `about.html` — remove that label only after checking |
| Headquarters city | Published: Mumbai, Maharashtra | `data/company.js` | Confirm |
| Registered office address | **Blank — hidden site-wide** | `data/company.js` → `registeredAddress` | Add the verified address |
| CIN | **Blank** | `data/company.js` → `cin` | Add from the incorporation certificate |
| GSTIN | **Blank** | `data/company.js` → `gstin` | Add from the GST registration |
| Importer Exporter Code | **Blank** | `data/company.js` → `iec` | Add from the DGFT licence |
| PAN | **Blank** | `data/company.js` → `pan` | Add only if you intend to publish it |
| Phone number | **Blank** | `data/company.js` → `phone` | Add the verified business number |
| WhatsApp business number | **Blank** | `data/company.js` → `whatsapp` | Add if used |
| Business hours | **Blank** | `data/company.js` → `businessHours` | Add, with the time zone |
| Certifications | **Empty array — none claimed** | `data/company.js` → `certifications` | Add only with issuing body and certificate number |
| Social profiles | **Blank** | `data/company.js` → `social` | Add only official, live profiles |
| Map location | **Blank** | `data/company.js` → `mapEmbedUrl` | Add once the address is verified |
| Email | Published: contact@impxgroup.com | `data/company.js` → `email` | Confirm it is monitored |
| Domain | Assumed `www.impxgroup.com` | `data/company.js`, `sitemap.xml`, `robots.txt`, canonical tags in every page `<head>` | Update if the live domain differs |

Blank fields are **hidden automatically**. Nothing appears as an empty row or a fake value.

---

## 2. Office network — all six cities

`data/markets.js` → `window.IMPX.offices`

Delhi, Mumbai, Chennai, Hyderabad, Ahmedabad and Bengaluru are listed as the coordination network,
with the status label "Company office" as stated by the company. For every city:

- `address` — **blank.** No street address was invented for any location.
- `phone` — **blank**
- `email` — only Mumbai carries the main company address
- `hours` — **blank**
- `mapUrl` — **blank**

Each card shows a short note explaining that details are not yet published. Fill the fields in and
they appear automatically; the note disappears on its own.

**Do not publish a city-level address, phone number or map pin that has not been verified.** Vendor
registration checks fail on mismatched addresses, and it is the fastest way to lose a tender.

---

## 3. Product specifications needing verification

All 24 products in `data/products.js` are published as **enquiry listings, not stock listings**.

- No product claims in-house manufacture. `sourcingType` is `Third-Party Sourcing`,
  `Sourced from Partner`, `Custom Sourcing` or `Available on Request` throughout. The value
  `Manufactured by IMPX` exists in the schema but is deliberately unused — apply it only to
  products genuinely produced in-house.
- No prices anywhere. Every product shows "Request a quote".
- No minimum order quantities, lead times or origins are stated as fact. They read
  "to be confirmed" or "confirmed at quotation stage".
- Specification values are written either as **options** ("carbon steel, stainless steel or alloy
  steel, depending on the supplier selected") or as **to be confirmed**. Where you have a fixed,
  confirmed specification for a product you regularly supply, replace the option list with the real
  value.
- No certifications are claimed for any product. Safety equipment, LED lighting, food and feed
  products all state that conformity documents come from the supplier and are checked per order.

**Before launch:** for each product you actually stock or supply regularly, replace the generic
option lists with your confirmed specification, MOQ and lead time. Leave everything else as is.

---

## 4. Images needing replacement

Every image is an **original SVG illustration created for this project**. See
`assets/image-sources.md` for the full inventory.

- No stock photography, no scraped images, no watermarks, no third-party logos, no recognisable
  people, no branded products.
- They are drawings, not photographs. `terms.html` states that illustrations are representative and
  are not photographs of specific goods.

**Recommended before launch:** replace product illustrations with real photography of goods you
have supplied, or with licensed stock images. Instructions are in `README.md` section 5. Keep the
inventory file updated as you go.

The logo (`assets/images/logo/`) is an original wordmark and mark created for this project. It is
**a concept, not an approved final identity** — approve it internally, or replace the three SVG
files with the official artwork using the same filenames.

---

## 5. Legal content needing review

| Page | State | Action |
|---|---|---|
| `privacy.html` | Working draft describing how the site actually behaves. Claims no regulatory compliance. | **Lawyer review required** against the laws applying to your company and your visitors |
| `terms.html` | Working draft. Governing law provisionally India. | **Lawyer review required**, and align with your terms and conditions of sale |

Both pages carry a visible notice stating they are drafts pending review. Remove those notices only
after the review is done.

---

## 6. Claims deliberately **not** made

Listed here so nobody adds them back in without evidence:

- No customer names, logos, testimonials or case studies
- No revenue, employee count, shipment volume, order count or years-of-experience statistics
- No manufacturing capacity, factory size, warehouse size or machinery list
- No ISO or other certification
- No authorised dealership or distributorship for any brand
- No claim of active operations, local registration, local offices or completed shipments in any
  foreign market — every market is labelled "Target market" or "Market of interest"
- No guaranteed delivery, price or quality outside a signed agreement
- No claim that any form email has been sent (see `README.md` section 6)

---

## 7. Where each type of content lives

| Content | File |
|---|---|
| Company profile, statutory details, form endpoint | `data/company.js` |
| Products, categories, specifications | `data/products.js` |
| Target markets, office directory | `data/markets.js` |
| FAQ questions and answers | `faq.html` (also mirrored in its FAQPage structured data — update both) |
| Industries served | `industries.html` |
| Page copy, headings, notices | the relevant `.html` file |
| Colours, typography, spacing | `assets/css/style.css` (design tokens at the top) |

---

## 8. Pre-launch checklist

- [ ] Establishment year verified, or the "pending verification" label kept
- [ ] CIN, GSTIN and IEC added, or left blank
- [ ] Registered address added, or left blank
- [ ] Phone number added, or left blank
- [ ] Office addresses verified city by city, or left blank
- [ ] Certifications added with certificate numbers, or left empty
- [ ] Privacy policy reviewed by a lawyer and the draft notice removed
- [ ] Terms reviewed by a lawyer and the draft notice removed
- [ ] Form endpoint configured and a live test submission received
- [ ] Domain updated in `sitemap.xml`, `robots.txt` and the canonical tags
- [ ] Logo approved or replaced
- [ ] Product images replaced where real photography exists
- [ ] Product specifications, MOQs and lead times confirmed for regularly supplied items
- [ ] Every page opened on a phone and checked
- [ ] Sitemap submitted to Google Search Console
