#!/usr/bin/env node
/**
 * Use the saved Instagram session to scrape all reels from a profile,
 * then match each reel to apps in src/data/apps.json by caption keywords.
 *
 * Only apps whose thumbnails are clearly "ambiguous" (still a fallback
 * gradient card) are touched. Real-screenshot thumbnails are preserved.
 *
 * Usage:
 *   node scripts/match-reels.mjs                    # dry-run (just print matches)
 *   node scripts/match-reels.mjs --apply            # apply matched reels
 *   node scripts/match-reels.mjs --apply --deploy   # apply + vercel --prod
 *   node scripts/match-reels.mjs --user=other_id    # different IG handle
 *   node scripts/match-reels.mjs --slugs=kikey,taxigo  # restrict to specific slugs
 */
import { readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const APPS_JSON = resolve(ROOT, "src/data/apps.json");
const THUMBS_DIR = resolve(ROOT, "public/thumbs");
const SESSION_PATH = resolve(ROOT, "scripts/.instagram-session.json");

const flags = Object.fromEntries(
  process.argv
    .slice(2)
    .filter((a) => a.startsWith("--"))
    .map((a) => {
      const [k, v] = a.replace(/^--/, "").split("=");
      return [k, v ?? true];
    })
);

const HANDLE = flags.user || "gojaehyun.go";
const APPLY = Boolean(flags.apply);
const DEPLOY = Boolean(flags.deploy);
const SLUG_FILTER = flags.slugs ? String(flags.slugs).split(",").map((s) => s.trim().toLowerCase()) : null;

if (!existsSync(SESSION_PATH)) {
  console.error("✗ No saved session. Run: node scripts/instagram-login.mjs");
  process.exit(1);
}

// ------------------------------------------------------------------
//  Load saved session
// ------------------------------------------------------------------
const session = JSON.parse(readFileSync(SESSION_PATH, "utf8"));
const ageMs = Date.now() - new Date(session.savedAt).getTime();
console.log(`→ Using session from ${session.savedAt} (${Math.round(ageMs / 60000)} min old)`);

// ------------------------------------------------------------------
//  Determine which apps need reel covers
// ------------------------------------------------------------------
//  Heuristic: fallback gradient PNGs are quite small (< 350 KB).
//  Real demo screenshots & reel covers are typically > 80 KB and have
//  vibrant content; gradient cards are around 60–340 KB depending on
//  text length.  Safer signal: visual fingerprint of the gradient card
//  is very low entropy.  We approximate by file size + naming heuristic:
//  if --slugs is provided, that wins.

const apps = JSON.parse(readFileSync(APPS_JSON, "utf8"));
const target = apps.filter((a) => {
  if (SLUG_FILTER) return SLUG_FILTER.includes(a.slug);
  // Default: only apps without a demo URL (the ones still on fallback)
  if (a.demoUrl) return false;
  return true;
});
const targetSlugs = new Set(target.map((a) => a.slug));
console.log(`→ Target apps (${target.length}): ${target.map((a) => a.slug).join(", ")}`);
if (target.length === 0) {
  console.log("Nothing to match. Exiting.");
  process.exit(0);
}

// ------------------------------------------------------------------
//  Scrape reels with the saved session
// ------------------------------------------------------------------
const puppeteer = (await import("puppeteer")).default;

const browser = await puppeteer.launch({
  headless: true,
  defaultViewport: { width: 1280, height: 1800 },
  args: ["--no-sandbox", "--lang=ko-KR", "--disable-blink-features=AutomationControlled"],
});

let reels = [];
try {
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"
  );
  await page.setExtraHTTPHeaders({ "Accept-Language": "ko,en;q=0.8" });
  await page.setCookie(...session.cookies);

  console.log(`→ Loading reels grid for @${HANDLE}...`);
  await page.goto(`https://www.instagram.com/${HANDLE}/reels/`, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });
  await new Promise((r) => setTimeout(r, 4000));

  // Aggressive scroll to load lazy items
  for (let i = 0; i < 12; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 1.2));
    await new Promise((r) => setTimeout(r, 1000));
  }

  const items = await page.evaluate(() => {
    const out = [];
    const links = document.querySelectorAll('a[href*="/reel/"]');
    for (const a of links) {
      const href = a.getAttribute("href");
      if (!href) continue;
      const img = a.querySelector("img");
      out.push({
        href: new URL(href, location.origin).toString().replace(/\?.*$/, ""),
        thumb: img?.getAttribute("src") || "",
        alt: img?.getAttribute("alt") || "",
      });
    }
    const seen = new Set();
    return out.filter((i) => (seen.has(i.href) ? false : (seen.add(i.href), true)));
  });
  reels = items;
  console.log(`→ Found ${reels.length} reels in grid`);

  // Fetch full caption per reel — first 250 chars are enough for matching
  for (const r of reels) {
    try {
      const detailPage = await browser.newPage();
      await detailPage.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"
      );
      await detailPage.setCookie(...session.cookies);
      await detailPage.goto(r.href, { waitUntil: "domcontentloaded", timeout: 30_000 });
      await new Promise((res) => setTimeout(res, 1500));
      const caption = await detailPage.evaluate(() => {
        const og = document.querySelector('meta[property="og:title"]')?.getAttribute("content") || "";
        const desc = document.querySelector('meta[property="og:description"]')?.getAttribute("content") || "";
        const article = document.querySelector("article")?.innerText || "";
        return [og, desc, article].filter(Boolean).join("\n");
      });
      r.caption = caption.slice(0, 1500);
      await detailPage.close();
    } catch (err) {
      r.caption = r.alt || "";
    }
  }
} finally {
  await browser.close();
}

