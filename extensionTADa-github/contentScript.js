const DEFAULT_SETTINGS = {
  superVolume: true,
  ambientLight: true,
  ambientBrightness: 100,
  ambientSpread: 100,
  curateSidebar: true,
  fourColumnGrid: true,
  hideShorts: true,
  hideEndScreens: true,
  premiumBranding: true,
  ensureComments: true,
  autoSelectChips: false,
  pipButton: true,
  videoScreenshot: true,
  customSpeed: true,
  abLooper: true,
  videoBookmarks: true,
  videoDownloader: true
};

let currentSettings = { ...DEFAULT_SETTINGS };
const HUD_ID = "ctf-adblock-hud";
const FOUR_COLUMN_GRID_STYLE_ID = "ctf-four-column-grid-style";
const HIDE_END_SCREENS_STYLE_ID = "ctf-hide-end-screens-style";
const HIDE_SHORTS_STYLE_ID = "ctf-hide-shorts-style";
const PREMIUM_BRANDING_STYLE_ID = "ctf-premium-branding-style";
const ENSURE_COMMENTS_STYLE_ID = "ctf-ensure-comments-style";
const CURATE_SIDEBAR_STYLE_ID = "ctf-curate-sidebar-style";
const SUPER_VOLUME_STYLE_ID = "ctf-super-volume-style";
const AMBIENT_LIGHT_STYLE_ID = "ctf-ambient-light-style";
const AMBIENT_LIGHT_CONTAINER_ID = "tada-ambient-light-container";
const AMBIENT_CANVAS_DIFFUSE_ID = "tada-ambient-canvas-diffuse";
const AMBIENT_CANVAS_GLOW_ID = "tada-ambient-canvas-glow";
const PIP_BUTTON_STYLE_ID = "tada-pip-button-style";
const PIP_BUTTON_ID = "tada-pip-button";
const SCREENSHOT_BUTTON_STYLE_ID = "tada-screenshot-button-style";
const SCREENSHOT_BUTTON_ID = "tada-screenshot-button";
const SCREENSHOT_FLASH_ID = "tada-screenshot-flash";
const SPEED_BUTTON_STYLE_ID = "tada-speed-button-style";
const SPEED_BUTTON_ID = "tada-speed-btn";
const SPEED_HUD_ID = "tada-speed-hud";
const SPEED_PRESET_MENU_ID = "tada-speed-preset-menu";
const SPEED_MIN = 0.1;
const SPEED_MAX = 4.0;
const SPEED_DEFAULT = 1.0;
const SPEED_STEP = 0.1;
const SPEED_FINE_STEP = 0.05;
const SPEED_STORAGE_KEY = "tada_custom_playback_rate";
const AB_STYLE_ID = "tada-ab-style";
const AB_BTN_ID = "tada-ab-btn";
const AB_CLEAR_BTN_ID = "tada-ab-clear-btn";
const AB_TRACK_ID = "tada-ab-track";
const BOOKMARK_STYLE_ID = "tada-bookmark-style";
const BOOKMARK_BTN_ID = "tada-bookmark-btn";
const BOOKMARK_ADD_BTN_ID = "tada-bookmark-add-btn";
const BOOKMARK_MODAL_ID = "tada-bookmark-modal";
const BOOKMARK_TRACK_ID = "tada-bookmark-track";
const BOOKMARK_PANEL_ID = "tada-bookmark-panel";
const BOOKMARK_TOAST_ID = "tada-bookmark-toast";
const BOOKMARKS_STORAGE_KEY = "tada_video_bookmarks_v1";
const DOWNLOAD_BUTTON_STYLE_ID = "tada-download-button-style";
const DOWNLOAD_BUTTON_ID = "tada-download-btn";
const DOWNLOAD_MODAL_ID = "tada-download-modal";
const DOWNLOAD_TOAST_ID = "tada-download-toast";
const AD_SELECTORS = [
  "ytd-promoted-video-renderer",
  "ytd-promoted-sparkles-text-search-renderer",
  "ytd-promoted-sparkles-web-renderer",
  "ytd-in-feed-ad-layout-renderer",
  "ytd-display-ad-renderer",
  "ytd-companion-slot-renderer",
  "ytd-ad-slot-renderer",
  "ytd-player-legacy-desktop-watch-ads-renderer",
  "#player-ads",
  "#masthead-ad",
  "ytd-action-companion-ad-renderer",
  "ytd-engagement-panel-section-list-renderer[target-id='engagement-panel-ads']",
  "ytd-enforcement-message-view-model",
  "ytd-enforcement-message-renderer",
  "#dialog.ytd-enforcement-message-view-model",
  "tp-yt-paper-dialog[label*='ad blocker']",
  "tp-yt-paper-dialog[dialog-renderer*='adBlocker']"
];

const END_SCREEN_SELECTORS = [
  ".ytp-ce-element",
  ".ytp-ce-covering-overlay",
  ".ytp-ce-element-show",
  ".ytp-ce-channel",
  ".ytp-ce-video",
  ".ytp-ce-playlist",
  ".ytp-ce-website-group",
  ".ytp-endscreen-content",
  ".html5-endscreen",
  ".videowall-endscreen"
];

const RICH_ITEM_SELECTOR = "ytd-rich-item-renderer[rendered-from-rich-grid]";
const SHORTS_SHELF_SELECTOR = "ytd-rich-shelf-renderer";
const SUPER_VOLUME_MAX = 500;
const SUPER_VOLUME_MIN = 0;
const SUPER_VOLUME_DEFAULT = 100;
const SUPER_VOLUME_STEP = 5;
const SUPER_VOLUME_FAST_STEP = 25;
const SUPER_VOLUME_STORAGE_KEY = "ctf-super-volume-percent";
const SIDEBAR_CURATE_DEBOUNCE_MS = 250;
const CURATED_BADGE_ID = "ctf-curated-sidebar-label";
const CURATED_ATTR = "data-ctf-curated";
const CURATED_SCORE_THRESHOLD = 4;
const STRICT_SCORE_THRESHOLD = 5;
const WATCHED_OVERLAY_SELECTOR =
  "ytd-thumbnail-overlay-resume-playback-renderer, ytd-thumbnail-overlay-playback-status-renderer";
const _MAX_YEAR_DELTA = 1; // Reserved for future year-based filtering
const MAX_DURATION_DELTA_SECONDS = 60;
const DURATION_SLACK_SECONDS = 15;
const KIDS_KEYWORD_HINTS = [
  "kid",
  "kids",
  "child",
  "children",
  "toddler",
  "baby",
  "nursery",
  "nursery rhyme",
  "nursery rhymes",
  "lullaby",
  "cartoon",
  "learning",
  "learn",
  "phonics",
  "abc",
  "123",
  "colors",
  "colour",
  "preschool",
  "pre-school",
  "kindergarten",
  "sing along",
  "sing-along",
  "storytime",
  "family fun",
  "animal song",
  "wheels on the bus",
  "baby shark",
  "cocomelon",
  "pinkfong",
  "little baby",
  "playtime",
  "kids songs",
  "kids song",
  "nursery song"
];
const KIDS_HINTS_NORMALIZED = KIDS_KEYWORD_HINTS.map((hint) => hint.toLowerCase());
const SECTION_EXCLUSION_KEYWORDS = [
  "watched",
  "recent",
  "recently",
  "for you",
  "mix",
  "playlist",
  "from your search",
  "from the series",
  "electronic dance music",
  "beats",
  "g-funk",
  "alternative hip hop",
  "recently uploaded"
];
const SIDEBAR_STRIP_SELECTORS = [
  "ytd-compact-radio-renderer",
  "ytd-compact-playlist-renderer",
  "ytd-compact-movie-renderer",
  "ytd-compact-channel-renderer",
  "ytd-compact-station-renderer"
];
const GENRE_CLUSTERS = [
  {
    name: "arabicRap",
    keywords: [
      "arabic",
      "arabicrap",
      "iraq",
      "iraqi",
      "iraqi rap",
      "khaleeji",
      "levant",
      "عرب",
      "العراق",
      "حسام",
      "محمد",
      "خليجي",
      "دسر",
      "اغنية"
    ]
  },
  {
    name: "turkishPop",
    keywords: [
      "turk",
      "turkish",
      "istanbul",
      "tilki",
      "ö",
      "ş",
      "ğ",
      "ç",
      "ayı",
      "müzik"
    ]
  },
  {
    name: "afroBeat",
    keywords: [
      "amapiano",
      "afrobeat",
      "afro-beat",
      "afrobeats",
      "dbn gogo",
      "nandipha",
      "africori",
      "za",
      "gqom",
      "amzin deep",
      "titom",
      "yuppe"
    ]
  },
  {
    name: "latinUrban",
    keywords: [
      "reggaeton",
      "latino",
      "latina",
      "espanol",
      "español",
      "barrio",
      "perreo",
      "urbano",
      "mexico",
      "colombia"
    ]
  },
  {
    name: "mainstreamHipHop",
    keywords: [
      "hip hop",
      "hip-hop",
      "rap",
      "g-unit",
      "gunit",
      "shady",
      "aftermath",
      "g-funk",
      "50 cent",
      "eminem",
      "dr. dre",
      "snoop",
      "lloyd banks",
      "tony yayo",
      "g unit"
    ]
  },
  {
    name: "pop",
    keywords: ["pop", "r&b", "dance", "club", "chart"]
  },
  {
    name: "edm",
    keywords: ["edm", "electronic", "techno", "house", "trance"]
  }
];
const SCRIPT_PATTERNS = [
  { name: "arabic", regex: /[\u0600-\u06FF]/ },
  { name: "cyrillic", regex: /[\u0400-\u04FF]/ },
  { name: "latinExtended", regex: /[çğıöşüáéíóúñãõ]/i },
  { name: "latin", regex: /[A-Za-z]/ }
];
const KEYWORD_STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "for",
  "from",
  "in",
  "into",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "to",
  "was",
  "were",
  "with"
]);

let hudIntervalId = null;
let domObserver = null;
let hasInvalidatedContext = false;
let premiumStyleInjected = false;
let pageEventHandler = null;
let superVolumePercent = SUPER_VOLUME_DEFAULT;
let superVolumePreferenceLoaded = false;
let superVolumeAudioCtx = null;
let superVolumeGainNode = null;
let superVolumeSourceMap = new WeakMap();
let superVolumeHotkeysBound = false;
let suppressNativeVolumeEvent = false;
let sliderDragActive = false;
let sidebarCurateHandle = null;
let sidebarCuratorBound = false;
let _lastSidebarVideoId = null; // Reserved for optimization
let _lastSidebarItemCount = 0; // Reserved for optimization
let chipSelectionHandle = null;

function scheduleChipSelection() {
  if (!currentSettings.autoSelectChips) {
    return;
  }
  if (chipSelectionHandle) {
    clearTimeout(chipSelectionHandle);
  }
  chipSelectionHandle = setTimeout(() => {
    chipSelectionHandle = null;
    try {
      selectDefaultChip(document);
    } catch (error) {
      console.debug("[TADa] chip selection failed", error);
    }
  }, 150);
}
function canMessageRuntime() {
  try {
    return (
      typeof chrome !== "undefined" &&
      !!chrome.runtime &&
      typeof chrome.runtime.sendMessage === "function" &&
      !!chrome.runtime.id
    );
  } catch (error) {
    return false;
  }
}

function collectMatches(root, selector) {
  const matches = new Set();
  const scope = root ?? document;
  const maybeAdd = (node) => {
    if (node) {
      matches.add(node);
    }
  };

  if (scope?.matches?.(selector)) {
    maybeAdd(scope);
  }

  scope?.querySelectorAll?.(selector)?.forEach((node) => {
    maybeAdd(node);
  });

  return Array.from(matches);
}

function isWatchPage() {
  return window.location?.pathname?.startsWith("/watch");
}

function getCurrentVideoId() {
  try {
    return new URLSearchParams(window.location.search).get("v");
  } catch (error) {
    console.debug("[TADa] unable to parse video id", error);
    return null;
  }
}

function normalizeWhitespace(text) {
  return (text ?? "").replace(/\s+/g, " ").trim();
}

function normalizeComparableText(text) {
  return normalizeWhitespace(text).toLowerCase();
}

function containsKeywordFromList(text, keywordList) {
  const normalized = normalizeComparableText(text);
  if (!normalized) {
    return false;
  }
  return keywordList.some((hint) => normalized.includes(hint));
}

function detectKidsTheme(strings = []) {
  for (const value of strings) {
    if (containsKeywordFromList(value, KIDS_HINTS_NORMALIZED)) {
      return true;
    }
  }
  return false;
}

function detectGenreCluster(strings = [], scriptTag = null) {
  const normalized = strings.map((value) => normalizeComparableText(value)).filter(Boolean);
  if (scriptTag === "arabic") {
    return "arabicRap";
  }
  if (scriptTag === "cyrillic") {
    return "cyrillicMusic";
  }
  for (const cluster of GENRE_CLUSTERS) {
    if (cluster.scriptHint && scriptTag && cluster.scriptHint !== scriptTag) {
      continue;
    }
    if (cluster.keywords.some((hint) => normalized.some((value) => value.includes(hint)))) {
      return cluster.name;
    }
  }
  return null;
}

function detectScriptTag(strings = []) {
  const haystacks = strings.filter(Boolean);
  for (const pattern of SCRIPT_PATTERNS) {
    if (haystacks.some((value) => pattern.regex.test(value))) {
      return pattern.name === "latinExtended" ? "latin" : pattern.name;
    }
  }
  return null;
}

function tokenizeKeywords(input, limit = 5) {
  const normalized = normalizeComparableText(input);
  if (!normalized) {
    return [];
  }
  const tokens = normalized
    .split(/[^a-z0-9]+/)
    .map((token) => token.trim())
    .filter((token) => token && token.length > 1 && !KEYWORD_STOP_WORDS.has(token));
  const unique = [];
  for (const token of tokens) {
    if (!unique.includes(token)) {
      unique.push(token);
    }
    if (unique.length >= limit) {
      break;
    }
  }
  return unique;
}

function buildContextKeywords(title, channel, extraSources = []) {
  const keywordSet = new Set(tokenizeKeywords(title, 8));
  tokenizeKeywords(channel, 4).forEach((token) => keywordSet.add(token));
  extraSources.forEach((source) => {
    tokenizeKeywords(source, 6).forEach((token) => keywordSet.add(token));
  });
  return Array.from(keywordSet).slice(0, 20);
}

function deriveYearFromIsoDate(value) {
  if (!value) {
    return null;
  }
  const match = String(value).match(/(\d{4})/);
  return match ? Number(match[1]) : null;
}

function deriveYearFromText(text) {
  const normalized = normalizeWhitespace(text);
  if (!normalized) {
    return null;
  }
  const explicit = normalized.match(/(19|20)\d{2}/);
  if (explicit) {
    return Number(explicit[0]);
  }
  const relative = normalized.match(/(\d+)\s+(year|month|week|day)s?\s+ago/i);
  if (relative) {
    return yearFromRelative(Number(relative[1]), relative[2]);
  }
  const parsed = Date.parse(normalized);
  if (!Number.isNaN(parsed)) {
    return new Date(parsed).getFullYear();
  }
  return null;
}

function yearFromRelative(amount, unit) {
  if (!Number.isFinite(amount)) {
    return null;
  }
  const now = new Date();
  switch (unit?.toLowerCase()) {
    case "year":
      return now.getFullYear() - amount;
    case "month": {
      const computed = new Date(now.getFullYear(), now.getMonth() - amount, 1);
      return computed.getFullYear();
    }
    case "week": {
      const computed = new Date(now);
      computed.setDate(computed.getDate() - amount * 7);
      return computed.getFullYear();
    }
    case "day": {
      const computed = new Date(now);
      computed.setDate(computed.getDate() - amount);
      return computed.getFullYear();
    }
    default:
      return null;
  }
}

function getCurrentVideoContext() {
  const player = window.ytInitialPlayerResponse || {};
  const videoDetails = player.videoDetails || {};
  const microformat = player.microformat?.playerMicroformatRenderer || {};
  const uploadYear =
    deriveYearFromIsoDate(microformat.uploadDate) ||
    deriveYearFromText(document.querySelector('meta[itemprop="datePublished"]')?.content);
  const title = normalizeWhitespace(videoDetails.title || document.title.replace(/- YouTube$/i, ""));
  const channel =
    normalizeWhitespace(videoDetails.author) ||
    normalizeWhitespace(microformat.ownerChannelName) ||
    normalizeWhitespace(document.querySelector("#text.ytd-channel-name")?.textContent);
  const category =
    normalizeWhitespace(videoDetails.category) ||
    normalizeWhitespace(microformat.category) ||
    "";
  const videoId = videoDetails.videoId || getCurrentVideoId();
  const scriptTag = detectScriptTag([
    title,
    channel,
    ...(videoDetails.keywords ?? []),
    ...(microformat.tags ?? [])
  ]);
  const keywords = buildContextKeywords(title, channel, [
    ...(videoDetails.keywords ?? []),
    ...(microformat.tags ?? [])
  ]);
  const isKids = detectKidsTheme([title, channel, category, keywords.join(" ")]);
  const durationSeconds = Number(videoDetails.lengthSeconds || microformat.lengthSeconds);
  const genreCluster = detectGenreCluster(
    [title, channel, category, ...(videoDetails.keywords ?? []), ...(microformat.tags ?? [])],
    scriptTag
  );
  return {
    videoId,
    title,
    channel,
    category,
    uploadYear,
    keywords,
    isKids,
    durationSeconds: Number.isFinite(durationSeconds) ? durationSeconds : null,
    genreCluster,
    scriptTag
  };
}

function extractVideoIdFromNode(node) {
  const anchor = node?.querySelector?.("a#thumbnail, a#video-title");
  if (!anchor) {
    return null;
  }
  try {
    const target = new URL(anchor.href, window.location.origin);
    return target.searchParams.get("v");
  } catch (error) {
    return null;
  }
}

function isNodeWatched(node) {
  if (!node) {
    return false;
  }
  return Boolean(node.querySelector?.(WATCHED_OVERLAY_SELECTOR));
}

function parseDurationSeconds(text) {
  if (!text) {
    return null;
  }
  const normalized = text.trim();
  const hmsMatch = normalized.match(/(?:(\d+):)?(\d{1,2}):(\d{2})/);
  if (hmsMatch) {
    const hours = Number(hmsMatch[1] ?? 0);
    const minutes = Number(hmsMatch[2] ?? 0);
    const seconds = Number(hmsMatch[3] ?? 0);
    return hours * 3600 + minutes * 60 + seconds;
  }
  const minutesMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(minutes|minute|min)/i);
  if (minutesMatch) {
    return Math.round(Number(minutesMatch[1]) * 60);
  }
  return null;
}

function extractDurationSeconds(node) {
  const overlay = node?.querySelector?.("ytd-thumbnail-overlay-time-status-renderer #text");
  const text = overlay?.textContent || node?.querySelector?.("#video-title")?.getAttribute("aria-label");
  return parseDurationSeconds(text);
}

function getSectionLabel(node) {
  const section = node?.closest?.("ytd-item-section-renderer");
  if (!section) {
    return "";
  }
  const titleNode =
    section.querySelector?.("#title-container yt-formatted-string") ||
    section.querySelector?.("#header yt-formatted-string") ||
    section.querySelector?.("#title-text");
  return normalizeWhitespace(titleNode?.textContent);
}

function shouldDropBySection(label) {
  if (!label) {
    return false;
  }
  const normalized = label.toLowerCase();
  return SECTION_EXCLUSION_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

function extractRecommendationMetadata(node) {
  if (!node) {
    return null;
  }
  const titleEl = node.querySelector?.("#video-title");
  const title = normalizeWhitespace(titleEl?.textContent);
  const channel = normalizeWhitespace(
    node.querySelector?.("#channel-name a, #channel-name yt-formatted-string")?.textContent
  );
  const badgeNodes = node.querySelectorAll?.(
    "ytd-badge-supported-renderer yt-formatted-string, ytd-badge-supported-renderer .badge-style-type-simple"
  );
  const badges = Array.from(badgeNodes ?? [])
    .map((badge) => normalizeWhitespace(badge.textContent).toLowerCase())
    .filter(Boolean);
  const metadataLine = node.querySelector?.("#metadata-line span:nth-child(2)");
  const publishedText =
    normalizeWhitespace(metadataLine?.textContent) || normalizeWhitespace(titleEl?.getAttribute("aria-label"));
  const year = deriveYearFromText(publishedText);
  const videoId = extractVideoIdFromNode(node);
  const isKids = detectKidsTheme([title, channel, publishedText, badges.join(" ")]);
  const isWatched = isNodeWatched(node);
  const sectionLabel = getSectionLabel(node);
  const scriptTag = detectScriptTag([title, channel, publishedText, sectionLabel]);
  const genreCluster = detectGenreCluster(
    [title, channel, sectionLabel, badges.join(" "), publishedText],
    scriptTag
  );
  const durationSeconds = extractDurationSeconds(node);
  return {
    title,
    channel,
    badges,
    year,
    videoId,
    isKids,
    isWatched,
    sectionLabel,
    genreCluster,
    scriptTag,
    durationSeconds
  };
}

function computeRecommendationScore(context, metadata) {
  if (!context || !metadata) {
    return 0;
  }
  let score = 0;
  if (metadata.isWatched) {
    score -= 4;
  }
  if (
    context.channel &&
    metadata.channel &&
    normalizeComparableText(context.channel) === normalizeComparableText(metadata.channel)
  ) {
    score += 4;
  }
  if (context.uploadYear && metadata.year) {
    const delta = Math.abs(context.uploadYear - metadata.year);
    if (delta === 0) {
      score += 5;
    } else if (delta === 1) {
      score += 2;
    } else {
      score -= 3;
    }
  }
  const normalizedTitle = normalizeComparableText(metadata.title);
  context.keywords.forEach((keyword) => {
    if (keyword && normalizedTitle.includes(keyword)) {
      score += 1;
    }
  });
  if (context.category) {
    const categoryToken = normalizeComparableText(context.category);
    if (categoryToken && metadata.badges.some((badge) => badge.includes(categoryToken))) {
      score += 1;
    }
  }
  if (context.isKids) {
    if (metadata.isKids) {
      score += 4;
    } else {
      score -= 5;
    }
  }
  if (context.durationSeconds && metadata.durationSeconds) {
    const delta = metadata.durationSeconds - context.durationSeconds;
    if (Math.abs(delta) <= DURATION_SLACK_SECONDS) {
      score += 2;
    } else if (delta < 0 && Math.abs(delta) <= MAX_DURATION_DELTA_SECONDS) {
      score += 1;
    } else if (delta > MAX_DURATION_DELTA_SECONDS) {
      score -= 4;
    } else {
      score -= 1;
    }
  }
  if (context.genreCluster && metadata.genreCluster) {
    if (context.genreCluster === metadata.genreCluster) {
      score += 2;
    } else {
      score -= 3;
    }
  }
  if (context.scriptTag && metadata.scriptTag) {
    if (context.scriptTag === metadata.scriptTag) {
      score += 1;
    } else {
      score -= 4;
    }
  }
  return score;
}

function passesStrictFilters(context, metadata, score) {
  if (!metadata) {
    return false;
  }
  if (metadata.isWatched) {
    return false;
  }
  if (metadata.sectionLabel && shouldDropBySection(metadata.sectionLabel)) {
    return false;
  }
  if (context.isKids && !metadata.isKids) {
    return false;
  }
  if (context.uploadYear && metadata.year) {
    if (context.uploadYear !== metadata.year) {
      return false;
    }
  }
  if (context.durationSeconds && metadata.durationSeconds) {
    if (metadata.durationSeconds > context.durationSeconds + MAX_DURATION_DELTA_SECONDS) {
      return false;
    }
  }
  if (context.genreCluster && metadata.genreCluster && context.genreCluster !== metadata.genreCluster) {
    return false;
  }
  if (context.scriptTag && metadata.scriptTag && context.scriptTag !== metadata.scriptTag) {
    return false;
  }
  if (score < STRICT_SCORE_THRESHOLD && (!context.channel || normalizeComparableText(context.channel) !== normalizeComparableText(metadata.channel))) {
    return false;
  }
  return true;
}

function ensureCuratedSidebarBanner(context, curatedCount) {
  const host = document.querySelector("#secondary #related");
  const existing = document.getElementById(CURATED_BADGE_ID);
  if (!curatedCount || !context || !host) {
    if (existing) {
      existing.remove();
    }
    return;
  }
  const parts = [];
  if (context.uploadYear) {
    parts.push(context.uploadYear);
  }
  if (context.category) {
    parts.push(context.category);
  }
  const qualifier = parts.length ? parts.join(" • ") : "similar vibes";
  const text = `Curated for ${qualifier}`;
  if (existing) {
    existing.textContent = text;
    return;
  }
  const badge = document.createElement("div");
  badge.id = CURATED_BADGE_ID;
  badge.textContent = text;
  badge.style.cssText = [
    "font-size:13px",
    "font-weight:600",
    "margin:12px 0",
    "color:#f9d423",
    "letter-spacing:0.05em",
    "text-transform:uppercase"
  ].join(";");
  host.insertBefore(badge, host.firstChild);
}

function disableSidebarCurator() {
  const existing = document.getElementById(CURATED_BADGE_ID);
  if (existing) {
    existing.remove();
  }
  document.querySelectorAll(`[${CURATED_ATTR}]`).forEach((el) => {
    el.removeAttribute(CURATED_ATTR);
    delete el.dataset.ctfSidebarScore;
  });
}

function curateWatchSidebar() {
  if (!currentSettings.curateSidebar || !isWatchPage()) {
    _lastSidebarVideoId = null;
    _lastSidebarItemCount = 0;
    const existing = document.getElementById(CURATED_BADGE_ID);
    existing?.remove();
    return;
  }
  const context = getCurrentVideoContext();
  if (!context.videoId) {
    return;
  }
  const container = document.querySelector("ytd-watch-next-secondary-results-renderer #contents");
  if (!container) {
    return;
  }
  SIDEBAR_STRIP_SELECTORS.forEach((selector) => {
    collectMatches(container, selector).forEach((node) => node.remove());
  });
  const items = Array.from(container.querySelectorAll("ytd-compact-video-renderer"));
  if (!items.length) {
    return;
  }
  _lastSidebarVideoId = context.videoId;
  _lastSidebarItemCount = items.length;
  const ranked = items.map((node, index) => {
    const metadata = extractRecommendationMetadata(node);
    const score = computeRecommendationScore(context, metadata);
    return { node, metadata, score, originalIndex: index };
  });
  const sorted = ranked
    .slice()
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.originalIndex - b.originalIndex;
    });
  const needsReorder = sorted.some((entry, index) => entry.originalIndex !== index);
  const seenVideoIds = new Set();
  if (context.videoId) {
    seenVideoIds.add(context.videoId);
  }
  const filtered = [];
  let curatedCount = 0;
  let requiresDomRewrite = needsReorder;
  sorted.forEach((entry) => {
    const { node, score, metadata } = entry;
    const videoId = metadata?.videoId;
    const strictMismatch = !passesStrictFilters(context, metadata, score);
    const dropForDuplicate = Boolean(videoId && seenVideoIds.has(videoId));
    if (strictMismatch || dropForDuplicate) {
      requiresDomRewrite = true;
      node.remove();
      return;
    }
    if (videoId) {
      seenVideoIds.add(videoId);
    }
    if (score >= CURATED_SCORE_THRESHOLD) {
      node.setAttribute(CURATED_ATTR, "true");
      curatedCount += 1;
    } else {
      node.removeAttribute(CURATED_ATTR);
    }
    node.dataset.ctfSidebarScore = String(score);
    filtered.push(entry);
  });
  if (requiresDomRewrite) {
    const fragment = document.createDocumentFragment();
    filtered.forEach(({ node }) => {
      fragment.appendChild(node);
    });
    container.appendChild(fragment);
  }
  ensureCuratedSidebarBanner(context, curatedCount);
}

function scheduleSidebarCurate() {
  if (sidebarCurateHandle) {
    clearTimeout(sidebarCurateHandle);
  }
  sidebarCurateHandle = setTimeout(() => {
    sidebarCurateHandle = null;
    try {
      curateWatchSidebar();
    } catch (error) {
      console.debug("[TADa] sidebar curate failed", error);
    }
  }, SIDEBAR_CURATE_DEBOUNCE_MS);
}

function bindSidebarCurator() {
  if (sidebarCuratorBound) {
    return;
  }
  sidebarCuratorBound = true;
  scheduleSidebarCurate();
  ["yt-navigate-finish", "yt-page-data-updated", "yt-navigate-start"].forEach((eventName) => {
    window.addEventListener(eventName, scheduleSidebarCurate, true);
    document.addEventListener(eventName, scheduleSidebarCurate, true);
  });
  window.addEventListener("popstate", scheduleSidebarCurate, true);
}

