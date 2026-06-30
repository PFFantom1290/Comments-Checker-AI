const MAX_REVIEW_CHARS = 10_000;
const MIN_REVIEW_CHARS = 400;

// High-fidelity signals that appear INSIDE individual customer reviews.
const INDIVIDUAL_REVIEW_SIGNALS = [
  /verified purchase/i,
  /reviewed in .+? on /i,
  /\d+ people? found this helpful/i,
  /one person found this helpful/i,
  /top positive review/i,
  /top critical review/i,
  /helpful\. report/i,
];

// Section-level headings that suggest we're entering the reviews area
const SECTION_ANCHORS = [
  /customer reviews/i,
  /user reviews/i,
  /top reviews/i,
  /most helpful reviews/i,
  /most recent reviews/i,
  /ratings? and reviews/i,
  /what customers (say|think|are saying)/i,
  /\d[\d,]+ (global )?ratings?/i,
  /write a review/i,
  /overall rating/i,
];

// Stop extraction when we hit page furniture that lives after the review section.
// Includes footer / legal links that appear at the bottom of every e-commerce page.
const END_ANCHORS = [
  /customers also (viewed|bought)/i,
  /frequently bought together/i,
  /^#{1,3}\s*navigation/i,
  /^#{1,3}\s*footer/i,
  /questions and answers/i,
  /ask a question/i,
  // Footer / legal — marks the very bottom of most pages
  /privacy policy/i,
  /cookie preferences/i,
  /intellectual property protection/i,
  /terms (of|and) (use|service|conditions)/i,
  /all rights reserved/i,
  /sitemap/i,
];

export interface ProcessedText {
  reviewBlock: string;
  productTitle: string;
  reviewCount: number | null;
}

// Signals that indicate the page is a bot-block screen — fast-fail before AI call
const PAGE_BLOCK_SIGNALS = [
  /captcha interception/i,
  /slide to verify/i,
  /sorry, we have detected unusual traffic/i,
  /please slide/i,
  /checking your browser/i,
  /cloudflare ray id/i,
  /access denied/i,
];

// Strong signals that we're on ONE product's page (its review section), not a
// search/category listing. Listings show per-item star ratings but never review
// *text*, a "Verified Purchase" tag, or an "N global ratings" summary.
const SINGLE_PRODUCT_SIGNALS =
  /(verified purchase|\d[\d,]*\s+global ratings?|(?:\d+ )?(?:people|person) found this helpful)/i;

