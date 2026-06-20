import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { sampleContent } from "../src/sample-content/index.ts";
import type { LanguageCode } from "../src/guidekit/index.ts";

const distDir = join(process.cwd(), "dist");
const baseHtml = readFileSync(join(distDir, "index.html"), "utf8");
const siteUrl = process.env.SITE_URL || "https://example.com";

const routeFor = (code: LanguageCode) => {
  const routes = {
    "zh-Hant": "zh-hant",
    "zh-Hans": "zh-hans",
    ja: "ja",
    ko: "ko",
    en: "en",
  } satisfies Record<LanguageCode, string>;
  return routes[code];
};

const escapeHtml = (value: string) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const renderLocalizedHtml = (code: LanguageCode) => {
  const language = sampleContent.languages.find((option) => option.code === code)!;
  const copy = sampleContent.site.copy[code];
  const route = routeFor(code);
  const canonical = `${siteUrl}/${route}/`;
  const alternates = sampleContent.languages
    .map((option) => `<link rel="alternate" hreflang="${option.htmlLang}" href="${siteUrl}/${routeFor(option.code)}/" />`)
    .join("\n    ");
  return baseHtml
    .replace(/<html lang="[^"]*">/, `<html lang="${language.htmlLang}">`)
    .replace(/content="[^"]*"(\s*\/>\s*<title>)/, `content="${escapeHtml(copy.metaDescription)}"$1`)
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(copy.metaTitle)}</title>`)
    .replace("</head>", `    <link rel="canonical" href="${canonical}" />\n    ${alternates}\n  </head>`);
};

for (const option of sampleContent.languages) {
  const route = routeFor(option.code);
  const routeDir = join(distDir, route);
  mkdirSync(routeDir, { recursive: true });
  writeFileSync(join(routeDir, "index.html"), renderLocalizedHtml(option.code));
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sampleContent.languages
  .map((option) => `  <url><loc>${siteUrl}/${routeFor(option.code)}/</loc></url>`)
  .join("\n")}\n</urlset>\n`;

writeFileSync(join(distDir, "sitemap.xml"), sitemap);
