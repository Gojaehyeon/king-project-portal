#!/usr/bin/env node
/**
 * Scrape gojaehyun.go's Instagram profile via puppeteer (real browser).
 * Outputs a JSON list of reels with cover image, post URL, and caption hint.
 *
 * Usage: node scripts/scrape-reels.mjs
 *        node scripts/scrape-reels.mjs --user=<other_handle>
 *        node scripts/scrape-reels.mjs --headed   (see what's happening)
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT = resolve(ROOT, "scripts/.reels-cache.json");

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
const HEADED = Boolean(flags.headed);

const puppeteer = (await import("puppeteer")).default;

const browser = await puppeteer.launch({
  headless: !HEADED,
  defaultViewport: { width: 1280, height: 1800 },
  args: [
    "--no-sandbox",
    "--lang=ko-KR",
    "--disable-blink-features=AutomationControlled",
  ],
});

try {
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({ "Accept-Language": "ko,en;q=0.8" });
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"
  );

  const tab = flags.tab === "reels" ? "reels/" : flags.tab === "tagged" ? "tagged/" : "";
  const url = `https://www.instagram.com/${HANDLE}/${tab}`;
  console.log(`→ Loading ${url}`);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await new Promise((r) => setTimeout(r, 4000));

  // Try to dismiss the login interstitial if present
  await page.evaluate(() => {
    document.querySelectorAll("button").forEach((b) => {
      const t = (b.textContent || "").toLowerCase();
      if (t.includes("not now") || t.includes("나중에") || t.includes("닫기")) b.click();
    });
  });

  // Scroll a few times to lazy-load grid
  for (let i = 0; i < 6; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await new Promise((r) => setTimeout(r, 1200));
  }

  const items = await page.evaluate(() => {
    const out = [];
    const links = document.querySelectorAll('a[href*="/p/"], a[href*="/reel/"]');
    for (const a of links) {
      const href = a.getAttribute("href");
      if (!href) continue;
      const img = a.querySelector("img");
      if (!img) continue;
      out.push({
        href: new URL(href, location.origin).toString(),
        thumb: img.getAttribute("src") || "",
        alt: img.getAttribute("alt") || "",
      });
    }
    // dedupe by href
    const seen = new Set();
    return out.filter((i) => (seen.has(i.href) ? false : (seen.add(i.href), true)));
  });

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(items, null, 2));
  console.log(`✓ Saved ${items.length} items → ${OUT}`);
  for (const i of items.slice(0, 30)) {
    console.log(`  ${i.href.replace("https://www.instagram.com", "")}  | ${(i.alt || "").slice(0, 80)}`);
  }
} finally {
  await browser.close();
}