function ensureSuperVolumePreferenceLoaded() {
  if (superVolumePreferenceLoaded) {
    return;
  }
  superVolumePreferenceLoaded = true;
  try {
    const storedRaw = localStorage.getItem(SUPER_VOLUME_STORAGE_KEY);
    if (storedRaw !== null && storedRaw !== "") {
      const storedValue = Number(storedRaw);
      if (Number.isFinite(storedValue) && storedValue > 0) {
        superVolumePercent = clampSuperVolume(storedValue);
      } else {
        // Invalid or 0 value stored, reset to default
        superVolumePercent = SUPER_VOLUME_DEFAULT;
        persistSuperVolumePreference(SUPER_VOLUME_DEFAULT);
      }
    } else {
      // No preference stored, use default and save it
      superVolumePercent = SUPER_VOLUME_DEFAULT;
      persistSuperVolumePreference(SUPER_VOLUME_DEFAULT);
    }
  } catch (error) {
    console.debug("[TADa] volume preference unavailable", error);
    superVolumePercent = SUPER_VOLUME_DEFAULT;
  }
}

function clampSuperVolume(value) {
  if (!Number.isFinite(value)) {
    return SUPER_VOLUME_DEFAULT;
  }
  return Math.max(SUPER_VOLUME_MIN, Math.min(SUPER_VOLUME_MAX, value));
}

function persistSuperVolumePreference(value) {
  try {
    localStorage.setItem(SUPER_VOLUME_STORAGE_KEY, String(value));
  } catch (error) {
    console.debug("[TADa] volume preference save failed", error);
  }
}

function resumeSuperVolumeContext() {
  if (superVolumeAudioCtx && superVolumeAudioCtx.state === "suspended") {
    superVolumeAudioCtx.resume().catch(() => { });
  }
}

function disableSuperVolumeControls() {
  if (superVolumeGainNode) {
    superVolumeGainNode.gain.value = 1.0;
  }
  const video = document.querySelector("video.html5-main-video");
  if (video) {
    video.volume = Math.min(video.volume, 1.0);
    delete video.dataset.ctfSuperVolumePercent;
  }
  document.querySelectorAll(".ctf-volume-boost-slider").forEach((slider) => {
    slider.classList.remove("ctf-volume-boost-slider", "ctf-dragging", "ctf-boost-mode");
    slider.removeAttribute("data-ctf-volume");
    delete slider.dataset.ctfVolumeSlider;
    slider.style.removeProperty("--ctf-volume-ratio");
    slider.style.removeProperty("--ctf-volume-pct");
    slider.querySelectorAll(".ctf-volume-track").forEach((el) => el.remove());
  });
  document.querySelectorAll("[data-ctf-volume-panel]").forEach((panel) => {
    delete panel.dataset.ctfVolumePanel;
    panel.classList.remove("ctf-panel-boost", "ctf-dragging");
    panel.removeAttribute("data-tooltip-title");
    panel.querySelectorAll(".ctf-volume-badge").forEach((el) => el.remove());
  });
  document.getElementById(SUPER_VOLUME_STYLE_ID)?.remove();
}

function ensureSuperVolumeControls(root = document) {
  if (!currentSettings.superVolume) {
    disableSuperVolumeControls();
    return;
  }
  ensureSuperVolumePreferenceLoaded();
  const video = ensureAudioGraph();
  if (video) {
    applySuperVolumeToMedia(video);
  }
  enhanceVolumePanel(root);
  ensureVolumeHotkeys();
  syncVolumeUi();
}

function ensureAudioGraph() {
  const video = document.querySelector("video.html5-main-video");
  if (!video) {
    return null;
  }
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextCtor) {
    return video;
  }
  if (!superVolumeAudioCtx) {
    try {
      superVolumeAudioCtx = new AudioContextCtor();
    } catch (error) {
      console.debug("[TADa] audio context unavailable", error);
      return video;
    }
  }
  if (!superVolumeGainNode && superVolumeAudioCtx) {
    superVolumeGainNode = superVolumeAudioCtx.createGain();
    superVolumeGainNode.gain.value = superVolumePercent / 100;
    superVolumeGainNode.connect(superVolumeAudioCtx.destination);
  }
  if (superVolumeSourceMap.has(video)) {
    return video;
  }
  if (!superVolumeAudioCtx) {
    return video;
  }
  try {
    const source = superVolumeAudioCtx.createMediaElementSource(video);
    source.connect(superVolumeGainNode);
    superVolumeSourceMap.set(video, source);
    video.addEventListener("volumechange", handleNativeVolumeChange, true);
  } catch (error) {
    console.debug("[TADa] unable to wire audio graph", error);
  }
  return video;
}

function applySuperVolumeToMedia(video) {
  if (!video) {
    return;
  }
  const normalized = Math.min(superVolumePercent / 100, 1);
  suppressNativeVolumeEvent = true;
  try {
    video.volume = normalized;
    video.dataset.ctfSuperVolumePercent = String(superVolumePercent);
  } catch (error) {
    console.debug("[TADa] failed to set volume", error);
  } finally {
    suppressNativeVolumeEvent = false;
  }
  if (superVolumeGainNode) {
    superVolumeGainNode.gain.value = superVolumePercent / 100;
  }
}

function volumeToRatio(vol) {
  const v = Math.max(0, Math.min(SUPER_VOLUME_MAX, Number(vol) || 0));
  // Thang đo thống nhất xuyên suốt (Unified Scale):
  // 0% - 100%: 34% chiều dài thanh (rộng rãi, 0 -> 0.34)
  // 100% - 200%: 33% chiều dài thanh (0.34 -> 0.67)
  // 200% - 500%: 33% chiều dài thanh (0.67 -> 1.00)
  if (v <= 100) {
    return (v / 100) * 0.34;
  } else if (v <= 200) {
    return 0.34 + ((v - 100) / 100) * 0.33;
  } else {
    return 0.67 + ((v - 200) / 300) * 0.33;
  }
}

function ratioToVolume(rawRatio) {
  const r = Math.max(0, Math.min(1, rawRatio));
  let vol;
  if (r <= 0.34) {
    vol = (r / 0.34) * 100;
  } else if (r <= 0.67) {
    vol = 100 + ((r - 0.34) / 0.33) * 100;
  } else {
    vol = 200 + ((r - 0.67) / 0.33) * 300;
  }

  // Lực hút nam châm nhẹ tại các mốc quan trọng 100%, 200%, 500%
  if (Math.abs(vol - 100) <= 2) vol = 100;
  else if (Math.abs(vol - 200) <= 3) vol = 200;
  else if (vol >= 496) vol = 500;

  return Math.round(vol);
}

function syncVolumeUi() {
  const panel = document.querySelector(".ytp-volume-panel");
  if (!panel) {
    return;
  }
  const rounded = Math.round(superVolumePercent);
  const isBoost = rounded > 100;

  panel.setAttribute("aria-valuemin", String(SUPER_VOLUME_MIN));
  panel.setAttribute("aria-valuemax", String(SUPER_VOLUME_MAX));
  panel.setAttribute("aria-valuenow", String(rounded));
  panel.setAttribute("aria-valuetext", `${rounded}% volume`);
  panel.setAttribute("data-tooltip-title", `Âm lượng (${rounded}%)`);

  panel.classList.toggle("ctf-panel-boost", isBoost);

  const slider = panel.querySelector(".ytp-volume-slider");
  if (!slider) {
    return;
  }

  buildVolumeTrack(slider);

  const ratio = volumeToRatio(rounded);
  const pct = (ratio * 100).toFixed(2);

  slider.dataset.ctfVolume = String(rounded);
  slider.classList.toggle("ctf-boost-mode", isBoost);
  slider.style.setProperty("--ctf-volume-ratio", ratio.toFixed(4));
  slider.style.setProperty("--ctf-volume-pct", `${pct}%`);

  const fill = slider.querySelector(".ctf-volume-fill");
  if (fill) {
    fill.style.width = `${pct}%`;
  }

  const thumb = slider.querySelector(".ctf-volume-thumb");
  if (thumb) {
    thumb.style.left = `${pct}%`;
  }

  // Update live percentage badge
  const badge = panel.querySelector(".ctf-volume-badge");
  if (badge) {
    if (rounded >= 500) {
      badge.textContent = "500% ";
      badge.className = "ctf-volume-badge ctf-badge-max";
    } else if (rounded > 100) {
      badge.textContent = `${rounded}% `;
      badge.className = "ctf-volume-badge ctf-badge-boost";
    } else {
      badge.textContent = `${rounded}%`;
      badge.className = "ctf-volume-badge";
    }
  }
}

function enhanceVolumePanel(root = document) {
  collectMatches(root, ".ytp-volume-panel").forEach((panel) => {
    if (!panel.dataset.ctfVolumePanel) {
      panel.dataset.ctfVolumePanel = "true";
      panel.addEventListener("keydown", handlePanelKeyDown, true);
    }
    panel.setAttribute("aria-valuemin", String(SUPER_VOLUME_MIN));
    panel.setAttribute("aria-valuemax", String(SUPER_VOLUME_MAX));
    panel.setAttribute("data-tooltip-title", `Âm lượng (0-${SUPER_VOLUME_MAX}%)`);
    const slider = panel.querySelector(".ytp-volume-slider");
    if (slider) {
      prepareVolumeSlider(slider);
    }
  });
}

function buildVolumeTrack(slider) {
  const panel = slider.closest(".ytp-volume-panel");

  let track = slider.querySelector(".ctf-volume-track");
  if (track) {
    // Dọn dẹp triệt để các vạch tick và nhãn dư thừa nếu còn lưu trong DOM
    track.querySelectorAll(".ctf-volume-mark, .ctf-volume-tooltip, .ctf-mark-tick, .ctf-mark-label").forEach((el) => el.remove());
  } else {
    track = document.createElement("div");
    track.className = "ctf-volume-track";

    const fill = document.createElement("div");
    fill.className = "ctf-volume-fill";

    const thumb = document.createElement("div");
    thumb.className = "ctf-volume-thumb";

    track.appendChild(fill);
    track.appendChild(thumb);
    slider.appendChild(track);
  }

  // Luôn đảm bảo có badge hiển thị % âm lượng trực tiếp rõ ràng ngay bên cạnh thanh kéo
  if (panel && !panel.querySelector(".ctf-volume-badge")) {
    const badge = document.createElement("span");
    badge.className = "ctf-volume-badge";
    const rounded = Math.round(superVolumePercent);
    if (rounded >= 500) {
      badge.textContent = "500% ";
      badge.className = "ctf-volume-badge ctf-badge-max";
    } else if (rounded > 100) {
      badge.textContent = `${rounded}% `;
      badge.className = "ctf-volume-badge ctf-badge-boost";
    } else {
      badge.textContent = `${rounded}%`;
    }
    panel.appendChild(badge);
  }
}

function prepareVolumeSlider(slider) {
  if (slider.dataset.ctfVolumeSlider === "true") {
    buildVolumeTrack(slider);
    return;
  }
  slider.dataset.ctfVolumeSlider = "true";
  slider.classList.add("ctf-volume-boost-slider");
  buildVolumeTrack(slider);
  slider.addEventListener("pointerdown", handleSliderPointerDown, true);
  slider.addEventListener("wheel", handleSliderWheel, { passive: false, capture: true });
}

function handleSliderPointerDown(event) {
  if (event.button !== 0 && event.pointerType !== "touch" && event.pointerType !== "pen") {
    return;
  }
  event.preventDefault();
  event.stopImmediatePropagation();
  const slider = event.currentTarget;
  const panel = slider.closest(".ytp-volume-panel");
  sliderDragActive = true;
  slider.classList.add("ctf-dragging");
  panel?.classList.add("ctf-dragging");
  slider.setPointerCapture?.(event.pointerId);
  slider.dataset.ctfPointerId = String(event.pointerId);
  slider.addEventListener("pointermove", handleSliderPointerMove, true);
  slider.addEventListener("pointerup", handleSliderPointerUp, true);
  slider.addEventListener("pointercancel", handleSliderPointerUp, true);
  updateVolumeFromPointer(slider, event, { skipPersist: true });
}

function handleSliderPointerMove(event) {
  if (!sliderDragActive) {
    return;
  }
  event.preventDefault();
  event.stopImmediatePropagation();
  const slider = event.currentTarget;
  updateVolumeFromPointer(slider, event, { skipPersist: true });
}

function handleSliderPointerUp(event) {
  if (!sliderDragActive) {
    return;
  }
  sliderDragActive = false;
  event.preventDefault();
  event.stopImmediatePropagation();
  const slider = event.currentTarget;
  const panel = slider.closest(".ytp-volume-panel");
  slider.classList.remove("ctf-dragging");
  panel?.classList.remove("ctf-dragging");
  const pointerId = slider.dataset.ctfPointerId;
  if (pointerId) {
    slider.releasePointerCapture?.(Number(pointerId));
    delete slider.dataset.ctfPointerId;
  }
  slider.removeEventListener("pointermove", handleSliderPointerMove, true);
  slider.removeEventListener("pointerup", handleSliderPointerUp, true);
  slider.removeEventListener("pointercancel", handleSliderPointerUp, true);
  updateVolumeFromPointer(slider, event);
}

function updateVolumeFromPointer(slider, event, options = {}) {
  const track = slider.querySelector(".ctf-volume-track") || slider;
  const rect = track.getBoundingClientRect();
  if (!rect.width) {
    return;
  }
  const rawRatio = (event.clientX - rect.left) / rect.width;
  const newVol = ratioToVolume(rawRatio);
  resumeSuperVolumeContext();
  setSuperVolumePercent(newVol, { skipPersist: options.skipPersist });
}

function handleSliderWheel(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
  if (!event.deltaY) {
    return;
  }
  const step = event.shiftKey ? SUPER_VOLUME_FAST_STEP : SUPER_VOLUME_STEP;
  const delta = event.deltaY < 0 ? step : -step;
  resumeSuperVolumeContext();
  setSuperVolumePercent(superVolumePercent + delta);
}

function handlePanelKeyDown(event) {
  const actionableKeys = new Set(["ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"]);
  if (!actionableKeys.has(event.key)) {
    return;
  }
  event.preventDefault();
  event.stopImmediatePropagation();
  const baseStep = event.shiftKey ? SUPER_VOLUME_FAST_STEP : SUPER_VOLUME_STEP;
  switch (event.key) {
    case "ArrowUp":
    case "PageUp":
      resumeSuperVolumeContext();
      setSuperVolumePercent(superVolumePercent + baseStep);
      break;
    case "ArrowDown":
    case "PageDown":
      resumeSuperVolumeContext();
      setSuperVolumePercent(superVolumePercent - baseStep);
      break;
    case "Home":
      resumeSuperVolumeContext();
      setSuperVolumePercent(SUPER_VOLUME_MIN);
      break;
    case "End":
      resumeSuperVolumeContext();
      setSuperVolumePercent(SUPER_VOLUME_MAX);
      break;
    default:
      break;
  }
}

function ensureVolumeHotkeys() {
  if (superVolumeHotkeysBound) {
    return;
  }
  window.addEventListener("keydown", handleGlobalVolumeKeys, true);
  superVolumeHotkeysBound = true;
}

function handleGlobalVolumeKeys(event) {
  if (!currentSettings.superVolume) {
    return;
  }
  if (event.defaultPrevented) {
    return;
  }
  if (event.key !== "ArrowUp" && event.key !== "ArrowDown") {
    return;
  }
  if (shouldIgnoreKeyEvent(event)) {
    return;
  }
  event.preventDefault();
  event.stopImmediatePropagation();
  const step = event.shiftKey ? SUPER_VOLUME_FAST_STEP : SUPER_VOLUME_STEP;
  const delta = event.key === "ArrowUp" ? step : -step;
  resumeSuperVolumeContext();
  setSuperVolumePercent(superVolumePercent + delta);
}

function shouldIgnoreKeyEvent(event) {
  const target = event.target;
  if (!target) {
    return false;
  }
  if (target.isContentEditable || target.getAttribute?.("role") === "textbox") {
    return true;
  }
  const tagName = target.tagName;
  if (tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT") {
    return true;
  }
  if (target.closest?.("[contenteditable='true'], [role='textbox'], input, textarea, select")) {
    return true;
  }
  return false;
}

function handleNativeVolumeChange(event) {
  if (suppressNativeVolumeEvent) {
    return;
  }
  const video = event.currentTarget;
  if (!video || video.muted) {
    return;
  }
  applySuperVolumeToMedia(video);
  syncVolumeUi();
}

function setSuperVolumePercent(value, options = {}) {
  ensureSuperVolumePreferenceLoaded();
  const clamped = clampSuperVolume(value);
  if (clamped === superVolumePercent && !options.force) {
    if (!options.skipUi) {
      syncVolumeUi();
    }
    return;
  }
  superVolumePercent = clamped;
  if (!options.skipPersist) {
    persistSuperVolumePreference(clamped);
  }
  const video = ensureAudioGraph();
  if (video) {
    applySuperVolumeToMedia(video);
  }
  if (!options.skipUi) {
    syncVolumeUi();
  }
}

function removeStaticAds(root = document) {
  const scope = root ?? document;
  AD_SELECTORS.forEach((selector) => {
    collectMatches(scope, selector).forEach((node) => node.remove());
  });

  pruneSponsoredRichItems(scope);

  if (currentSettings.hideEndScreens) {
    END_SCREEN_SELECTORS.forEach((selector) => {
      collectMatches(scope, selector).forEach((node) => node.remove());
    });
  }

  if (currentSettings.hideShorts) {
    removeShortsShelves(scope);
  }

  if (currentSettings.superVolume) {
    ensureSuperVolumeControls(scope);
  }
}

function scrubPlayerAds() {
  const video = document.querySelector("video.html5-main-video");
  const player = document.querySelector("#movie_player, .html5-video-player");
  const skipButton = document.querySelector(
    ".ytp-skip-ad-button, .ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-ad-skip-button-container button, button.ytp-ad-skip-button-modern"
  );

  if (skipButton) {
    try {
      skipButton.click();
    } catch (e) { }
  }

  const isAdShowing = Boolean(
    player?.classList.contains("ad-showing") ||
    player?.classList.contains("ad-interrupting") ||
    document.querySelector(".ytp-ad-player-overlay") ||
    document.body.classList.contains("ad-showing")
  );

  if (video && isAdShowing) {
    try {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        video.currentTime = video.duration;
      }
    } catch (e) { }
  }
}

function pruneSponsoredRichItems(root = document) {
  collectMatches(root, RICH_ITEM_SELECTOR).forEach((item) => {
    const hasMedia = item.querySelector(
      "ytd-rich-grid-media, ytd-rich-grid-playlist-renderer, ytd-rich-grid-channel-renderer, yt-lockup-view-model"
    );
    const hasAdSignals = item.querySelector(
      "ytd-display-ad-renderer, ytd-ad-slot-renderer, ytd-promoted-video-renderer"
    );
    const contentContainer = item.querySelector("#content");
    const isVisiblyEmpty = contentContainer && contentContainer.children.length === 0;
    const playableLink = item.querySelector(
      'a[href^="/watch"], a[href^="/live"], a[href^="/shorts"], a[href^="/playlist"]'
    );
    const hasMetadata = item.querySelector(
      "yt-lockup-metadata-view-model, ytd-video-meta-block, h3.yt-lockup-metadata-view-model__heading-reset"
    );
    const hasRenderableContent = hasMedia && (playableLink || hasMetadata);

    if (hasAdSignals || isVisiblyEmpty || !hasRenderableContent) {
      item.remove();
    }
  });
}

function removeShortsShelves(root = document) {
  if (!currentSettings.hideShorts) {
    return;
  }
  collectMatches(root, SHORTS_SHELF_SELECTOR).forEach((shelf) => {
    const title = shelf.querySelector("#title")?.textContent?.trim().toLowerCase();
    const hasShortsLockup = shelf.querySelector("ytm-shorts-lockup-view-model, ytd-reel-shelf-renderer");
    if ((title && title.includes("shorts")) || hasShortsLockup) {
      shelf.style.setProperty("display", "none", "important");
      shelf.setAttribute("data-ctf-hidden-shorts", "true");
    }
  });
}

function selectDefaultChip(filterRoot = document) {
  const containers = filterRoot.querySelectorAll?.(
    "yt-related-chip-cloud-renderer, ytd-related-chip-cloud-renderer"
  );
  if (!containers?.length) {
    return;
  }
  containers.forEach((container) => {
    const chips = Array.from(container.querySelectorAll("yt-chip-cloud-chip-renderer"));
    if (chips.length < 2) {
      return;
    }
    const preferredIndex = Math.min(2, chips.length - 1);
    const fallbackChip = chips[chips.length - 1];
    const targetButton = getChipButton(chips[preferredIndex]) || getChipButton(fallbackChip);
    if (!targetButton || targetButton.getAttribute("aria-selected") === "true") {
      return;
    }
    targetButton.click();
    // Re-assert selection shortly after click because YouTube may re-render the chips.
    setTimeout(() => {
      if (targetButton.getAttribute("aria-selected") !== "true") {
        scheduleChipSelection();
      }
    }, 200);
  });
}

function getChipButton(chipRenderer) {
  if (!chipRenderer) {
    return null;
  }
  return (
    chipRenderer.querySelector("button[role='tab']") ||
    chipRenderer.querySelector("chip-shape button") ||
    chipRenderer.shadowRoot?.querySelector?.("button[role='tab'], button") ||
    chipRenderer.firstElementChild?.shadowRoot?.querySelector?.("button") ||
    null
  );
}

/**
 * Ensures the comments section is visible on watch pages.
 * YouTube may hide comments via hidden attribute, collapsed state, or JS manipulation.
 */
function ensureCommentsVisible() {
  if (!currentSettings.ensureComments || !isWatchPage()) {
    return;
  }

  // Target selectors for comments section
  const commentsSelectors = [
    "ytd-comments#comments",
    "ytd-comments.ytd-watch-flexy",
    "#comments.ytd-watch-flexy",
    "#below.ytd-watch-flexy",
    "#below"
  ];

  commentsSelectors.forEach((selector) => {
    const element = document.querySelector(selector);
    if (element) {
      // Remove hidden attribute
      element.removeAttribute("hidden");
      element.removeAttribute("collapsed");

      // Force display via inline style as last resort
      if (getComputedStyle(element).display === "none") {
        element.style.setProperty("display", "block", "important");
      }
      if (getComputedStyle(element).visibility === "hidden") {
        element.style.setProperty("visibility", "visible", "important");
      }
    }
  });

  // Ensure item-section-renderer inside comments is visible
  const commentSections = document.querySelectorAll("ytd-comments ytd-item-section-renderer");
  commentSections.forEach((section) => {
    section.removeAttribute("hidden");
    if (getComputedStyle(section).display === "none") {
      section.style.setProperty("display", "block", "important");
    }
  });

  // HIDE the right-side engagement panel comments (keep only below-player comments)
  const engagementComments = document.querySelector(
    'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-comments-section"]'
  );
  if (engagementComments) {
    engagementComments.style.setProperty("display", "none", "important");
  }

  // Check for comment continuation
  const continuation = document.querySelector("ytd-comments ytd-continuation-item-renderer");
  if (continuation && !continuation.hasAttribute("data-ctf-triggered")) {
    continuation.setAttribute("data-ctf-triggered", "true");
  }
}

function applyFourColumnGridSetting() {
  const existing = document.getElementById(FOUR_COLUMN_GRID_STYLE_ID);
  if (currentSettings.fourColumnGrid) {
    if (!existing) {
      const style = document.createElement("style");
      style.id = FOUR_COLUMN_GRID_STYLE_ID;
      style.textContent = `
        /* ===== 4-ROW GRID LAYOUT FOR HOME PAGE ===== */
        ytd-rich-grid-renderer {
          --ytd-rich-grid-items-per-row: 4 !important;
          --ytd-rich-grid-posts-per-row: 4 !important;
          --ytd-rich-grid-movies-per-row: 4 !important;
          --ytd-rich-grid-game-cards-per-row: 4 !important;
        }

        ytd-rich-grid-renderer #contents.ytd-rich-grid-renderer {
          display: grid !important;
          grid-template-columns: repeat(4, 1fr) !important;
          gap: 16px !important;
          grid-auto-flow: row !important;
        }

        /* Force all rich items to respect grid sizing */
        ytd-rich-item-renderer[rendered-from-rich-grid] {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
          grid-column: span 1 !important;
        }
        
        ytd-rich-item-renderer[rendered-from-rich-grid] #content {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
        }

        /* Force all media containers to 100% width */
        ytd-rich-item-renderer[rendered-from-rich-grid] ytd-thumbnail,
        ytd-rich-item-renderer[rendered-from-rich-grid] ytd-rich-grid-media,
        ytd-rich-item-renderer[rendered-from-rich-grid] ytd-rich-grid-slim-media,
        ytd-rich-item-renderer[rendered-from-rich-grid] ytd-video-renderer,
        ytd-rich-item-renderer[rendered-from-rich-grid] ytd-grid-video-renderer,
        ytd-rich-item-renderer[rendered-from-rich-grid] ytd-playlist-renderer,
        ytd-rich-item-renderer[rendered-from-rich-grid] ytd-rich-grid-playlist-renderer,
        ytd-rich-item-renderer[rendered-from-rich-grid] yt-lockup-view-model,
        ytd-rich-item-renderer[rendered-from-rich-grid] yt-image {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
        }

        ytd-rich-item-renderer[rendered-from-rich-grid] ytd-thumbnail a,
        ytd-rich-item-renderer[rendered-from-rich-grid] ytd-thumbnail #thumbnail,
        ytd-rich-item-renderer[rendered-from-rich-grid] ytd-thumbnail img,
        ytd-rich-item-renderer[rendered-from-rich-grid] yt-image img {
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
        }

        ytd-rich-grid-row {
          display: contents !important;
        }

        /* ===== CONSTRAIN RICH SECTION RENDERERS (MIXES, PROMOTIONS) ===== */
        ytd-rich-section-renderer {
          width: 100% !important;
          max-width: 100% !important;
          grid-column: span 4 !important;
        }

        /* Ensure any content within sections also respects grid */
        ytd-rich-section-renderer ytd-rich-item-renderer {
          width: calc(25% - 12px) !important;
          max-width: calc(25% - 12px) !important;
          min-width: 0 !important;
          display: inline-block !important;
          vertical-align: top !important;
          margin: 0 16px 16px 0 !important;
        }

        ytd-rich-section-renderer ytd-rich-item-renderer:nth-child(4n) {
          margin-right: 0 !important;
        }

        /* ===== REMOVE EMPTY SPACE / GAPS ===== */
        ytd-rich-grid-renderer #contents.ytd-rich-grid-renderer > ytd-rich-item-renderer:empty,
        ytd-rich-grid-renderer #contents.ytd-rich-grid-renderer > ytd-rich-section-renderer:empty {
          display: none !important;
        }

        ytd-two-column-browse-results-renderer {
          padding: 0 24px !important;
        }

        #primary.ytd-two-column-browse-results-renderer {
          padding-top: 24px !important;
        }

        ytd-rich-grid-renderer {
          margin: 0 !important;
          padding: 0 !important;
        }
      `;
      (document.head || document.documentElement).appendChild(style);
    }
  } else {
    existing?.remove();
  }
}

function applyHideEndScreensSetting() {
  const existing = document.getElementById(HIDE_END_SCREENS_STYLE_ID);
  if (currentSettings.hideEndScreens) {
    if (!existing) {
      const style = document.createElement("style");
      style.id = HIDE_END_SCREENS_STYLE_ID;
      style.textContent = `
        /* ===== HIDE END SCREEN OVERLAYS ===== */
        .ytp-ce-element,
        .ytp-ce-covering-overlay,
        .ytp-ce-element-show,
        .ytp-ce-channel,
        .ytp-ce-video,
        .ytp-ce-playlist,
        .ytp-ce-website-group,
        .ytp-endscreen-content,
        .ytp-ce-expanding-overlay,
        .ytp-ce-expanding-image,
        .ytp-ce-shadow,
        .html5-endscreen,
        .videowall-endscreen,
        .ytp-endscreen-previous,
        .ytp-endscreen-next,
        .ytp-show-tiles .ytp-videowall-still {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `;
      (document.head || document.documentElement).appendChild(style);
    }
    END_SCREEN_SELECTORS.forEach((selector) => {
      collectMatches(document, selector).forEach((node) => {
        node.style.setProperty("display", "none", "important");
        node.setAttribute("data-ctf-hidden-endscreen", "true");
      });
    });
  } else {
    existing?.remove();
    document.querySelectorAll('[data-ctf-hidden-endscreen="true"]').forEach((node) => {
      node.style.removeProperty("display");
      node.removeAttribute("data-ctf-hidden-endscreen");
    });
  }
}

