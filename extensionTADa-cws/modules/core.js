/**
 * TADa for YouTube - Core Module
 * Global settings, constants, and shared utilities
 */

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
  logoType: "tada",
  ensureComments: true,
  autoSelectChips: false,
  pipButton: true,
  videoScreenshot: true,
  customSpeed: true,
  abLooper: true,
  videoBookmarks: true,
  returnDislike: true,
  autoSkipSegments: true,
  interfaceMode: "pc",
  autoTvRedirect: false,
  progressColor: true,
  progressBarColor: "#E8930C",
  videoFilter: true,
  filterBrightness: 100,
  filterContrast: 100,
  filterSaturation: 100,
  filterWarmth: 0,
  filterInvert: 0,
  filterGrayscale: 0,
  cinemaMode: true,
  cinemaOpacity: 85,
  customLoader: true,
  autoQuality: true,
  preferredQuality: "highest",
  qualityBadge: true,
  hotkeysEnabled: true,
  customHotkeys: {},
  toolbarOrder: [
    "abLooper",
    "cinemaMode",
    "videoFilter",
    "customSpeed",
    "pipButton",
    "videoScreenshot",
    "videoBookmarks"
  ],
  toolbarHidden: {},
  abLooperPosition: "left",
  toolbarAnchor: "beforeSettings"
};

const DEFAULT_TOOLBAR_ORDER = [
  "abLooper",
  "cinemaMode",
  "videoFilter",
  "customSpeed",
  "pipButton",
  "videoScreenshot",
  "videoBookmarks"
];
window.DEFAULT_TOOLBAR_ORDER = DEFAULT_TOOLBAR_ORDER;

var currentSettings = { ...DEFAULT_SETTINGS };
window.currentSettings = currentSettings;
window.DEFAULT_SETTINGS = DEFAULT_SETTINGS;

const DEFAULT_HOTKEYS = {
  screenshot: "s",
  screenshotClipboard: "Shift+s",
  cinemaMode: "w",
  pip: "p",
  speedUp: ">",
  speedDown: "<",
  speedReset: "=",
  abSetA: "[",
  abSetB: "]",
  abToggle: "\\",
  bookmarkAdd: "Shift+b",
  bookmarkPanel: "b",
  volumeUp: "Shift+ArrowUp",
  volumeDown: "Shift+ArrowDown",
  sponsorRevert: "z"
};
window.DEFAULT_HOTKEYS = DEFAULT_HOTKEYS;

function getHotkeyForAction(action) {
  if (currentSettings.customHotkeys && currentSettings.customHotkeys[action]) {
    return currentSettings.customHotkeys[action];
  }
  return DEFAULT_HOTKEYS[action];
}
window.getHotkeyForAction = getHotkeyForAction;

