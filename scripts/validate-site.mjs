import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const ORIGIN = "https://llmleft.com";

const ROUTES = {
  "/": "index.html",
  "/download/": "download/index.html",
  "/privacy/": "privacy/index.html",
  "/changelog/": "changelog/index.html",
};

const REQUIRED_ASSETS = [
  "favicon.svg",
  "favicon.png",
  "icon-64.png",
  "icon-192.png",
  "icon-512.png",
  "apple-touch-icon.png",
  "og.png",
  "manifest.webmanifest",
  "robots.txt",
  "sitemap-index.xml",
  "llms.txt",
  "_headers",
  "404.html",
];

let failures = 0;
const ok = (message) => console.log(`  ✓ ${message}`);
const fail = (message) => {
  failures += 1;
  console.error(`  ✗ ${message}`);
};
const attr = (tag, name) => tag?.match(new RegExp(`${name}="([^"]*)"`))?.[1];

if (!existsSync(DIST)) {
  console.error("✗ dist/ is missing. Run npm run build first.");
  process.exit(1);
}

console.log("assets");
for (const asset of REQUIRED_ASSETS) {
  const path = join(DIST, asset);
  existsSync(path) && statSync(path).size > 0 ? ok(asset) : fail(`${asset} missing or empty`);
}

for (const [asset, expectedWidth, expectedHeight] of [
  ["favicon.png", 96, 96],
  ["icon-64.png", 64, 64],
  ["icon-192.png", 192, 192],
  ["icon-512.png", 512, 512],
  ["apple-touch-icon.png", 180, 180],
  ["og.png", 1200, 630],
]) {
  const png = readFileSync(join(DIST, asset));
  const width = png.readUInt32BE(16);
  const height = png.readUInt32BE(20);
  width === expectedWidth && height === expectedHeight
    ? ok(`${asset} is ${expectedWidth}x${expectedHeight}`)
    : fail(`${asset} is ${width}x${height}; expected ${expectedWidth}x${expectedHeight}`);
}

const robots = readFileSync(join(DIST, "robots.txt"), "utf8");
robots.includes(`Sitemap: ${ORIGIN}/sitemap-index.xml`)
  ? ok("robots.txt references the canonical sitemap")
  : fail("robots.txt does not reference the canonical sitemap");

let sitemap = readFileSync(join(DIST, "sitemap-index.xml"), "utf8");
for (const match of sitemap.matchAll(/<loc>([^<]+\.xml)<\/loc>/g)) {
  const nested = match[1].replace(`${ORIGIN}/`, "");
  if (existsSync(join(DIST, nested))) sitemap += readFileSync(join(DIST, nested), "utf8");
}
for (const route of Object.keys(ROUTES)) {
  sitemap.includes(`<loc>${ORIGIN}${route}</loc>`)
    ? ok(`sitemap lists ${ORIGIN}${route}`)
    : fail(`sitemap does not list ${ORIGIN}${route}`);
}

const headers = readFileSync(join(DIST, "_headers"), "utf8");
for (const required of [
  "X-Content-Type-Options: nosniff",
  "Content-Security-Policy:",
  "Referrer-Policy:",
  "Strict-Transport-Security:",
]) {
  headers.includes(required) ? ok(`_headers has ${required.replace(":", "")}`) : fail(`_headers missing ${required}`);
}

const titles = new Map();
const descriptions = new Map();

for (const [route, file] of Object.entries(ROUTES)) {
  console.log(`page ${route}`);
  const path = join(DIST, file);
  if (!existsSync(path)) {
    fail(`missing ${file}`);
    continue;
  }
  const html = readFileSync(path, "utf8");

  const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
  h1Count === 1 ? ok("exactly one h1") : fail(`${h1Count} h1 elements`);

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
  if (!title) fail("missing title");
  else if (titles.has(title)) fail(`duplicate title also on ${titles.get(title)}`);
  else {
    titles.set(title, route);
    title.length <= 70 ? ok(`title length ${title.length}`) : fail(`title is too long: ${title.length}`);
  }

  const description = attr(html.match(/<meta name="description"[^>]*>/)?.[0], "content") ?? "";
  if (!description) fail("missing description");
  else if (descriptions.has(description)) fail(`duplicate description also on ${descriptions.get(description)}`);
  else {
    descriptions.set(description, route);
    description.length >= 50 && description.length <= 165
      ? ok(`description length ${description.length}`)
      : fail(`description length ${description.length} is outside 50 to 165`);
  }

  const canonical = attr(html.match(/<link rel="canonical"[^>]*>/)?.[0], "href");
  canonical === `${ORIGIN}${route}` ? ok("canonical matches route") : fail(`canonical is ${canonical}`);

  const ogImage = attr(html.match(/<meta property="og:image"[^>]*>/)?.[0], "content");
  ogImage === `${ORIGIN}/og.png` ? ok("Open Graph image is absolute") : fail(`Open Graph image is ${ogImage}`);
  html.includes('name="twitter:card" content="summary_large_image"')
    ? ok("Twitter card is present")
    : fail("Twitter card is missing");

  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (jsonLd.length === 0) fail("JSON-LD is missing");
  for (const [, raw] of jsonLd) {
    try {
      const data = JSON.parse(raw);
      ok(`JSON-LD ${data["@type"]} parses`);
      if (data["@type"] === "FAQPage") {
        const visibleQuestions = (html.match(/<summary[\s>]/g) ?? []).length;
        visibleQuestions === data.mainEntity.length
          ? ok("FAQ content matches FAQ schema")
          : fail("FAQ content does not match FAQ schema");
      }
    } catch {
      fail("JSON-LD does not parse");
    }
  }

  const executableScripts = [...html.matchAll(/<script(?![^>]*type="application\/ld\+json")[^>]*>/g)];
  executableScripts.length === 0 ? ok("no client JavaScript") : fail(`${executableScripts.length} client scripts found`);

  const images = [...html.matchAll(/<img[^>]*>/g)].map((match) => match[0]);
  const missingAlt = images.filter((image) => !/\salt="/.test(image));
  missingAlt.length === 0 ? ok(`all ${images.length} images have alt`) : fail(`${missingAlt.length} images missing alt`);
  for (const image of images) {
    const src = attr(image, "src");
    if (src?.startsWith("/") && !existsSync(join(DIST, src.slice(1)))) fail(`image ${src} is missing from dist`);
  }

  const internalHrefs = [...html.matchAll(/href="(\/[^"#]*)(?:#[^"]*)?"/g)].map((match) => match[1]);
  for (const href of new Set(internalHrefs)) {
    const target = href.endsWith("/") ? join(DIST, href.slice(1), "index.html") : join(DIST, href.slice(1));
    const directoryTarget = join(DIST, href.slice(1), "index.html");
    if (!existsSync(target) && !existsSync(directoryTarget)) fail(`internal link ${href} does not resolve`);
  }
  ok("internal links resolve");
}

const notFound = readFileSync(join(DIST, "404.html"), "utf8");
notFound.includes('name="robots" content="noindex"') ? ok("404 is noindex") : fail("404 is not noindex");

const allHtml = Object.values(ROUTES).map((file) => readFileSync(join(DIST, file), "utf8")).join("\n");
for (const forbidden of ["googletagmanager", "google-analytics", "plausible.io", "cloudflareinsights"]) {
  allHtml.includes(forbidden) ? fail(`analytics reference found: ${forbidden}`) : ok(`no ${forbidden}`);
}

if (failures > 0) {
  console.error(`\n✗ validate-site failed with ${failures} issue(s)`);
  process.exit(1);
}

console.log("\n✓ validate-site passed");

