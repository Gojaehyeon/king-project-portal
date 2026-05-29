#!/usr/bin/env node
/**
 * /ㄱㄱ — auto-detect the GitHub repo from the user's current working
 * directory, deploy the app to Vercel, attach <slug>.gojaehyun.com, point
 * the GitHub homepage at it, and refresh the portal entry.
 *
 * Pipeline (per invocation):
 *   1. Detect owner/repo via `git remote get-url origin`
 *   2. `vercel --prod --yes --scope ...` from userCwd  (deploy app)
 *   3. `vercel domains add <slug>.gojaehyun.com`       (attach subdomain)
 *   4. `gh repo edit ... --homepage https://<slug>.gojaehyun.com`
 *   5. Hand off to add-app.mjs (gh meta + thumbnail + apps.json + portal deploy)
 *
 * Usage (from inside any project's working tree):
 *   node /Users/go/develop/king-project-portal/scripts/gg.mjs
 *   node /Users/go/develop/king-project-portal/scripts/gg.mjs --reel=https://...
 *   node /Users/go/develop/king-project-portal/scripts/gg.mjs --thumbnail=~/Downloads/cover.png --featured
 *
 * Flags:
 *   --no-deploy        skip BOTH the app deploy and the portal deploy
 *   --no-domain        skip the gojaehyun.com subdomain attachment
 *   (all other flags pass through to add-app.mjs)
 */
import { execSync, spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const userCwd = process.cwd();

const SCOPE = "gojaehyeons-projects";
const ROOT_DOMAIN = "gojaehyun.com";

// ---------------------- detect repo --------------------------------------
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
const owner = m[1];
const repo = m[2];
const ownerRepo = `${owner}/${repo}`;
const slug = repo.toLowerCase();
const customDomain = `${slug}.${ROOT_DOMAIN}`;
const customUrl = `https://${customDomain}`;

console.log(`→ Auto-detected: ${ownerRepo}`);
console.log(`  (from ${userCwd})`);

// ---------------------- args ---------------------------------------------
const passthrough = process.argv.slice(2);
const skipDeploy = passthrough.includes("--no-deploy");
const skipDomain = passthrough.includes("--no-domain");
// strip --no-domain before forwarding (add-app.mjs doesn't know it)
const forwardedArgs = passthrough.filter((a) => a !== "--no-domain");

// ---------------------- 2. deploy user app -------------------------------
if (!skipDeploy) {
  console.log(`\n→ Deploying app (vercel --prod, scope=${SCOPE})…`);
  const r = spawnSync(
    "vercel",
    ["--prod", "--yes", "--scope", SCOPE],
    { cwd: userCwd, stdio: "inherit" }
  );
  if (r.status !== 0) {
    console.error("✗ vercel --prod (app) failed");
    process.exit(r.status || 1);
  }
} else {
  console.log("→ Skipping app deploy (--no-deploy)");
}

// ---------------------- 3. attach <slug>.gojaehyun.com -------------------
if (!skipDomain) {
  console.log(`\n→ Attaching ${customDomain}…`);
  const r = spawnSync(
    "vercel",
    ["domains", "add", customDomain, "--scope", SCOPE],
    { cwd: userCwd, encoding: "utf8" }
  );
  const out = (r.stdout || "") + (r.stderr || "");
  if (r.status === 0) {
    console.log(`✓ ${customDomain} attached`);
  } else if (/already|exists|in use|conflict/i.test(out)) {
    console.log(`  (already attached)`);
  } else {
    console.warn(`⚠ domain attach failed: ${out.trim().split("\n").slice(-3).join(" | ")}`);
  }

  // 4. point GH homepage at the custom URL
  console.log(`→ GitHub homepage → ${customUrl}`);
  const gh = spawnSync(
    "gh",
    ["repo", "edit", ownerRepo, "--homepage", customUrl],
    { encoding: "utf8" }
  );
  if (gh.status !== 0) {
    console.warn(`⚠ gh repo edit failed: ${(gh.stderr || "").trim().split("\n").slice(-2).join(" | ")}`);
  }
} else {
  console.log("→ Skipping domain attachment (--no-domain)");
}

// ---------------------- 5. portal pipeline -------------------------------
console.log(`\n→ Refreshing portal entry…`);
const r = spawnSync(
  "node",
  [resolve(__dirname, "add-app.mjs"), ownerRepo, ...forwardedArgs],
  { stdio: "inherit", cwd: ROOT }
);
process.exit(r.status || 0);