function applyHideShortsSetting() {
  const existing = document.getElementById(HIDE_SHORTS_STYLE_ID);
  if (currentSettings.hideShorts) {
    if (!existing) {
      const style = document.createElement("style");
      style.id = HIDE_SHORTS_STYLE_ID;
      style.textContent = `
        /* ===== HIDE YOUTUBE SHORTS ===== */
        ytd-rich-shelf-renderer[is-shorts],
        ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts]),
        ytd-reel-shelf-renderer,
        ytd-guide-entry-renderer:has(a[title="Shorts"]),
        ytd-mini-guide-entry-renderer[aria-label="Shorts"],
        ytd-guide-entry-renderer a[href^="/shorts"],
        ytd-mini-guide-entry-renderer a[href^="/shorts"],
        ytd-video-renderer:has(a[href*="/shorts/"]) {
          display: none !important;
        }
      `;
      (document.head || document.documentElement).appendChild(style);
    }
    removeShortsShelves(document);
  } else {
    existing?.remove();
    document.querySelectorAll('[data-ctf-hidden-shorts="true"]').forEach((node) => {
      node.style.removeProperty("display");
      node.removeAttribute("data-ctf-hidden-shorts");
    });
  }
}

function applyPremiumBrandingSetting() {
  const existingStyle = document.getElementById(PREMIUM_BRANDING_STYLE_ID);
  const logoIcon = document.querySelector("ytd-topbar-logo-renderer #logo-icon");
  const label = document.querySelector("ytd-topbar-logo-renderer #logo-icon-label");
  const masthead = document.querySelector("ytd-masthead");

  if (!existingStyle) {
    const style = document.createElement("style");
    style.id = PREMIUM_BRANDING_STYLE_ID;
    style.textContent = `
      /* ===== TADa BRAND LOGO (CLEAN, NO GLOW, NO MASTHEAD BORDER) ===== */
      ytd-topbar-logo-renderer #logo-icon {
        display: flex !important;
        align-items: center !important;
        width: auto !important;
        height: auto !important;
        position: relative !important;
      }

      ytd-topbar-logo-renderer #logo-icon-label {
        display: none !important;
      }

      ytd-topbar-logo-renderer #logo-icon .ctf-brand-logo {
        height: 20px !important;
        width: auto !important;
        max-width: 175px !important;
        object-fit: contain !important;
        display: block !important;
        cursor: pointer !important;
        transition: opacity 0.2s ease, transform 0.2s ease !important;
        box-shadow: none !important;
        filter: none !important;
        animation: none !important;
      }

      ytd-topbar-logo-renderer #logo-icon:hover .ctf-brand-logo {
        opacity: 0.85 !important;
        transform: scale(1.02) !important;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  if (logoIcon) {
    if (!logoIcon.dataset.originalLogo && logoIcon.innerHTML && !logoIcon.dataset.ctfPremium) {
      logoIcon.dataset.originalLogo = logoIcon.innerHTML;
    }
    const existingLogoImg = logoIcon.querySelector(".ctf-brand-logo");
    let logoSrc = null;
    try {
      if (typeof chrome !== "undefined" && chrome?.runtime?.id) {
        logoSrc = chrome.runtime.getURL("icons/youtube-tada-logo.png");
      }
    } catch {
      return;
    }
    if (!logoSrc) return;
    if (!existingLogoImg || existingLogoImg.getAttribute("src") !== logoSrc) {
      const logoImg = document.createElement("img");
      logoImg.className = "ctf-brand-logo";
      logoImg.src = logoSrc;
      logoImg.alt = "YouTube TADa";
      logoIcon.innerHTML = "";
      logoIcon.appendChild(logoImg);
      logoIcon.dataset.ctfPremium = "true";
    }
  }

  if (label) {
    label.textContent = "TADa";
  }

  // Remove amber border on masthead as requested
  if (masthead) {
    masthead.style.removeProperty("border-bottom");
    delete masthead.dataset.ctfPremium;
  }

  applyFaviconBrandingSetting();
}

let originalFaviconsBackup = null;

function applyFaviconBrandingSetting() {
  const isEnabled = Boolean(currentSettings.premiumBranding);
  let icon32Url = null;
  let icon48Url = null;
  let icon16Url = null;
  try {
    if (typeof chrome !== "undefined" && chrome?.runtime?.id) {
      icon32Url = chrome.runtime.getURL("icons/icon32.png");
      icon48Url = chrome.runtime.getURL("icons/icon48.png");
      icon16Url = chrome.runtime.getURL("icons/icon16.png");
    }
  } catch {
    return;
  }
  if (!icon32Url) return;

  if (isEnabled) {
    const foreignIcons = document.querySelectorAll(
      "link[rel*='icon']:not([data-ctf-favicon='true'])"
    );

    if (foreignIcons.length > 0) {
      if (!originalFaviconsBackup) {
        originalFaviconsBackup = Array.from(foreignIcons).map((link) => ({
          rel: link.getAttribute("rel") || "icon",
          href: link.getAttribute("href") || "",
          type: link.getAttribute("type") || "",
          sizes: link.getAttribute("sizes") || "",
        }));
      }
      foreignIcons.forEach((link) => link.remove());
    }

    let ctfFavicon32 = document.querySelector(
      "link[data-ctf-favicon='true'][sizes='32x32']"
    );
    if (!ctfFavicon32) {
      ctfFavicon32 = document.createElement("link");
      ctfFavicon32.rel = "icon";
      ctfFavicon32.type = "image/png";
      ctfFavicon32.sizes = "32x32";
      ctfFavicon32.href = icon32Url;
      ctfFavicon32.dataset.ctfFavicon = "true";
      (document.head || document.documentElement).appendChild(ctfFavicon32);
    } else if (ctfFavicon32.href !== icon32Url) {
      ctfFavicon32.href = icon32Url;
    }

    let ctfFavicon48 = document.querySelector(
      "link[data-ctf-favicon='true'][sizes='48x48']"
    );
    if (!ctfFavicon48) {
      ctfFavicon48 = document.createElement("link");
      ctfFavicon48.rel = "shortcut icon";
      ctfFavicon48.type = "image/png";
      ctfFavicon48.sizes = "48x48";
      ctfFavicon48.href = icon48Url;
      ctfFavicon48.dataset.ctfFavicon = "true";
      (document.head || document.documentElement).appendChild(ctfFavicon48);
    } else if (ctfFavicon48.href !== icon48Url) {
      ctfFavicon48.href = icon48Url;
    }

    let ctfFavicon16 = document.querySelector(
      "link[data-ctf-favicon='true'][sizes='16x16']"
    );
    if (!ctfFavicon16) {
      ctfFavicon16 = document.createElement("link");
      ctfFavicon16.rel = "icon";
      ctfFavicon16.type = "image/png";
      ctfFavicon16.sizes = "16x16";
      ctfFavicon16.href = icon16Url;
      ctfFavicon16.dataset.ctfFavicon = "true";
      (document.head || document.documentElement).appendChild(ctfFavicon16);
    } else if (ctfFavicon16.href !== icon16Url) {
      ctfFavicon16.href = icon16Url;
    }
  } else {
    const ctfIcons = document.querySelectorAll("link[data-ctf-favicon='true']");
    if (ctfIcons.length > 0) {
      ctfIcons.forEach((link) => link.remove());
    }

    if (originalFaviconsBackup && originalFaviconsBackup.length > 0) {
      originalFaviconsBackup.forEach((item) => {
        const link = document.createElement("link");
        if (item.rel) link.setAttribute("rel", item.rel);
        if (item.href) link.setAttribute("href", item.href);
        if (item.type) link.setAttribute("type", item.type);
        if (item.sizes) link.setAttribute("sizes", item.sizes);
        (document.head || document.documentElement).appendChild(link);
      });
      originalFaviconsBackup = null;
    }
  }
}

function applyEnsureCommentsSetting() {
  const existing = document.getElementById(ENSURE_COMMENTS_STYLE_ID);
  if (currentSettings.ensureComments) {
    if (!existing) {
      const style = document.createElement("style");
      style.id = ENSURE_COMMENTS_STYLE_ID;
      style.textContent = `
        /* ===== HIDE RIGHT-SIDE COMMENTS PANEL ===== */
        ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-comments-section"] {
          display: none !important;
          visibility: hidden !important;
        }
      `;
      (document.head || document.documentElement).appendChild(style);
    }
    if (isWatchPage()) {
      ensureCommentsVisible();
    }
  } else {
    existing?.remove();
  }
}

function applyCurateSidebarSetting() {
  const existingStyle = document.getElementById(CURATE_SIDEBAR_STYLE_ID);
  if (currentSettings.curateSidebar) {
    if (!existingStyle) {
      const style = document.createElement("style");
      style.id = CURATE_SIDEBAR_STYLE_ID;
      style.textContent = `
        ytd-compact-video-renderer[data-ctf-curated="true"] {
          border: 1px solid rgba(232,147,12,0.45);
          border-radius: 12px;
          padding: 6px;
          background: rgba(5,5,5,0.35);
        }

        #ctf-curated-sidebar-label {
          font-size: 13px;
          font-weight: 600;
          color: #E8930C;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
      `;
      (document.head || document.documentElement).appendChild(style);
    }
    if (isWatchPage()) {
      scheduleSidebarCurate();
    }
  } else {
    existingStyle?.remove();
    _lastSidebarVideoId = null;
    _lastSidebarItemCount = 0;
    const existingBadge = document.getElementById(CURATED_BADGE_ID);
    existingBadge?.remove();
    document.querySelectorAll(`[${CURATED_ATTR}]`).forEach((node) => {
      node.removeAttribute(CURATED_ATTR);
      delete node.dataset.ctfSidebarScore;
    });
  }
}

function applySuperVolumeSetting() {
  let style = document.getElementById(SUPER_VOLUME_STYLE_ID);
  if (currentSettings.superVolume) {
    if (!style) {
      style = document.createElement("style");
      style.id = SUPER_VOLUME_STYLE_ID;
      (document.head || document.documentElement).appendChild(style);
    }
    style.textContent = `
        /* ===== SUPER VOLUME SLIDER (CLEAN, EXPANDED, LIVE BADGE) ===== */
        
        /* 1. Closed/Collapsed: completely hidden, 0 width, clipped (NEVER overlaps timestamp) */
        .ytp-volume-panel {
          width: 0 !important;
          min-width: 0 !important;
          max-width: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
          opacity: 0 !important;
          overflow: hidden !important;
          pointer-events: none !important;
          display: inline-flex !important;
          align-items: center !important;
          vertical-align: top !important;
          height: 100% !important;
          transition: width 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s ease, margin 0.2s ease !important;
        }

        .ytp-volume-panel .ctf-volume-boost-slider,
        .ytp-volume-panel .ctf-volume-badge {
          opacity: 0 !important;
          pointer-events: none !important;
          transition: opacity 0.15s ease !important;
        }

        /* 2. Open / Expanded: 260px wide, fills the control pill frame seamlessly */
        .ytp-volume-area:hover .ytp-volume-panel,
        .ytp-volume-panel:hover,
        .ytp-volume-control-hover .ytp-volume-panel,
        .ytp-volume-panel.ytp-volume-panel-expanded,
        .ytp-volume-panel:focus-within,
        .ytp-volume-panel.ctf-dragging {
          width: 260px !important;
          min-width: 260px !important;
          max-width: 260px !important;
          opacity: 1 !important;
          overflow: visible !important;
          pointer-events: auto !important;
          margin-right: 6px !important;
        }

        .ytp-volume-area:hover .ytp-volume-panel .ctf-volume-boost-slider,
        .ytp-volume-panel:hover .ctf-volume-boost-slider,
        .ytp-volume-control-hover .ytp-volume-panel .ctf-volume-boost-slider,
        .ytp-volume-panel.ytp-volume-panel-expanded .ctf-volume-boost-slider,
        .ytp-volume-panel:focus-within .ctf-volume-boost-slider,
        .ytp-volume-panel.ctf-dragging .ctf-volume-boost-slider,
        .ytp-volume-area:hover .ytp-volume-panel .ctf-volume-badge,
        .ytp-volume-panel:hover .ctf-volume-badge,
        .ytp-volume-control-hover .ytp-volume-panel .ctf-volume-badge,
        .ytp-volume-panel.ytp-volume-panel-expanded .ctf-volume-badge,
        .ytp-volume-panel:focus-within .ctf-volume-badge,
        .ytp-volume-panel.ctf-dragging .ctf-volume-badge {
          opacity: 1 !important;
          pointer-events: auto !important;
        }

        /* Slider base container: fills the entire panel width up to the badge */
        .html5-video-player .ytp-volume-slider.ctf-volume-boost-slider,
        .ytp-volume-slider.ctf-volume-boost-slider {
          display: flex !important;
          align-items: center !important;
          justify-content: flex-start !important;
          position: relative !important;
          flex: 1 1 auto !important;
          width: 100% !important;
          min-width: 0 !important;
          max-width: none !important;
          height: 100% !important;
          max-height: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          cursor: pointer !important;
          overflow: visible !important;
          z-index: 50 !important;
          box-sizing: border-box !important;
        }

        /* Hide native YouTube handle */
        .ctf-volume-boost-slider .ytp-volume-slider-handle,
        .ctf-volume-boost-slider .ytp-volume-slider-handle::before,
        .ctf-volume-boost-slider .ytp-volume-slider-handle::after {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
        }

        /* Slider Track: ALWAYS 100% width of slider container */
        .ctf-volume-track {
          position: relative !important;
          width: 100% !important;
          height: 5px !important;
          background: rgba(255, 255, 255, 0.28) !important;
          border-radius: 999px !important;
          pointer-events: none !important;
          transition: height 0.15s ease, background 0.15s ease !important;
          overflow: visible !important;
        }

        .ctf-volume-boost-slider:hover .ctf-volume-track,
        .ctf-volume-boost-slider.ctf-dragging .ctf-volume-track {
          height: 6px !important;
          background: rgba(255, 255, 255, 0.38) !important;
        }

        /* Progress Fill: White by default (0-100% classic YouTube) */
        .ctf-volume-fill {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          height: 100% !important;
          width: 0%;
          background: #FFFFFF !important;
          border-radius: 999px !important;
          pointer-events: none !important;
          transition: width 0.05s linear, background 0.2s ease, box-shadow 0.2s ease !important;
        }

        /* Khi tăng trên 100% -> Chuyển sang dải màu lửa từ mốc 100% (34% track) trở đi */
        .ctf-boost-mode .ctf-volume-fill {
          background: linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 32%, #F87171 36%, #EF4444 67%, #DC2626 100%) !important;
          box-shadow: 0 0 8px rgba(239, 68, 68, 0.75) !important;
        }

        /* Thumb Knob: Classic white for 0-100% */
        .ctf-volume-thumb {
          position: absolute !important;
          top: 50% !important;
          left: 0%;
          transform: translate(-50%, -50%) !important;
          width: 13px !important;
          height: 13px !important;
          border-radius: 50% !important;
          background: #FFFFFF !important;
          border: none !important;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.6) !important;
          box-sizing: border-box !important;
          pointer-events: none !important;
          transition: width 0.15s ease, height 0.15s ease, border 0.2s ease, box-shadow 0.2s ease, left 0.05s linear !important;
          z-index: 5 !important;
        }

        .ctf-volume-boost-slider:hover .ctf-volume-thumb,
        .ctf-volume-boost-slider.ctf-dragging .ctf-volume-thumb {
          width: 14px !important;
          height: 14px !important;
        }

        /* Thumb Knob in Boost Mode (> 100%): Red border & glowing fire */
        .ctf-boost-mode .ctf-volume-thumb {
          background: #FFFFFF !important;
          border: 2px solid #EF4444 !important;
          box-shadow: 0 1px 5px rgba(0, 0, 0, 0.5), 0 0 8px rgba(239, 68, 68, 0.8) !important;
        }

        /* Live Volume Percentage Badge */
        .ctf-volume-badge {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex: 0 0 auto !important;
          font-size: 11.5px !important;
          font-weight: 700 !important;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
          color: rgba(255, 255, 255, 0.95) !important;
          margin-left: 8px !important;
          min-width: 44px !important;
          white-space: nowrap !important;
          pointer-events: none !important;
          user-select: none !important;
          letter-spacing: -0.2px !important;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8) !important;
          transition: color 0.2s ease, transform 0.15s ease !important;
        }

        .ctf-volume-badge.ctf-badge-boost {
          color: #F87171 !important;
          text-shadow: 0 0 8px rgba(239, 68, 68, 0.8) !important;
        }

        .ctf-volume-badge.ctf-badge-max {
          color: #EF4444 !important;
          font-weight: 800 !important;
          text-shadow: 0 0 10px rgba(220, 38, 38, 0.95) !important;
        }
      `;
    ensureSuperVolumeControls();
  } else {
    style?.remove();
    disableSuperVolumeControls();
  }
}

function applyHudSetting() {
  if (hudIntervalId) {
    clearInterval(hudIntervalId);
    hudIntervalId = null;
  }
  const existing = document.getElementById(HUD_ID);
  existing?.remove();
}

function applyAutoSelectChipsSetting() {
  if (currentSettings.autoSelectChips) {
    scheduleChipSelection();
  } else {
    if (chipSelectionHandle) {
      clearTimeout(chipSelectionHandle);
      chipSelectionHandle = null;
    }
  }
}

let ambientRenderActive = false;
let ambientVideoEl = null;
let ambientFrameCallbackId = null;
let ambientRafId = null;

function scheduleNextAmbientFrame() {
  if (!ambientRenderActive) return;
  const video = ambientVideoEl || document.querySelector("video.html5-main-video");
  if (!video) return;
  if ("requestVideoFrameCallback" in video) {
    ambientFrameCallbackId = video.requestVideoFrameCallback(renderAmbientFrame);
  } else {
    ambientRafId = requestAnimationFrame(renderAmbientFrame);
  }
}

function renderAmbientFrame() {
  if (!currentSettings.ambientLight || !isWatchPage()) {
    cancelAmbientLoop();
    ambientRenderActive = false;
    return;
  }

  const video = (ambientVideoEl && ambientVideoEl.isConnected)
    ? ambientVideoEl
    : document.querySelector("video.html5-main-video");

  if (!video) {
    if (ambientRenderActive) scheduleNextAmbientFrame();
    return;
  }
  ambientVideoEl = video;

  // Dừng vòng lặp khi video tạm dừng hoặc kết thúc
  if (video.paused || video.ended) {
    ambientRenderActive = false;
    cancelAmbientLoop();
    return;
  }

  // Khi đang buffer hoặc kích thước khung hình chưa sẵn sàng:
  // KHÔNG hủy vòng lặp mà tiếp tục hẹn frame tiếp theo để tự động bắt lại ngay khi buffer xong!
  if (video.readyState < 2 || video.videoWidth <= 0 || video.videoHeight <= 0) {
    scheduleNextAmbientFrame();
    return;
  }

  const container = ensureAmbientLightDom();
  if (!container) {
    scheduleNextAmbientFrame();
    return;
  }

  const diffuseCanvas = document.getElementById(AMBIENT_CANVAS_DIFFUSE_ID);
  const glowCanvas = document.getElementById(AMBIENT_CANVAS_GLOW_ID);

  if (diffuseCanvas && glowCanvas) {
    try {
      const diffuseCtx = diffuseCanvas.getContext("2d", { alpha: true, desynchronized: true });
      const glowCtx = glowCanvas.getContext("2d", { alpha: true, desynchronized: true });

      if (diffuseCtx && glowCtx) {
        glowCtx.drawImage(video, 0, 0, 64, 36);
        diffuseCtx.drawImage(video, 0, 0, 64, 36);
        if (!container.classList.contains("tada-ambient-active")) {
          container.classList.add("tada-ambient-active");
        }
      }
    } catch {
      // Bỏ qua lỗi tạm thời khi đổi bài hoặc quảng cáo cross-origin
    }
  }

  scheduleNextAmbientFrame();
}

function renderAmbientSingleFrame(videoEl) {
  const video = videoEl || ambientVideoEl || document.querySelector("video.html5-main-video");
  if (!video || video.readyState < 2 || video.videoWidth <= 0 || video.videoHeight <= 0) return;
  const container = ensureAmbientLightDom();
  if (!container) return;
  const diffuseCanvas = document.getElementById(AMBIENT_CANVAS_DIFFUSE_ID);
  const glowCanvas = document.getElementById(AMBIENT_CANVAS_GLOW_ID);
  if (!diffuseCanvas || !glowCanvas) return;
  try {
    const diffuseCtx = diffuseCanvas.getContext("2d", { alpha: true, desynchronized: true });
    const glowCtx = glowCanvas.getContext("2d", { alpha: true, desynchronized: true });
    if (diffuseCtx && glowCtx) {
      glowCtx.drawImage(video, 0, 0, 64, 36);
      diffuseCtx.drawImage(video, 0, 0, 64, 36);
      container.classList.add("tada-ambient-active");
    }
  } catch { }
}

function cancelAmbientLoop() {
  if (ambientVideoEl && ambientFrameCallbackId && "cancelVideoFrameCallback" in ambientVideoEl) {
    try {
      ambientVideoEl.cancelVideoFrameCallback(ambientFrameCallbackId);
    } catch (e) { }
    ambientFrameCallbackId = null;
  }
  if (ambientRafId) {
    cancelAnimationFrame(ambientRafId);
    ambientRafId = null;
  }
}

function updateAmbientLightVariables(containerEl) {
  const container = containerEl || document.getElementById(AMBIENT_LIGHT_CONTAINER_ID);
  if (!container) return;

  const brightnessRatio = Math.max(0.5, Math.min(2.0, (Number(currentSettings.ambientBrightness) || 100) / 100));
  const spreadRatio = Math.max(0.5, Math.min(2.0, (Number(currentSettings.ambientSpread) || 100) / 100));

  // Diffuse layer (wide ambient)
  const diffuseScaleX = (1 + 0.52 * spreadRatio).toFixed(3);
  const diffuseScaleY = (1 + 0.48 * spreadRatio).toFixed(3);
  const diffuseBlur = Math.round(85 * spreadRatio) + "px";
  const diffuseBrightness = (1.1 * brightnessRatio).toFixed(2);
  const diffuseOpacity = Math.min(1, 0.7 * brightnessRatio).toFixed(2);

  // Glow layer (close vibrant edge)
  const glowScaleX = (1 + 0.18 * spreadRatio).toFixed(3);
  const glowScaleY = (1 + 0.15 * spreadRatio).toFixed(3);
  const glowBlur = Math.round(36 * spreadRatio) + "px";
  const glowBrightness = (1.25 * brightnessRatio).toFixed(2);
  const glowOpacity = Math.min(1, 0.85 * brightnessRatio).toFixed(2);

  container.style.setProperty("--tada-diffuse-scale-x", diffuseScaleX);
  container.style.setProperty("--tada-diffuse-scale-y", diffuseScaleY);
  container.style.setProperty("--tada-diffuse-blur", diffuseBlur);
  container.style.setProperty("--tada-diffuse-brightness", diffuseBrightness);
  container.style.setProperty("--tada-diffuse-opacity", diffuseOpacity);

  container.style.setProperty("--tada-glow-scale-x", glowScaleX);
  container.style.setProperty("--tada-glow-scale-y", glowScaleY);
  container.style.setProperty("--tada-glow-blur", glowBlur);
  container.style.setProperty("--tada-glow-brightness", glowBrightness);
  container.style.setProperty("--tada-glow-opacity", glowOpacity);
}

function getAmbientHost() {
  if (!isWatchPage()) return null;
  const theaterHost = document.querySelector(
    "ytd-watch-flexy[theater] #full-bleed-container, ytd-watch-flexy[full-bleed-player] #full-bleed-container"
  );
  if (theaterHost && theaterHost.offsetParent !== null) return theaterHost;
  return (
    document.querySelector("#player") ||
    document.querySelector("#player-container-outer") ||
    document.querySelector("ytd-watch-flexy #primary")
  );
}

function ensureAmbientLightDom() {
  if (!isWatchPage()) {
    removeAmbientLightDom();
    return null;
  }

  const host = getAmbientHost();
  if (!host) {
    return null;
  }

  let container = document.getElementById(AMBIENT_LIGHT_CONTAINER_ID);
  if (container) {
    if (container.parentElement !== host) {
      host.insertBefore(container, host.firstChild);
    }
    updateAmbientLightVariables(container);
    return container;
  }

  container = document.createElement("div");
  container.id = AMBIENT_LIGHT_CONTAINER_ID;

  const diffuseCanvas = document.createElement("canvas");
  diffuseCanvas.id = AMBIENT_CANVAS_DIFFUSE_ID;
  diffuseCanvas.width = 64;
  diffuseCanvas.height = 36;

  const glowCanvas = document.createElement("canvas");
  glowCanvas.id = AMBIENT_CANVAS_GLOW_ID;
  glowCanvas.width = 64;
  glowCanvas.height = 36;

  container.appendChild(diffuseCanvas);
  container.appendChild(glowCanvas);

  updateAmbientLightVariables(container);
  host.insertBefore(container, host.firstChild);
  return container;
}

function removeAmbientLightDom() {
  cancelAmbientLoop();
  ambientRenderActive = false;
  ambientVideoEl = null;
  const container = document.getElementById(AMBIENT_LIGHT_CONTAINER_ID);
  container?.remove();
}

function bindAmbientVideoListeners(video) {
  if (!video || video.dataset.tadaAmbientBound === "true") return;
  video.dataset.tadaAmbientBound = "true";

  const onResume = () => {
    if (currentSettings.ambientLight && isWatchPage() && !video.paused && !video.ended) {
      ambientVideoEl = video;
      ensureAmbientLightDom();
      if (!ambientRenderActive) {
        ambientRenderActive = true;
        cancelAmbientLoop();
        renderAmbientFrame();
      }
    }
  };

  const onStop = () => {
    if (video.paused || video.ended) {
      ambientRenderActive = false;
      cancelAmbientLoop();
    }
  };

  video.addEventListener("play", onResume, { passive: true });
  video.addEventListener("playing", onResume, { passive: true });
  video.addEventListener("timeupdate", onResume, { passive: true });
  video.addEventListener("canplay", onResume, { passive: true });
  video.addEventListener("loadeddata", onResume, { passive: true });
  video.addEventListener("seeked", () => {
    if (currentSettings.ambientLight && isWatchPage()) {
      ambientVideoEl = video;
      renderAmbientSingleFrame(video);
    }
  }, { passive: true });
  video.addEventListener("pause", onStop, { passive: true });
  video.addEventListener("ended", onStop, { passive: true });
  video.addEventListener("emptied", onStop, { passive: true });
}

function startAmbientRenderLoop() {
  if (!currentSettings.ambientLight || !isWatchPage()) {
    removeAmbientLightDom();
    return;
  }

  const video = document.querySelector("video.html5-main-video");
  if (!video) {
    return;
  }

  ambientVideoEl = video;
  ensureAmbientLightDom();
  bindAmbientVideoListeners(video);

  if (!video.paused && !video.ended && video.readyState >= 2) {
    if (!ambientRenderActive) {
      ambientRenderActive = true;
      cancelAmbientLoop();
      renderAmbientFrame();
    }
  }
}

function ensureAmbientLight() {
  if (!currentSettings.ambientLight || !isWatchPage()) {
    removeAmbientLightDom();
    return;
  }
  applyAmbientLightSetting();
  startAmbientRenderLoop();
}

function applyAmbientLightSetting() {
  const existingStyle = document.getElementById(AMBIENT_LIGHT_STYLE_ID);
  if (currentSettings.ambientLight && isWatchPage()) {
    if (!existingStyle) {
      const style = document.createElement("style");
      style.id = AMBIENT_LIGHT_STYLE_ID;
      style.textContent = `
        /* ===== TADa AMBIENT LIGHT STYLES ===== */
        #player,
        #full-bleed-container {
          position: relative !important;
          overflow: visible !important;
        }

        /* YouTube player containers stay strictly above ambient backlight */
        #player-container-outer,
        #player-full-bleed-container {
          position: relative !important;
          z-index: 1 !important;
        }

        #tada-ambient-light-container {
          position: absolute !important;
          inset: 0 !important;
          pointer-events: none !important;
          z-index: 0 !important;
          overflow: visible !important;
          display: block !important;
          opacity: 0;
          transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        #tada-ambient-light-container.tada-ambient-active {
          opacity: 1 !important;
        }

        /* Hide native YouTube ambient canvas to prevent duplicate/conflicting overlays */
        #cinematic-container > canvas,
        ytd-cinematic-container-renderer > canvas {
          display: none !important;
        }

        /* Layer 1: Wide diffuse atmospheric glow spreading behind the player */
        #tada-ambient-canvas-diffuse {
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) scale(var(--tada-diffuse-scale-x, 1.52), var(--tada-diffuse-scale-y, 1.48)) translateZ(0) !important;
          width: 100% !important;
          height: 100% !important;
          filter: blur(var(--tada-diffuse-blur, 85px)) saturate(2.2) brightness(var(--tada-diffuse-brightness, 1.1)) !important;
          opacity: var(--tada-diffuse-opacity, 0.7) !important;
          border-radius: 28px !important;
          pointer-events: none !important;
          will-change: filter, transform !important;
        }

        /* Layer 2: Rich, vibrant edge glow closely hugging the video player frame */
        #tada-ambient-canvas-glow {
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) scale(var(--tada-glow-scale-x, 1.18), var(--tada-glow-scale-y, 1.15)) translateZ(0) !important;
          width: 100% !important;
          height: 100% !important;
          filter: blur(var(--tada-glow-blur, 36px)) saturate(1.8) brightness(var(--tada-glow-brightness, 1.25)) !important;
          opacity: var(--tada-glow-opacity, 0.85) !important;
          border-radius: 12px !important;
          pointer-events: none !important;
          will-change: filter, transform !important;
        }

        /* Hide ambient light in fullscreen since video already fills 100% of the display */
        :fullscreen #tada-ambient-light-container,
        [fullscreen] #tada-ambient-light-container {
          display: none !important;
        }
      `;
      (document.head || document.documentElement).appendChild(style);
    }
    updateAmbientLightVariables();
    startAmbientRenderLoop();
  } else {
    existingStyle?.remove();
    removeAmbientLightDom();
  }
}

/* ===== TADa PICTURE-IN-PICTURE (PiP) CONTROLLER ===== */
let pipHotkeysBound = false;
let pipControlInterval = null;

function getMainVideoElement() {
  return document.querySelector("video.html5-main-video") || document.querySelector("video");
}

async function togglePictureInPicture() {
  const video = getMainVideoElement();
  if (!video) {
    console.debug("[TADa] No video element found to toggle PiP");
    return;
  }

  if (video.disablePictureInPicture) {
    video.disablePictureInPicture = false;
  }

  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
    } else if (document.pictureInPictureEnabled) {
      await video.requestPictureInPicture();
    } else {
      console.warn("[TADa] Picture-in-Picture is not supported in this browser");
    }
  } catch (error) {
    console.warn("[TADa] PiP toggle failed:", error);
  }
}

function updatePipButtonState() {
  const btn = document.getElementById(PIP_BUTTON_ID);
  if (!btn) return;
  const isPipActive = Boolean(document.pictureInPictureElement);
  if (isPipActive) {
    btn.classList.add("tada-pip-active");
    btn.setAttribute("aria-label", "Thoát hình trong hình (P)");
    btn.setAttribute("title", "Thoát hình trong hình (P)");
  } else {
    btn.classList.remove("tada-pip-active");
    btn.setAttribute("aria-label", "Hình trong hình (P)");
    btn.setAttribute("title", "Hình trong hình (P)");
  }
}

function handleGlobalPipHotkeys(event) {
  if (!currentSettings.pipButton) return;
  if (event.defaultPrevented) return;
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  // Shortcut is 'p' or 'P' (without Shift)
  if (event.key !== "p" && event.key !== "P") return;
  if (event.shiftKey) return;

  if (shouldIgnoreKeyEvent(event) || event.target?.closest?.("ytd-comments, #comments, #search-input, [role='textbox']")) {
    return;
  }

  const video = getMainVideoElement();
  if (!video) return;

  event.preventDefault();
  event.stopPropagation();
  togglePictureInPicture();
}

function ensurePipHotkeys() {
  if (pipHotkeysBound) return;
  window.addEventListener("keydown", handleGlobalPipHotkeys, true);
  pipHotkeysBound = true;
}

function bindVideoPipListeners() {
  const video = getMainVideoElement();
  if (!video || video.dataset.tadaPipBound) return;
  video.dataset.tadaPipBound = "true";
  video.addEventListener("enterpictureinpicture", updatePipButtonState);
  video.addEventListener("leavepictureinpicture", updatePipButtonState);
  video.addEventListener("play", () => {
    ensurePipButton();
    updatePipButtonState();
  });
}

function ensurePipButton() {
  if (!currentSettings.pipButton) {
    removePipButton();
    return;
  }

  // Anchor directly to YouTube's Settings button (gear HD in the pill controls)
  const settingsBtn = document.querySelector(".ytp-settings-button");
  const rightControls = document.querySelector(".ytp-right-controls") ||
    settingsBtn?.closest?.(".ytp-right-controls") ||
    settingsBtn?.parentElement;

  if (!settingsBtn && !rightControls) {
    return;
  }

  let btn = document.getElementById(PIP_BUTTON_ID);
  if (!btn || !document.contains(btn)) {
    if (btn) btn.remove();

    btn = document.createElement("button");
    btn.id = PIP_BUTTON_ID;
    btn.className = "ytp-button tada-pip-button";
    btn.setAttribute("aria-label", "Hình trong hình (P)");
    btn.setAttribute("title", "Hình trong hình (P)");
    btn.innerHTML = `
      <svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%">
        <!-- Screen outline -->
        <path class="ytp-svg-fill" d="M26,9 H10 C8.9,9 8,9.9 8,11 V25 C8,26.1 8.9,27 10,27 H17 V25 H10 V11 H26 V16 H28 V11 C28,9.9 27.1,9 26,9 Z" fill="#fff"></path>
        <!-- Floating PiP mini-window -->
        <rect class="tada-pip-inner" x="18" y="17" width="10" height="8" rx="1.5" fill="#fff"></rect>
      </svg>
    `;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      togglePictureInPicture();
    });

    if (settingsBtn) {
      settingsBtn.insertAdjacentElement("afterend", btn);
    } else if (rightControls) {
      const ref = rightControls.querySelector(".ytp-size-button") ||
        rightControls.querySelector(".ytp-fullscreen-button") ||
        null;
      if (ref) {
        rightControls.insertBefore(btn, ref);
      } else {
        rightControls.appendChild(btn);
      }
    }
  } else if (settingsBtn && btn.previousElementSibling !== settingsBtn) {
    settingsBtn.insertAdjacentElement("afterend", btn);
  }

  updatePipButtonState();
  bindVideoPipListeners();
}

function removePipButton() {
  const btn = document.getElementById(PIP_BUTTON_ID);
  if (btn) {
    btn.remove();
  }
}

function startPipButtonCheck() {
  if (pipControlInterval) {
    clearInterval(pipControlInterval);
    pipControlInterval = null;
  }
  let count = 0;
  ensurePipButton();
  pipControlInterval = setInterval(() => {
    count++;
    if (isWatchPage()) {
      ensurePipButton();
    }
    if (count > 25 && document.getElementById(PIP_BUTTON_ID)) {
      clearInterval(pipControlInterval);
      pipControlInterval = null;
    }
  }, 300);
}

function applyPipButtonSetting() {
  const existingStyle = document.getElementById(PIP_BUTTON_STYLE_ID);
  if (currentSettings.pipButton) {
    if (!existingStyle) {
      const style = document.createElement("style");
      style.id = PIP_BUTTON_STYLE_ID;
      style.textContent = `
        /* ===== TADa PICTURE-IN-PICTURE (PiP) BUTTON ===== */
        .tada-pip-button {
          position: relative;
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: transparent;
          border: none;
          outline: none;
          padding: 0;
          width: 48px;
          height: 100%;
          opacity: 0.9;
          transition: opacity 0.15s ease, transform 0.15s ease;
          user-select: none;
          -webkit-user-select: none;
          vertical-align: top;
        }
        .tada-pip-button:hover {
          opacity: 1;
        }
        .tada-pip-button:active {
          transform: scale(0.92);
        }
        .tada-pip-button svg {
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        .tada-pip-button .tada-pip-inner {
          transition: fill 0.2s ease, filter 0.2s ease;
        }
        .tada-pip-button.tada-pip-active .tada-pip-inner {
          fill: #E8930C !important;
          filter: drop-shadow(0 0 4px rgba(232, 147, 12, 0.75));
        }
        .tada-pip-button.tada-pip-active svg path {
          fill: #FDF6EC !important;
        }
      `;
      (document.head || document.documentElement).appendChild(style);
    }
    ensurePipHotkeys();
    ensurePipButton();
    startPipButtonCheck();
  } else {
    existingStyle?.remove();
    removePipButton();
  }
}

/* ===== TADa CLEAN VIDEO SCREENSHOT (HD / 4K) ===== */
let screenshotControlInterval = null;
let screenshotHotkeysBound = false;

function triggerScreenshotFlash() {
  const player = document.getElementById("movie_player") || document.querySelector(".html5-video-player");
  if (!player) return;

  let flash = player.querySelector("#" + SCREENSHOT_FLASH_ID);
  if (!flash) {
    flash = document.createElement("div");
    flash.id = SCREENSHOT_FLASH_ID;
    flash.className = "tada-screenshot-flash";
    player.appendChild(flash);
  }

  flash.classList.remove("flash-active");
  void flash.offsetWidth;
  flash.classList.add("flash-active");

  setTimeout(() => {
    flash.classList.remove("flash-active");
  }, 350);
}

function secToFilenameTime(sec) {
  if (sec === null || sec === undefined || isNaN(sec)) return "00-00";
  const s = Math.floor(sec % 60);
  const m = Math.floor((sec / 60) % 60);
  const h = Math.floor(sec / 3600);
  const pad = (n) => (n < 10 ? "0" + n : "" + n);
  return h > 0 ? `${pad(h)}-${pad(m)}-${pad(s)}` : `${pad(m)}-${pad(s)}`;
}

function screenshotToast(msg) {
  const player = document.getElementById("movie_player") || document.querySelector(".html5-video-player");
  if (!player) return;
  let t = player.querySelector("#tada-screenshot-toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "tada-screenshot-toast";
    t.className = "tada-screenshot-toast";
    player.appendChild(t);
  }
  t.textContent = msg;
  t.classList.remove("show");
  void t.offsetWidth;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => {
    t.classList.remove("show");
  }, 2400);
}

async function takeVideoScreenshot({ copyToClipboard = false } = {}) {
  const video = getMainVideoElement();
  if (!video || video.readyState < 2 || !video.videoWidth || !video.videoHeight) {
    screenshotToast("Chưa tải xong khung hình video!");
    return;
  }

  try {
    const width = video.videoWidth;
    const height = video.videoHeight;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      screenshotToast(" Không thể tạo khung vẽ canvas");
      return;
    }

    ctx.drawImage(video, 0, 0, width, height);

    // Hiệu ứng chớp sáng màn trập máy ảnh
    triggerScreenshotFlash();

    // Chuẩn bị tên file sạch
    const rawTitle = typeof getCurrentVideoTitle === "function" ? getCurrentVideoTitle() : (document.title || "YouTube");
    const safeTitle = rawTitle.replace(/[/\\?%*:|"<>]/g, "_").substring(0, 80).trim() || "YouTube";
    const timeStr = secToFilenameTime(video.currentTime);
    const filename = `[TADa] ${safeTitle} [${timeStr}] (${width}x${height}).png`;

    if (copyToClipboard) {
      try {
        if (navigator.clipboard && typeof ClipboardItem !== "undefined") {
          const blobPromise = new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
              if (blob) resolve(blob);
              else reject(new Error("toBlob failed"));
            }, "image/png");
          });

          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blobPromise })
          ]);
          screenshotToast(`Đã sao chép ảnh vào Clipboard (${width}x${height})`);
          return;
        }
      } catch (clipErr) {
        console.debug("[TADa] Clipboard write failed, falling back to download", clipErr);
      }
    }

    // Tải ảnh về máy
    canvas.toBlob((blob) => {
      if (!blob) {
        screenshotToast("Không thể xuất dữ liệu ảnh blob");
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.remove();
      }, 1500);

      if (copyToClipboard) {
        screenshotToast(`Đã tải ảnh (${width}x${height}) [Trình duyệt chặn Clipboard]`);
      } else {
        screenshotToast(`Đã lưu ảnh: ${width}x${height} [${timeStr}]`);
      }
    }, "image/png");

  } catch (err) {
    console.warn("[TADa] Lỗi chụp màn hình:", err);
    screenshotToast("Không thể chụp ảnh màn hình");
  }
}

function handleGlobalScreenshotHotkeys(event) {
  if (!currentSettings.videoScreenshot) return;
  if (event.defaultPrevented) return;
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key !== "s" && event.key !== "S") return;

  if (shouldIgnoreKeyEvent(event) || event.target?.closest?.("ytd-comments, #comments, #search-input, [role='textbox']")) {
    return;
  }

  const video = getMainVideoElement();
  if (!video) return;

  event.preventDefault();
  event.stopPropagation();
  takeVideoScreenshot({ copyToClipboard: event.shiftKey });
}

function ensureScreenshotHotkeys() {
  if (screenshotHotkeysBound) return;
  window.addEventListener("keydown", handleGlobalScreenshotHotkeys, true);
  screenshotHotkeysBound = true;
}

function ensureScreenshotButton() {
  if (!currentSettings.videoScreenshot || !isWatchPage()) {
    removeScreenshotButton();
    return;
  }

  const pipBtn = document.getElementById(PIP_BUTTON_ID);
  const settingsBtn = document.querySelector(".ytp-settings-button");
  const rightControls = document.querySelector(".ytp-right-controls") ||
    settingsBtn?.closest?.(".ytp-right-controls") ||
    settingsBtn?.parentElement;

  if (!rightControls && !settingsBtn && !pipBtn) return;

  let btn = document.getElementById(SCREENSHOT_BUTTON_ID);
  if (!btn || !document.contains(btn)) {
    if (btn) btn.remove();

    btn = document.createElement("button");
    btn.id = SCREENSHOT_BUTTON_ID;
    btn.className = "ytp-button tada-screenshot-button";
    btn.setAttribute("aria-label", "Chụp ảnh màn hình (S)");
    btn.setAttribute("title", "Chụp ảnh màn hình (S) • Chuột phải / Shift: Sao chép Clipboard");
    btn.innerHTML = `
      <svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%">
        <!-- Camera body -->
        <path class="ytp-svg-fill" d="M10,12 L12.5,9.5 C13,9 13.8,8.5 14.5,8.5 L21.5,8.5 C22.2,8.5 23,9 23.5,9.5 L26,12 H27.5 C29.4,12 31,13.6 31,15.5 V25.5 C31,27.4 29.4,29 27.5,29 H8.5 C6.6,29 5,27.4 5,25.5 V15.5 C5,13.6 6.6,12 8.5,12 Z M8.5,14 C7.7,14 7,14.7 7,15.5 V25.5 C7,26.3 7.7,27 8.5,27 H27.5 C28.3,27 29,26.3 29,25.5 V15.5 C29,14.7 28.3,14 27.5,14 H25.2 C24.7,14 24.1,13.6 23.8,13.2 L21.8,10.7 C21.7,10.6 21.6,10.5 21.5,10.5 H14.5 C14.4,10.5 14.3,10.6 14.2,10.7 L12.2,13.2 C11.9,13.6 11.3,14 10.8,14 Z" fill="#fff"></path>
        <!-- Lens outer ring -->
        <circle cx="18" cy="20.5" r="5" stroke="#fff" stroke-width="2" fill="none"></circle>
        <!-- Aperture center dot -->
        <circle cx="18" cy="20.5" r="2.2" fill="#E8930C" class="tada-cam-inner"></circle>
        <!-- Flash bulb -->
        <circle cx="26" cy="16.5" r="1.3" fill="#fff"></circle>
      </svg>
    `;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      takeVideoScreenshot({ copyToClipboard: e.shiftKey });
    });

    btn.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
      takeVideoScreenshot({ copyToClipboard: true });
    });

    if (pipBtn && pipBtn.nextSibling) {
      pipBtn.parentNode.insertBefore(btn, pipBtn.nextSibling);
    } else if (pipBtn) {
      pipBtn.parentNode.appendChild(btn);
    } else if (settingsBtn && settingsBtn.nextSibling) {
      settingsBtn.parentNode.insertBefore(btn, settingsBtn.nextSibling);
    } else if (rightControls) {
      const ref = rightControls.querySelector(".ytp-size-button") ||
        rightControls.querySelector(".ytp-fullscreen-button") ||
        null;
      if (ref) {
        rightControls.insertBefore(btn, ref);
      } else {
        rightControls.appendChild(btn);
      }
    }
  } else if (pipBtn && btn.previousElementSibling !== pipBtn) {
    pipBtn.insertAdjacentElement("afterend", btn);
  }
}

function removeScreenshotButton() {
  const btn = document.getElementById(SCREENSHOT_BUTTON_ID);
  if (btn) btn.remove();
}

function startScreenshotButtonCheck() {
  if (screenshotControlInterval) {
    clearInterval(screenshotControlInterval);
    screenshotControlInterval = null;
  }
  let count = 0;
  ensureScreenshotButton();
  screenshotControlInterval = setInterval(() => {
    count++;
    if (isWatchPage()) {
      ensureScreenshotButton();
    }
    if (count > 25 && document.getElementById(SCREENSHOT_BUTTON_ID)) {
      clearInterval(screenshotControlInterval);
      screenshotControlInterval = null;
    }
  }, 300);
}

function applyScreenshotButtonSetting() {
  const existingStyle = document.getElementById(SCREENSHOT_BUTTON_STYLE_ID);
  if (currentSettings.videoScreenshot) {
    if (!existingStyle) {
      const style = document.createElement("style");
      style.id = SCREENSHOT_BUTTON_STYLE_ID;
      style.textContent = `
        /* ===== TADa SCREENSHOT & FLASH EFFECT ===== */
        .tada-screenshot-button {
          position: relative;
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: transparent;
          border: none;
          outline: none;
          padding: 0;
          width: 48px;
          height: 100%;
          opacity: 0.9;
          transition: opacity 0.15s ease, transform 0.15s ease;
          user-select: none;
          -webkit-user-select: none;
          vertical-align: top;
        }
        .tada-screenshot-button:hover {
          opacity: 1;
        }
        .tada-screenshot-button:active {
          transform: scale(0.92);
        }
        .tada-screenshot-button svg {
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        .tada-screenshot-button .tada-cam-inner {
          transition: transform 0.2s ease, fill 0.2s ease;
        }
        .tada-screenshot-button:hover .tada-cam-inner {
          transform-origin: 18px 20.5px;
          transform: scale(1.2);
        }
        .tada-screenshot-flash {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #ffffff;
          opacity: 0;
          pointer-events: none;
          z-index: 999;
          transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .tada-screenshot-flash.flash-active {
          opacity: 0.75;
          transition: none;
        }
        .tada-screenshot-toast {
          position: absolute;
          top: 18px;
          left: 50%;
          transform: translate(-50%, -8px);
          background: rgba(20, 16, 12, 0.94);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(232, 147, 12, 0.65);
          color: #FDF6EC;
          padding: 6px 16px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 600;
          font-family: "Roboto", "Segoe UI", sans-serif;
          box-shadow: 0 6px 20px rgba(0,0,0,0.5);
          pointer-events: none;
          opacity: 0;
          z-index: 1000;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .tada-screenshot-toast.show {
          opacity: 1;
          transform: translate(-50%, 0);
        }
      `;
      (document.head || document.documentElement).appendChild(style);
    }
    ensureScreenshotHotkeys();
    ensureScreenshotButton();
    startScreenshotButtonCheck();
  } else {
    existingStyle?.remove();
    removeScreenshotButton();
    document.getElementById(SCREENSHOT_FLASH_ID)?.remove();
  }
}

/* ===== TADa FINE PLAYBACK SPEED CONTROLLER (0.1x - 4.0x) ===== */
let currentCustomSpeed = 1.0;
let speedControlInterval = null;
let speedHotkeysBound = false;
let speedHudTimer = null;
let speedPreferenceLoaded = false;

async function loadStoredSpeedPreference() {
  if (speedPreferenceLoaded) return;
  try {
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      const data = await chrome.storage.local.get([SPEED_STORAGE_KEY]);
      if (data && data[SPEED_STORAGE_KEY]) {
        const rate = parseFloat(data[SPEED_STORAGE_KEY]);
        if (!isNaN(rate) && rate >= SPEED_MIN && rate <= SPEED_MAX) {
          currentCustomSpeed = Math.round(rate * 100) / 100;
        }
      }
    }
  } catch { }
  speedPreferenceLoaded = true;
}

function showSpeedHud(rate) {
  const player = document.getElementById("movie_player") || document.querySelector(".html5-video-player");
  if (!player) return;

  let hud = player.querySelector("#" + SPEED_HUD_ID);
  if (!hud) {
    hud = document.createElement("div");
    hud.id = SPEED_HUD_ID;
    hud.className = "tada-speed-hud";
    player.appendChild(hud);
  }

  const rateText = (Math.round(rate * 100) / 100).toFixed(rate % 1 === 0 ? 1 : 2) + "x";
  const pct = Math.max(0, Math.min(100, ((rate - SPEED_MIN) / (SPEED_MAX - SPEED_MIN)) * 100));

  hud.innerHTML = `
    <div class="tada-speed-hud-content">
      <div class="tada-speed-hud-top">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="tada-speed-hud-icon">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
        <span class="tada-speed-hud-val">${rateText}</span>
      </div>
      <div class="tada-speed-hud-bar">
        <div class="tada-speed-hud-bar-fill" style="width: ${pct}%"></div>
      </div>
    </div>
  `;

  hud.classList.remove("show");
  void hud.offsetWidth;
  hud.classList.add("show");

  clearTimeout(speedHudTimer);
  speedHudTimer = setTimeout(() => {
    hud.classList.remove("show");
  }, 1100);
}

function updateSpeedButtonText() {
  const btn = document.getElementById(SPEED_BUTTON_ID);
  if (!btn) return;
  const badge = btn.querySelector(".tada-speed-badge");
  const rateText = (Math.round(currentCustomSpeed * 100) / 100).toFixed(currentCustomSpeed % 1 === 0 ? 1 : 2) + "x";
  if (badge) {
    badge.textContent = rateText;
  }
  btn.setAttribute("title", `Tốc độ: ${rateText} • Click: Menu • Chuột phải: 1.0x • Cuộn: ±0.05x • Phím [>] [<] [=]`);
  if (Math.abs(currentCustomSpeed - 1.0) > 0.01) {
    btn.classList.add("tada-speed-customized");
  } else {
    btn.classList.remove("tada-speed-customized");
  }
}

function setCustomPlaybackRate(rate, { showHud = true, save = true } = {}) {
  let targetRate = Math.round(rate * 100) / 100;
  if (targetRate < SPEED_MIN) targetRate = SPEED_MIN;
  if (targetRate > SPEED_MAX) targetRate = SPEED_MAX;

  currentCustomSpeed = targetRate;

  const video = getMainVideoElement();
  if (video) {
    video.playbackRate = targetRate;
  }

  updateSpeedButtonText();

  if (showHud) {
    showSpeedHud(targetRate);
  }

  if (save) {
    try {
      if (typeof chrome !== "undefined" && chrome.storage?.local) {
        chrome.storage.local.set({ [SPEED_STORAGE_KEY]: targetRate }).catch(() => { });
      }
    } catch { }
  }
}

function toggleSpeedPresetMenu() {
  const player = document.getElementById("movie_player") || document.querySelector(".html5-video-player");
  if (!player) return;

  let menu = player.querySelector("#" + SPEED_PRESET_MENU_ID);
  if (menu) {
    menu.remove();
    return;
  }

  menu = document.createElement("div");
  menu.id = SPEED_PRESET_MENU_ID;
  menu.className = "tada-speed-menu";

  const rateText = (Math.round(currentCustomSpeed * 100) / 100).toFixed(currentCustomSpeed % 1 === 0 ? 1 : 2) + "x";
  const presets = [0.5, 0.75, 1.0, 1.15, 1.25, 1.35, 1.5, 1.75, 2.0, 2.5, 3.0, 4.0];

  menu.innerHTML = `
    <div class="tada-speed-menu-header">
      <div class="tada-speed-menu-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="tada-speed-menu-icon">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
        <span>Tốc độ phát vi chỉnh</span>
      </div>
      <span class="tada-speed-menu-current">${rateText}</span>
    </div>
    <div class="tada-speed-menu-stepper">
      <button class="tada-speed-step-btn" data-delta="-0.1" title="Giảm 0.1x (Phím <)">- 0.1x</button>
      <button class="tada-speed-step-btn reset" data-reset="1.0" title="Về 1.0x (Phím =)">1.0x chuẩn</button>
      <button class="tada-speed-step-btn" data-delta="0.1" title="Tăng 0.1x (Phím >)">+ 0.1x</button>
    </div>
    <div class="tada-speed-menu-grid">
      ${presets.map((p) => {
    const isCurrent = Math.abs(currentCustomSpeed - p) < 0.02;
    return `<button class="tada-speed-preset ${isCurrent ? "active" : ""}" data-speed="${p}">${p}x</button>`;
  }).join("")}
    </div>
    <div class="tada-speed-menu-hint">
      Phím: <b>&gt;</b> tăng · <b>&lt;</b> giảm · <b>=</b> đặt lại · Cuộn chuột ±0.05x
    </div>
  `;

  menu.addEventListener("click", (e) => {
    e.stopPropagation();
    const presetBtn = e.target.closest("[data-speed]");
    if (presetBtn) {
      const spd = parseFloat(presetBtn.getAttribute("data-speed"));
      setCustomPlaybackRate(spd);
      menu.remove();
      return;
    }
    const stepBtn = e.target.closest("[data-delta]");
    if (stepBtn) {
      const d = parseFloat(stepBtn.getAttribute("data-delta"));
      setCustomPlaybackRate(currentCustomSpeed + d);
      const cur = menu.querySelector(".tada-speed-menu-current");
      if (cur) cur.textContent = (Math.round(currentCustomSpeed * 100) / 100).toFixed(currentCustomSpeed % 1 === 0 ? 1 : 2) + "x";
      menu.querySelectorAll(".tada-speed-preset").forEach(btn => {
        const p = parseFloat(btn.getAttribute("data-speed"));
        btn.classList.toggle("active", Math.abs(currentCustomSpeed - p) < 0.02);
      });
      return;
    }
    const resetBtn = e.target.closest("[data-reset]");
    if (resetBtn) {
      setCustomPlaybackRate(1.0);
      menu.remove();
      return;
    }
  });

  player.appendChild(menu);

  const onOutsideClick = (evt) => {
    if (!menu.contains(evt.target) && !evt.target.closest("#" + SPEED_BUTTON_ID)) {
      menu.remove();
      document.removeEventListener("click", onOutsideClick, true);
    }
  };
  setTimeout(() => {
    document.addEventListener("click", onOutsideClick, true);
  }, 50);
}

function handleGlobalSpeedHotkeys(event) {
  if (!currentSettings.customSpeed) return;
  if (event.defaultPrevented) return;
  if (event.ctrlKey || event.metaKey) return;

  if (shouldIgnoreKeyEvent(event) || event.target?.closest?.("ytd-comments, #comments, #search-input, [role='textbox']")) {
    return;
  }

  const key = event.key;
  const code = event.code;

  // '>' or 'Shift + .'
  if (key === ">" || (event.shiftKey && (key === "." || code === "Period"))) {
    event.preventDefault();
    event.stopPropagation();
    const step = event.altKey ? SPEED_FINE_STEP : SPEED_STEP;
    setCustomPlaybackRate(currentCustomSpeed + step);
    return;
  }

  // '<' or 'Shift + ,'
  if (key === "<" || (event.shiftKey && (key === "," || code === "Comma"))) {
    event.preventDefault();
    event.stopPropagation();
    const step = event.altKey ? SPEED_FINE_STEP : SPEED_STEP;
    setCustomPlaybackRate(currentCustomSpeed - step);
    return;
  }

  // '=' or '+' (reset to 1.0x)
  if ((key === "=" && !event.shiftKey) || (code === "Equal" && !event.shiftKey)) {
    event.preventDefault();
    event.stopPropagation();
    setCustomPlaybackRate(SPEED_DEFAULT);
    return;
  }
}

function ensureSpeedHotkeys() {
  if (speedHotkeysBound) return;
  window.addEventListener("keydown", handleGlobalSpeedHotkeys, true);
  speedHotkeysBound = true;
}

function bindVideoSpeedListeners() {
  const video = getMainVideoElement();
  if (!video || video.dataset.tadaSpeedBound) return;
  video.dataset.tadaSpeedBound = "true";

  video.addEventListener("play", () => {
    if (currentSettings.customSpeed && currentCustomSpeed !== 1.0) {
      if (Math.abs(video.playbackRate - currentCustomSpeed) > 0.01) {
        video.playbackRate = currentCustomSpeed;
      }
    }
    updateSpeedButtonText();
  });

  video.addEventListener("ratechange", () => {
    if (currentSettings.customSpeed) {
      const actualRate = Math.round(video.playbackRate * 100) / 100;
      if (Math.abs(currentCustomSpeed - actualRate) > 0.01) {
        currentCustomSpeed = actualRate;
        updateSpeedButtonText();
      }
    }
  });
}

function ensureSpeedButton() {
  if (!currentSettings.customSpeed || !isWatchPage()) {
    removeSpeedButton();
    return;
  }

  const settingsBtn = document.querySelector(".ytp-settings-button");
  const rightControls = document.querySelector(".ytp-right-controls") ||
    settingsBtn?.closest?.(".ytp-right-controls") ||
    settingsBtn?.parentElement;

  if (!rightControls && !settingsBtn) return;

  let btn = document.getElementById(SPEED_BUTTON_ID);
  if (!btn || !document.contains(btn)) {
    if (btn) btn.remove();

    btn = document.createElement("button");
    btn.id = SPEED_BUTTON_ID;
    btn.className = "ytp-button tada-speed-button";
    btn.setAttribute("aria-label", "Tốc độ phát vi chỉnh");
    btn.innerHTML = `<span class="tada-speed-badge">1.0x</span>`;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleSpeedPresetMenu();
    });

    btn.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
      setCustomPlaybackRate(1.0);
    });

    btn.addEventListener("wheel", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY < 0 ? SPEED_FINE_STEP : -SPEED_FINE_STEP;
      setCustomPlaybackRate(currentCustomSpeed + delta);
    }, { passive: false });

    if (settingsBtn) {
      settingsBtn.parentNode.insertBefore(btn, settingsBtn);
    } else if (rightControls) {
      rightControls.insertBefore(btn, rightControls.firstChild);
    }
  }

  updateSpeedButtonText();
  bindVideoSpeedListeners();
}

function removeSpeedButton() {
  const btn = document.getElementById(SPEED_BUTTON_ID);
  if (btn) btn.remove();
  document.getElementById(SPEED_PRESET_MENU_ID)?.remove();
  document.getElementById(SPEED_HUD_ID)?.remove();
}

function startSpeedButtonCheck() {
  if (speedControlInterval) {
    clearInterval(speedControlInterval);
    speedControlInterval = null;
  }
  let count = 0;
  ensureSpeedButton();
  speedControlInterval = setInterval(() => {
    count++;
    if (isWatchPage()) {
      ensureSpeedButton();
    }
    if (count > 25 && document.getElementById(SPEED_BUTTON_ID)) {
      clearInterval(speedControlInterval);
      speedControlInterval = null;
    }
  }, 300);
}

function applyCustomSpeedSetting() {
  const existingStyle = document.getElementById(SPEED_BUTTON_STYLE_ID);
  if (currentSettings.customSpeed) {
    if (!existingStyle) {
      const style = document.createElement("style");
      style.id = SPEED_BUTTON_STYLE_ID;
      style.textContent = `
        /* ===== TADa CUSTOM SPEED CONTROL ===== */
        .tada-speed-button {
          position: relative;
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: transparent;
          border: none;
          outline: none;
          padding: 0 4px;
          min-width: 44px;
          height: 100%;
          opacity: 0.9;
          transition: opacity 0.15s ease, transform 0.15s ease;
          user-select: none;
          -webkit-user-select: none;
          vertical-align: top;
        }
        .tada-speed-button:hover {
          opacity: 1;
        }
        .tada-speed-button:active {
          transform: scale(0.94);
        }
        .tada-speed-badge {
          font-family: "Roboto", "Segoe UI", sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          padding: 2px 6px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.12);
          transition: all 0.2s ease;
          letter-spacing: 0.2px;
        }
        .tada-speed-button:hover .tada-speed-badge {
          background: rgba(232, 147, 12, 0.25);
          color: #FDF6EC;
        }
        .tada-speed-button.tada-speed-customized .tada-speed-badge {
          background: rgba(232, 147, 12, 0.28);
          color: #E8930C;
          border: 1px solid rgba(232, 147, 12, 0.55);
        }

        /* Speed HUD */
        .tada-speed-hud {
          position: absolute;
          top: 36px;
          right: 28px;
          background: rgba(20, 16, 12, 0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(232, 147, 12, 0.65);
          border-radius: 14px;
          padding: 10px 18px;
          box-shadow: 0 10px 28px rgba(0,0,0,0.6);
          pointer-events: none;
          opacity: 0;
          transform: translateY(-8px) scale(0.96);
          z-index: 1000;
          transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .tada-speed-hud.show {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        .tada-speed-hud-content {
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 90px;
        }
        .tada-speed-hud-top {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .tada-speed-hud-icon {
          width: 18px;
          height: 18px;
          color: #E8930C;
        }
        .tada-speed-hud-val {
          font-family: "Roboto", "Segoe UI", sans-serif;
          font-size: 19px;
          font-weight: 800;
          color: #FDF6EC;
          letter-spacing: 0.5px;
        }
        .tada-speed-hud-bar {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 2px;
          overflow: hidden;
        }
        .tada-speed-hud-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #E8930C, #F59E0B);
          border-radius: 2px;
          transition: width 0.12s ease;
        }

        /* Speed Preset Floating Menu */
        .tada-speed-menu {
          position: absolute;
          bottom: 56px;
          right: 120px;
          width: 250px;
          background: rgba(20, 16, 12, 0.96);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(232, 147, 12, 0.55);
          border-radius: 14px;
          padding: 12px;
          box-shadow: 0 16px 36px rgba(0,0,0,0.75);
          z-index: 1001;
          font-family: "Roboto", "Segoe UI", sans-serif;
          color: #FDF6EC;
          animation: tadaSlideUp 0.15s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes tadaSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .tada-speed-menu-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 10px;
        }
        .tada-speed-menu-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #D1D5DB;
        }
        .tada-speed-menu-icon {
          width: 14px;
          height: 14px;
          color: #E8930C;
        }
        .tada-speed-menu-current {
          font-size: 13px;
          font-weight: 800;
          color: #E8930C;
          background: rgba(232, 147, 12, 0.16);
          padding: 2px 7px;
          border-radius: 8px;
        }
        .tada-speed-menu-stepper {
          display: flex;
          gap: 6px;
          margin-bottom: 10px;
        }
        .tada-speed-step-btn {
          flex: 1;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #FDF6EC;
          padding: 5px 0;
          font-size: 11px;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .tada-speed-step-btn:hover {
          background: rgba(232, 147, 12, 0.22);
          border-color: rgba(232, 147, 12, 0.5);
          color: #E8930C;
        }
        .tada-speed-step-btn.reset {
          color: #E8930C;
        }
        .tada-speed-menu-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
          margin-bottom: 10px;
        }
        .tada-speed-preset {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #E5E7EB;
          padding: 6px 0;
          font-size: 11px;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .tada-speed-preset:hover {
          background: rgba(232, 147, 12, 0.2);
          border-color: rgba(232, 147, 12, 0.4);
          color: #FFFFFF;
        }
        .tada-speed-preset.active {
          background: #E8930C;
          border-color: #E8930C;
          color: #1A1410;
          font-weight: 700;
        }
        .tada-speed-menu-hint {
          font-size: 10px;
          color: #9CA3AF;
          text-align: center;
          padding-top: 6px;
          border-top: 1px dashed rgba(255, 255, 255, 0.1);
        }
        .tada-speed-menu-hint b {
          color: #FDF6EC;
        }
      `;
      (document.head || document.documentElement).appendChild(style);
    }
    loadStoredSpeedPreference().then(() => {
      ensureSpeedHotkeys();
      ensureSpeedButton();
      startSpeedButtonCheck();
      const video = getMainVideoElement();
      if (video && currentCustomSpeed !== 1.0) {
        video.playbackRate = currentCustomSpeed;
      }
    });
  } else {
    existingStyle?.remove();
    removeSpeedButton();
  }
}


/* ===== TADa SMART A-B LOOPER ===== */
const ab = { a: null, b: null, on: false };
let abInterval = null;
let abBtnInterval = null;
let abKeysBound = false;
let abDrag = null; // null | { type: "A"|"B"|"RANGE", startX, initA, initB }
let abPicking = false; // true = click-on-timeline mode active

function abFmt(sec) {
  if (sec === null || sec === undefined || isNaN(sec)) return "--:--";
  const s = Math.floor(sec);
  const ms = Math.floor((sec - s) * 10);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  const pad = (n) => n < 10 ? "0" + n : "" + n;
  return h > 0 ? h + ":" + pad(m) + ":" + pad(ss) + "." + ms : pad(m) + ":" + pad(ss) + "." + ms;
}

function abToast(text) {
  const player = document.getElementById("movie_player") || document.querySelector(".html5-video-player");
  if (!player) return;
  let t = player.querySelector(".tada-ab-toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "tada-ab-toast";
    player.appendChild(t);
  }
  t.textContent = text;
  t.classList.remove("show");
  void t.offsetWidth; // reflow
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 1800);
}

function abCheck() {
  if (!ab.on || ab.a === null || ab.b === null) return;
  const v = getMainVideoElement();
  if (!v || v.paused) return;
  if (v.currentTime >= ab.b) v.currentTime = ab.a;
}

function abStartLoop() {
  abStopLoop();
  if (ab.on && ab.a !== null && ab.b !== null) {
    abInterval = setInterval(abCheck, 50);
  }
}

function abStopLoop() {
  if (abInterval) { clearInterval(abInterval); abInterval = null; }
}

function abSetA(time) {
  const v = getMainVideoElement();
  if (!v) return;
  const t = typeof time === "number" ? time : v.currentTime;
  ab.a = Math.max(0, parseFloat(t.toFixed(1)));
  if (ab.b !== null && ab.a >= ab.b) { ab.b = null; ab.on = false; abStopLoop(); }
  abUpdateAll();
  abToast("Đã chọn A · Giờ chọn mốc B");
}

function abSetB(time) {
  const v = getMainVideoElement();
  if (!v) return;
  const t = typeof time === "number" ? time : v.currentTime;
  if (ab.a === null) ab.a = 0;
  if (t <= ab.a) { abToast("Điểm B phải sau điểm A"); return; }
  ab.b = parseFloat(t.toFixed(1));
  ab.on = true;
  abStartLoop();
  abUpdateAll();
  abToast("Đang lặp đoạn");
}

function abToggle() {
  if (ab.a === null || ab.b === null) { abToast("Cần đặt cả hai điểm A và B"); return; }
  ab.on = !ab.on;
  ab.on ? abStartLoop() : abStopLoop();
  if (ab.on) {
    const v = getMainVideoElement();
    if (v && (v.currentTime < ab.a || v.currentTime >= ab.b)) v.currentTime = ab.a;
  }
  abUpdateAll();
  abToast(ab.on ? "Đang lặp đoạn" : "Đã tắt lặp đoạn");
}

function abReset() {
  ab.a = null; ab.b = null; ab.on = false;
  abPicking = false;
  abStopLoop();
  abUpdateAll();
  abUpdatePickingUI();
  abToast("Đã xóa đoạn lặp");
}

/* --- Smart button click handler --- */
function abSmartClick() {
  if (typeof stopBookmarkPicking === "function" && typeof bookmarkPicking !== "undefined" && bookmarkPicking) {
    stopBookmarkPicking();
  }
  // If both points set → toggle loop
  if (ab.a !== null && ab.b !== null) {
    abToggle();
    return;
  }
  // Otherwise toggle pick mode
  abPicking = !abPicking;
  abUpdateAll();
  abUpdatePickingUI();
  if (abPicking) {
    abToast(ab.a === null ? "Nhấp trên thanh tua để chọn điểm A" : "Nhấp trên thanh tua để chọn điểm B");
  } else {
    abToast("Đã tắt chế độ chọn");
  }
}

function abUpdatePickingUI() {
  const bar = document.querySelector(".ytp-progress-bar");
  const container = document.querySelector(".ytp-progress-bar-container");
  if (bar) {
    bar.classList.toggle("tada-ab-picking", abPicking);
  }
  if (container) {
    container.classList.toggle("tada-ab-picking", abPicking);
  }
  const btn = document.getElementById(AB_BTN_ID);
  if (btn) {
    btn.classList.toggle("picking", abPicking);
  }
  if (!abPicking && typeof removeTimelineGuide === "function") {
    removeTimelineGuide();
  }
}

/* --- Button UI --- */
function abBtnLabel() {
  if (ab.a !== null && ab.b !== null) {
    return ab.on ? "Đang lặp" : "Đang tắt";
  }
  if (abPicking && ab.a !== null) return "Chọn B...";
  if (abPicking) return "Chọn A...";
  return "A-B";
}

function ensureAbBtn() {
  if (!currentSettings.abLooper) { removeAbBtn(); return; }
  const timeDisplay = document.querySelector(".ytp-time-display");
  const leftControls = document.querySelector(".ytp-left-controls") || timeDisplay?.parentElement;
  if (!timeDisplay && !leftControls) return;

  let btn = document.getElementById(AB_BTN_ID);
  if (!btn || !document.contains(btn)) {
    if (btn) btn.remove();
    btn = document.createElement("button");
    btn.id = AB_BTN_ID;
    btn.className = "ytp-button tada-ab-btn";
    btn.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); abSmartClick(); });
    btn.addEventListener("dblclick", (e) => {
      e.preventDefault(); e.stopPropagation();
      abReset();
      abSmartClick();
    });
    btn.addEventListener("contextmenu", (e) => { e.preventDefault(); e.stopPropagation(); abReset(); });

    if (timeDisplay) {
      timeDisplay.insertAdjacentElement("afterend", btn);
    } else if (leftControls) {
      leftControls.appendChild(btn);
    }
  }

  btn.textContent = abBtnLabel();
  btn.title = ab.a !== null && ab.b !== null
    ? (ab.on ? "Đang lặp · Click: Tắt lặp · Chuột phải: Xóa" : "Đang tắt · Click: Bật lặp · Chuột phải: Xóa")
    : abPicking ? "Đang chọn trên thanh tua · Click để hủy" : "A-B Looper · Click để chọn mốc";
  btn.classList.toggle("active", ab.on);
  btn.classList.toggle("has-points", ab.a !== null && ab.b !== null);
  btn.classList.toggle("picking", abPicking);

  // Clear / Cancel button
  let clearBtn = document.getElementById(AB_CLEAR_BTN_ID);
  const showClear = abPicking || (ab.a !== null || ab.b !== null);
  if (showClear) {
    if (!clearBtn || !document.contains(clearBtn)) {
      if (clearBtn) clearBtn.remove();
      clearBtn = document.createElement("button");
      clearBtn.id = AB_CLEAR_BTN_ID;
      clearBtn.className = "ytp-button tada-ab-clear-btn";
      clearBtn.addEventListener("click", (e) => {
        e.preventDefault(); e.stopPropagation();
        abReset();
      });
      btn.insertAdjacentElement("afterend", clearBtn);
    }
    clearBtn.textContent = abPicking ? "Hủy" : "Xóa";
    clearBtn.title = abPicking ? "Hủy chọn mốc" : "Xóa mốc lặp";
  } else if (clearBtn) {
    clearBtn.remove();
  }
}

function removeAbBtn() {
  document.getElementById(AB_BTN_ID)?.remove();
  document.getElementById(AB_CLEAR_BTN_ID)?.remove();
}

/* --- Timeline markers & Picking Guide --- */
const TIMELINE_GUIDE_ID = "tada-timeline-picker-guide";
let lastTimelineActionTime = 0;

function updateTimelineGuide(time, duration, mode) {
  const container = document.querySelector(".ytp-progress-bar-container") || document.querySelector(".ytp-progress-bar");
  if (!container) return;

  let guide = document.getElementById(TIMELINE_GUIDE_ID);
  if (!guide || !document.contains(guide)) {
    if (guide) guide.remove();
    guide = document.createElement("div");
    guide.id = TIMELINE_GUIDE_ID;
    guide.className = "tada-timeline-picker-guide";
    container.appendChild(guide);
  }

  const pct = Math.max(0, Math.min(100, (time / duration) * 100));
  guide.style.left = `${pct}%`;

  guide.className = `tada-timeline-picker-guide guide-${mode.toLowerCase()}`;
  if (mode === "A") {
    guide.textContent = `🎯 Chọn mốc A: ${abFmt(time)}`;
  } else if (mode === "B") {
    guide.textContent = `🎯 Chọn mốc B: ${abFmt(time)}`;
  } else {
    guide.textContent = `🔖 Chọn mốc ghi chú: ${typeof formatBookmarkTime === "function" ? formatBookmarkTime(time) : abFmt(time)}`;
  }
}

function removeTimelineGuide() {
  document.getElementById(TIMELINE_GUIDE_ID)?.remove();
}

function abTimeFromEvent(e) {
  const bar = document.querySelector(".ytp-progress-bar") || document.querySelector(".ytp-progress-bar-container");
  const v = getMainVideoElement();
  if (!bar || !v || !v.duration || isNaN(v.duration)) return null;
  const r = bar.getBoundingClientRect();
  if (r.width <= 0) return null;
  const ratio = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
  return parseFloat((ratio * v.duration).toFixed(1));
}

function abSetupTimeline() {
  const container = document.querySelector(".ytp-progress-bar-container");
  const bar = document.querySelector(".ytp-progress-bar");
  if (!container && !bar) return;

  const targets = [container, bar].filter(Boolean);

  const handlePointerAction = (e) => {
    // Nếu click vào pin A/B hoặc bookmark pin thì để handler kéo/mở pin xử lý
    const pinOrRange = e.target.closest?.(".tada-ab-pin-a, .tada-ab-pin-b, .tada-ab-range, .tada-bm-pin");
    if (pinOrRange) return;

    const isAbShortcut = currentSettings.abLooper && (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey);
    const isAbActive = currentSettings.abLooper && (abPicking || isAbShortcut);
    const isBmActive = currentSettings.videoBookmarks && typeof bookmarkPicking !== "undefined" && bookmarkPicking;

    if (!isAbActive && !isBmActive) return;

    // Chặn YouTube scrub/seek ngay từ pointerdown/mousedown
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation?.();
    lastTimelineActionTime = Date.now();

    const t = abTimeFromEvent(e);
    if (t === null) return;

    // 1. Chế độ chọn Bookmark / Note trên thanh tua
    if (isBmActive) {
      stopBookmarkPicking();
      removeTimelineGuide();
      const v = getMainVideoElement();
      if (v) v.currentTime = t;
      openBookmarkInputModal(t);
      return;
    }

    // 2. Phím tắt Shift/Alt click cho A-B
    if (e.shiftKey) { abSetA(t); return; }
    if (e.altKey || e.ctrlKey || e.metaKey) { abSetB(t); return; }

    // 3. Chế độ chọn A-B Looper
    if (abPicking) {
      if (ab.a === null) {
        abSetA(t);
        abToast(`Đã chọn A (${abFmt(t)}) · Giờ click chọn mốc B`);
      } else {
        const timeA = ab.a;
        if (t < timeA) {
          ab.b = timeA;
          ab.a = t;
        } else {
          ab.b = t;
        }
        ab.on = true;
        abPicking = false;
        abUpdatePickingUI();
        removeTimelineGuide();
        const v = getMainVideoElement();
        if (v) v.currentTime = ab.a;
        abStartLoop();
        abToast(`Đang lặp: ${abFmt(ab.a)} ↔ ${abFmt(ab.b)}`);
      }
      abUpdateAll();
    }
  };

  const handleClick = (e) => {
    const pinOrRange = e.target.closest?.(".tada-ab-pin-a, .tada-ab-pin-b, .tada-ab-range, .tada-bm-pin");
    if (pinOrRange) return;

    const isAbShortcut = currentSettings.abLooper && (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey);
    const isAbActive = currentSettings.abLooper && (abPicking || isAbShortcut);
    const isBmActive = currentSettings.videoBookmarks && typeof bookmarkPicking !== "undefined" && bookmarkPicking;

    if (!isAbActive && !isBmActive) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation?.();

    // Nếu pointerdown đã xử lý trong vòng 450ms thì bỏ qua click trùng lặp
    if (Date.now() - lastTimelineActionTime < 450) return;
    lastTimelineActionTime = Date.now();

    const t = abTimeFromEvent(e);
    if (t === null) return;

    if (isBmActive) {
      stopBookmarkPicking();
      removeTimelineGuide();
      const v = getMainVideoElement();
      if (v) v.currentTime = t;
      openBookmarkInputModal(t);
      return;
    }

    if (e.shiftKey) { abSetA(t); return; }
    if (e.altKey || e.ctrlKey || e.metaKey) { abSetB(t); return; }

    if (abPicking) {
      if (ab.a === null) {
        abSetA(t);
        abToast(`Đã chọn A (${abFmt(t)}) · Giờ click chọn mốc B`);
      } else {
        const timeA = ab.a;
        if (t < timeA) {
          ab.b = timeA;
          ab.a = t;
        } else {
          ab.b = t;
        }
        ab.on = true;
        abPicking = false;
        abUpdatePickingUI();
        removeTimelineGuide();
        const v = getMainVideoElement();
        if (v) v.currentTime = ab.a;
        abStartLoop();
        abToast(`Đang lặp: ${abFmt(ab.a)} ↔ ${abFmt(ab.b)}`);
      }
      abUpdateAll();
    }
  };

  // Hover guide khi đang ở chế độ picking
  const handleMouseMove = (e) => {
    const isAbActive = currentSettings.abLooper && abPicking;
    const isBmActive = currentSettings.videoBookmarks && typeof bookmarkPicking !== "undefined" && bookmarkPicking;
    if (!isAbActive && !isBmActive) {
      removeTimelineGuide();
      return;
    }

    const t = abTimeFromEvent(e);
    const v = getMainVideoElement();
    if (t === null || !v || !v.duration) {
      removeTimelineGuide();
      return;
    }

    updateTimelineGuide(t, v.duration, isBmActive ? "BM" : (ab.a === null ? "A" : "B"));
  };

  const handleMouseLeave = () => {
    removeTimelineGuide();
  };

  targets.forEach((el) => {
    if (!el || el.dataset.tadaTimelineBound) return;
    el.dataset.tadaTimelineBound = "true";

    el.addEventListener("pointerdown", handlePointerAction, { capture: true, passive: false });
    el.addEventListener("mousedown", handlePointerAction, { capture: true, passive: false });
    el.addEventListener("click", handleClick, { capture: true, passive: false });
    el.addEventListener("mousemove", handleMouseMove, { capture: true, passive: true });
    el.addEventListener("mouseleave", handleMouseLeave, { capture: true, passive: true });
  });

  // Kéo thả mốc A, B và dải lặp Range
  if (bar && !bar.dataset.tadaAbDragBound) {
    bar.dataset.tadaAbDragBound = "true";
    bar.addEventListener("mousedown", (e) => {
      if (!currentSettings.abLooper) return;
      const pinA = e.target.closest(".tada-ab-pin-a");
      const pinB = e.target.closest(".tada-ab-pin-b");
      const range = e.target.closest(".tada-ab-range");
      if (!pinA && !pinB && !range) return;

      e.preventDefault(); e.stopPropagation();
      abDrag = {
        type: pinA ? "A" : pinB ? "B" : "RANGE",
        startX: e.clientX,
        initA: ab.a ?? 0,
        initB: ab.b ?? 0
      };

      const onMove = (me) => {
        if (!abDrag) return;
        me.preventDefault(); me.stopPropagation();
        const bar2 = document.querySelector(".ytp-progress-bar");
        const v = getMainVideoElement();
        if (!bar2 || !v || !v.duration) return;
        const rect = bar2.getBoundingClientRect();
        if (rect.width <= 0) return;
        const dur = v.duration;

        if (abDrag.type === "A") {
          let nA = parseFloat(((me.clientX - rect.left) / rect.width * dur).toFixed(1));
          nA = Math.max(0, Math.min(nA, ab.b !== null ? ab.b - 0.2 : dur));
          ab.a = nA;
        } else if (abDrag.type === "B") {
          let nB = parseFloat(((me.clientX - rect.left) / rect.width * dur).toFixed(1));
          nB = Math.max(ab.a !== null ? ab.a + 0.2 : 0, Math.min(nB, dur));
          ab.b = nB; ab.on = true;
        } else if (abDrag.type === "RANGE") {
          const delta = (me.clientX - abDrag.startX) / rect.width * dur;
          const len = Math.max(0.5, abDrag.initB - abDrag.initA);
          let nA = Math.max(0, Math.min(dur - len, abDrag.initA + delta));
          ab.a = parseFloat(nA.toFixed(1));
          ab.b = parseFloat((nA + len).toFixed(1));
        }
        abUpdateAll();
        abToast(abDrag.type === "A" ? "A: " + abFmt(ab.a) : abDrag.type === "B" ? "B: " + abFmt(ab.b) : "Đoạn: " + abFmt(ab.a) + " ↔ " + abFmt(ab.b));
      };

      const onUp = (ue) => {
        ue.preventDefault(); ue.stopPropagation();
        document.removeEventListener("mousemove", onMove, true);
        document.removeEventListener("mouseup", onUp, true);
        abDrag = null;
        if (ab.on) abStartLoop();
        abUpdateAll();
        abToast("Đang lặp đoạn");
      };

      document.addEventListener("mousemove", onMove, true);
      document.addEventListener("mouseup", onUp, true);
    }, true);
  }
}

function abUpdateTrack() {
  const bar = document.querySelector(".ytp-progress-bar");
  if (!bar) return;
  abSetupTimeline();

  let track = document.getElementById(AB_TRACK_ID);
  if (!currentSettings.abLooper || (ab.a === null && ab.b === null)) {
    if (track) track.remove();
    return;
  }

  const v = getMainVideoElement();
  const dur = v?.duration;
  if (!dur || isNaN(dur) || dur <= 0) { if (track) track.remove(); return; }

  if (!track) {
    track = document.createElement("div");
    track.id = AB_TRACK_ID;
    track.className = "tada-ab-track";
    bar.appendChild(track);
  }

  const aPct = ab.a !== null ? (ab.a / dur) * 100 : null;
  const bPct = ab.b !== null ? (ab.b / dur) * 100 : null;

  let html = "";
  if (aPct !== null && bPct !== null && bPct > aPct) {
    html += `<div class="tada-ab-range ${ab.on ? "looping" : ""}" style="left:${aPct}%;width:${bPct - aPct}%" title="Kéo đoạn"></div>`;
  }
  if (aPct !== null) html += `<div class="tada-ab-pin tada-ab-pin-a" style="left:${aPct}%" title="A: ${abFmt(ab.a)}"><span>A</span></div>`;
  if (bPct !== null) html += `<div class="tada-ab-pin tada-ab-pin-b" style="left:${bPct}%" title="B: ${abFmt(ab.b)}"><span>B</span></div>`;
  track.innerHTML = html;
}

function abUpdateAll() {
  ensureAbBtn();
  abUpdateTrack();
}

/* --- Hotkeys --- */
function abHotkey(e) {
  if (!currentSettings.abLooper || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
  if (shouldIgnoreKeyEvent(e)) return;
  if (e.key === "[") { e.preventDefault(); e.stopPropagation(); abSetA(); }
  else if (e.key === "]") { e.preventDefault(); e.stopPropagation(); abSetB(); }
  else if (e.key === "\\") { e.preventDefault(); e.stopPropagation(); abToggle(); }
}

function abEnsureKeys() {
  if (abKeysBound) return;
  window.addEventListener("keydown", abHotkey, true);
  abKeysBound = true;
}

function abBindVideo() {
  const v = getMainVideoElement();
  if (!v || v.dataset.tadaAbV) return;
  v.dataset.tadaAbV = "1";
  v.addEventListener("timeupdate", abCheck);
  v.addEventListener("play", () => { if (ab.on) abStartLoop(); });
  v.addEventListener("pause", abStopLoop);
}

function startAbCheck() {
  if (abBtnInterval) { clearInterval(abBtnInterval); abBtnInterval = null; }
  let c = 0;
  ensureAbBtn();
  abBtnInterval = setInterval(() => {
    c++;
    if (isWatchPage()) { ensureAbBtn(); abUpdateTrack(); }
    if (c > 25 && document.getElementById(AB_BTN_ID)) { clearInterval(abBtnInterval); abBtnInterval = null; }
  }, 300);
}

function abResetOnNav() {
  ab.a = null; ab.b = null; ab.on = false;
  abPicking = false;
  abStopLoop();
  abUpdateAll();
  abUpdatePickingUI();
}

function applyAbLooperSetting() {
  const existing = document.getElementById(AB_STYLE_ID);
  if (currentSettings.abLooper) {
    if (!existing) {
      const s = document.createElement("style");
      s.id = AB_STYLE_ID;
      s.textContent = `
        /* ===== TADa Smart A-B Looper ===== */
        .tada-ab-btn {
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: transparent;
          border: none;
          outline: none;
          padding: 0 6px;
          height: 100%;
          opacity: 0.85;
          transition: all 0.18s ease;
          user-select: none;
          -webkit-user-select: none;
          vertical-align: top;
          font-family: "Roboto", "Segoe UI", sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,0.85);
          letter-spacing: 0.3px;
          white-space: nowrap;
          border-radius: 4px;
        }
        .tada-ab-btn:hover {
          opacity: 1;
          background: rgba(255,255,255,0.1);
        }
        .tada-ab-btn:active { transform: scale(0.94); }
        .tada-ab-btn.has-points {
          color: #fbbf24;
        }
        .tada-ab-btn.active {
          color: #E8930C;
          text-shadow: 0 0 8px rgba(232,147,12,0.7);
        }
        .tada-ab-btn.picking {
          color: #38bdf8;
          background: rgba(56,189,248,0.15);
          animation: tadaAbBlink 1s ease-in-out infinite;
        }
        @keyframes tadaAbBlink {
          0%,100% { opacity: 0.85; }
          50% { opacity: 1; }
        }

        .tada-ab-clear-btn {
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: rgba(239, 68, 68, 0.16) !important;
          border: 1px solid rgba(239, 68, 68, 0.35) !important;
          outline: none;
          padding: 0 6px;
          height: 22px;
          margin-left: 4px;
          opacity: 0.85;
          transition: all 0.18s ease;
          user-select: none;
          -webkit-user-select: none;
          font-family: "Roboto", "Segoe UI", sans-serif;
          font-size: 11px;
          font-weight: 600;
          color: #fca5a5 !important;
          border-radius: 4px;
          vertical-align: middle;
        }
        .tada-ab-clear-btn:hover {
          opacity: 1;
          background: rgba(239, 68, 68, 0.35) !important;
          color: #ffffff !important;
          border-color: rgba(239, 68, 68, 0.6) !important;
        }
        .tada-ab-clear-btn:active {
          transform: scale(0.94);
        }

        /* Pick mode - progress bar glow & container cursor */
        .ytp-progress-bar-container.tada-ab-picking,
        .ytp-progress-bar.tada-ab-picking {
          cursor: crosshair !important;
        }
        .ytp-progress-bar.tada-ab-picking {
          box-shadow: 0 0 0 2px #38bdf8, 0 0 12px rgba(56,189,248,0.6) !important;
          border-radius: 4px;
        }

        /* Timeline hover guide badge */
        .tada-timeline-picker-guide {
          position: absolute;
          top: -28px;
          transform: translateX(-50%);
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          pointer-events: none;
          white-space: nowrap;
          z-index: 1000;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.7);
          transition: left 0.04s ease-out;
        }
        .tada-timeline-picker-guide.guide-a {
          background: #38bdf8;
          color: #0c4a6e;
          border: 1px solid #7dd3fc;
        }
        .tada-timeline-picker-guide.guide-b {
          background: #E8930C;
          color: #1A1410;
          border: 1px solid #fcd34d;
        }
        .tada-timeline-picker-guide.guide-bm {
          background: #E8930C;
          color: #1A1410;
          border: 1px solid #fcd34d;
        }
        .tada-timeline-picker-guide::after {
          content: "";
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
        }
        .tada-timeline-picker-guide.guide-a::after {
          border-top: 5px solid #38bdf8;
        }
        .tada-timeline-picker-guide.guide-b::after,
        .tada-timeline-picker-guide.guide-bm::after {
          border-top: 5px solid #E8930C;
        }

        /* Toast */
        .tada-ab-toast {
          position: absolute;
          top: 18px;
          left: 50%;
          transform: translate(-50%, -14px) scale(0.96);
          background: rgba(20, 16, 12, 0.94);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(232, 147, 12, 0.38);
          color: #FDF6EC;
          padding: 6px 16px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 550;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.55), 0 0 16px rgba(232, 147, 12, 0.12);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 100;
          white-space: nowrap;
        }
        .tada-ab-toast.show {
          opacity: 1;
          transform: translate(-50%, 0) scale(1);
        }

        /* Timeline track */
        .tada-ab-track {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          pointer-events: none;
          z-index: 35;
        }
        .tada-ab-range {
          position: absolute;
          top: 0; height: 100%;
          background: rgba(232,147,12,0.30);
          border-left: 2px solid #38bdf8;
          border-right: 2px solid #E8930C;
          pointer-events: auto;
          cursor: grab;
          transition: background 0.15s ease;
        }
        .tada-ab-range:hover { background: rgba(232,147,12,0.48); }
        .tada-ab-range.looping {
          background: rgba(232,147,12,0.42);
          animation: tadaAbPulse 2s ease-in-out infinite;
        }
        @keyframes tadaAbPulse {
          0%,100% { opacity: 0.85; }
          50% { opacity: 1; }
        }
        .tada-ab-pin {
          position: absolute;
          top: -16px;
          transform: translateX(-50%);
          width: 18px; height: 18px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 800;
          pointer-events: auto;
          cursor: grab;
          user-select: none;
          -webkit-user-select: none;
          z-index: 40;
          transition: transform 0.1s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.7);
        }
        .tada-ab-pin::before {
          content: "";
          position: absolute;
          top: -8px; bottom: -8px; left: -8px; right: -8px;
        }
        .tada-ab-pin:hover { transform: translateX(-50%) scale(1.15); }
        .tada-ab-pin:active { cursor: grabbing; transform: translateX(-50%) scale(1.22); }
        .tada-ab-pin::after {
          content: "";
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: 20px;
          pointer-events: none;
        }
        .tada-ab-pin-a { background: #38bdf8; color: #0c4a6e; }
        .tada-ab-pin-a::after { background: #38bdf8; box-shadow: 0 0 5px #38bdf8; }
        .tada-ab-pin-b { background: #E8930C; color: #1A1410; }
        .tada-ab-pin-b::after { background: #E8930C; box-shadow: 0 0 5px #E8930C; }
      `;
      (document.head || document.documentElement).appendChild(s);
    }
    abEnsureKeys();
    abBindVideo();
    ensureAbBtn();
    startAbCheck();
  } else {
    existing?.remove();
    abStopLoop();
    removeAbBtn();
    document.getElementById(AB_TRACK_ID)?.remove();
    document.querySelector(".tada-ab-toast")?.remove();
  }
}

/* ===== TADa VIDEO BOOKMARKS & NOTES ===== */
let currentVideoBookmarks = [];
let bookmarkPanelOpen = false;
let bookmarkHotkeysBound = false;
let bookmarkControlInterval = null;
let currentBookmarkVideoId = null;
let bookmarkPicking = false;

function formatBookmarkTime(sec) {
  if (sec === null || sec === undefined || isNaN(sec)) return "00:00";
  const total = Math.max(0, Math.floor(sec));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n) => (n < 10 ? "0" + n : "" + n);
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

function escapeBookmarkHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getCurrentVideoTitle() {
  const metaTitle = document.querySelector("h1.ytd-watch-metadata yt-formatted-string")?.textContent;
  if (metaTitle && metaTitle.trim()) return metaTitle.trim();
  const pageTitle = document.title || "";
  return pageTitle.replace(/ - YouTube$/, "").trim() || "Video YouTube";
}

function getCurrentVideoChannel() {
  const channelEl = document.querySelector("ytd-channel-name yt-formatted-string a, ytd-video-owner-renderer #channel-name a");
  return channelEl?.textContent?.trim() || "";
}

function bookmarkToast(msg) {
  const player = document.getElementById("movie_player") || document.querySelector(".html5-video-player");
  if (!player) return;
  let t = player.querySelector("#" + BOOKMARK_TOAST_ID);
  if (!t) {
    t = document.createElement("div");
    t.id = BOOKMARK_TOAST_ID;
    t.className = "tada-bm-toast";
    player.appendChild(t);
  }
  t.textContent = msg;
  t.classList.remove("show");
  void t.offsetWidth;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => {
    t.classList.remove("show");
  }, 2200);
}

/* --- Picking Mode --- */
function toggleBookmarkPicking() {
  if (bookmarkPicking) {
    stopBookmarkPicking();
    bookmarkToast("Đã hủy chọn mốc ghi chú");
  } else {
    startBookmarkPicking();
  }
}

function startBookmarkPicking() {
  if (typeof abPicking !== "undefined" && abPicking) {
    abPicking = false;
    if (typeof abUpdatePickingUI === "function") abUpdatePickingUI();
  }
  bookmarkPicking = true;
  updateBookmarkButtonUI();
  bookmarkUpdatePickingUI();
  bookmarkToast("Nhấp trên thanh tua để chọn mốc (Esc để hủy)");
}

function stopBookmarkPicking() {
  bookmarkPicking = false;
  updateBookmarkButtonUI();
  bookmarkUpdatePickingUI();
}

function bookmarkUpdatePickingUI() {
  const bar = document.querySelector(".ytp-progress-bar");
  const container = document.querySelector(".ytp-progress-bar-container");
  if (bar) {
    bar.classList.toggle("tada-bm-picking", bookmarkPicking);
  }
  if (container) {
    container.classList.toggle("tada-bm-picking", bookmarkPicking);
  }
  const addBtn = document.getElementById(BOOKMARK_ADD_BTN_ID);
  if (addBtn) {
    addBtn.classList.toggle("picking", bookmarkPicking);
  }
  if (!bookmarkPicking && typeof removeTimelineGuide === "function") {
    removeTimelineGuide();
  }
}

/* --- Storage & Data --- */
async function loadBookmarksForCurrentVideo() {
  const vId = getCurrentVideoId();
  currentBookmarkVideoId = vId;
  if (!vId) {
    currentVideoBookmarks = [];
    updateBookmarkButtonBadge();
    updateBookmarkPins();
    if (bookmarkPanelOpen) renderBookmarkPanelList();
    return;
  }
  try {
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      const data = await chrome.storage.local.get([BOOKMARKS_STORAGE_KEY]);
      const allBm = data?.[BOOKMARKS_STORAGE_KEY] || {};
      const videoEntry = allBm[vId];
      currentVideoBookmarks = Array.isArray(videoEntry?.items) ? [...videoEntry.items] : [];
      currentVideoBookmarks.sort((a, b) => (a.time || 0) - (b.time || 0));
    }
  } catch (err) {
    console.debug("[TADa] Failed to load bookmarks", err);
  }
  updateBookmarkButtonBadge();
  updateBookmarkPins();
  if (bookmarkPanelOpen) renderBookmarkPanelList();
}

async function saveNewBookmark(targetTime, noteText) {
  const vId = getCurrentVideoId();
  if (!vId) return;

  const v = getMainVideoElement();
  const time = typeof targetTime === "number" ? targetTime : (v?.currentTime || 0);
  const roundedTime = parseFloat(time.toFixed(1));
  const finalNote = (noteText && noteText.trim()) ? noteText.trim() : `Mốc ${formatBookmarkTime(roundedTime)}`;

  const newItem = {
    id: "bm_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
    time: roundedTime,
    note: finalNote,
    createdAt: Date.now()
  };

  try {
    const data = await chrome.storage.local.get([BOOKMARKS_STORAGE_KEY]);
    const allBm = data?.[BOOKMARKS_STORAGE_KEY] || {};
    const existing = allBm[vId] || {
      title: getCurrentVideoTitle(),
      channel: getCurrentVideoChannel(),
      duration: v?.duration || 0,
      items: []
    };

    existing.title = getCurrentVideoTitle() || existing.title;
    existing.channel = getCurrentVideoChannel() || existing.channel;
    existing.duration = v?.duration || existing.duration;
    existing.updatedAt = Date.now();

    const items = Array.isArray(existing.items) ? existing.items : [];
    items.push(newItem);
    items.sort((a, b) => (a.time || 0) - (b.time || 0));
    existing.items = items;
    allBm[vId] = existing;

    await chrome.storage.local.set({ [BOOKMARKS_STORAGE_KEY]: allBm });
    currentVideoBookmarks = items;

    updateBookmarkButtonBadge();
    updateBookmarkPins();
    if (bookmarkPanelOpen) renderBookmarkPanelList();
    bookmarkToast(`Đã lưu mốc [${formatBookmarkTime(roundedTime)}]: ${finalNote}`);
  } catch (err) {
    console.error("[TADa] Failed to save bookmark", err);
  }
}

async function updateBookmarkNote(bmId, newNote) {
  const vId = getCurrentVideoId();
  if (!vId) return;
  try {
    const data = await chrome.storage.local.get([BOOKMARKS_STORAGE_KEY]);
    const allBm = data?.[BOOKMARKS_STORAGE_KEY] || {};
    if (allBm[vId] && Array.isArray(allBm[vId].items)) {
      const item = allBm[vId].items.find(it => it.id === bmId);
      if (item) {
        item.note = (newNote && newNote.trim()) ? newNote.trim() : `Mốc ${formatBookmarkTime(item.time)}`;
        item.updatedAt = Date.now();
        allBm[vId].updatedAt = Date.now();
        await chrome.storage.local.set({ [BOOKMARKS_STORAGE_KEY]: allBm });
        currentVideoBookmarks = allBm[vId].items;
        updateBookmarkPins();
        if (bookmarkPanelOpen) renderBookmarkPanelList();
        bookmarkToast("Đã cập nhật ghi chú");
      }
    }
  } catch (err) {
    console.error("[TADa] Failed to update bookmark", err);
  }
}

async function removeBookmark(bmId) {
  const vId = getCurrentVideoId();
  if (!vId) return;

  try {
    const data = await chrome.storage.local.get([BOOKMARKS_STORAGE_KEY]);
    const allBm = data?.[BOOKMARKS_STORAGE_KEY] || {};
    if (allBm[vId] && Array.isArray(allBm[vId].items)) {
      allBm[vId].items = allBm[vId].items.filter(item => item.id !== bmId);
      allBm[vId].updatedAt = Date.now();
      if (allBm[vId].items.length === 0) {
        delete allBm[vId];
        currentVideoBookmarks = [];
      } else {
        currentVideoBookmarks = allBm[vId].items;
      }
      await chrome.storage.local.set({ [BOOKMARKS_STORAGE_KEY]: allBm });
      updateBookmarkButtonBadge();
      updateBookmarkPins();
      if (bookmarkPanelOpen) renderBookmarkPanelList();
      bookmarkToast("Đã xóa mốc thời gian");
    }
  } catch (err) {
    console.error("[TADa] Failed to remove bookmark", err);
  }
}

function exportBookmarksToMarkdown() {
  const vId = getCurrentVideoId();
  if (!vId || currentVideoBookmarks.length === 0) {
    bookmarkToast("Chưa có mốc nào để sao chép");
    return;
  }
  const title = getCurrentVideoTitle();
  const url = `https://www.youtube.com/watch?v=${vId}`;
  let md = `**${title}**\n${url}\n\n`;
  currentVideoBookmarks.forEach((bm) => {
    md += `- [${formatBookmarkTime(bm.time)}](${url}&t=${Math.floor(bm.time)}s) - ${bm.note}\n`;
  });

  navigator.clipboard.writeText(md).then(() => {
    bookmarkToast("Đã sao chép Markdown vào clipboard");
  }).catch(() => {
    bookmarkToast("Không thể sao chép vào clipboard");
  });
}

/* --- Note Input Popup Modal --- */
function openBookmarkInputModal(targetTime, existingItem = null) {
  if (!currentSettings.videoBookmarks || !isWatchPage()) return;
  const player = document.getElementById("movie_player") || document.querySelector(".html5-video-player");
  if (!player) return;

  removeBookmarkModal();

  const isEdit = Boolean(existingItem);
  const time = typeof targetTime === "number" ? targetTime : (existingItem?.time || 0);
  const roundedTime = parseFloat(time.toFixed(1));

  const overlay = document.createElement("div");
  overlay.id = BOOKMARK_MODAL_ID;
  overlay.className = "tada-bm-modal-overlay";

  overlay.innerHTML = `
    <div class="tada-bm-modal" role="dialog" aria-modal="true">
      <div class="tada-bm-modal-header">
        <div class="tada-bm-modal-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" class="tada-bm-modal-icon">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          <span>${isEdit ? "Chỉnh sửa ghi chú" : "Thêm ghi chú mốc thời gian"}</span>
        </div>
        <button class="tada-bm-modal-btn-close" id="tada-bm-modal-close" title="Đóng (Esc)">×</button>
      </div>

      <div class="tada-bm-modal-body">
        <div class="tada-bm-modal-time-row">
          <span class="tada-bm-modal-time-label">Mốc thời gian:</span>
          <span class="tada-bm-modal-time-pill" title="Mốc thời gian ghi chú">${formatBookmarkTime(roundedTime)}</span>
        </div>
        <textarea id="tada-bm-modal-textarea" class="tada-bm-modal-textarea" placeholder="Nhập ghi chú cho mốc này... (Nhấn Enter để lưu)" rows="3" maxlength="250">${isEdit ? escapeBookmarkHtml(existingItem.note) : ""}</textarea>
        <div class="tada-bm-modal-hint">
          <span>Nhấn <b>Enter</b> để lưu · <b>Shift+Enter</b> xuống dòng · <b>Esc</b> để hủy</span>
        </div>
      </div>

      <div class="tada-bm-modal-footer">
        <button class="tada-bm-modal-btn-cancel" id="tada-bm-modal-cancel">Hủy</button>
        <button class="tada-bm-modal-btn-save" id="tada-bm-modal-save">${isEdit ? "Cập nhật" : "Lưu ghi chú"}</button>
      </div>
    </div>
  `;

  player.appendChild(overlay);

  const textarea = overlay.querySelector("#tada-bm-modal-textarea");
  const saveBtn = overlay.querySelector("#tada-bm-modal-save");
  const cancelBtn = overlay.querySelector("#tada-bm-modal-cancel");
  const closeBtn = overlay.querySelector("#tada-bm-modal-close");

  const doSave = async () => {
    const text = textarea?.value?.trim() || "";
    if (isEdit && existingItem) {
      await updateBookmarkNote(existingItem.id, text);
    } else {
      await saveNewBookmark(roundedTime, text);
    }
    removeBookmarkModal();
  };

  saveBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    doSave();
  });

  cancelBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    removeBookmarkModal();
  });

  closeBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    removeBookmarkModal();
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      removeBookmarkModal();
    }
  });

  textarea?.addEventListener("keydown", (e) => {
    e.stopPropagation();
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      doSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      removeBookmarkModal();
    }
  });

  setTimeout(() => {
    if (textarea) {
      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }
  }, 50);
}

