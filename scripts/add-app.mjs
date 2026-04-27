#!/usr/bin/env node
/**
 * /add-app pipeline
 *   - Pulls metadata via `gh repo view`
 *   - Captures a thumbnail via puppeteer (or falls back to GitHub OG image)
 *   - Prepends/updates the entry in src/data/apps.json
 *   - Optionally runs `vercel --prod`
 *
 * Usage:
 *   node scripts/add-app.mjs <repo>           (defaults owner to Gojaehyeon)
 *   node scripts/add-app.mjs <owner>/<repo>
 *   node scripts/add-app.mjs <repo> --no-deploy --featured --platform=macos
 *   node scripts/add-app.mjs <repo> --thumbnail=/path/to/reel-capture.png
 */

import { execFileSync, spawnSync } from "node:child_process";
import { writeFileSync, readFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const APPS_JSON = resolve(ROOT, "src/data/apps.json");
const THUMBS_DIR = resolve(ROOT, "public/thumbs");
const DEFAULT_OWNER = "Gojaehyeon";

// ------------------------------ args -----------------------------------
const args = process.argv.slice(2);
const positional = args.filter((a) => !a.startsWith("--"));
const flags = Object.fromEntries(
  args
    .filter((a) => a.startsWith("--"))
    .map((a) => {
      const [k, v] = a.replace(/^--/, "").split("=");
      return [k, v ?? true];
    })
);

if (positional.length === 0) {
  console.error("Usage: add-app <repo|owner/repo> [--no-deploy] [--no-thumbnail] [--featured] [--platform=web|macos|ios|other]");
  process.exit(1);
}

const target = positional[0];
const [owner, repo] = target.includes("/")
  ? target.split("/")
  : [DEFAULT_OWNER, target];
const slug = repo.toLowerCase();

console.log(`\n→ Adding ${owner}/${repo} (slug: ${slug})`);

// ------------------------------ gh meta --------------------------------
function gh(args) {
  return execFileSync("gh", args, { encoding: "utf8" });
}

let meta;
try {
  const raw = gh([
    "repo",
    "view",
    `${owner}/${repo}`,
    "--json",
    "name,description,homepageUrl,url,repositoryTopics,primaryLanguage,createdAt,pushedAt",
  ]);
  meta = JSON.parse(raw);
} catch (err) {
  console.error("✗ gh repo view failed:", err.message);
  process.exit(1);
}

const description = (meta.description || "").trim();
let demoUrl = meta.homepageUrl?.trim() || undefined;
// Treat homepageUrl that just points back to the repo (or any github.com URL) as no-demo.
if (demoUrl && /^https?:\/\/(www\.)?github\.com\//i.test(demoUrl)) {
  demoUrl = undefined;
}
const repoUrl = meta.url;
const topics = (meta.repositoryTopics || []).map((t) => t.name);
const lang = meta.primaryLanguage?.name;

// title: snake/dash → Title Case
const title = repo
  .replace(/[-_]+/g, " ")
  .replace(/\b\w/g, (m) => m.toUpperCase())
  .trim();

// platform inference
function inferPlatform() {
  if (flags.platform) return flags.platform;
  const haystack = `${description} ${topics.join(" ")} ${lang || ""}`.toLowerCase();
  // iOS-only signals (require explicit iOS/iPad/iPhone keywords)
  if (/\b(ios|ipados|swift student|iphone|ipad|app ?store)\b/.test(haystack)) return "ios";
  // macOS signals — Mac/맥/메뉴바/Apple Silicon/macOS keywords
  if (/(macos|menu ?bar|메뉴바|menubar|appkit|mac app|for mac\b|맥북|macbook|apple silicon|mac os)/.test(haystack)) return "macos";
  if (demoUrl) return "web";
  return "other";
}

const platform = inferPlatform();

// tags: prefer topics, fall back to language
const tags = topics.length > 0 ? topics.slice(0, 6) : lang ? [lang] : [];

// createdAt: prefer original creation
const createdAt = meta.createdAt || new Date().toISOString();

// ------------------------------ thumbnail ------------------------------
mkdirSync(THUMBS_DIR, { recursive: true });
const thumbPath = resolve(THUMBS_DIR, `${slug}.png`);
const thumbRel = `/thumbs/${slug}.png`;

async function captureScreenshot(url, outPath) {
  const puppeteer = (await import("puppeteer")).default;
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--use-fake-ui-for-media-stream",
      "--use-fake-device-for-media-stream",
      "--autoplay-policy=no-user-gesture-required",
      "--disable-blink-features=AutomationControlled",
    ],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30_000 });
    await new Promise((r) => setTimeout(r, 1500));
    await page.screenshot({ path: outPath, type: "png" });
    return true;
  } finally {
    await browser.close();
  }
}

// Monochrome gradient palette — slight tonal differentiation per platform
const PLATFORM_GRADIENT = {
  web: ["#0a0a0b", "#3f3f46"],
  macos: ["#09090b", "#52525b"],
  ios: ["#050507", "#27272a"],
  other: ["#18181b", "#3f3f46"],
};