// Listing pages have many price + product-name pairs but no review text.
// Detect them by counting "## Product …\nPrice …" groups.
function isListingPage(markdown: string): boolean {
  // A page carrying real review signals is a product page — never a listing.
  // (Amazon product pages contain dozens of "$" tokens from recommendations,
  // which would otherwise trip the price-heavy heuristic below.)
  if (SINGLE_PRODUCT_SIGNALS.test(markdown)) return false;
  const priceLines = (markdown.match(/\b(?:ціна|price|цена|\$|€|£|₴|грн)\b/gi) ?? []).length;
  const headingLines = (markdown.match(/^#{1,3} .{5,}/gm) ?? []).length;
  // If there are many price signals relative to headings, it's a listing
  return priceLines >= 3 && headingLines >= 3 && priceLines >= headingLines * 0.5;
}

export function extractReviews(markdown: string): ProcessedText {
  // Fast-fail: bot-block page
  if (PAGE_BLOCK_SIGNALS.some((re) => re.test(markdown))) {
    throw new Error(
      "The scraped page is a bot-detection screen, not a product page. " +
        "The site is blocking automated access — try a different URL."
    );
  }

  // Fast-fail: search / category listing page
  if (isListingPage(markdown)) {
    throw new Error(
      "This looks like a search results or category page, not a single product page. " +
        "Open a specific product and copy its URL from the address bar."
    );
  }

  const lines = markdown.split("\n");
  const productTitle = extractTitle(lines);

  // Strategy 1 — look for in-review signals ("Verified Purchase", etc.)
  let startIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (INDIVIDUAL_REVIEW_SIGNALS.some((re) => re.test(lines[i]))) {
      startIdx = Math.max(0, i - 15);
      break;
    }
  }

  // Strategy 2 — section headings
  if (startIdx === -1) {
    for (let i = 0; i < lines.length; i++) {
      if (SECTION_ANCHORS.some((re) => re.test(lines[i]))) {
        startIdx = i;
        break;
      }
    }
  }

  // Strategy 3 — bottom 40% of the page
  if (startIdx === -1) {
    startIdx = Math.floor(lines.length * 0.60);
  }

  // Find end of review section
  let endIdx = lines.length;
  for (let i = startIdx + 1; i < lines.length; i++) {
    if (END_ANCHORS.some((re) => re.test(lines[i]))) {
      endIdx = i;
      break;
    }
  }

  let reviewBlock = clean(lines.slice(startIdx, endIdx).join("\n"));

  // If the extracted slice is too thin, use the whole page as context
  if (reviewBlock.length < MIN_REVIEW_CHARS) {
    reviewBlock = clean(markdown);
  }

  if (reviewBlock.length > MAX_REVIEW_CHARS) {
    reviewBlock = reviewBlock.slice(0, MAX_REVIEW_CHARS) + "\n\n[... truncated ...]";
  }

  const countMatch = markdown.match(/(\d[\d,]+)\s+(?:global\s+)?(?:ratings?|reviews?)/i);
  const reviewCount =
    countMatch?.[1] != null ? parseInt(countMatch[1].replace(/,/g, ""), 10) : null;

  return { reviewBlock, productTitle, reviewCount };
}

function clean(text: string): string {
  return text
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Site-name prefixes stripped from page <title> tags
const TITLE_PREFIXES = [
  /^Title:\s*/i,
  /^Amazon\.com\s*:\s*/i,
  /^Amazon\s*[-–]\s*/i,
  /^AliExpress\s*[-–]\s*/i,
  /^eBay\s*[-–|:]\s*/i,
  /^Walmart\.com\s*[-–|:]\s*/i,
  /^Walmart\s*[-–|:]\s*/i,
  /^Best Buy\s*[-–|:]\s*/i,
  /^Etsy\s*[-–|:]\s*/i,
  /^Flipkart\s*[-–|:]\s*/i,
  /^Lazada\s*[-–|:]\s*/i,
  /^Shopee\s*[-–|:]\s*/i,
  /^Joom\s*[-–|:]\s*/i,
  /^Rozetka\s*[-–|:]\s*/i,
  /^Prom\.ua\s*[-–|:]\s*/i,
  /^Temu\s*[-–|:]\s*/i,
  /^Shein\s*[-–|:]\s*/i,
  /^Ozon\s*[-–|:]\s*/i,
  /^Wildberries\s*[-–|:]\s*/i,
];

// Site names that are themselves not a product title
const BARE_SITE_NAMES = new Set([
  "joom", "rozetka", "aliexpress", "amazon", "ebay", "walmart",
  "best buy", "etsy", "flipkart", "lazada", "shopee", "temu",
  "shein", "ozon", "wildberries", "prom", "taobao", "tmall",
]);

function cleanTitle(raw: string): string {
  let t = raw;
  for (const re of TITLE_PREFIXES) t = t.replace(re, "");
  return t.trim();
}

// Strings that indicate the "title" is a bot-block page or bare site name
const INVALID_TITLE_SIGNALS = [
  /captcha/i,
  /verify you are/i,
  /slide to verify/i,
  /unusual traffic/i,
  /access denied/i,
  /just a moment/i,
  /cloudflare/i,
  /robot/i,
  /security check/i,
  /please enable javascript/i,
];

function extractTitle(lines: string[]): string {
  for (const line of lines.slice(0, 40)) {
    const stripped = line.replace(/^#+\s*/, "").trim();
    const cleaned = cleanTitle(stripped);
    if (
      stripped.length > 10 &&
      stripped.length < 300 &&
      !stripped.includes("|") &&
      !INVALID_TITLE_SIGNALS.some((re) => re.test(stripped)) &&
      !BARE_SITE_NAMES.has(cleaned.toLowerCase())   // reject bare site names as titles
    ) {
      return cleaned;
    }
  }
  return "Unknown Product";
}
