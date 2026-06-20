export type LanguageCode = "zh-Hant" | "zh-Hans" | "ja" | "ko" | "en";

export type Localized<T> = Record<LanguageCode, T>;

export type LanguageOption = {
  code: LanguageCode;
  label: string;
  shortLabel: string;
  htmlLang: string;
  locale: string;
};

export type Contact = {
  phone: string;
  line?: string;
  secondaryLine?: string;
  area: string;
  hours: string;
};

export type RegionCopy = {
  name: string;
  shortName: string;
  heroTitle: string;
  heroCopy: string;
  introTitle: string;
  introCopy: string;
  hotelsTitle: string;
  hotelsCopy: string;
};

export type SiteCopy = {
  metaTitle: string;
  metaDescription: string;
  brand: string;
  nav: Array<[string, string]>;
};

export type Region = {
  id: string;
  countryCode: string;
  timezone: string;
  copy: Localized<RegionCopy>;
};

export type Shop = {
  id: string;
  regionId: string;
  name: string;
  shortName: string;
  contact: Contact;
};

export type Profile = {
  id: string;
  regionId: string;
  shopId: string;
  name: string;
  title: string;
  date: string;
  image: string;
  gallery: string[];
  origin: string;
  age: string;
  height: string;
  tags: string[];
  price: string;
  summary: string;
  isToday?: boolean;
  lastSeen?: string;
};

export type Hotel = {
  id: string;
  regionId: string;
  name: string;
  area: string;
  address: string;
  image: string;
};

export type PricePlan = {
  id: string;
  regionId: string;
  name: string;
  note: string;
  rows: string[];
};

export type SiteSettings = {
  id: string;
  defaultLanguage: LanguageCode;
  defaultRegionId: string;
  copy: Localized<SiteCopy>;
};

export type SiteContent = {
  site: SiteSettings;
  languages: LanguageOption[];
  regions: Region[];
  shops: Shop[];
  profiles: Profile[];
  hotels: Hotel[];
  pricePlans: PricePlan[];
  imageMap: Record<string, string>;
};

export type GuideContentProvider = {
  loadContent: () => SiteContent | Promise<SiteContent>;
};

export type GuideAppOptions = {
  root: string | HTMLElement;
  provider: GuideContentProvider;
  storagePrefix?: string;
};
