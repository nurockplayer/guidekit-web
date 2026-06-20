import { validateSiteContent } from "./content-provider.ts";
import { imageSrc } from "./media.ts";
import type { GuideAppOptions, LanguageCode, Profile } from "./types.ts";
import { uiCopy } from "./ui-copy.ts";

const languageRoutes: Record<string, LanguageCode> = {
  "/zh-hant/": "zh-Hant",
  "/zh-hans/": "zh-Hans",
  "/ja/": "ja",
  "/ko/": "ko",
  "/en/": "en",
};

const routeForLanguage = (code: LanguageCode) => {
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
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const resolveRoot = (root: string | HTMLElement) => {
  const element = typeof root === "string" ? document.querySelector<HTMLElement>(root) : root;
  if (!element) throw new Error("Guidekit root element was not found");
  return element;
};

export const createGuideApp = async (options: GuideAppOptions) => {
  const root = resolveRoot(options.root);
  const content = await options.provider.loadContent();
  const errors = validateSiteContent(content);
  if (errors.length) throw new Error(`Invalid Guidekit content:\n${errors.join("\n")}`);

  const storagePrefix = options.storagePrefix || content.site.id;
  const languageKey = `${storagePrefix}:language`;
  const regionKey = `${storagePrefix}:region`;
  const shopKey = `${storagePrefix}:shop`;
  const ageKey = `${storagePrefix}:age-ok`;
  const allShopsId = "all";
  let activeRegionId = localStorage.getItem(regionKey) || content.site.defaultRegionId;
  let activeShopId = localStorage.getItem(shopKey) || allShopsId;
  const storedLanguage = localStorage.getItem(languageKey) as LanguageCode | null;
  const routedLanguage = languageRoutes[window.location.pathname];
  let language: LanguageCode =
    routedLanguage ||
    (content.languages.some((option) => option.code === storedLanguage) ? storedLanguage! : content.site.defaultLanguage);
  let query = "";

  const getLanguageOption = () => content.languages.find((option) => option.code === language) || content.languages[0]!;
  const copy = () => content.site.copy[language];
  const labels = () => uiCopy[language];
  const regions = () => content.regions;
  const region = () => regions().find((item) => item.id === activeRegionId) || regions()[0]!;
  const regionCopy = () => region().copy[language];
  const shops = () => content.shops.filter((shop) => shop.regionId === region().id);
  const activeShop = () => shops().find((shop) => shop.id === activeShopId);
  const profiles = () => content.profiles.filter((profile) => profile.regionId === region().id);
  const regionHotels = () => content.hotels.filter((hotel) => hotel.regionId === region().id);
  const pricePlans = () => content.pricePlans.filter((plan) => plan.regionId === region().id);
  const activeContact = () => activeShop()?.contact || shops()[0]?.contact;
  const phoneLink = () => `tel:${(activeContact()?.phone || "").replaceAll(/[^0-9+]/g, "")}`;

  const updateDocument = () => {
    const siteCopy = copy();
    document.documentElement.lang = getLanguageOption().htmlLang;
    document.title = siteCopy.metaTitle;
    document.querySelector('meta[name="description"]')?.setAttribute("content", siteCopy.metaDescription);
  };

  const visibleProfiles = () => {
    const selected = activeShopId === allShopsId ? profiles() : profiles().filter((profile) => profile.shopId === activeShopId);
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return selected;
    return selected.filter((profile) => {
      const shop = content.shops.find((item) => item.id === profile.shopId);
      const haystack = `${profile.name} ${profile.title} ${profile.origin} ${profile.tags.join(" ")} ${profile.summary} ${shop?.name || ""}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  };

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat(getLanguageOption().locale, { month: "2-digit", day: "2-digit" }).format(new Date(date));

  const renderLanguageSwitcher = () => `
    <div class="switcher" role="group" aria-label="${labels().language}">
      ${content.languages
        .map(
          (option) => `
            <button class="chip ${option.code === language ? "is-active" : ""}" data-language="${option.code}" type="button" aria-pressed="${option.code === language}">
              ${option.shortLabel}
            </button>
          `,
        )
        .join("")}
    </div>
  `;

  const renderNav = () => `
    <header class="site-header">
      <a class="brand" href="#top">${copy().brand}</a>
      <nav aria-label="Primary">
        ${copy().nav.map(([id, label]) => `<a href="#${id}">${label}</a>`).join("")}
      </nav>
      ${renderLanguageSwitcher()}
    </header>
  `;

  const renderRegionTabs = () => `
    <div class="region-tabs" role="group" aria-label="${labels().region}">
      ${regions()
        .map(
          (item) => `
            <button class="region-tab ${item.id === region().id ? "is-active" : ""}" data-region="${item.id}" type="button">
              <span>${escapeHtml(item.copy[language].name)}</span>
              <small>${escapeHtml(item.timezone)}</small>
            </button>
          `,
        )
        .join("")}
    </div>
  `;

  const renderHero = () => {
    const heroProfiles = visibleProfiles().slice(0, 4);
    const fallbackProfiles = profiles().slice(0, 4);
    const mediaProfiles = heroProfiles.length ? heroProfiles : fallbackProfiles;
    return `
      <section class="hero" id="top">
        <div class="hero-copy">
          <p class="kicker">${escapeHtml(regionCopy().shortName)} / ${labels().today}</p>
          <h1>${escapeHtml(regionCopy().heroTitle)}</h1>
          <p>${escapeHtml(regionCopy().heroCopy)}</p>
          <div class="hero-actions">
            <a class="button primary" href="#profiles">${labels().view}</a>
            <a class="button secondary" href="${phoneLink()}">${labels().call}</a>
          </div>
        </div>
        <div class="hero-media" aria-hidden="true">
          ${mediaProfiles
            .map(
              (profile, index) =>
                `<img src="${imageSrc(profile.image, content.imageMap)}" alt="" style="--image-index:${index}" />`,
            )
            .join("")}
        </div>
      </section>
    `;
  };

  const renderShopTabs = () => `
    <div class="toolbar">
      <div class="shop-tabs" role="group" aria-label="${labels().shop}">
        <button class="chip ${activeShopId === allShopsId ? "is-active" : ""}" data-shop="${allShopsId}" type="button">${labels().allShops}</button>
        ${shops()
          .map(
            (shop) => `
              <button class="chip ${shop.id === activeShopId ? "is-active" : ""}" data-shop="${shop.id}" type="button">
                ${escapeHtml(shop.shortName)}
              </button>
            `,
          )
          .join("")}
      </div>
      <label class="search-box">
        <span>${labels().search}</span>
        <input type="search" value="${escapeHtml(query)}" placeholder="${labels().searchPlaceholder}" />
      </label>
    </div>
  `;

  const renderProfileCard = (profile: Profile) => {
    const shop = content.shops.find((item) => item.id === profile.shopId);
    const dateLabel = profile.isToday === false ? labels().featured : labels().updated;
    return `
      <article class="profile-card">
        <button class="profile-image" data-profile="${profile.id}" type="button">
          <img src="${imageSrc(profile.image, content.imageMap)}" alt="${escapeHtml(profile.name)} ${escapeHtml(profile.title)}" loading="lazy" />
          <span>${formatDate(profile.lastSeen || profile.date)} ${dateLabel}</span>
        </button>
        <div class="profile-body">
          <div>
            <p>${escapeHtml(shop?.shortName || regionCopy().shortName)}</p>
            <h3>${escapeHtml(profile.name)}</h3>
          </div>
          <dl class="profile-specs">
            <div><dt>${labels().age}</dt><dd>${escapeHtml(profile.age)}</dd></div>
            <div><dt>${labels().height}</dt><dd>${escapeHtml(profile.height)}</dd></div>
          </dl>
          <p>${escapeHtml(profile.summary)}</p>
          <div class="tag-row">${profile.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
          <strong>${escapeHtml(profile.price)}</strong>
          <button class="button small" data-profile="${profile.id}" type="button">${labels().view}</button>
        </div>
      </article>
    `;
  };

  const renderProfiles = () => {
    const visible = visibleProfiles();
    return `
      <section class="content-section" id="profiles">
        <div class="section-head">
          <h2>${labels().today} ${escapeHtml(regionCopy().name)}</h2>
          <p>${escapeHtml(regionCopy().introCopy)}</p>
        </div>
        ${renderShopTabs()}
        <div class="profile-grid">
          ${visible.length ? visible.map(renderProfileCard).join("") : `<p class="empty-state">${labels().empty}</p>`}
        </div>
      </section>
    `;
  };

  const renderPrices = () => `
    <section class="content-section" id="prices">
      <div class="section-head">
        <h2>${labels().prices}</h2>
        <p>${escapeHtml(regionCopy().introTitle)}</p>
      </div>
      <div class="price-grid">
        ${pricePlans()
          .map(
            (plan) => `
              <article class="info-card">
                <h3>${escapeHtml(plan.name)}</h3>
                <p>${escapeHtml(plan.note)}</p>
                <ul>${plan.rows.map((row) => `<li>${escapeHtml(row)}</li>`).join("")}</ul>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;

  const renderHotels = () => `
    <section class="content-section" id="hotels">
      <div class="section-head">
        <h2>${escapeHtml(regionCopy().hotelsTitle)}</h2>
        <p>${escapeHtml(regionCopy().hotelsCopy)}</p>
      </div>
      <div class="hotel-grid">
        ${regionHotels()
          .map(
            (hotel) => `
              <article class="hotel-row">
                <img src="${imageSrc(hotel.image, content.imageMap)}" alt="${escapeHtml(hotel.name)}" loading="lazy" />
                <div>
                  <span>${escapeHtml(hotel.area)}</span>
                  <h3>${escapeHtml(hotel.name)}</h3>
                  <p>${escapeHtml(hotel.address)}</p>
                </div>
              </article>
            `,
          )
          .join("")}
      </div>
    </section>
  `;

  const renderContact = () => {
    const contact = activeContact();
    return `
      <section class="contact-section" id="contact">
        <div>
          <h2>${labels().contact}</h2>
          <p>${escapeHtml(contact?.area || regionCopy().name)}</p>
        </div>
        <div class="contact-panel">
          <a href="${phoneLink()}">${escapeHtml(contact?.phone || "")}</a>
          <span>${escapeHtml(contact?.hours || "")}</span>
        </div>
      </section>
    `;
  };

  const renderAgeGate = () => `
    <div class="age-gate" role="dialog" aria-modal="true" aria-labelledby="age-title">
      <div class="age-panel">
        <h2 id="age-title">${labels().ageGateTitle}</h2>
        <p>${labels().ageGateCopy}</p>
        <div class="hero-actions">
          <button class="button primary" data-age-confirm type="button">${labels().confirmAge}</button>
          <a class="button secondary" href="https://www.google.com/">${labels().leave}</a>
        </div>
      </div>
    </div>
  `;

  const renderModal = () => `<dialog class="profile-dialog"><button class="dialog-close" type="button" aria-label="${labels().close}">×</button><div class="dialog-content"></div></dialog>`;

  const openProfile = (id: string | undefined) => {
    const profile = content.profiles.find((item) => item.id === id);
    if (!profile) return;
    const dialog = root.querySelector<HTMLDialogElement>(".profile-dialog");
    const body = root.querySelector<HTMLElement>(".dialog-content");
    if (!dialog || !body) return;
    const gallery = profile.gallery.length ? profile.gallery : [profile.image];
    body.innerHTML = `
      <div class="dialog-gallery">
        <img data-gallery-main src="${imageSrc(gallery[0]!, content.imageMap)}" alt="${escapeHtml(profile.name)}" />
        <div class="dialog-thumbs">
          ${gallery
            .map(
              (image, index) => `
                <button class="${index === 0 ? "is-active" : ""}" data-gallery-image="${escapeHtml(image)}" type="button">
                  <img src="${imageSrc(image, content.imageMap)}" alt="" loading="lazy" />
                </button>
              `,
            )
            .join("")}
        </div>
      </div>
      <div class="dialog-copy">
        <span>${formatDate(profile.lastSeen || profile.date)}</span>
        <h2>${escapeHtml(profile.name)}</h2>
        <p>${escapeHtml(profile.summary)}</p>
        <dl class="profile-specs">
          <div><dt>${labels().age}</dt><dd>${escapeHtml(profile.age)}</dd></div>
          <div><dt>${labels().height}</dt><dd>${escapeHtml(profile.height)}</dd></div>
        </dl>
        <strong>${escapeHtml(profile.price)}</strong>
      </div>
    `;
    body.querySelectorAll<HTMLButtonElement>("[data-gallery-image]").forEach((button) => {
      button.addEventListener("click", () => {
        const mainImage = body.querySelector<HTMLImageElement>("[data-gallery-main]");
        const image = button.dataset.galleryImage;
        if (mainImage && image) mainImage.src = imageSrc(image, content.imageMap);
        body.querySelectorAll("[data-gallery-image]").forEach((item) => item.classList.toggle("is-active", item === button));
      });
    });
    dialog.showModal();
  };

  const bindEvents = () => {
    root.querySelectorAll<HTMLButtonElement>("[data-language]").forEach((button) => {
      button.addEventListener("click", () => {
        const nextLanguage = button.dataset.language as LanguageCode | undefined;
        if (!nextLanguage) return;
        language = nextLanguage;
        localStorage.setItem(languageKey, language);
        render();
      });
    });

    root.querySelectorAll<HTMLButtonElement>("[data-region]").forEach((button) => {
      button.addEventListener("click", () => {
        const nextRegion = button.dataset.region;
        if (!nextRegion || !content.regions.some((item) => item.id === nextRegion)) return;
        activeRegionId = nextRegion;
        activeShopId = allShopsId;
        localStorage.setItem(regionKey, activeRegionId);
        localStorage.setItem(shopKey, activeShopId);
        render();
      });
    });

    root.querySelectorAll<HTMLButtonElement>("[data-shop]").forEach((button) => {
      button.addEventListener("click", () => {
        const nextShop = button.dataset.shop;
        if (!nextShop || (nextShop !== allShopsId && !shops().some((shop) => shop.id === nextShop))) return;
        activeShopId = nextShop;
        localStorage.setItem(shopKey, activeShopId);
        render();
      });
    });

    root.querySelector<HTMLInputElement>(".search-box input")?.addEventListener("input", (event) => {
      query = (event.currentTarget as HTMLInputElement).value;
      const grid = root.querySelector<HTMLElement>(".profile-grid");
      if (!grid) return;
      const visible = visibleProfiles();
      grid.innerHTML = visible.length ? visible.map(renderProfileCard).join("") : `<p class="empty-state">${labels().empty}</p>`;
      bindProfileButtons();
    });

    root.querySelector("[data-age-confirm]")?.addEventListener("click", () => {
      localStorage.setItem(ageKey, "1");
      root.querySelector(".age-gate")?.remove();
    });

    root.querySelector<HTMLButtonElement>(".dialog-close")?.addEventListener("click", () => {
      root.querySelector<HTMLDialogElement>(".profile-dialog")?.close();
    });

    bindProfileButtons();
  };

  const bindProfileButtons = () => {
    root.querySelectorAll<HTMLButtonElement>("[data-profile]").forEach((button) => {
      button.addEventListener("click", () => openProfile(button.dataset.profile));
    });
  };

  const render = () => {
    updateDocument();
    root.innerHTML = `
      ${renderNav()}
      <main>
        ${renderRegionTabs()}
        ${renderHero()}
        ${renderProfiles()}
        ${renderPrices()}
        ${renderHotels()}
        ${renderContact()}
      </main>
      ${renderModal()}
      ${localStorage.getItem(ageKey) ? "" : renderAgeGate()}
    `;
    bindEvents();
  };

  render();

  return {
    content,
    routeForLanguage,
    rerender: render,
  };
};