function checkEventMatchesHotkey(e, hotkeyStr) {
  if (!hotkeyStr || !e) return false;
  if (e.defaultPrevented) return false;

  const parts = hotkeyStr.split("+");
  const baseKey = parts[parts.length - 1];
  const reqShift = parts.includes("Shift");
  const reqCtrl = parts.includes("Ctrl");
  const reqAlt = parts.includes("Alt");
  const reqMeta = parts.includes("Meta");

  if (Boolean(e.ctrlKey) !== reqCtrl) return false;
  if (Boolean(e.altKey) !== reqAlt) return false;
  if (Boolean(e.metaKey) !== reqMeta) return false;

  const isShiftSymbol = /[><?:!@#$%^&*()_+{}|"~]/.test(baseKey);
  if (!isShiftSymbol && Boolean(e.shiftKey) !== reqShift) {
    return false;
  }

  const eventKey = e.key;
  if (eventKey && eventKey.toLowerCase() === baseKey.toLowerCase()) {
    return true;
  }

  // Handle symbols and special codes
  if (baseKey === ">" && (eventKey === ">" || (e.code === "Period" && e.shiftKey))) return true;
  if (baseKey === "<" && (eventKey === "<" || (e.code === "Comma" && e.shiftKey))) return true;
  if (baseKey === "=" && (eventKey === "=" || e.code === "Equal")) return true;
  if (baseKey === "[" && (eventKey === "[" || e.code === "BracketLeft")) return true;
  if (baseKey === "]" && (eventKey === "]" || e.code === "BracketRight")) return true;
  if (baseKey === "\\" && (eventKey === "\\" || e.code === "Backslash")) return true;
  if (baseKey.toLowerCase() === "space" && (eventKey === " " || e.code === "Space")) return true;
  if (baseKey === "ArrowUp" && (eventKey === "ArrowUp" || e.code === "ArrowUp")) return true;
  if (baseKey === "ArrowDown" && (eventKey === "ArrowDown" || e.code === "ArrowDown")) return true;

  return false;
}
window.checkEventMatchesHotkey = checkEventMatchesHotkey;

function matchesHotkey(event, action) {
  if (currentSettings.hotkeysEnabled === false) return false;

  // Fallback for cinemaMode: support both 'w' and 'Shift+l' unless explicitly customized
  if (action === "cinemaMode" && (!currentSettings.customHotkeys || !currentSettings.customHotkeys.cinemaMode)) {
    return checkEventMatchesHotkey(event, "w") || checkEventMatchesHotkey(event, "Shift+l");
  }

  const hotkeyStr = getHotkeyForAction(action);
  if (!hotkeyStr) return false;
  return checkEventMatchesHotkey(event, hotkeyStr);
}
window.matchesHotkey = matchesHotkey;

const CUSTOM_LOADER_STYLE_ID = "tada-custom-loader-style";
const VIDEO_FILTER_STYLE_ID = "tada-video-filter-style";
const VIDEO_FILTER_BUTTON_STYLE_ID = "tada-video-filter-btn-style";
const VIDEO_FILTER_BUTTON_ID = "tada-video-filter-btn";
const VIDEO_FILTER_POPOVER_ID = "tada-video-filter-popover";

const CINEMA_OVERLAY_ID = "tada-cinema-overlay";
const CINEMA_STYLE_ID = "tada-cinema-style";
const CINEMA_BUTTON_ID = "tada-cinema-btn";
const CINEMA_BUTTON_STYLE_ID = "tada-cinema-btn-style";

const HUD_ID = "ctf-adblock-hud";
const PROGRESS_BAR_STYLE_ID = "tada-progress-bar-style";
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
const SKIP_STYLE_ID = "tada-skip-style";
const SKIP_TOAST_ID = "tada-skip-toast";
const SKIP_TRACK_ID = "tada-skip-track";
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
var hudIntervalId = null;
var domObserver = null;
var hasInvalidatedContext = false;
var premiumStyleInjected = false;
var pageEventHandler = null;
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

function isShortsPage() {
  return window.location?.pathname?.startsWith("/shorts");
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


function setHudText() {
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

// Global exports for universal module access
if (typeof window !== "undefined") {
  window.currentSettings = currentSettings;
  window.DEFAULT_SETTINGS = DEFAULT_SETTINGS;
  window.DEFAULT_HOTKEYS = DEFAULT_HOTKEYS;
  window.isWatchPage = isWatchPage;
  window.isShortsPage = isShortsPage;
  window.getCurrentVideoId = getCurrentVideoId;
  window.hasInvalidatedContext = hasInvalidatedContext;
  window.canMessageRuntime = canMessageRuntime;
  window.safeSendMessage = safeSendMessage;
  window.matchesHotkey = matchesHotkey;
  window.getHotkeyForAction = getHotkeyForAction;
  window.checkEventMatchesHotkey = checkEventMatchesHotkey;
  window.DEFAULT_TOOLBAR_ORDER = DEFAULT_TOOLBAR_ORDER;
}
if (typeof globalThis !== "undefined") {
  globalThis.currentSettings = currentSettings;
  globalThis.DEFAULT_SETTINGS = DEFAULT_SETTINGS;
  globalThis.DEFAULT_HOTKEYS = DEFAULT_HOTKEYS;
  globalThis.isWatchPage = isWatchPage;
  globalThis.isShortsPage = isShortsPage;
  globalThis.getCurrentVideoId = getCurrentVideoId;
  globalThis.hasInvalidatedContext = hasInvalidatedContext;
  globalThis.canMessageRuntime = canMessageRuntime;
  globalThis.safeSendMessage = safeSendMessage;
  globalThis.matchesHotkey = matchesHotkey;
  globalThis.getHotkeyForAction = getHotkeyForAction;
  globalThis.checkEventMatchesHotkey = checkEventMatchesHotkey;
  globalThis.DEFAULT_TOOLBAR_ORDER = DEFAULT_TOOLBAR_ORDER;
}
