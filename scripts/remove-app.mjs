#!/usr/bin/env node
/**
 * /remove-app <slug>
 * Removes an entry from apps.json and the corresponding thumbnail file.
 * Optionally redeploys (default on, use --no-deploy to skip).
 */
import { readFileSync, writeFileSync, unlinkSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const APPS_JSON = resolve(ROOT, "src/data/apps.json");

const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith("--"))?.toLowerCase();
const noDeploy = args.includes("--no-deploy");

if (!slug) {
  console.error("Usage: remove-app <slug> [--no-deploy]");
  process.exit(1);
}

const apps = JSON.parse(readFileSync(APPS_JSON, "utf8"));
const idx = apps.findIndex((a) => a.slug === slug);
if (idx < 0) {
  console.error(`✗ slug not found: ${slug}`);
  process.exit(1);
}
const [removed] = apps.splice(idx, 1);
writeFileSync(APPS_JSON, JSON.stringify(apps, null, 2) + "\n");
console.log(`✓ removed: ${removed.title}`);

const thumb = resolve(ROOT, "public", removed.thumbnail.replace(/^\//, ""));
if (existsSync(thumb)) {
  unlinkSync(thumb);
  console.log(`✓ thumbnail deleted`);
}

if (noDeploy) process.exit(0);
const r = spawnSync("vercel", ["--prod", "--yes"], { cwd: ROOT, stdio: "inherit" });
process.exit(r.status || 0);
