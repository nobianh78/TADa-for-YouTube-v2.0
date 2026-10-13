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
  tadaPopupButton: true
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
const TADA_POPUP_STYLE_ID = "tada-inplayer-popup-style";
const TADA_POPUP_BUTTON_ID = "tada-popup-button";
const TADA_INPLAYER_POPUP_ID = "tada-inplayer-popup";
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
    superVolumeAudioCtx.resume().catch(() => {});
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
      badge.textContent = "500% 🚀";
      badge.className = "ctf-volume-badge ctf-badge-max";
    } else if (rounded > 100) {
      badge.textContent = `${rounded}% 🔥`;
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
      badge.textContent = "500% 🚀";
      badge.className = "ctf-volume-badge ctf-badge-max";
    } else if (rounded > 100) {
      badge.textContent = `${rounded}% 🔥`;
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
    } catch (e) {}
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
    } catch (e) {}
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
  } catch {}
}

function cancelAmbientLoop() {
  if (ambientVideoEl && ambientFrameCallbackId && "cancelVideoFrameCallback" in ambientVideoEl) {
    try {
      ambientVideoEl.cancelVideoFrameCallback(ambientFrameCallbackId);
    } catch (e) {}
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

function ensurePipButton() {
  removePipButton();
}

function removePipButton() {
  const btn = document.getElementById(PIP_BUTTON_ID);
  if (btn) {
    btn.remove();
  }
}

function applyPipButtonSetting() {
  removePipButton();
  if (currentSettings.pipButton) {
    ensurePipHotkeys();
  }
}

/* ===== TADa IN-PLAYER QUICK POPUP CONTROLLER ===== */
let tadaInplayerPopupOpen = false;
let inplayerPopupDismissBound = false;

function persistSettingsChange() {
  try {
    if (typeof chrome !== "undefined" && chrome?.storage?.local) {
      chrome.storage.local.set({ ctfSettings: currentSettings }).catch(() => {});
    }
  } catch {}
}

function closeTadaInplayerPopup() {
  const popup = document.getElementById(TADA_INPLAYER_POPUP_ID);
  const btn = document.getElementById(TADA_POPUP_BUTTON_ID);
  btn?.classList.remove("tada-popup-active");
  if (popup) {
    popup.remove();
  }
  tadaInplayerPopupOpen = false;
}

async function toggleTadaInplayerPopup() {
  const existing = document.getElementById(TADA_INPLAYER_POPUP_ID);
  if (existing) {
    closeTadaInplayerPopup();
    return;
  }
  await openTadaInplayerPopup();
}

async function openTadaInplayerPopup() {
  closeTadaInplayerPopup();

  const player = document.getElementById("movie_player") || 
                 document.querySelector(".html5-video-player") || 
                 document.querySelector("#player") || 
                 document.body;
  if (!player) return;

  const btn = document.getElementById(TADA_POPUP_BUTTON_ID);
  btn?.classList.add("tada-popup-active");

  let blockedCount = 0;
  try {
    if (typeof chrome !== "undefined" && chrome?.storage?.local) {
      const data = await chrome.storage.local.get(["blockedRequestCount"]);
      blockedCount = data.blockedRequestCount || 0;
    }
  } catch {}

  const popup = document.createElement("div");
  popup.id = TADA_INPLAYER_POPUP_ID;

  let logoUrl = "";
  try {
    if (typeof chrome !== "undefined" && chrome?.runtime?.id) {
      logoUrl = chrome.runtime.getURL("icons/icon32.png");
    }
  } catch {}

  const vol = superVolumePercent || 100;
  const isBoost = vol > 100;
  const volBadgeText = isBoost ? `🔥 ${vol}%` : `${vol}%`;

  popup.innerHTML = `
    <div class="tada-ipp-header">
      <div class="tada-ipp-title-wrap">
        <img src="${logoUrl}" class="tada-ipp-logo" alt="TADa" />
        <span class="tada-ipp-title">TADa for YouTube</span>
        <span class="tada-ipp-badge">v2.0</span>
      </div>
      <button class="tada-ipp-close-btn" id="tada-ipp-close" title="Đóng">✕</button>
    </div>

    <div class="tada-ipp-body">
      <div class="tada-ipp-stats-bar">
        <div class="tada-ipp-stats-left">
          <span class="tada-ipp-dot"></span>
          <span>Bảo vệ & Chặn quảng cáo</span>
        </div>
        <span class="tada-ipp-stats-count">${blockedCount.toLocaleString()} ads</span>
      </div>

      <div class="tada-ipp-item tada-ipp-item-col">
        <div class="tada-ipp-item-header">
          <div class="tada-ipp-label">🔊 Booster âm lượng 500%</div>
          <span class="tada-ipp-val-badge" id="tada-ipp-vol-badge">${volBadgeText}</span>
        </div>
        <input type="range" class="tada-ipp-slider" id="tada-ipp-vol-slider" min="0" max="500" step="5" value="${vol}" />
      </div>

      <div class="tada-ipp-item tada-ipp-item-col">
        <div class="tada-ipp-item-header">
          <div>
            <div class="tada-ipp-label">✨ Ambient Light (Ánh sáng viền)</div>
            <div class="tada-ipp-desc">Tỏa ánh sáng màn hình ra nền</div>
          </div>
          <label class="tada-ipp-switch">
            <input type="checkbox" id="tada-ipp-ambient-toggle" ${currentSettings.ambientLight ? "checked" : ""} />
            <span class="tada-ipp-slider-round"></span>
          </label>
        </div>
        <div id="tada-ipp-ambient-sliders" style="display: ${currentSettings.ambientLight ? "flex" : "none"}; flex-direction: column; gap: 8px; margin-top: 4px; padding-top: 6px; border-top: 1px dashed rgba(232, 147, 12, 0.25);">
          <div>
            <div class="tada-ipp-item-header" style="margin-bottom: 3px;">
              <span class="tada-ipp-desc" style="font-weight: 600; color: #FDF6EC;">Độ sáng viền</span>
              <span class="tada-ipp-val-badge" id="tada-ipp-bright-badge">${currentSettings.ambientBrightness || 100}%</span>
            </div>
            <input type="range" class="tada-ipp-slider" id="tada-ipp-bright-slider" min="50" max="200" step="5" value="${currentSettings.ambientBrightness || 100}" />
          </div>
          <div>
            <div class="tada-ipp-item-header" style="margin-bottom: 3px;">
              <span class="tada-ipp-desc" style="font-weight: 600; color: #FDF6EC;">Độ lan tỏa</span>
              <span class="tada-ipp-val-badge" id="tada-ipp-spread-badge">${currentSettings.ambientSpread || 100}%</span>
            </div>
            <input type="range" class="tada-ipp-slider" id="tada-ipp-spread-slider" min="50" max="200" step="5" value="${currentSettings.ambientSpread || 100}" />
          </div>
        </div>
      </div>

      <div class="tada-ipp-item">
        <div>
          <div class="tada-ipp-label">🖼️ Hình trong hình (PiP)</div>
          <div class="tada-ipp-desc">Xem góc màn hình & phím tắt [P]</div>
        </div>
        <button class="tada-ipp-pip-quick-btn" id="tada-ipp-launch-pip" title="Kích hoạt PiP ngay">Bật PiP</button>
      </div>

      <div class="tada-ipp-item">
        <div>
          <div class="tada-ipp-label">📐 Lưới 4 video / hàng</div>
          <div class="tada-ipp-desc">Bố cục trang chủ cân đối</div>
        </div>
        <label class="tada-ipp-switch">
          <input type="checkbox" id="tada-ipp-grid-toggle" ${currentSettings.fourColumnGrid ? "checked" : ""} />
          <span class="tada-ipp-slider-round"></span>
        </label>
      </div>

      <div class="tada-ipp-item">
        <div>
          <div class="tada-ipp-label">🚫 Ẩn YouTube Shorts</div>
          <div class="tada-ipp-desc">Loại bỏ kệ video ngắn</div>
        </div>
        <label class="tada-ipp-switch">
          <input type="checkbox" id="tada-ipp-shorts-toggle" ${currentSettings.hideShorts ? "checked" : ""} />
          <span class="tada-ipp-slider-round"></span>
        </label>
      </div>

      <div class="tada-ipp-item">
        <div>
          <div class="tada-ipp-label">🛑 Ẩn thẻ kết thúc</div>
          <div class="tada-ipp-desc">Chặn ô che màn hình cuối clip</div>
        </div>
        <label class="tada-ipp-switch">
          <input type="checkbox" id="tada-ipp-endscreen-toggle" ${currentSettings.hideEndScreens ? "checked" : ""} />
          <span class="tada-ipp-slider-round"></span>
        </label>
      </div>

      <div class="tada-ipp-item">
        <div>
          <div class="tada-ipp-label">🎯 Lọc gợi ý Sidebar</div>
          <div class="tada-ipp-desc">Ẩn video trùng & đã xem</div>
        </div>
        <label class="tada-ipp-switch">
          <input type="checkbox" id="tada-ipp-sidebar-toggle" ${currentSettings.curateSidebar ? "checked" : ""} />
          <span class="tada-ipp-slider-round"></span>
        </label>
      </div>
    </div>

    <div class="tada-ipp-footer">
      <span>Đồng bộ tự động</span>
      <span>Phím tắt: <b>P</b> (PiP) · <b>↑/↓</b> (Âm)</span>
    </div>
  `;

  popup.addEventListener("click", (e) => {
    e.stopPropagation();
  });
  popup.addEventListener("mousedown", (e) => {
    e.stopPropagation();
  });
  popup.addEventListener("touchstart", (e) => {
    e.stopPropagation();
  }, { passive: true });

  popup.querySelector("#tada-ipp-close")?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeTadaInplayerPopup();
  });

  const volSlider = popup.querySelector("#tada-ipp-vol-slider");
  const volBadge = popup.querySelector("#tada-ipp-vol-badge");
  if (volSlider) {
    volSlider.addEventListener("input", (e) => {
      e.stopPropagation();
      const val = parseInt(e.target.value, 10);
      setSuperVolumePercent(val);
      resumeSuperVolumeContext();
      if (volBadge) {
        volBadge.textContent = val > 100 ? `🔥 ${val}%` : `${val}%`;
      }
    });
  }

  const ambientToggle = popup.querySelector("#tada-ipp-ambient-toggle");
  const ambientSlidersWrap = popup.querySelector("#tada-ipp-ambient-sliders");
  const brightSlider = popup.querySelector("#tada-ipp-bright-slider");
  const brightBadge = popup.querySelector("#tada-ipp-bright-badge");
  const spreadSlider = popup.querySelector("#tada-ipp-spread-slider");
  const spreadBadge = popup.querySelector("#tada-ipp-spread-badge");

  if (ambientToggle) {
    ambientToggle.addEventListener("change", (e) => {
      e.stopPropagation();
      const isChecked = e.target.checked;
      currentSettings.ambientLight = isChecked;
      if (ambientSlidersWrap) {
        ambientSlidersWrap.style.display = isChecked ? "flex" : "none";
      }
      persistSettingsChange();
      applyAmbientLightSetting();
      if (isChecked && isWatchPage()) {
        ensureAmbientLight();
      }
    });
  }

  if (brightSlider) {
    brightSlider.addEventListener("input", (e) => {
      e.stopPropagation();
      const val = parseInt(e.target.value, 10);
      currentSettings.ambientBrightness = val;
      if (brightBadge) brightBadge.textContent = `${val}%`;
      updateAmbientLightVariables();
      persistSettingsChange();
    });
  }

  if (spreadSlider) {
    spreadSlider.addEventListener("input", (e) => {
      e.stopPropagation();
      const val = parseInt(e.target.value, 10);
      currentSettings.ambientSpread = val;
      if (spreadBadge) spreadBadge.textContent = `${val}%`;
      updateAmbientLightVariables();
      persistSettingsChange();
    });
  }

  popup.querySelector("#tada-ipp-launch-pip")?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    togglePictureInPicture();
    closeTadaInplayerPopup();
  });

  const bindToggle = (id, settingKey, applyFn) => {
    popup.querySelector(id)?.addEventListener("change", (e) => {
      e.stopPropagation();
      currentSettings[settingKey] = e.target.checked;
      persistSettingsChange();
      applyFn?.();
    });
  };

  bindToggle("#tada-ipp-grid-toggle", "fourColumnGrid", applyFourColumnGridSetting);
  bindToggle("#tada-ipp-shorts-toggle", "hideShorts", applyHideShortsSetting);
  bindToggle("#tada-ipp-endscreen-toggle", "hideEndScreens", applyHideEndScreensSetting);
  bindToggle("#tada-ipp-sidebar-toggle", "curateSidebar", applyCurateSidebarSetting);

  player.appendChild(popup);
  tadaInplayerPopupOpen = true;
}