function removeBookmarkModal() {
  document.getElementById(BOOKMARK_MODAL_ID)?.remove();
}

/* --- Buttons in Player Controls --- */
function ensureBookmarkButton() {
  if (!currentSettings.videoBookmarks || !isWatchPage()) {
    removeBookmarkButton();
    return;
  }

  const pipBtn = document.getElementById(PIP_BUTTON_ID);
  const settingsBtn = document.querySelector(".ytp-settings-button");
  const rightControls = document.querySelector(".ytp-right-controls") ||
    settingsBtn?.closest?.(".ytp-right-controls") ||
    settingsBtn?.parentElement;

  if (!rightControls && !settingsBtn && !pipBtn) return;

  // 1. Nút Thêm Note (Bật chế độ chọn điểm trên thanh tua)
  let addBtn = document.getElementById(BOOKMARK_ADD_BTN_ID);
  if (!addBtn || !document.contains(addBtn)) {
    if (addBtn) addBtn.remove();
    addBtn = document.createElement("button");
    addBtn.id = BOOKMARK_ADD_BTN_ID;
    addBtn.className = "ytp-button tada-bookmark-button tada-bookmark-add-button";
    addBtn.setAttribute("aria-label", "Thêm ghi chú mốc thời gian");
    addBtn.innerHTML = `
      <svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%">
        <path class="ytp-svg-fill" d="M12 7 C10.9 7 10 7.9 10 9 V28 L18 24 L26 28 V9 C26 7.9 25.1 7 24 7 H12 Z" fill="#fff"></path>
        <circle cx="25" cy="11" r="5.5" fill="#E8930C"></circle>
        <path d="M25 8.5 V13.5 M22.5 11 H27.5" stroke="#1A1410" stroke-width="1.8" stroke-linecap="round"></path>
      </svg>
    `;
    addBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleBookmarkPicking();
    });

    const anchorBtn = document.getElementById(DOWNLOAD_BUTTON_ID) || document.getElementById(SCREENSHOT_BUTTON_ID) || pipBtn;
    if (anchorBtn && anchorBtn.nextSibling) {
      anchorBtn.parentNode.insertBefore(addBtn, anchorBtn.nextSibling);
    } else if (anchorBtn) {
      anchorBtn.parentNode.appendChild(addBtn);
    } else if (settingsBtn && settingsBtn.nextSibling) {
      settingsBtn.parentNode.insertBefore(addBtn, settingsBtn.nextSibling);
    } else if (rightControls) {
      rightControls.insertBefore(addBtn, rightControls.firstChild);
    }
  }

  // 2. Nút Xem tất cả ghi chú (mở panel danh sách)
  let listBtn = document.getElementById(BOOKMARK_BTN_ID);
  if (!listBtn || !document.contains(listBtn)) {
    if (listBtn) listBtn.remove();
    listBtn = document.createElement("button");
    listBtn.id = BOOKMARK_BTN_ID;
    listBtn.className = "ytp-button tada-bookmark-button";
    listBtn.setAttribute("aria-label", "Xem tất cả ghi chú");
    listBtn.innerHTML = `
      <svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%">
        <path class="ytp-svg-fill" d="M12 7 C10.9 7 10 7.9 10 9 V28 L18 24 L26 28 V9 C26 7.9 25.1 7 24 7 H12 Z" fill="#fff"></path>
      </svg>
      <span class="tada-bm-btn-badge" id="tada-bm-btn-badge" style="display:none;"></span>
    `;

    listBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleBookmarkPanel();
    });

    if (addBtn && addBtn.nextSibling) {
      addBtn.parentNode.insertBefore(listBtn, addBtn.nextSibling);
    } else if (addBtn) {
      addBtn.parentNode.appendChild(listBtn);
    } else if (pipBtn && pipBtn.nextSibling) {
      pipBtn.parentNode.insertBefore(listBtn, pipBtn.nextSibling);
    } else if (rightControls) {
      rightControls.appendChild(listBtn);
    }
  }

  updateBookmarkButtonUI();
}

