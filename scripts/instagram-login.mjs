#!/usr/bin/env node
/**
 * One-time interactive Instagram login.
 * Opens a real Chrome window — log in manually, then the script saves cookies
 * to scripts/.instagram-session.json so other scripts can reuse the session.
 *
 * Usage: node scripts/instagram-login.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SESSION_PATH = resolve(ROOT, "scripts/.instagram-session.json");

const puppeteer = (await import("puppeteer")).default;

const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: null,
  args: [
    "--no-sandbox",
    "--lang=ko-KR",
    "--window-size=1280,900",
    "--disable-blink-features=AutomationControlled",
  ],
});

const [page] = await browser.pages();
await page.setUserAgent(
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"
);

console.log("→ Opening Instagram login. Sign in in the browser window.");
await page.goto("https://www.instagram.com/accounts/login/", {
  waitUntil: "domcontentloaded",
});

console.log("⏳ Waiting for login (polling Instagram cookies; up to 5 minutes)...");
const cdp = await page.target().createCDPSession();
const deadline = Date.now() + 5 * 60 * 1000;
let allCookies = [];
let loggedIn = false;
while (Date.now() < deadline) {
  try {
    const result = await cdp.send("Network.getAllCookies");
    allCookies = result.cookies || [];
    if (allCookies.some((c) => c.name === "sessionid" && c.value && c.domain.includes("instagram.com"))) {
      loggedIn = true;
      break;
    }
  } catch {
    /* keep polling */
  }
  await new Promise((r) => setTimeout(r, 1500));
}
if (!loggedIn) {
  console.error("✗ Login timed out (no sessionid cookie on instagram.com).");
  await browser.close();
  process.exit(1);
}

// Filter to instagram.com cookies and shape them like puppeteer setCookie expects
const cookies = allCookies
  .filter((c) => c.domain.endsWith("instagram.com") || c.domain === ".instagram.com")
  .map((c) => ({
    name: c.name,
    value: c.value,
    domain: c.domain,
    path: c.path,
    expires: c.expires,
    httpOnly: c.httpOnly,
    secure: c.secure,
    sameSite: c.sameSite,
  }));
mkdirSync(dirname(SESSION_PATH), { recursive: true });
writeFileSync(SESSION_PATH, JSON.stringify({ cookies, savedAt: new Date().toISOString() }, null, 2));
console.log(`✓ Session saved → ${SESSION_PATH}`);
console.log(`  ${cookies.length} cookies stored.`);
await browser.close();
