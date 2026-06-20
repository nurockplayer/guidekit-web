import { expect, test } from "@playwright/test";
import { sampleContent } from "../../src/sample-content/index.ts";

const tokyoProfiles = sampleContent.profiles.filter((profile) => profile.regionId === "tokyo").length;
const osakaProfiles = sampleContent.profiles.filter((profile) => profile.regionId === "osaka").length;

test("renders sample region, shop, language, and gallery flows", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "I am of legal age" }).click();

  await expect(page.locator(".region-tab")).toHaveCount(sampleContent.regions.length);
  await expect(page.locator(".profile-card")).toHaveCount(tokyoProfiles);

  await page.getByRole("button", { name: /Osaka/ }).click();
  await expect(page.locator(".hero h1")).toHaveText("Osaka Area Guide");
  await expect(page.locator(".profile-card")).toHaveCount(osakaProfiles);

  await page.getByRole("button", { name: "日" }).click();
  await expect(page.locator(".hero h1")).toHaveText("大阪エリアガイド");

  await page.getByPlaceholder("名前、地域、タグ").fill("Rin");
  await expect(page.locator(".profile-card")).toHaveCount(1);

  await page.locator("[data-profile='sample-rin']").first().click();
  await expect(page.locator(".profile-dialog")).toBeVisible();
  await expect(page.locator(".dialog-thumbs button")).toHaveCount(2);
});

test("generates localized static routes", async ({ page }) => {
  await page.goto("/ja/");
  await expect(page).toHaveTitle("Guidekit Web サンプル");

  await page.goto("/sitemap.xml");
  await expect.poll(() => page.content()).toContain("https://example.com/ja/");
});