function updateBookmarkButtonUI() {
  const addBtn = document.getElementById(BOOKMARK_ADD_BTN_ID);
  if (addBtn) {
    addBtn.classList.toggle("picking", bookmarkPicking);
    addBtn.setAttribute("title", bookmarkPicking
      ? "Đang chọn trên thanh tua · Click để hủy"
      : "Thêm ghi chú mốc thời gian · Bật để click chọn điểm trên thanh tua (N)");
  }

  const listBtn = document.getElementById(BOOKMARK_BTN_ID);
  if (listBtn) {
    listBtn.classList.toggle("active", bookmarkPanelOpen);
    listBtn.setAttribute("title", bookmarkPanelOpen
      ? "Đang mở danh sách ghi chú · Click để đóng (B)"
      : "Xem tất cả ghi chú (B)");
    updateBookmarkButtonBadge();
  }
}

function updateBookmarkButtonBadge() {
  const btn = document.getElementById(BOOKMARK_BTN_ID);
  if (!btn) return;
  const badge = document.getElementById("tada-bm-btn-badge");
  const count = currentVideoBookmarks.length;
  if (badge) {
    if (count > 0) {
      badge.textContent = count > 99 ? "99+" : count;
      badge.style.display = "flex";
      btn.classList.add("has-bookmarks");
    } else {
      badge.style.display = "none";
      btn.classList.remove("has-bookmarks");
    }
  }
  btn.classList.toggle("active", bookmarkPanelOpen);
}

