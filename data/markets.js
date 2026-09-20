/* ---------------------------------------------------------------------------
   data/markets.js  —  Target markets, Indian office network, industries, FAQs.

   "status" wording is deliberately cautious. Use "Target market" or "Market of
   interest" until trading activity in that market is documented. Do not change
   it to "Active market" without evidence.
   Map coordinates are percentages of the map panel, used for positioning only.
--------------------------------------------------------------------------- */
window.IMPX = window.IMPX || {};

window.IMPX.markets = [
  {
    id: "india",
    name: "India",
    region: "South Asia",
    status: "Home market",
    x: 62, y: 52,
    description: "India is the company's base of operations and the starting point for most sourcing work, with supplier discovery, coordination and consolidation handled from Mumbai.",
    productFocus: "Industrial goods, electronics and agricultural products across all three catalogue categories.",
    sourcing: "Direct supplier contact and factory coordination within India; consolidation of mixed orders before dispatch.",
    logistics: "Road movement domestically; sea and air departures from western and southern Indian ports and airports.",
    regulatory: "Domestic tax and documentation requirements apply. Export documentation is prepared per destination."
  },
  {
    id: "uae",
    name: "United Arab Emirates",
    region: "Middle East",
    status: "Target market",
    x: 51, y: 50,
    description: "Dubai and the wider UAE function as both an end market and a re-export hub, which makes them a natural first destination for consolidated B2B shipments out of India.",
    productFocus: "Industrial goods, safety and packaging supplies, electrical and lighting products, selected food-grade agricultural products.",
    sourcing: "Buyer requirements matched to Indian and third-country suppliers, depending on specification and price point.",
    logistics: "Short sea transit from western India, with air freight practical for urgent or low-volume consignments.",
    regulatory: "Import documentation, conformity requirements and labelling rules are confirmed per product before shipment."
  },
  {
    id: "singapore",
    name: "Singapore",
    region: "Southeast Asia",
    status: "Target market",
    x: 74, y: 62,
    description: "Singapore is approached as a specification-led market where documentation, traceability and consistency matter more than lowest price.",
    productFocus: "Electronics and automation components, industrial spares, selected agricultural products.",
    sourcing: "Supplier selection weighted towards documentation quality and repeatable specification compliance.",
    logistics: "Established sea routes from Indian ports; air freight for components and time-critical spares.",
    regulatory: "Product standards, import controls and food regulations reviewed per enquiry."
  },
  {
    id: "china",
    name: "China",
    region: "East Asia",
    status: "Target market",
    x: 78, y: 42,
    description: "China features on both sides of the business: as a destination for selected agricultural and industrial products, and as a sourcing origin for electronics and components.",
    productFocus: "Electronics and components inbound; agricultural and industrial products outbound, subject to feasibility.",
    sourcing: "Two-way flows — supplier discovery for imports and buyer coordination for exports.",
    logistics: "Container sea freight as the norm; air freight for components.",
    regulatory: "Import and export controls, inspection requirements and documentation confirmed per product and direction."
  },
  {
    id: "thailand",
    name: "Thailand",
    region: "Southeast Asia",
    status: "Target market",
    x: 76, y: 56,
    description: "Thailand is treated as a manufacturing-adjacent market with demand for industrial consumables, components and packaging.",
    productFocus: "Industrial goods, packaging materials, electronic components.",
    sourcing: "Supplier options compared across India and regional alternatives on landed cost.",
    logistics: "Sea freight via regional transhipment hubs; air freight available for smaller consignments.",
    regulatory: "Import documentation and product-specific approvals reviewed before an offer is confirmed."
  },
  {
    id: "russia",
    name: "Russia",
    region: "Eurasia",
    status: "Market of interest",
    x: 68, y: 28,
    description: "Russia is listed as a market of interest. Feasibility here is assessed case by case, because payment routes, sanctions compliance and logistics all have to be workable before an enquiry can be accepted.",
    productFocus: "Agricultural products and selected industrial goods, subject to feasibility.",
    sourcing: "Assessed per enquiry rather than offered as a standing capability.",
    logistics: "Route and transit options reviewed at enquiry stage.",
    regulatory: "Applicable trade controls, sanctions screening and banking requirements are checked before any commitment is given."
  },
  {
    id: "other",
    name: "Other markets",
    region: "Worldwide",
    status: "Subject to feasibility",
    x: 30, y: 60,
    description: "Enquiries from markets outside the list above are welcome. Whether they can be served depends on the product, the applicable legal requirements and the logistics route.",
    productFocus: "Assessed per enquiry.",
    sourcing: "Depends on product category and supplier reach.",
    logistics: "Reviewed against the destination and quantity.",
    regulatory: "Product, destination and trade-control requirements reviewed before any commitment."
  }
];

window.IMPX.offices = [
  { city: "Mumbai", role: "Headquarters and coordination", status: "Company office", address: "", phone: "", email: "contact@impxgroup.com", hours: "", mapUrl: "" },
  { city: "Delhi", role: "North India coordination", status: "Company office", address: "", phone: "", email: "", hours: "", mapUrl: "" },
  { city: "Chennai", role: "South India coordination", status: "Company office", address: "", phone: "", email: "", hours: "", mapUrl: "" },
  { city: "Hyderabad", role: "Regional coordination", status: "Company office", address: "", phone: "", email: "", hours: "", mapUrl: "" },
  { city: "Ahmedabad", role: "West India coordination", status: "Company office", address: "", phone: "", email: "", hours: "", mapUrl: "" },
  { city: "Bengaluru", role: "Regional coordination", status: "Company office", address: "", phone: "", email: "", hours: "", mapUrl: "" }
];