async function renderFallbackCard(outPath, info) {
  const puppeteer = (await import("puppeteer")).default;
  const [from, to] = PLATFORM_GRADIENT[info.platform] || PLATFORM_GRADIENT.other;
  const escapeHtml = (s) =>
    s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{width:1280px;height:800px;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Apple SD Gothic Neo,sans-serif;background:linear-gradient(135deg,${from} 0%,${to} 100%);color:#fafafa;padding:96px 88px;display:flex;flex-direction:column;justify-content:flex-end;position:relative;overflow:hidden}
    body::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 80% 0%,rgba(255,255,255,.06),transparent 55%)}
    .badge{position:absolute;top:64px;left:88px;font-size:18px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.55)}
    .platform{position:absolute;top:64px;right:88px;font-size:14px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.7);background:rgba(255,255,255,.06);padding:8px 16px;border-radius:999px;border:1px solid rgba(255,255,255,.12)}
    h1{font-size:108px;font-weight:700;line-height:1.04;letter-spacing:-.03em;margin-bottom:36px;position:relative;color:#fafafa}
    p{font-size:30px;line-height:1.4;color:rgba(250,250,250,.7);max-width:1000px;position:relative;font-weight:400}
  </style></head><body>
    <div class="badge">King Project · Daily</div>
    <div class="platform">${escapeHtml(info.platformLabel)}</div>
    <h1>${escapeHtml(info.title)}</h1>
    <p>${escapeHtml(info.description.slice(0, 160))}</p>
  </body></html>`;
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.screenshot({ path: outPath, type: "png" });
  } finally {
    await browser.close();
  }
}

async function generateThumbnail() {
  if (flags["no-thumbnail"]) {
    console.log("→ Skipping thumbnail generation (--no-thumbnail)");
    return existsSync(thumbPath) ? thumbRel : "/thumbs/_placeholder.png";
  }
  // Manual override — typically a Reel/video screenshot the user dropped in
  if (flags.thumbnail) {
    const src = resolve(process.cwd(), String(flags.thumbnail));
    if (!existsSync(src)) {
      console.error(`✗ --thumbnail path not found: ${src}`);
      process.exit(1);
    }
    const ext = src.split(".").pop()?.toLowerCase() || "png";
    const finalPath = resolve(THUMBS_DIR, `${slug}.${ext === "jpg" ? "jpg" : ext}`);
    const finalRel = `/thumbs/${slug}.${ext === "jpg" ? "jpg" : ext}`;
    const buf = readFileSync(src);
    writeFileSync(finalPath, buf);
    console.log(`✓ Manual thumbnail copied → ${finalRel}`);
    return finalRel;
  }
  if (demoUrl) {
    try {
      console.log(`→ Capturing screenshot of ${demoUrl}...`);
      await captureScreenshot(demoUrl, thumbPath);
      console.log(`✓ Screenshot saved → ${thumbRel}`);
      return thumbRel;
    } catch (err) {
      console.warn(`⚠ Screenshot failed (${err.message}), generating fallback card`);
    }
  }
  console.log("→ Rendering fallback card...");
  await renderFallbackCard(thumbPath, {
    title,
    description: description || `${owner}/${repo}`,
    platform,
    platformLabel:
      platform === "web" ? "Web" : platform === "macos" ? "macOS" : platform === "ios" ? "iOS" : "Other",
  });
  console.log(`✓ Fallback card saved → ${thumbRel}`);
  return thumbRel;
}

const thumbnail = await generateThumbnail();

// ------------------------------ apps.json ------------------------------
let apps = [];
try {
  apps = JSON.parse(readFileSync(APPS_JSON, "utf8"));
  if (!Array.isArray(apps)) apps = [];
} catch {
  apps = [];
}

const entry = {
  slug,
  title,
  description,
  platform,
  demoUrl,
  repoUrl,
  thumbnail,
  tags,
  featured: Boolean(flags.featured),
  createdAt,
};

// preserve featured flag if app already exists and we didn't set it
const existingIdx = apps.findIndex((a) => a.slug === slug);
if (existingIdx >= 0 && !flags.featured) {
  entry.featured = apps[existingIdx].featured;
}
if (existingIdx >= 0) apps.splice(existingIdx, 1);
apps.unshift(entry);

writeFileSync(APPS_JSON, JSON.stringify(apps, null, 2) + "\n");
console.log(`✓ apps.json updated (${apps.length} total)`);
console.log(`  ${title}  [${platform}]  ${demoUrl ? "demo: " + demoUrl : "repo only"}`);

// ------------------------------ deploy ---------------------------------
if (flags["no-deploy"]) {
  console.log("→ Skipping deploy (--no-deploy)");
  process.exit(0);
}

console.log("\n→ Deploying with vercel --prod...");
const result = spawnSync("vercel", ["--prod", "--yes"], {
  cwd: ROOT,
  stdio: "inherit",
});
if (result.status !== 0) {
  console.error("✗ vercel deploy failed");
  process.exit(result.status || 1);
}
console.log("\n✓ Done.");
