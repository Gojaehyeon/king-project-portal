#!/usr/bin/env node
/**
 * /ㄱㄱ — auto-detect the GitHub repo from the user's current working
 * directory (via `git remote get-url origin`) and pipe straight into
 * the add-app pipeline (metadata + thumbnail + apps.json + vercel deploy).
 *
 * Usage (from inside any project's working tree):
 *   node /Users/go/develop/king-project-portal/scripts/gg.mjs
 *   node /Users/go/develop/king-project-portal/scripts/gg.mjs --reel=https://www.instagram.com/reel/...
 *   node /Users/go/develop/king-project-portal/scripts/gg.mjs --thumbnail=~/Downloads/cover.png --featured
 *
 * All extra flags pass through to add-app.mjs.
 */
import { execSync, spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const userCwd = process.cwd();

let originUrl;
try {
  originUrl = execSync("git remote get-url origin", {
    cwd: userCwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();
} catch {
  console.error("✗ 현재 디렉토리가 git 레포가 아니거나 'origin' 리모트가 없어요.");
  console.error("  → 명시적으로: /add-app <repo>");
  process.exit(1);
}

const m = originUrl.match(/(?:github\.com[:/])([^/]+)\/([^/.]+?)(?:\.git)?\/?$/i);
if (!m) {
  console.error(`✗ origin URL에서 GitHub 레포 파싱 실패: ${originUrl}`);
  process.exit(1);
}
const ownerRepo = `${m[1]}/${m[2]}`;
console.log(`→ Auto-detected: ${ownerRepo}`);
console.log(`  (from ${userCwd})`);

const passthrough = process.argv.slice(2);
const r = spawnSync(
  "node",
  [resolve(__dirname, "add-app.mjs"), ownerRepo, ...passthrough],
  { stdio: "inherit", cwd: ROOT }
);
process.exit(r.status || 0);
