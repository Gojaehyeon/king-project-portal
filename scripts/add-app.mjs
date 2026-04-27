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
const demoUrl = meta.homepageUrl?.trim() || undefined;
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
  if (/\b(ios|ipados|swiftui|swift student|iphone|ipad)\b/.test(haystack)) return "ios";
  if (/\b(macos|menu ?bar|메뉴바|menubar|appkit|mac app|apple silicon)\b/.test(haystack)) return "macos";
  if (demoUrl) return "web";
  if (lang === "Swift") return "ios";
  if (lang === "Python" || lang === "Go") return "other";
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

async function fetchOgImage(outPath) {
  const url = `https://opengraph.githubassets.com/1/${owner}/${repo}.png`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OG image fetch failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(outPath, buf);
  return true;
}

async function generateThumbnail() {
  if (flags["no-thumbnail"]) {
    console.log("→ Skipping thumbnail generation (--no-thumbnail)");
    return existsSync(thumbPath) ? thumbRel : "/thumbs/_placeholder.png";
  }
  if (demoUrl) {
    try {
      console.log(`→ Capturing screenshot of ${demoUrl}...`);
      await captureScreenshot(demoUrl, thumbPath);
      console.log(`✓ Screenshot saved → ${thumbRel}`);
      return thumbRel;
    } catch (err) {
      console.warn(`⚠ Screenshot failed (${err.message}), falling back to OG image`);
    }
  }
  console.log("→ Fetching GitHub OG image...");
  await fetchOgImage(thumbPath);
  console.log(`✓ OG image saved → ${thumbRel}`);
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
