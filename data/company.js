/* ---------------------------------------------------------------------------
   data/company.js  —  Central company configuration.
   Edit the values below to update the whole website. Anything left as an empty
   string ("") is automatically hidden from the public pages, so never invent a
   value just to fill a gap. Fields marked VERIFY must be confirmed against
   official documents before commercial launch.
--------------------------------------------------------------------------- */
window.IMPX = window.IMPX || {};

window.IMPX.company = {
  legalName: "IMPX GLOBAL TRADERS PRIVATE LIMITED",
  shortName: "IMPX Global Traders",
  brand: "IMPX",
  tagline: "Manufacturing excellence. Global trade. Trusted partnerships.",
  supportingLine:
    "Connecting quality products, reliable sourcing and global business opportunities.",

  // VERIFY — supplied by the company, not independently confirmed.
  establishedYear: "2011",
  establishedNote: "Year provided by the company. Confirm against incorporation documents before publishing as verified.",

  headquartersCity: "Mumbai",
  headquartersRegion: "Maharashtra",
  headquartersCountry: "India",
  headquartersLine: "Mumbai, Maharashtra, India",

  email: "contact@impxgroup.com",
  // Leave blank until confirmed. Blank fields are hidden site-wide.
  phone: "",
  whatsapp: "",
  registeredAddress: "",
  businessHours: "",
  mapEmbedUrl: "",

  // Statutory identifiers — leave blank until documents are on hand.
  cin: "",
  gstin: "",
  iec: "",              // Importer Exporter Code
  pan: "",
  certifications: [],   // e.g. ["ISO 9001:2015 — certificate no. …"] once documented

  website: "https://www.impxgroup.com",
  domainNote: "Update to the live domain before generating the sitemap.",

  social: {
    linkedin: "",
    x: "",
    facebook: "",
    instagram: "",
    youtube: ""
  },

  businessLines: [
    "Manufacturing coordination",
    "International trading",
    "Third-party sourcing",
    "Custom procurement"
  ],

  categories: ["Industrial Goods", "Electronics", "Agricultural Products"]
};

window.IMPX.site = {
  titleSuffix: "IMPX Global Traders Private Limited",
  defaultDescription:
    "Industrial goods, electronics and agricultural products for B2B buyers — sourcing, manufacturing coordination and international trade support from Mumbai, India.",
  // Where quote and contact forms are sent. See README.md → "Configure email".
  formEndpoint: "",            // e.g. "https://formspree.io/f/xxxxxxx"
  formRecipient: "contact@impxgroup.com",
  inquiryReferencePrefix: "IMPX",
  ogImage: "assets/images/logo/impx-logo.svg"
};