function removeBookmarkButton() {
  document.getElementById(BOOKMARK_ADD_BTN_ID)?.remove();
  document.getElementById(BOOKMARK_BTN_ID)?.remove();
  removeBookmarkPanel();
  removeBookmarkModal();
  removeBookmarkTrack();
  stopBookmarkPicking();
}

/* --- Timeline Track & Diamond Pins --- */
function ensureBookmarkTrack() {
  const bar = document.querySelector(".ytp-progress-bar");
  if (!bar) return;
  if (typeof abSetupTimeline === "function") {
    abSetupTimeline();
  }
  let track = document.getElementById(BOOKMARK_TRACK_ID);
  if (!track || !document.contains(track)) {
    if (track) track.remove();
    track = document.createElement("div");
    track.id = BOOKMARK_TRACK_ID;
    track.className = "tada-bm-track";
    bar.appendChild(track);
  }
}

function updateBookmarkPins() {
  const bar = document.querySelector(".ytp-progress-bar");
  if (!bar || !currentSettings.videoBookmarks) {
    removeBookmarkTrack();
    return;
  }
  ensureBookmarkTrack();
  const track = document.getElementById(BOOKMARK_TRACK_ID);
  if (!track) return;

  const v = getMainVideoElement();
  const dur = v?.duration;
  if (!dur || isNaN(dur) || dur <= 0 || currentVideoBookmarks.length === 0) {
    track.innerHTML = "";
    return;
  }

  let html = "";
  currentVideoBookmarks.forEach((bm) => {
    const pct = Math.max(0, Math.min(100, (bm.time / dur) * 100));
    html += `
      <div class="tada-bm-pin" style="left: ${pct}%;" data-time="${bm.time}" data-id="${bm.id}">
        <div class="tada-bm-pin-diamond"></div>
        <div class="tada-bm-tooltip">${formatBookmarkTime(bm.time)}: ${escapeBookmarkHtml(bm.note)}</div>
      </div>
    `;
  });
  track.innerHTML = html;

  if (!track.dataset.listenerBound) {
    track.dataset.listenerBound = "true";
    track.addEventListener("click", (e) => {
      const pin = e.target.closest(".tada-bm-pin");
      if (!pin) return;
      e.preventDefault();
      e.stopPropagation();
      const time = parseFloat(pin.dataset.time);
      if (!isNaN(time)) {
        const video = getMainVideoElement();
        if (video) {
          video.currentTime = time;
          video.play().catch(() => { });
          bookmarkToast(`Đã nhảy tới ${formatBookmarkTime(time)}`);
        }
      }
    });
  }
}

function removeBookmarkTrack() {
  document.getElementById(BOOKMARK_TRACK_ID)?.remove();
}

/* --- View All Notes Panel --- */
function toggleBookmarkPanel() {
  if (bookmarkPanelOpen) {
    closeBookmarkPanel();
  } else {
    openBookmarkPanel();
  }
}

function openBookmarkPanel() {
  if (!currentSettings.videoBookmarks || !isWatchPage()) return;
  const player = document.getElementById("movie_player") || document.querySelector(".html5-video-player");
  if (!player) return;

  bookmarkPanelOpen = true;
  let panel = document.getElementById(BOOKMARK_PANEL_ID);
  if (!panel || !document.contains(panel)) {
    if (panel) panel.remove();
    panel = document.createElement("div");
    panel.id = BOOKMARK_PANEL_ID;
    panel.className = "tada-bm-panel";
    player.appendChild(panel);
  }

  const v = getMainVideoElement();
  const curTime = v?.currentTime || 0;

  panel.innerHTML = `
    <div class="tada-bm-header">
      <div class="tada-bm-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="tada-bm-title-icon">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
        <span>Tất cả ghi chú</span>
        <span class="tada-bm-header-count" id="tada-bm-header-count">${currentVideoBookmarks.length}</span>
      </div>
      <div class="tada-bm-actions">
        <button id="tada-bm-btn-export" class="tada-bm-btn-action" title="Sao chép Markdown / Ghi chú">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          Chép MD
        </button>
        <button id="tada-bm-btn-close" class="tada-bm-btn-action tada-bm-btn-close" title="Đóng panel (Esc hoặc B)">
          ×
        </button>
      </div>
    </div>

    <!-- Quick Action Bar -->
    <div class="tada-bm-add-bar">
      <button id="tada-bm-btn-pick-new" class="tada-bm-btn-pick-action" title="Bật chế độ click chọn mốc trên thanh tua">
        Chọn mốc trên thanh tua
      </button>
      <button id="tada-bm-btn-curtime" class="tada-bm-time-pill" title="Thêm ghi chú ngay tại giây hiện tại của video">
        + Ghim tại <span id="tada-bm-curtime-display">${formatBookmarkTime(curTime)}</span>
      </button>
    </div>

    <!-- Bookmarks List -->
    <div class="tada-bm-list-container" id="tada-bm-list-container">
      <!-- Injected list -->
    </div>
  `;

  renderBookmarkPanelList();

  const closeBtn = panel.querySelector("#tada-bm-btn-close");
  closeBtn?.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); closeBookmarkPanel(); });

  const exportBtn = panel.querySelector("#tada-bm-btn-export");
  exportBtn?.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); exportBookmarksToMarkdown(); });

  const pickNewBtn = panel.querySelector("#tada-bm-btn-pick-new");
  pickNewBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeBookmarkPanel();
    startBookmarkPicking();
  });

  const curTimeBtn = panel.querySelector("#tada-bm-btn-curtime");
  curTimeBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const video = getMainVideoElement();
    const time = video?.currentTime || 0;
    openBookmarkInputModal(time);
  });

  updateBookmarkButtonUI();
}