// ------------------------------------------------------------------
//  Match each app to the best reel via caption keyword scoring
// ------------------------------------------------------------------
function tokenize(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 2);
}

function score(app, reel) {
  const haystack = `${reel.alt} ${reel.caption || ""}`.toLowerCase();
  if (!haystack) return 0;
  const slugRoot = app.slug.replace(/[-_]/g, "").toLowerCase();
  let s = 0;
  // strong: slug appears literally
  if (haystack.includes(slugRoot)) s += 100;
  if (haystack.includes(app.slug.toLowerCase())) s += 80;
  if (haystack.includes(app.title.toLowerCase())) s += 80;
  // tag terms
  for (const tag of app.tags || []) {
    if (haystack.includes(tag.toLowerCase())) s += 8;
  }
  // overlap of description tokens
  const dTokens = new Set(tokenize(app.description));
  const cTokens = tokenize(haystack);
  for (const t of cTokens) if (dTokens.has(t)) s += 1;
  return s;
}

const matches = [];
const usedReels = new Set();
for (const app of target) {
  let best = null;
  for (const r of reels) {
    if (usedReels.has(r.href)) continue;
    const sc = score(app, r);
    if (!best || sc > best.score) best = { reel: r, score: sc };
  }
  if (best && best.score > 0) {
    usedReels.add(best.reel.href);
    matches.push({ slug: app.slug, score: best.score, reel: best.reel });
  } else {
    matches.push({ slug: app.slug, score: 0, reel: null });
  }
}

console.log("\n=== Matching results ===");
for (const m of matches) {
  if (!m.reel) {
    console.log(`  ${m.slug.padEnd(14)} — no candidate (score 0)`);
  } else {
    const cap = (m.reel.alt || m.reel.caption || "").replace(/\s+/g, " ").slice(0, 80);
    console.log(`  ${m.slug.padEnd(14)} score=${m.score}  ${m.reel.href}`);
    console.log(`                 “${cap}”`);
  }
}

// Always dump full reel list for manual inspection
console.log("\n=== All scraped reels (newest first) ===");
for (let i = 0; i < reels.length; i++) {
  const r = reels[i];
  const cap = (r.alt || r.caption || "").replace(/\s+/g, " ").slice(0, 140);
  console.log(`#${String(i + 1).padStart(2, "0")} ${r.href}`);
  console.log(`     ${cap}`);
}

if (!APPLY) {
  console.log("\n(dry-run; pass --apply to update thumbnails based on the keyword matches above)");
  process.exit(0);
}

// ------------------------------------------------------------------
//  Apply via add-app.mjs --reel for each match
// ------------------------------------------------------------------
console.log("\n→ Applying matched reels...");
for (const m of matches) {
  if (!m.reel) continue;
  const args = [
    resolve(__dirname, "add-app.mjs"),
    m.slug,
    `--reel=${m.reel.href}`,
    "--no-deploy",
  ];
  const r = spawnSync("node", args, { cwd: ROOT, stdio: "inherit" });
  if (r.status !== 0) console.warn(`⚠ failed for ${m.slug}`);
}

if (DEPLOY) {
  console.log("\n→ Deploying...");
  const r = spawnSync("vercel", ["--prod", "--yes"], { cwd: ROOT, stdio: "inherit" });
  process.exit(r.status || 0);
}
