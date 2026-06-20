import type { GuideContentProvider, SiteContent } from "./types.ts";

export const createStaticContentProvider = (content: SiteContent): GuideContentProvider => ({
  loadContent: () => content,
});

export const validateSiteContent = (content: SiteContent): string[] => {
  const errors: string[] = [];
  const regionIds = new Set(content.regions.map((region) => region.id));
  const shopIds = new Set(content.shops.map((shop) => shop.id));
  const languageCodes = new Set(content.languages.map((language) => language.code));

  if (!content.site.id) errors.push("site.id is required");
  if (!regionIds.has(content.site.defaultRegionId)) errors.push("site.defaultRegionId must match a region");
  if (!languageCodes.has(content.site.defaultLanguage)) errors.push("site.defaultLanguage must match a language");
  if (content.regions.length === 0) errors.push("at least one region is required");
  if (content.shops.length === 0) errors.push("at least one shop is required");
  if (content.profiles.length === 0) errors.push("at least one profile is required");

  for (const shop of content.shops) {
    if (!regionIds.has(shop.regionId)) errors.push(`shop ${shop.id} uses unknown region ${shop.regionId}`);
  }

  for (const profile of content.profiles) {
    if (!regionIds.has(profile.regionId)) errors.push(`profile ${profile.id} uses unknown region ${profile.regionId}`);
    if (!shopIds.has(profile.shopId)) errors.push(`profile ${profile.id} uses unknown shop ${profile.shopId}`);
    if (!profile.gallery.includes(profile.image)) errors.push(`profile ${profile.id} image must appear in gallery`);
  }

  for (const hotel of content.hotels) {
    if (!regionIds.has(hotel.regionId)) errors.push(`hotel ${hotel.id} uses unknown region ${hotel.regionId}`);
  }

  for (const pricePlan of content.pricePlans) {
    if (!regionIds.has(pricePlan.regionId)) errors.push(`pricePlan ${pricePlan.id} uses unknown region ${pricePlan.regionId}`);
  }

  return errors;
};