function renderBookmarkPanelList() {
  const container = document.getElementById("tada-bm-list-container");
  if (!container) return;

  const countBadge = document.getElementById("tada-bm-header-count");
  if (countBadge) countBadge.textContent = currentVideoBookmarks.length;

  if (currentVideoBookmarks.length === 0) {
    container.innerHTML = `
      <div class="tada-bm-empty">
        <div class="tada-bm-empty-dot"></div>
        <div class="tada-bm-empty-text">Chưa có ghi chú nào cho video này</div>
        <div class="tada-bm-empty-sub">Bấm nút bên dưới để chọn mốc trên thanh tua</div>
        <button id="tada-bm-empty-pick-btn" class="tada-bm-empty-btn">
          Chọn điểm trên thanh tua
        </button>
      </div>
    `;
    const pickBtn = container.querySelector("#tada-bm-empty-pick-btn");
    pickBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeBookmarkPanel();
      startBookmarkPicking();
    });
    return;
  }

  let html = "";
  currentVideoBookmarks.forEach((bm) => {
    html += `
      <div class="tada-bm-item" data-id="${bm.id}">
        <button class="tada-bm-item-jump" data-time="${bm.time}" title="Nhảy tới ${formatBookmarkTime(bm.time)} và phát">
          ${formatBookmarkTime(bm.time)}
        </button>
        <div class="tada-bm-item-note" title="${escapeBookmarkHtml(bm.note)}">
          ${escapeBookmarkHtml(bm.note)}
        </div>
        <div class="tada-bm-item-actions">
          <button class="tada-bm-item-edit" data-id="${bm.id}" title="Chỉnh sửa ghi chú này">
            Sửa
          </button>
          <button class="tada-bm-item-delete" data-id="${bm.id}" title="Xóa mốc này">
            ×
          </button>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;

  container.querySelectorAll(".tada-bm-item-jump").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation();
      const time = parseFloat(btn.dataset.time);
      if (!isNaN(time)) {
        const video = getMainVideoElement();
        if (video) {
          video.currentTime = time;
          video.play().catch(() => { });
          bookmarkToast(`Đã nhảy tới ${formatBookmarkTime(time)}`);
        }
      }
    });
  });

  container.querySelectorAll(".tada-bm-item-edit").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation();
      const id = btn.dataset.id;
      const item = currentVideoBookmarks.find(it => it.id === id);
      if (item) {
        openBookmarkInputModal(item.time, item);
      }
    });
  });

  container.querySelectorAll(".tada-bm-item-delete").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation();
      const id = btn.dataset.id;
      if (id) removeBookmark(id);
    });
  });
}

function closeBookmarkPanel() {
  bookmarkPanelOpen = false;
  document.getElementById(BOOKMARK_PANEL_ID)?.remove();
  updateBookmarkButtonUI();
}

function removeBookmarkPanel() {
  bookmarkPanelOpen = false;
  document.getElementById(BOOKMARK_PANEL_ID)?.remove();
}

/* --- Hotkeys --- */
function handleGlobalBookmarkHotkeys(e) {
  if (!currentSettings.videoBookmarks || !isWatchPage()) return;
  if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;

  if (e.key === "Escape") {
    if (document.getElementById(BOOKMARK_MODAL_ID)) {
      e.preventDefault(); e.stopPropagation();
      removeBookmarkModal();
      return;
    }
    if (bookmarkPicking) {
      e.preventDefault(); e.stopPropagation();
      stopBookmarkPicking();
      bookmarkToast("Đã hủy chọn mốc");
      return;
    }
    if (bookmarkPanelOpen) {
      e.preventDefault(); e.stopPropagation();
      closeBookmarkPanel();
      return;
    }
    return;
  }

  if (shouldIgnoreKeyEvent(e) || e.target?.closest?.("ytd-comments, #comments, #search-input, [role='textbox']")) {
    return;
  }

  if (e.key === "b" || e.key === "B") {
    e.preventDefault();
    e.stopPropagation();
    if (e.shiftKey) {
      toggleBookmarkPicking();
    } else {
      toggleBookmarkPanel();
    }
    return;
  }

  if (e.key === "n" || e.key === "N") {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmarkPicking();
    return;
  }
}

function ensureBookmarkHotkeys() {
  if (bookmarkHotkeysBound) return;
  window.addEventListener("keydown", handleGlobalBookmarkHotkeys, true);
  bookmarkHotkeysBound = true;
}

function bindVideoBookmarkListeners() {
  const v = getMainVideoElement();
  if (!v || v.dataset.tadaBmBound) return;
  v.dataset.tadaBmBound = "true";
  v.addEventListener("durationchange", () => {
    updateBookmarkPins();
  });
  v.addEventListener("loadedmetadata", () => {
    updateBookmarkPins();
  });
  v.addEventListener("play", () => {
    ensureBookmarkButton();
    updateBookmarkPins();
  });
}

function startBookmarkCheck() {
  if (bookmarkControlInterval) {
    clearInterval(bookmarkControlInterval);
    bookmarkControlInterval = null;
  }
  let count = 0;
  ensureBookmarkButton();
  updateBookmarkPins();
  bindVideoBookmarkListeners();
  bookmarkControlInterval = setInterval(() => {
    count++;
    if (isWatchPage()) {
      ensureBookmarkButton();
      updateBookmarkPins();
      bindVideoBookmarkListeners();
    }
    if (count > 25 && document.getElementById(BOOKMARK_BTN_ID) && document.getElementById(BOOKMARK_ADD_BTN_ID)) {
      clearInterval(bookmarkControlInterval);
      bookmarkControlInterval = null;
    }
  }, 300);
}

function onBookmarkNav() {
  loadBookmarksForCurrentVideo();
  if (bookmarkPanelOpen) {
    closeBookmarkPanel();
  }
  removeBookmarkModal();
  stopBookmarkPicking();
}

function applyVideoBookmarksSetting() {
  const existingStyle = document.getElementById(BOOKMARK_STYLE_ID);
  if (currentSettings.videoBookmarks) {
    if (!existingStyle) {
      const style = document.createElement("style");
      style.id = BOOKMARK_STYLE_ID;
      style.textContent = `
        /* ===== TADa VIDEO BOOKMARKS ===== */
        .tada-bookmark-button {
          position: relative;
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: transparent;
          border: none;
          outline: none;
          padding: 0;
          width: 44px;
          height: 100%;
          opacity: 0.88;
          transition: opacity 0.15s ease, transform 0.15s ease, background 0.15s ease;
          user-select: none;
          -webkit-user-select: none;
          vertical-align: top;
        }
        .tada-bookmark-button:hover {
          opacity: 1;
          background: rgba(255, 255, 255, 0.08);
        }
        .tada-bookmark-button:active { transform: scale(0.92); }
        .tada-bookmark-button svg { width: 100%; height: 100%; pointer-events: none; }
        .tada-bookmark-button.active svg path.ytp-svg-fill { fill: #E8930C !important; }
        .tada-bookmark-button.active { opacity: 1; }

        /* Add Button Picking state */
        .tada-bookmark-add-button.picking {
          opacity: 1 !important;
          background: rgba(232, 147, 12, 0.22) !important;
          border-radius: 6px;
          animation: tadaBmPulse 1.2s ease-in-out infinite;
        }
        .tada-bookmark-add-button.picking svg path.ytp-svg-fill {
          fill: #E8930C !important;
        }

        /* Timeline picking crosshair & glow */
        .ytp-progress-bar-container.tada-bm-picking,
        .ytp-progress-bar.tada-bm-picking {
          cursor: crosshair !important;
        }
        .ytp-progress-bar.tada-bm-picking {
          box-shadow: 0 0 0 2px #E8930C, 0 0 14px rgba(232, 147, 12, 0.75) !important;
          border-radius: 4px;
        }

        @keyframes tadaBmPulse {
          0%, 100% { opacity: 0.85; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }

        .tada-bm-btn-badge {
          position: absolute;
          top: 8px;
          right: 5px;
          background: #E8930C;
          color: #1A1410;
          font-size: 9px;
          font-weight: 800;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          min-width: 14px;
          height: 14px;
          padding: 0 3px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          pointer-events: none;
          box-shadow: 0 1px 4px rgba(0,0,0,0.5);
        }
        .tada-bm-track {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 39;
        }
        .tada-bm-pin {
          position: absolute;
          top: -3px;
          transform: translateX(-50%);
          width: 14px;
          height: 14px;
          pointer-events: auto;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 41;
          transition: transform 0.15s ease;
        }
        .tada-bm-pin:hover {
          transform: translateX(-50%) scale(1.35);
          z-index: 45;
        }
        .tada-bm-pin-diamond {
          width: 8px;
          height: 8px;
          background: #E8930C;
          border: 1.5px solid #FFFFFF;
          border-radius: 1px;
          transform: rotate(45deg);
          box-shadow: 0 0 6px rgba(232, 147, 12, 0.9), 0 2px 4px rgba(0,0,0,0.5);
        }
        .tada-bm-tooltip {
          position: absolute;
          bottom: 22px;
          left: 50%;
          transform: translateX(-50%) translateY(4px);
          background: rgba(18, 14, 10, 0.94);
          color: #FDF6EC;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 4px;
          border: 1px solid rgba(232, 147, 12, 0.4);
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: all 0.15s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.6);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .tada-bm-pin:hover .tada-bm-tooltip {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        /* ===== Note Input Modal ===== */
        .tada-bm-modal-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: tadaBmFadeIn 0.18s ease-out;
        }
        .tada-bm-modal {
          background: rgba(22, 17, 13, 0.96);
          border: 1px solid rgba(232, 147, 12, 0.45);
          border-radius: 14px;
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.85), 0 0 24px rgba(232, 147, 12, 0.25);
          width: 90%;
          max-width: 400px;
          padding: 16px 18px;
          color: #FDF6EC;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          display: flex;
          flex-direction: column;
          gap: 12px;
          animation: tadaBmScaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: auto;
          user-select: none;
        }
        .tada-bm-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 8px;
        }
        .tada-bm-modal-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          color: #FDF6EC;
        }
        .tada-bm-modal-icon {
          width: 16px;
          height: 16px;
          color: #E8930C;
        }
        .tada-bm-modal-btn-close {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
          cursor: pointer;
          padding: 2px 6px;
          border-radius: 4px;
          transition: all 0.15s ease;
        }
        .tada-bm-modal-btn-close:hover {
          color: #FDF6EC;
          background: rgba(255, 255, 255, 0.1);
        }
        .tada-bm-modal-body {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .tada-bm-modal-time-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
        }
        .tada-bm-modal-time-label {
          color: rgba(255, 255, 255, 0.65);
        }
        .tada-bm-modal-time-pill {
          background: rgba(232, 147, 12, 0.2);
          border: 1px solid rgba(232, 147, 12, 0.45);
          color: #FDF6EC;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 6px;
        }
        .tada-bm-modal-textarea {
          width: 100%;
          box-sizing: border-box;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          color: #FDF6EC;
          font-size: 12px;
          padding: 8px 10px;
          outline: none;
          font-family: inherit;
          resize: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .tada-bm-modal-textarea:focus {
          border-color: #E8930C;
          box-shadow: 0 0 0 2px rgba(232, 147, 12, 0.25);
        }
        .tada-bm-modal-textarea::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }
        .tada-bm-modal-hint {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.45);
        }
        .tada-bm-modal-hint b {
          color: rgba(255, 255, 255, 0.75);
        }
        .tada-bm-modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          padding-top: 4px;
        }
        .tada-bm-modal-btn-cancel {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #FDF6EC;
          font-size: 11px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .tada-bm-modal-btn-cancel:hover {
          background: rgba(255, 255, 255, 0.15);
        }
        .tada-bm-modal-btn-save {
          background: #E8930C;
          border: none;
          color: #1A1410;
          font-size: 11px;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .tada-bm-modal-btn-save:hover {
          background: #F59E0B;
          transform: scale(1.02);
        }
        .tada-bm-modal-btn-save:active {
          transform: scale(0.96);
        }
        @keyframes tadaBmScaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }

        /* ===== View All Notes Panel ===== */
        .tada-bm-panel {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 330px;
          max-height: calc(100% - 75px);
          background: rgba(22, 17, 13, 0.96);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(232, 147, 12, 0.35);
          border-radius: 12px;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.7);
          color: #FDF6EC;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          display: flex;
          flex-direction: column;
          z-index: 61;
          overflow: hidden;
          animation: tadaBmFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .tada-bm-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.25);
        }
        .tada-bm-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          color: #FDF6EC;
        }
        .tada-bm-title-icon { width: 15px; height: 15px; color: #E8930C; }
        .tada-bm-header-count {
          font-size: 10px;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 9999px;
          background: rgba(232, 147, 12, 0.2);
          color: #E8930C;
        }
        .tada-bm-actions { display: flex; align-items: center; gap: 6px; }
        .tada-bm-btn-action {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #FDF6EC;
          font-size: 10px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 6px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: all 0.15s ease;
        }
        .tada-bm-btn-action:hover {
          background: rgba(232, 147, 12, 0.2);
          border-color: rgba(232, 147, 12, 0.4);
          color: #E8930C;
        }
        .tada-bm-btn-action svg { width: 11px; height: 11px; }
        .tada-bm-btn-close { padding: 3px 7px; font-size: 11px; }

        .tada-bm-add-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
          padding: 8px 10px;
          background: rgba(255, 255, 255, 0.04);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .tada-bm-btn-pick-action {
          background: rgba(232, 147, 12, 0.18);
          border: 1px solid rgba(232, 147, 12, 0.4);
          color: #FDF6EC;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 6px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: all 0.15s ease;
        }
        .tada-bm-btn-pick-action:hover {
          background: #E8930C;
          color: #1A1410;
        }
        .tada-bm-time-pill {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #FDF6EC;
          font-size: 10px;
          font-weight: 600;
          padding: 4px 7px;
          border-radius: 6px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }
        .tada-bm-time-pill:hover {
          background: rgba(232, 147, 12, 0.25);
          border-color: rgba(232, 147, 12, 0.4);
        }

        .tada-bm-list-container {
          padding: 6px 10px 10px;
          overflow-y: auto;
          max-height: 280px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          scrollbar-width: thin;
          scrollbar-color: rgba(232, 147, 12, 0.35) transparent;
        }
        .tada-bm-list-container::-webkit-scrollbar { width: 4px; }
        .tada-bm-list-container::-webkit-scrollbar-thumb {
          background: rgba(232, 147, 12, 0.35);
          border-radius: 4px;
        }
        .tada-bm-item {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          padding: 4px 6px;
          transition: all 0.15s ease;
        }
        .tada-bm-item:hover {
          background: rgba(255, 255, 255, 0.09);
          border-color: rgba(232, 147, 12, 0.3);
        }
        .tada-bm-item-jump {
          background: rgba(232, 147, 12, 0.18);
          border: 1px solid rgba(232, 147, 12, 0.35);
          color: #FDF6EC;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }
        .tada-bm-item-jump:hover { background: #E8930C; color: #1A1410; }
        .tada-bm-item-note {
          flex: 1;
          min-width: 0;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.9);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .tada-bm-item-actions {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .tada-bm-item-edit {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          font-size: 11px;
          cursor: pointer;
          padding: 2px 4px;
          border-radius: 4px;
          transition: all 0.15s ease;
        }
        .tada-bm-item-edit:hover {
          color: #E8930C;
          background: rgba(232, 147, 12, 0.15);
        }
        .tada-bm-item-delete {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.4);
          font-size: 11px;
          cursor: pointer;
          padding: 2px 5px;
          border-radius: 4px;
          transition: all 0.15s ease;
        }
        .tada-bm-item-delete:hover {
          color: #EF4444;
          background: rgba(239, 68, 68, 0.15);
        }

        .tada-bm-empty {
          padding: 24px 10px;
          text-align: center;
          color: rgba(255, 255, 255, 0.5);
        }
        .tada-bm-empty-icon { font-size: 24px; margin-bottom: 6px; }
        .tada-bm-empty-text { font-size: 12px; font-weight: 600; color: #FDF6EC; }
        .tada-bm-empty-sub {
          font-size: 10px;
          margin-top: 4px;
          color: rgba(255, 255, 255, 0.45);
        }
        .tada-bm-empty-btn {
          margin-top: 10px;
          background: #E8930C;
          border: none;
          color: #1A1410;
          font-size: 11px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .tada-bm-empty-btn:hover {
          background: #F59E0B;
          transform: scale(1.02);
        }

        .tada-bm-empty-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #E8930C;
          box-shadow: 0 0 10px rgba(232, 147, 12, 0.6);
          margin-bottom: 4px;
        }

        .tada-bm-toast {
          position: absolute;
          top: 18px;
          left: 50%;
          transform: translate(-50%, -14px) scale(0.96);
          background: rgba(20, 16, 12, 0.94);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(232, 147, 12, 0.38);
          color: #FDF6EC;
          padding: 6px 16px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 550;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.55), 0 0 16px rgba(232, 147, 12, 0.12);
          pointer-events: none;
          opacity: 0;
          z-index: 999;
          transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .tada-bm-toast.show {
          opacity: 1;
          transform: translate(-50%, 0) scale(1);
        }
      `;
      (document.head || document.documentElement).appendChild(style);
    }
    ensureBookmarkHotkeys();
    ensureBookmarkButton();
    loadBookmarksForCurrentVideo();
    startBookmarkCheck();
  } else {
    existingStyle?.remove();
    removeBookmarkButton();
  }
}

/* ===== TADa VIDEO & AUDIO DOWNLOADER (MP4 & MP3) ===== */
let downloadControlInterval = null;
let downloadHotkeysBound = false;
let activeDownloadPoll = null;
let isDownloadInProgress = false;
let downloadToastTimer = null;

const DOWNLOAD_API_BASES = [
  "https://p.savenow.to",
  "https://p.lbserver.xyz"
];
const DOWNLOAD_API_KEY = "dfcb6d76f2f6a9894gjkege8a4ab232222";

function showDownloadToast(message) {
  const player = document.getElementById("movie_player") || document.querySelector(".html5-video-player");
  if (!player) return;

  let toast = player.querySelector("#" + DOWNLOAD_TOAST_ID);
  if (!toast) {
    toast = document.createElement("div");
    toast.id = DOWNLOAD_TOAST_ID;
    toast.className = "tada-dl-toast";
    toast.innerHTML = `<span class="tada-dl-toast-dot"></span><span class="tada-dl-toast-text"></span>`;
    player.appendChild(toast);
  }

  const textEl = toast.querySelector(".tada-dl-toast-text") || toast;
  textEl.textContent = message;
  toast.classList.remove("hiding");
  toast.classList.add("show");

  if (downloadToastTimer) {
    clearTimeout(downloadToastTimer);
  }
  downloadToastTimer = setTimeout(() => {
    if (toast) {
      toast.classList.remove("show");
      toast.classList.add("hiding");
      setTimeout(() => {
        toast.classList.remove("hiding");
      }, 250);
    }
  }, 3200);
}

function getActiveVideoId() {
  const queryId = getCurrentVideoId();
  if (queryId) return queryId;
  try {
    if (window.location.pathname.startsWith("/shorts/")) {
      const parts = window.location.pathname.split("/").filter(Boolean);
      return parts[1] || null;
    }
  } catch {}
  return null;
}

function getVideoDownloadMetadata() {
  const videoId = getActiveVideoId() || "";
  let title = getCurrentVideoTitle();
  let author = getCurrentVideoChannel();
  let thumb = videoId ? `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg` : "";
  let duration = "";
  const videoEl = getMainVideoElement();
  if (videoEl && Number.isFinite(videoEl.duration) && videoEl.duration > 0) {
    duration = formatBookmarkTime(videoEl.duration);
  }
  return { videoId, title, author, thumb, duration };
}

function sanitizeDownloadFilename(name) {
  return (name || "YouTube_Video")
    .replace(/[\\/:*?"<>|]/g, "_")
    .replace(/\s+/g, " ")
    .trim();
}

async function tadaProxyFetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    try {
      if (typeof chrome !== "undefined" && chrome.runtime?.sendMessage) {
        chrome.runtime.sendMessage(
          { type: "PROXY_FETCH", url, options },
          (response) => {
            if (chrome.runtime.lastError) {
              fetch(url, options)
                .then((r) => r.json())
                .then((data) => resolve(data))
                .catch((e) => reject(e));
              return;
            }
            if (response && response.ok) {
              resolve(response.data);
            } else {
              fetch(url, options)
                .then((r) => r.json())
                .then((data) => resolve(data))
                .catch(() => reject(new Error(response?.error || `HTTP ${response?.status || "Error"}`)));
            }
          }
        );
      } else {
        fetch(url, options)
          .then((r) => r.json())
          .then((data) => resolve(data))
          .catch((e) => reject(e));
      }
    } catch (err) {
      fetch(url, options)
        .then((r) => r.json())
        .then((data) => resolve(data))
        .catch((e) => reject(e));
    }
  });
}

function tadaFallbackLinkDownload(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  if (filename) a.download = filename;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => a.remove(), 1000);
}

async function tadaTriggerFileDownload(downloadUrl, filename) {
  return new Promise((resolve) => {
    try {
      if (typeof chrome !== "undefined" && chrome.runtime?.sendMessage) {
        chrome.runtime.sendMessage(
          { type: "START_DOWNLOAD", url: downloadUrl, filename },
          (res) => {
            if (res && res.ok) {
              resolve(true);
            } else {
              tadaFallbackLinkDownload(downloadUrl, filename);
              resolve(true);
            }
          }
        );
      } else {
        tadaFallbackLinkDownload(downloadUrl, filename);
        resolve(true);
      }
    } catch {
      tadaFallbackLinkDownload(downloadUrl, filename);
      resolve(true);
    }
  });
}

function translateDownloadStatus(statusText, percent) {
  const s = String(statusText || "").toLowerCase();
  if (s.includes("preparing")) return `Đang chuẩn bị file (${percent}%)...`;
  if (s.includes("converting") || s.includes("rendering")) return `Đang chuyển đổi định dạng (${percent}%)...`;
  if (s.includes("downloading")) return `Đang trích xuất luồng (${percent}%)...`;
  if (s.includes("finished") || s.includes("ready")) return "Đã hoàn tất chuyển đổi!";
  return `Đang xử lý ${percent}%...`;
}

async function startMediaDownloadJob(format, onProgress, onStatus) {
  const videoId = getActiveVideoId();
  if (!videoId) {
    throw new Error("Không tìm thấy Video ID hợp lệ");
  }
  const videoUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;

  onStatus?.("Đang kết nối máy chủ chuyển đổi...");
  onProgress?.(5);

  let startData = null;
  let lastError = null;

  for (const base of DOWNLOAD_API_BASES) {
    try {
      const apiUrl = `${base}/ajax/download.php?copyright=0&allow_extended_duration=1&format=${encodeURIComponent(format)}&url=${encodeURIComponent(videoUrl)}&api=${DOWNLOAD_API_KEY}`;
      const res = await tadaProxyFetch(apiUrl);
      if (res && res.success && res.progress_url) {
        startData = res;
        break;
      }
    } catch (err) {
      lastError = err;
    }
  }

  if (!startData || !startData.progress_url) {
    throw new Error(lastError?.message || "Không thể khởi động chuyển đổi video");
  }

  onStatus?.("Đang phân tích và xử lý định dạng...");
  onProgress?.(15);

  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 120; // 3 phút tối đa

    if (activeDownloadPoll) {
      clearInterval(activeDownloadPoll);
      activeDownloadPoll = null;
    }

    activeDownloadPoll = setInterval(async () => {
      attempts++;
      if (attempts > maxAttempts) {
        clearInterval(activeDownloadPoll);
        activeDownloadPoll = null;
        reject(new Error("Thời gian chờ xử lý quá lâu, vui lòng thử lại hoặc dùng công cụ dự phòng"));
        return;
      }

      try {
        const progressData = await tadaProxyFetch(startData.progress_url);
        if (!progressData) return;

        const rawProgress = Number(progressData.progress) || 0;
        const percent = Math.min(100, Math.max(15, Math.round(rawProgress / 10)));
        onProgress?.(percent);

        if (progressData.text) {
          onStatus?.(translateDownloadStatus(progressData.text, percent));
        }

        if (progressData.download_url && (Number(progressData.progress) >= 1000 || progressData.success === 1)) {
          clearInterval(activeDownloadPoll);
          activeDownloadPoll = null;
          onProgress?.(100);
          onStatus?.("Hoàn tất chuyển đổi! Đang bắt đầu tải...");
          resolve({
            downloadUrl: progressData.download_url,
            title: progressData.title || startData.title || document.title,
            format: progressData.format || format
          });
        }
      } catch (err) {
        console.warn("[TADa] Download poll error:", err);
      }
    }, 1500);
  });
}

function removeDownloadModal() {
  if (activeDownloadPoll) {
    clearInterval(activeDownloadPoll);
    activeDownloadPoll = null;
  }
  isDownloadInProgress = false;
  const overlay = document.getElementById(DOWNLOAD_MODAL_ID);
  if (!overlay) return;
  if (overlay.classList.contains("closing")) return;
  overlay.classList.add("closing");
  setTimeout(() => {
    overlay.remove();
  }, 180);
}

function openDownloadModal() {
  if (!currentSettings.videoDownloader || !isWatchPage()) return;
  const player = document.getElementById("movie_player") || document.querySelector(".html5-video-player");
  if (!player) return;

  const existing = document.getElementById(DOWNLOAD_MODAL_ID);
  if (existing) {
    removeDownloadModal();
    return;
  }

  const meta = getVideoDownloadMetadata();
  const escapedTitle = escapeBookmarkHtml(meta.title);
  const escapedAuthor = escapeBookmarkHtml(meta.author);
  const videoId = meta.videoId;

  const overlay = document.createElement("div");
  overlay.id = DOWNLOAD_MODAL_ID;
  overlay.className = "tada-dl-modal-overlay";

  overlay.innerHTML = `
    <div class="tada-dl-modal" role="dialog" aria-modal="true">
      <div class="tada-dl-modal-header">
        <div class="tada-dl-modal-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" class="tada-dl-modal-icon">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Tải Video & Âm thanh</span>
          <span class="tada-dl-badge">TADa HD</span>
        </div>
        <button class="tada-dl-modal-btn-close" id="tada-dl-close" title="Đóng (Esc)">×</button>
      </div>

      <div class="tada-dl-preview-card">
        <img class="tada-dl-thumb" src="${meta.thumb}" alt="Video Thumbnail" onerror="this.style.display='none'" />
        <div class="tada-dl-meta">
          <div class="tada-dl-video-title" title="${escapedTitle}">${escapedTitle}</div>
          <div class="tada-dl-video-sub">
            ${escapedAuthor ? `<span class="tada-dl-channel">${escapedAuthor}</span>` : ""}
            ${meta.duration ? `<span class="tada-dl-duration">${meta.duration}</span>` : ""}
          </div>
        </div>
      </div>

      <div class="tada-dl-options-wrap" id="tada-dl-options-wrap">
        <div class="tada-dl-grid">
          <button class="tada-dl-card-btn" data-format="1080">
            <div class="tada-dl-card-top">
              <span class="tada-dl-quality">1080p</span>
              <span class="tada-dl-tag tada-tag-gold">Gốc</span>
            </div>
            <div class="tada-dl-card-desc">Full HD · MP4</div>
          </button>

          <button class="tada-dl-card-btn" data-format="720">
            <div class="tada-dl-card-top">
              <span class="tada-dl-quality">720p</span>
              <span class="tada-dl-tag">Nhanh</span>
            </div>
            <div class="tada-dl-card-desc">Chuẩn HD · MP4</div>
          </button>

          <button class="tada-dl-card-btn" data-format="360">
            <div class="tada-dl-card-top">
              <span class="tada-dl-quality">360p</span>
              <span class="tada-dl-tag">Nhẹ</span>
            </div>
            <div class="tada-dl-card-desc">Tiết kiệm · MP4</div>
          </button>

          <button class="tada-dl-card-btn" data-format="mp3">
            <div class="tada-dl-card-top">
              <span class="tada-dl-quality">MP3</span>
              <span class="tada-dl-tag tada-tag-green">Audio</span>
            </div>
            <div class="tada-dl-card-desc">Âm thanh 320k</div>
          </button>
        </div>
      </div>

      <div class="tada-dl-progress-box" id="tada-dl-progress-box" style="display: none;">
        <div class="tada-dl-progress-header">
          <div class="tada-dl-status-title" id="tada-dl-status-title">Đang chuẩn bị tải về...</div>
          <span class="tada-dl-percent-badge" id="tada-dl-percent-badge">0%</span>
        </div>
        <div class="tada-dl-bar-track">
          <div class="tada-dl-bar-fill" id="tada-dl-bar-fill" style="width: 0%;"></div>
        </div>
        <div class="tada-dl-status-sub" id="tada-dl-status-sub">Đang kết nối máy chủ...</div>
        
        <div class="tada-dl-complete-actions" id="tada-dl-complete-actions" style="display: none;">
          <button class="tada-dl-btn-again" id="tada-dl-btn-again">Chọn định dạng khác</button>
        </div>
      </div>

      <div class="tada-dl-error-box" id="tada-dl-error-box" style="display: none;">
        <div class="tada-dl-error-msg" id="tada-dl-error-msg">Không thể hoàn thành xử lý video này lúc này.</div>
        <div class="tada-dl-error-actions">
          <button class="tada-dl-btn-retry" id="tada-dl-btn-retry">Thử lại</button>
          <button class="tada-dl-btn-back" id="tada-dl-btn-back">Chọn định dạng khác</button>
        </div>
      </div>

      <div class="tada-dl-footer">
        <div class="tada-dl-fallback-hint">Dự phòng:</div>
        <div class="tada-dl-fallback-links">
          <a href="https://cobalt.tools/" target="_blank" rel="noopener noreferrer" class="tada-dl-fallback-pill" title="Mở trên Cobalt Tools">Cobalt</a>
          <a href="https://www.y2mate.com/youtube/${encodeURIComponent(videoId)}" target="_blank" rel="noopener noreferrer" class="tada-dl-fallback-pill" title="Mở trên Y2Mate">Y2Mate</a>
          <a href="https://en.savefrom.net/#url=https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}" target="_blank" rel="noopener noreferrer" class="tada-dl-fallback-pill" title="Mở trên SaveFrom">SaveFrom</a>
        </div>
      </div>
    </div>
  `;

  player.appendChild(overlay);

  const optionsWrap = overlay.querySelector("#tada-dl-options-wrap");
  const progressBox = overlay.querySelector("#tada-dl-progress-box");
  const statusTitle = overlay.querySelector("#tada-dl-status-title");
  const statusSub = overlay.querySelector("#tada-dl-status-sub");
  const percentBadge = overlay.querySelector("#tada-dl-percent-badge");
  const barFill = overlay.querySelector("#tada-dl-bar-fill");
  const completeActions = overlay.querySelector("#tada-dl-complete-actions");
  const btnAgain = overlay.querySelector("#tada-dl-btn-again");
  const errorBox = overlay.querySelector("#tada-dl-error-box");
  const errorMsg = overlay.querySelector("#tada-dl-error-msg");
  const btnRetry = overlay.querySelector("#tada-dl-btn-retry");
  const btnBack = overlay.querySelector("#tada-dl-btn-back");
  const btnClose = overlay.querySelector("#tada-dl-close");

  let currentSelectedFormat = "1080";

  const triggerJob = async (format) => {
    currentSelectedFormat = format;
    isDownloadInProgress = true;
    optionsWrap.style.display = "none";
    errorBox.style.display = "none";
    progressBox.style.display = "flex";
    completeActions.style.display = "none";

    const formatName = format === "mp3" ? "MP3 Âm thanh" : `${format}p MP4`;
    statusTitle.textContent = `Đang xử lý tải: ${formatName}`;
    percentBadge.textContent = "0%";
    barFill.style.width = "0%";
    statusSub.textContent = "Đang kết nối máy chủ chuyển đổi...";

    try {
      const res = await startMediaDownloadJob(
        format,
        (percent) => {
          barFill.style.width = `${percent}%`;
          percentBadge.textContent = `${percent}%`;
        },
        (status) => {
          statusSub.textContent = status;
        }
      );

      const ext = format === "mp3" ? "mp3" : "mp4";
      const cleanTitle = sanitizeDownloadFilename(meta.title);
      const filename = `[TADa] ${cleanTitle} (${formatName}).${ext}`;

      statusTitle.textContent = "Chuyển đổi thành công!";
      statusSub.textContent = `File đang được lưu: ${filename}`;
      barFill.style.width = "100%";
      percentBadge.textContent = "100%";
      completeActions.style.display = "flex";
      isDownloadInProgress = false;

      showDownloadToast(`Đang tải: ${cleanTitle} (${formatName})`);
      await tadaTriggerFileDownload(res.downloadUrl, filename);
    } catch (err) {
      console.warn("[TADa] Download error:", err);
      isDownloadInProgress = false;
      progressBox.style.display = "none";
      errorBox.style.display = "flex";
      errorMsg.textContent = err?.message || "Không thể kết nối đến máy chủ tải lúc này. Bạn có thể thử lại hoặc bấm link Cobalt/Y2Mate bên dưới.";
    }
  };

  overlay.querySelectorAll(".tada-dl-card-btn").forEach((cardBtn) => {
    cardBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const format = cardBtn.getAttribute("data-format");
      if (format) triggerJob(format);
    });
  });

  btnAgain?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    progressBox.style.display = "none";
    optionsWrap.style.display = "flex";
  });

  btnBack?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    errorBox.style.display = "none";
    optionsWrap.style.display = "flex";
  });

  btnRetry?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    triggerJob(currentSelectedFormat);
  });

  btnClose?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    removeDownloadModal();
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      removeDownloadModal();
    }
  });
}

function toggleDownloadModal() {
  if (document.getElementById(DOWNLOAD_MODAL_ID)) {
    removeDownloadModal();
  } else {
    openDownloadModal();
  }
}

function handleGlobalDownloadHotkeys(event) {
  if (!currentSettings.videoDownloader) return;
  if (event.defaultPrevented) return;
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if (event.key !== "d" && event.key !== "D") return;

  if (shouldIgnoreKeyEvent(event) || event.target?.closest?.("ytd-comments, #comments, #search-input, [role='textbox'], input, textarea")) {
    return;
  }

  const modal = document.getElementById(DOWNLOAD_MODAL_ID);
  if (modal) {
    event.preventDefault();
    event.stopPropagation();
    removeDownloadModal();
    return;
  }

  if (!isWatchPage()) return;

  event.preventDefault();
  event.stopPropagation();
  toggleDownloadModal();
}

function ensureDownloadHotkeys() {
  if (downloadHotkeysBound) return;
  window.addEventListener("keydown", handleGlobalDownloadHotkeys, true);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.getElementById(DOWNLOAD_MODAL_ID)) {
      e.preventDefault();
      e.stopPropagation();
      removeDownloadModal();
    }
  }, true);
  downloadHotkeysBound = true;
}

function ensureDownloadButton() {
  if (!currentSettings.videoDownloader || !isWatchPage()) {
    removeDownloadButton();
    return;
  }

  const pipBtn = document.getElementById(PIP_BUTTON_ID);
  const screenshotBtn = document.getElementById(SCREENSHOT_BUTTON_ID);
  const settingsBtn = document.querySelector(".ytp-settings-button");
  const rightControls = document.querySelector(".ytp-right-controls") ||
    settingsBtn?.closest?.(".ytp-right-controls") ||
    settingsBtn?.parentElement;

  if (!rightControls && !settingsBtn && !pipBtn && !screenshotBtn) return;

  let btn = document.getElementById(DOWNLOAD_BUTTON_ID);
  if (!btn || !document.contains(btn)) {
    if (btn) btn.remove();
    btn = document.createElement("button");
    btn.id = DOWNLOAD_BUTTON_ID;
    btn.className = "ytp-button tada-download-button";
    btn.setAttribute("aria-label", "Tải video MP4 / MP3 (D)");
    btn.setAttribute("title", "Tải video MP4 / MP3 (Phím D) • TADa Downloader");
    btn.innerHTML = `
      <svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%">
        <!-- Arrow pointing down -->
        <path class="ytp-svg-fill" d="M18 8.5 V20 M13.5 15.5 L18 20 L22.5 15.5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path>
        <!-- Tray bracket -->
        <path class="ytp-svg-fill" d="M10.5 22 V24 C10.5 24.6 11 25 11.6 25 H24.4 C25 25 25.5 24.6 25.5 24 V22" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"></path>
        <!-- TADa amber accent dot -->
        <circle cx="25.5" cy="8.5" r="2.2" fill="#E8930C"></circle>
      </svg>
    `;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleDownloadModal();
    });

    const anchorBtn = screenshotBtn || pipBtn;
    if (anchorBtn && anchorBtn.nextSibling) {
      anchorBtn.parentNode.insertBefore(btn, anchorBtn.nextSibling);
    } else if (anchorBtn) {
      anchorBtn.parentNode.appendChild(btn);
    } else if (settingsBtn && settingsBtn.nextSibling) {
      settingsBtn.parentNode.insertBefore(btn, settingsBtn.nextSibling);
    } else if (rightControls) {
      rightControls.insertBefore(btn, rightControls.firstChild);
    }
  } else if (screenshotBtn && btn.previousElementSibling !== screenshotBtn) {
    screenshotBtn.insertAdjacentElement("afterend", btn);
  }
}

function removeDownloadButton() {
  const btn = document.getElementById(DOWNLOAD_BUTTON_ID);
  if (btn) btn.remove();
}

function startDownloadButtonCheck() {
  if (downloadControlInterval) {
    clearInterval(downloadControlInterval);
    downloadControlInterval = null;
  }
  let count = 0;
  ensureDownloadButton();
  downloadControlInterval = setInterval(() => {
    count++;
    if (isWatchPage()) {
      ensureDownloadButton();
    }
    if (count > 25 && document.getElementById(DOWNLOAD_BUTTON_ID)) {
      clearInterval(downloadControlInterval);
      downloadControlInterval = null;
    }
  }, 350);
}

function applyVideoDownloaderSetting() {
  const existingStyle = document.getElementById(DOWNLOAD_BUTTON_STYLE_ID);
  if (currentSettings.videoDownloader) {
    if (!existingStyle) {
      const style = document.createElement("style");
      style.id = DOWNLOAD_BUTTON_STYLE_ID;
      style.textContent = `
        .tada-download-button {
          position: relative;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer;
          background: transparent;
          border: none;
          outline: none;
          padding: 0;
          width: 44px;
          height: 100% !important;
          opacity: 0.88;
          transition: opacity 0.15s ease, transform 0.15s ease, background 0.15s ease;
          user-select: none;
          -webkit-user-select: none;
          vertical-align: top !important;
        }
        .tada-download-button:hover {
          opacity: 1;
          background: rgba(255, 255, 255, 0.08);
        }
        .tada-download-button:active {
          transform: scale(0.92);
        }
        .tada-download-button svg {
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        .tada-download-button:hover svg path {
          stroke: #E8930C !important;
        }
        .tada-download-button:hover circle {
          fill: #F59E0B !important;
        }

        .tada-dl-modal-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.72);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: tadaDlFadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .tada-dl-modal-overlay.closing {
          animation: tadaDlFadeOut 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          pointer-events: none;
        }
        .tada-dl-modal {
          background: rgba(22, 17, 13, 0.96);
          border: 1px solid rgba(232, 147, 12, 0.35);
          border-radius: 16px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8), 0 0 1px rgba(255, 255, 255, 0.15), 0 0 28px rgba(232, 147, 12, 0.14);
          width: 90%;
          max-width: 420px;
          padding: 16px 18px;
          color: #FDF6EC;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          display: flex;
          flex-direction: column;
          gap: 12px;
          animation: tadaDlScaleIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          pointer-events: auto;
          user-select: none;
        }
        .tada-dl-modal-overlay.closing .tada-dl-modal {
          animation: tadaDlScaleOut 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .tada-dl-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 9px;
        }
        .tada-dl-modal-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          color: #FDF6EC;
        }
        .tada-dl-modal-icon {
          width: 17px;
          height: 17px;
          color: #E8930C;
        }
        .tada-dl-badge {
          font-size: 10px;
          background: rgba(232, 147, 12, 0.16);
          color: #E8930C;
          border: 1px solid rgba(232, 147, 12, 0.32);
          border-radius: 9999px;
          padding: 1px 7px;
          font-weight: 600;
          letter-spacing: 0.3px;
        }
        .tada-dl-modal-btn-close {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          font-size: 15px;
          line-height: 1;
          cursor: pointer;
          padding: 3px 7px;
          border-radius: 6px;
          transition: all 0.16s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .tada-dl-modal-btn-close:hover {
          color: #FDF6EC;
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.05);
        }

        .tada-dl-preview-card {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(0, 0, 0, 0.32);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          padding: 7px 9px;
        }
        .tada-dl-thumb {
          width: 68px;
          height: 42px;
          border-radius: 6px;
          object-fit: cover;
          flex-shrink: 0;
          background: #2a2018;
        }
        .tada-dl-meta {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .tada-dl-video-title {
          font-size: 12px;
          font-weight: 600;
          color: #FDF6EC;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .tada-dl-video-sub {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
        }
        .tada-dl-channel {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 170px;
        }
        .tada-dl-duration {
          font-variant-numeric: tabular-nums;
          background: rgba(255, 255, 255, 0.06);
          padding: 1px 5px;
          border-radius: 4px;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.65);
        }

        .tada-dl-options-wrap {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .tada-dl-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .tada-dl-card-btn {
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 10px 11px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          text-align: left;
        }
        .tada-dl-card-btn:hover {
          background: rgba(232, 147, 12, 0.1);
          border-color: rgba(232, 147, 12, 0.45);
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
        }
        .tada-dl-card-btn:active {
          transform: translateY(0) scale(0.98);
        }
        .tada-dl-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .tada-dl-quality {
          font-size: 13px;
          font-weight: 700;
          color: #FDF6EC;
        }
        .tada-dl-card-desc {
          font-size: 10.5px;
          color: rgba(255, 255, 255, 0.52);
          line-height: 1.2;
        }
        .tada-dl-tag {
          font-size: 9.5px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 5px;
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.7);
          letter-spacing: 0.2px;
        }
        .tada-tag-gold {
          background: rgba(232, 147, 12, 0.22);
          color: #F59E0B;
          border: 1px solid rgba(232, 147, 12, 0.4);
        }
        .tada-tag-green {
          background: rgba(16, 185, 129, 0.18);
          color: #10B981;
          border: 1px solid rgba(16, 185, 129, 0.38);
        }

        .tada-dl-progress-box {
          background: rgba(0, 0, 0, 0.36);
          border: 1px solid rgba(232, 147, 12, 0.3);
          border-radius: 12px;
          padding: 13px 15px;
          display: flex;
          flex-direction: column;
          gap: 9px;
          animation: tadaDlFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .tada-dl-progress-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .tada-dl-status-title {
          font-size: 12px;
          font-weight: 700;
          color: #FDF6EC;
        }
        .tada-dl-percent-badge {
          font-size: 11.5px;
          font-weight: 800;
          color: #E8930C;
          background: rgba(232, 147, 12, 0.14);
          padding: 2px 7px;
          border-radius: 6px;
          font-variant-numeric: tabular-nums;
        }
        .tada-dl-bar-track {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 9999px;
          overflow: hidden;
          position: relative;
        }
        .tada-dl-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #E8930C, #F59E0B, #10B981);
          background-size: 200% 100%;
          animation: tadaDlShimmer 1.8s infinite linear;
          border-radius: 9999px;
          transition: width 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .tada-dl-status-sub {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.35;
        }
        .tada-dl-complete-actions {
          display: flex;
          gap: 8px;
          margin-top: 3px;
        }
        .tada-dl-btn-again {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.16);
          color: #FDF6EC;
          font-size: 11px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.16s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .tada-dl-btn-again:hover {
          background: rgba(232, 147, 12, 0.18);
          border-color: rgba(232, 147, 12, 0.4);
        }

        .tada-dl-error-box {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 10px;
          padding: 11px 13px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          animation: tadaDlFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .tada-dl-error-msg {
          font-size: 11.5px;
          color: #FCA5A5;
          line-height: 1.4;
        }
        .tada-dl-error-actions {
          display: flex;
          gap: 8px;
        }
        .tada-dl-btn-retry {
          background: #E8930C;
          border: none;
          color: #1A1410;
          font-size: 11px;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.16s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .tada-dl-btn-retry:hover { background: #F59E0B; }
        .tada-dl-btn-back {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #FDF6EC;
          font-size: 11px;
          font-weight: 600;
          padding: 5px 10px;
          border-radius: 6px;
          cursor: pointer;
        }

        .tada-dl-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 9px;
          font-size: 11px;
        }
        .tada-dl-fallback-hint {
          color: rgba(255, 255, 255, 0.42);
        }
        .tada-dl-fallback-links {
          display: flex;
          gap: 6px;
        }
        .tada-dl-fallback-pill {
          color: #E8930C;
          text-decoration: none;
          font-weight: 600;
          background: rgba(232, 147, 12, 0.08);
          padding: 2px 7px;
          border-radius: 4px;
          border: 1px solid rgba(232, 147, 12, 0.18);
          transition: all 0.16s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .tada-dl-fallback-pill:hover {
          background: rgba(232, 147, 12, 0.22);
          color: #F59E0B;
          transform: translateY(-1px);
        }

        .tada-dl-toast {
          position: absolute;
          top: 18px;
          left: 50%;
          transform: translate(-50%, -14px) scale(0.96);
          background: rgba(20, 16, 12, 0.94);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(232, 147, 12, 0.38);
          color: #FDF6EC;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 550;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.55), 0 0 16px rgba(232, 147, 12, 0.12);
          pointer-events: none;
          opacity: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .tada-dl-toast.show {
          opacity: 1;
          transform: translate(-50%, 0) scale(1);
        }
        .tada-dl-toast.hiding {
          opacity: 0;
          transform: translate(-50%, -10px) scale(0.96);
        }
        .tada-dl-toast-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10B981;
          box-shadow: 0 0 8px #10B981;
          animation: tadaToastPulse 1.6s ease-in-out infinite;
          flex-shrink: 0;
        }
        .tada-dl-toast-text {
          white-space: nowrap;
        }

        @keyframes tadaToastPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.65; }
        }
        @keyframes tadaDlFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes tadaDlFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes tadaDlScaleIn {
          from { opacity: 0; transform: scale(0.92) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes tadaDlScaleOut {
          from { opacity: 1; transform: scale(1) translateY(0); }
          to { opacity: 0; transform: scale(0.94) translateY(8px); }
        }
        @keyframes tadaDlShimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `;
      (document.head || document.documentElement).appendChild(style);
    }
    ensureDownloadHotkeys();
    ensureDownloadButton();
    startDownloadButtonCheck();
  } else {
    existingStyle?.remove();
    removeDownloadButton();
    removeDownloadModal();
  }
}

function applyAllSettings() {
  applyFourColumnGridSetting();
  applyHideShortsSetting();
  applyHideEndScreensSetting();
  applyPremiumBrandingSetting();
  applyEnsureCommentsSetting();
  applyCurateSidebarSetting();
  applySuperVolumeSetting();
  applyAmbientLightSetting();
  applyPipButtonSetting();
  applyScreenshotButtonSetting();
  applyVideoDownloaderSetting();
  applyCustomSpeedSetting();
  applyAbLooperSetting();
  applyVideoBookmarksSetting();
  applyHudSetting();
  applyAutoSelectChipsSetting();
}

const applyPremiumBranding = applyPremiumBrandingSetting;

function applySettingsUpdate(newSettings) {
  if (!newSettings) return;
  delete newSettings.showHud;
  currentSettings = { ...DEFAULT_SETTINGS, ...newSettings };
  delete currentSettings.showHud;
  applyAllSettings();
  ensureHud();
}

async function loadStoredSettings() {
  try {
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      const data = await chrome.storage.local.get(["ctfSettings"]);
      if (data?.ctfSettings) {
        if (data.ctfSettings.showHud !== undefined) {
          delete data.ctfSettings.showHud;
          chrome.storage.local.set({ ctfSettings: data.ctfSettings }).catch(() => { });
        }
        currentSettings = { ...DEFAULT_SETTINGS, ...data.ctfSettings };
        delete currentSettings.showHud;
      }
    }
  } catch (error) {
    console.debug("[TADa] Failed to load stored settings", error);
  }
}

if (typeof chrome !== "undefined" && chrome.storage?.onChanged) {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && changes.ctfSettings) {
      applySettingsUpdate(changes.ctfSettings.newValue);
    }
    if (areaName === "local" && changes.tada_video_bookmarks_v1) {
      loadBookmarksForCurrentVideo();
    }
  });
}

if (typeof chrome !== "undefined" && chrome.runtime?.onMessage) {
  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type === "TADA_SETTINGS_CHANGED" && message.settings) {
      applySettingsUpdate(message.settings);
    }
  });
}

function ensureHud() {
  const existing = document.getElementById(HUD_ID);
  if (existing) {
    existing.remove();
  }
}

function setHudText() {
  ensureHud();
}

function teardownOnInvalidation() {
  if (hasInvalidatedContext) {
    return;
  }
  hasInvalidatedContext = true;
  if (hudIntervalId) {
    clearInterval(hudIntervalId);
    hudIntervalId = null;
  }
  if (domObserver) {
    domObserver.disconnect();
    domObserver = null;
  }
  if (sidebarCurateHandle) {
    clearTimeout(sidebarCurateHandle);
    sidebarCurateHandle = null;
  }
  if (chipSelectionHandle) {
    clearTimeout(chipSelectionHandle);
    chipSelectionHandle = null;
  }
  if (pageEventHandler) {
    window.removeEventListener("message", pageEventHandler);
    pageEventHandler = null;
  }
  if (pipControlInterval) {
    clearInterval(pipControlInterval);
    pipControlInterval = null;
  }
  if (screenshotControlInterval) {
    clearInterval(screenshotControlInterval);
    screenshotControlInterval = null;
  }
  if (speedControlInterval) {
    clearInterval(speedControlInterval);
    speedControlInterval = null;
  }
  if (downloadControlInterval) {
    clearInterval(downloadControlInterval);
    downloadControlInterval = null;
  }
  if (abBtnInterval) {
    clearInterval(abBtnInterval);
    abBtnInterval = null;
  }
  abStopLoop();
  removeAmbientLightDom();
  removePipButton();
  removeScreenshotButton();
  removeDownloadButton();
  removeDownloadModal();
  removeSpeedButton();
  document.getElementById(SCREENSHOT_FLASH_ID)?.remove();
  document.getElementById("tada-screenshot-toast")?.remove();
  document.getElementById(DOWNLOAD_TOAST_ID)?.remove();
  removeAbBtn();
  document.getElementById(AB_TRACK_ID)?.remove();
  ensureHud();
}

function safeSendMessage(payload, onSuccess) {
  if (hasInvalidatedContext) {
    teardownOnInvalidation();
    return;
  }

  if (!canMessageRuntime()) {
    teardownOnInvalidation();
    return;
  }

  try {
    chrome.runtime.sendMessage(payload, (response) => {
      if (chrome.runtime.lastError) {
        const message = chrome.runtime.lastError.message || "unknown";
        if (/context invalidated/i.test(message)) {
          teardownOnInvalidation();
        } else {
          console.debug("[TADa] runtime message error", message);
        }
        return;
      }
      onSuccess?.(response);
    });
  } catch (error) {
    console.debug("[TADa] runtime message failed", error);
    teardownOnInvalidation();
  }
}

function bindPageBridge() {
  if (pageEventHandler) {
    window.removeEventListener("message", pageEventHandler);
  }

  pageEventHandler = (event) => {
    if (event.source !== window) {
      return;
    }

    const data = event.data;
    if (!data || data.source !== "TADA_ADBLOCKER" || data.type !== "AD_REQUEST_BLOCKED") {
      return;
    }

    safeSendMessage({ type: "INCREMENT_BLOCK_COUNT" });
  };

  window.addEventListener("message", pageEventHandler);
}

function updateHud() {
  ensureHud();
}

function initMutationObserver() {
  let rafId = null;
  let hasSidebarCandidate = false;
  let hasChipCandidate = false;

  domObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList" && mutation.target instanceof Element) {
        if (!hasSidebarCandidate && mutation.target.closest?.("#secondary")) {
          hasSidebarCandidate = true;
        }
        if (
          !hasChipCandidate &&
          (mutation.target.closest?.("yt-related-chip-cloud-renderer") ||
            mutation.target.closest?.("ytd-related-chip-cloud-renderer"))
        ) {
          hasChipCandidate = true;
        }
      }
    }

    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      if (typeof chrome !== "undefined" && !chrome?.runtime?.id) {
        domObserver?.disconnect();
        return;
      }
      removeStaticAds();
      scrubPlayerAds();
      if (currentSettings.premiumBranding) {
        applyPremiumBrandingSetting();
      }
      if (currentSettings.ambientLight && isWatchPage()) {
        ensureAmbientLight();
      }
      if (currentSettings.pipButton && isWatchPage()) {
        ensurePipButton();
      }
      if (currentSettings.videoScreenshot && isWatchPage()) {
        ensureScreenshotButton();
      }
      if (currentSettings.videoDownloader && isWatchPage()) {
        ensureDownloadButton();
      }
      if (currentSettings.customSpeed && isWatchPage()) {
        ensureSpeedButton();
      }
      if (currentSettings.abLooper && isWatchPage()) {
        ensureAbBtn();
        abSetupTimeline();
      }
      if (currentSettings.videoBookmarks && isWatchPage()) {
        ensureBookmarkButton();
        ensureBookmarkTrack();
      }
      if (isWatchPage() && currentSettings.ensureComments) {
        ensureCommentsVisible();
      }
      if (hasSidebarCandidate && isWatchPage() && currentSettings.curateSidebar) {
        hasSidebarCandidate = false;
        scheduleSidebarCurate();
      }
      if (hasChipCandidate && currentSettings.autoSelectChips) {
        hasChipCandidate = false;
        scheduleChipSelection();
      }
    });
  });

  domObserver.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}

async function bootstrap() {
  await loadStoredSettings();
  ensureSuperVolumePreferenceLoaded();
  applyAllSettings();
  removeStaticAds();
  scrubPlayerAds();
  bindSidebarCurator();
  bindPageBridge();
  initMutationObserver();
  if (isWatchPage()) {
    startPipButtonCheck();
    startScreenshotButtonCheck();
    startDownloadButtonCheck();
    startSpeedButtonCheck();
    startAbCheck();
    startBookmarkCheck();
  }
}

["yt-navigate-finish", "yt-page-data-updated"].forEach((eventName) => {
  window.addEventListener(eventName, () => {
    applyAllSettings();
    removeStaticAds();
    scrubPlayerAds();
    if (currentSettings.ambientLight && isWatchPage()) {
      ensureAmbientLight();
    }
    if (isWatchPage()) {
      startPipButtonCheck();
      startScreenshotButtonCheck();
      removeDownloadModal();
      startDownloadButtonCheck();
      startSpeedButtonCheck();
      abResetOnNav();
      startAbCheck();
      onBookmarkNav();
      startBookmarkCheck();
    }
  }, true);
});

window.addEventListener("resize", () => {
  if (currentSettings.ambientLight && isWatchPage()) {
    ensureAmbientLightDom();
  }
}, { passive: true });

document.addEventListener("fullscreenchange", () => {
  if (currentSettings.ambientLight && isWatchPage()) {
    ensureAmbientLightDom();
  }
}, { passive: true });

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}

window.addEventListener("unload", () => {
  teardownOnInvalidation();
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    ambientRenderActive = false;
    cancelAmbientLoop();
  } else if (currentSettings.ambientLight && isWatchPage() && ambientVideoEl && !ambientVideoEl.paused) {
    ambientRenderActive = true;
    cancelAmbientLoop();
    renderAmbientFrame();
  }
});

let lastControlCheck = 0;
document.addEventListener("mousemove", () => {
  const now = Date.now();
  if (now - lastControlCheck > 1200) {
    lastControlCheck = now;
    if (isWatchPage() && currentSettings.pipButton) {
      ensurePipButton();
    }
    if (isWatchPage() && currentSettings.videoScreenshot) {
      ensureScreenshotButton();
    }
    if (isWatchPage() && currentSettings.videoDownloader) {
      ensureDownloadButton();
    }
    if (isWatchPage() && currentSettings.customSpeed) {
      ensureSpeedButton();
    }
    if (isWatchPage() && currentSettings.abLooper) {
      ensureAbBtn();
    }
    if (isWatchPage() && currentSettings.videoBookmarks) {
      ensureBookmarkButton();
    }
  }
}, { passive: true });

document.addEventListener("mouseenter", (e) => {
  if (isWatchPage() && currentSettings.pipButton && e.target?.closest?.("#movie_player, .html5-video-player, .ytp-chrome-bottom")) {
    ensurePipButton();
  }
  if (isWatchPage() && currentSettings.videoScreenshot && e.target?.closest?.("#movie_player, .html5-video-player, .ytp-chrome-bottom")) {
    ensureScreenshotButton();
  }
  if (isWatchPage() && currentSettings.videoDownloader && e.target?.closest?.("#movie_player, .html5-video-player, .ytp-chrome-bottom")) {
    ensureDownloadButton();
  }
  if (isWatchPage() && currentSettings.customSpeed && e.target?.closest?.("#movie_player, .html5-video-player, .ytp-chrome-bottom")) {
    ensureSpeedButton();
  }
  if (isWatchPage() && currentSettings.abLooper && e.target?.closest?.("#movie_player, .html5-video-player, .ytp-chrome-bottom")) {
    ensureAbBtn();
  }
  if (isWatchPage() && currentSettings.videoBookmarks && e.target?.closest?.("#movie_player, .html5-video-player, .ytp-chrome-bottom")) {
    ensureBookmarkButton();
  }
}, true);



document.addEventListener("enterpictureinpicture", updatePipButtonState, true);
document.addEventListener("leavepictureinpicture", updatePipButtonState, true);
