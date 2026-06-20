import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateSiteContent } from "../src/guidekit/index.ts";
import { sampleContent } from "../src/sample-content/index.ts";

const root = process.cwd();
const requiredFiles = [
  "AGENTS.md",
  ".gitignore",
  "package.json",
  "src/guidekit/index.ts",
  "src/sample-content/index.ts",
  "tests/e2e/site.spec.ts",
  "tools/postbuild.ts",
  "public/404.html",
  "public/robots.txt",
];

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

for (const file of requiredFiles) {
  assert(existsSync(join(root, file)), `Missing required file: ${file}`);
}

const errors = validateSiteContent(sampleContent);
assert(errors.length === 0, `sample content is invalid:\n${errors.join("\n")}`);
assert(sampleContent.regions.length >= 2, "sample content must include at least two regions");
assert(sampleContent.profiles.every((profile) => profile.regionId), "every profile must be scoped to a region");
assert(sampleContent.shops.every((shop) => shop.regionId), "every shop must be scoped to a region");

const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as {
  packageManager?: string;
  scripts?: Record<string, string>;
};
assert(packageJson.packageManager?.startsWith("pnpm@10."), "packageManager must use pnpm 10");
assert(packageJson.scripts?.test === "tsx tools/check-site.ts", "test script must run tools/check-site.ts");
assert(!("preinstall" in (packageJson.scripts || {})), "preinstall scripts are not allowed");
assert(!("install" in (packageJson.scripts || {})), "install scripts are not allowed");
assert(!("postinstall" in (packageJson.scripts || {})), "postinstall scripts are not allowed");
assert(!("prepare" in (packageJson.scripts || {})), "prepare scripts are not allowed");

const configuredPrivateMarkers = (process.env.GUIDEKIT_PRIVATE_MARKERS || "")
  .split(",")
  .map((marker) => marker.trim())
  .filter(Boolean);

const bannedStrings = configuredPrivateMarkers;

const scannedFiles = [
  "AGENTS.md",
  "README.md",
  "src/main.ts",
  "src/guidekit/app.ts",
  "src/sample-content/index.ts",
  "tools/postbuild.ts",
  "tests/e2e/site.spec.ts",
];

for (const file of scannedFiles) {
  const text = readFileSync(join(root, file), "utf8");
  for (const banned of bannedStrings) {
    assert(!text.includes(banned), `${file} must not contain private marker ${banned}`);
  }
}

console.log("guidekit checks passed");