function bindInplayerPopupDismissListeners() {
  if (inplayerPopupDismissBound) return;
  document.addEventListener("click", (event) => {
    if (!tadaInplayerPopupOpen) return;
    const target = event.target;
    if (target?.closest?.(`#${TADA_INPLAYER_POPUP_ID}`) || target?.closest?.(`#${TADA_POPUP_BUTTON_ID}`)) {
      return;
    }
    closeTadaInplayerPopup();
  }, true);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && tadaInplayerPopupOpen) {
      event.preventDefault();
      closeTadaInplayerPopup();
    }
  }, true);
  inplayerPopupDismissBound = true;
}

let playerControlInterval = null;

function ensureTadaPopupButton() {
  const isEnabled = currentSettings.tadaPopupButton !== false;
  if (!isEnabled) {
    removeTadaPopupButton();
    return;
  }

  // Target Settings button directly (the gear with HD in the controls)
  const settingsBtn = document.querySelector(".ytp-settings-button");
  const rightControls = document.querySelector(".ytp-right-controls") ||
                        settingsBtn?.closest?.(".ytp-right-controls") ||
                        settingsBtn?.parentElement;

  if (!settingsBtn && !rightControls) {
    return;
  }

  let btn = document.getElementById(TADA_POPUP_BUTTON_ID);
  if (!btn || !document.contains(btn)) {
    if (btn) btn.remove();

    btn = document.createElement("button");
    btn.id = TADA_POPUP_BUTTON_ID;
    btn.className = "ytp-button tada-popup-button";
    btn.setAttribute("aria-label", "Bảng điều khiển TADa");
    btn.setAttribute("title", "Bảng điều khiển TADa (Cài đặt nhanh)");
    btn.innerHTML = `
      <svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%">
        <rect x="8.5" y="8.5" width="19" height="19" rx="5" fill="rgba(45, 31, 22, 0.92)" stroke="#E8930C" stroke-width="1.8"/>
        <path d="M13 14.5h10M18 14.5v8" stroke="#FDF6EC" stroke-width="2.2" stroke-linecap="round"/>
        <circle cx="23" cy="13" r="1.5" fill="#E8930C"/>
      </svg>
    `;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleTadaInplayerPopup();
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
}

function removeTadaPopupButton() {
  const btn = document.getElementById(TADA_POPUP_BUTTON_ID);
  if (btn) {
    btn.remove();
  }
}

function startPlayerControlCheck() {
  if (playerControlInterval) {
    clearInterval(playerControlInterval);
    playerControlInterval = null;
  }
  let count = 0;
  ensureTadaPopupButton();
  playerControlInterval = setInterval(() => {
    count++;
    if (isWatchPage()) {
      ensureTadaPopupButton();
    }
    if (count > 25 && document.getElementById(TADA_POPUP_BUTTON_ID)) {
      clearInterval(playerControlInterval);
      playerControlInterval = null;
    }
  }, 300);
}

function ensurePlayerControlButtons() {
  removePipButton(); // Only quick popup button on the player controls
  ensureTadaPopupButton();
}

function applyTadaPopupButtonSetting() {
  const existingStyle = document.getElementById(TADA_POPUP_STYLE_ID);
  if (currentSettings.tadaPopupButton !== false) {
    if (!existingStyle) {
      const style = document.createElement("style");
      style.id = TADA_POPUP_STYLE_ID;
      style.textContent = `
        /* ===== TADa IN-PLAYER QUICK POPUP & BUTTON STYLES ===== */
        .tada-popup-button {
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
          opacity: 0.92;
          transition: opacity 0.15s ease, transform 0.15s ease;
          user-select: none;
          -webkit-user-select: none;
          vertical-align: top;
        }
        .tada-popup-button:hover {
          opacity: 1;
        }
        .tada-popup-button:active {
          transform: scale(0.92);
        }
        .tada-popup-button svg {
          width: 100%;
          height: 100%;
          pointer-events: none;
          transition: transform 0.2s ease, filter 0.2s ease;
        }
        .tada-popup-button:hover svg {
          filter: drop-shadow(0 0 6px rgba(232, 147, 12, 0.85));
          transform: scale(1.08);
        }
        .tada-popup-button.tada-popup-active svg {
          filter: drop-shadow(0 0 8px rgba(232, 147, 12, 1));
          transform: scale(1.12);
        }

        #tada-inplayer-popup {
          position: absolute;
          bottom: 60px;
          right: 14px;
          width: 320px;
          max-width: calc(100% - 28px);
          max-height: 480px;
          background: rgba(26, 20, 16, 0.95);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(232, 147, 12, 0.35);
          border-radius: 16px;
          box-shadow: 0 16px 44px rgba(0, 0, 0, 0.7), 0 0 24px rgba(232, 147, 12, 0.18);
          color: #FDF6EC;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          z-index: 99999;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          user-select: none;
          animation: tadaPopupSlideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes tadaPopupSlideUp {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        #tada-inplayer-popup * {
          box-sizing: border-box;
        }

        .tada-ipp-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          background: rgba(45, 31, 22, 0.6);
          border-bottom: 1px solid rgba(232, 147, 12, 0.2);
        }
        .tada-ipp-title-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .tada-ipp-logo {
          width: 22px;
          height: 22px;
          border-radius: 5px;
        }
        .tada-ipp-title {
          font-size: 13px;
          font-weight: 700;
          color: #FDF6EC;
          letter-spacing: -0.2px;
        }
        .tada-ipp-badge {
          font-size: 9px;
          font-weight: 700;
          padding: 1px 5px;
          border-radius: 10px;
          background: rgba(232, 147, 12, 0.2);
          color: #E8930C;
          border: 1px solid rgba(232, 147, 12, 0.4);
        }
        .tada-ipp-close-btn {
          background: transparent;
          border: none;
          color: rgba(253, 246, 236, 0.6);
          font-size: 16px;
          line-height: 1;
          cursor: pointer;
          padding: 4px 6px;
          border-radius: 6px;
          transition: all 0.15s ease;
        }
        .tada-ipp-close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .tada-ipp-body {
          padding: 10px 14px;
          overflow-y: auto;
          max-height: 380px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .tada-ipp-body::-webkit-scrollbar {
          width: 4px;
        }
        .tada-ipp-body::-webkit-scrollbar-thumb {
          background: rgba(232, 147, 12, 0.3);
          border-radius: 4px;
        }

        .tada-ipp-stats-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 10px;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.25);
          border-radius: 8px;
          font-size: 11px;
        }
        .tada-ipp-stats-left {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #A7F3D0;
        }
        .tada-ipp-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10B981;
          animation: tadaPulseDot 2s infinite;
        }
        @keyframes tadaPulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
        .tada-ipp-stats-count {
          font-weight: 700;
          color: #fff;
          font-family: monospace;
        }

        .tada-ipp-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 10px;
          background: rgba(45, 31, 22, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          transition: border-color 0.15s ease;
        }
        .tada-ipp-item:hover {
          border-color: rgba(232, 147, 12, 0.3);
        }
        .tada-ipp-item-col {
          flex-direction: column;
          align-items: stretch;
          gap: 8px;
        }
        .tada-ipp-item-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }
        .tada-ipp-label {
          font-size: 12px;
          font-weight: 600;
          color: #FDF6EC;
        }
        .tada-ipp-desc {
          font-size: 10px;
          color: rgba(253, 246, 236, 0.55);
        }
        .tada-ipp-val-badge {
          font-size: 11px;
          font-weight: 700;
          color: #E8930C;
          font-family: monospace;
        }

        .tada-ipp-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 5px;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.15);
          outline: none;
          cursor: pointer;
        }
        .tada-ipp-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #E8930C;
          box-shadow: 0 0 6px rgba(232, 147, 12, 0.8);
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .tada-ipp-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .tada-ipp-switch {
          position: relative;
          display: inline-block;
          width: 34px;
          height: 18px;
          flex-shrink: 0;
        }
        .tada-ipp-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .tada-ipp-slider-round {
          position: absolute;
          cursor: pointer;
          inset: 0;
          background-color: rgba(255, 255, 255, 0.2);
          transition: 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 18px;
        }
        .tada-ipp-slider-round:before {
          position: absolute;
          content: "";
          height: 14px;
          width: 14px;
          left: 2px;
          bottom: 2px;
          background-color: white;
          transition: 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 50%;
        }
        .tada-ipp-switch input:checked + .tada-ipp-slider-round {
          background-color: #E8930C;
        }
        .tada-ipp-switch input:checked + .tada-ipp-slider-round:before {
          transform: translateX(16px);
        }

        .tada-ipp-footer {
          padding: 8px 14px;
          background: rgba(20, 14, 10, 0.6);
          border-top: 1px solid rgba(232, 147, 12, 0.15);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 10px;
          color: rgba(253, 246, 236, 0.5);
        }
        .tada-ipp-pip-quick-btn {
          background: rgba(232, 147, 12, 0.15);
          border: 1px solid rgba(232, 147, 12, 0.4);
          color: #E8930C;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 6px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: all 0.15s ease;
        }
        .tada-ipp-pip-quick-btn:hover {
          background: #E8930C;
          color: #1A1410;
        }
      `;
      (document.head || document.documentElement).appendChild(style);
    }
    bindInplayerPopupDismissListeners();
    startPlayerControlCheck();
  } else {
    existingStyle?.remove();
    removeTadaPopupButton();
    closeTadaInplayerPopup();
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
  applyTadaPopupButtonSetting();
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
          chrome.storage.local.set({ ctfSettings: data.ctfSettings }).catch(() => {});
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
  if (playerControlInterval) {
    clearInterval(playerControlInterval);
    playerControlInterval = null;
  }
  removeAmbientLightDom();
  removePipButton();
  removeTadaPopupButton();
  closeTadaInplayerPopup();
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
      if (currentSettings.pipButton || currentSettings.tadaPopupButton) {
        ensurePlayerControlButtons();
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
    startPlayerControlCheck();
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
      startPlayerControlCheck();
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
    if (isWatchPage()) {
      ensurePlayerControlButtons();
    }
  }
}, { passive: true });

document.addEventListener("mouseenter", (e) => {
  if (isWatchPage() && e.target?.closest?.("#movie_player, .html5-video-player, .ytp-chrome-bottom")) {
    ensurePlayerControlButtons();
  }
}, true);


