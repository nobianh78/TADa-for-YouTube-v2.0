/**
 * TADa for YouTube - Content Script Orchestrator
 * Bootstraps all modules, handles settings synchronization, observer & events.
 */

// Safe fallback declarations
var currentSettings = window.currentSettings || globalThis.currentSettings || (typeof DEFAULT_SETTINGS !== "undefined" ? { ...DEFAULT_SETTINGS } : {});
var hasInvalidatedContext = window.hasInvalidatedContext ?? false;
var isWatchPage = window.isWatchPage || globalThis.isWatchPage || (() => Boolean(window.location?.pathname?.startsWith("/watch")));
var isShortsPage = window.isShortsPage || globalThis.isShortsPage || (() => Boolean(window.location?.pathname?.startsWith("/shorts")));

function applyAllSettings() {
  const oldOverlayStyle = document.getElementById("tada-custom-overlay-style");
  if (oldOverlayStyle) oldOverlayStyle.remove();

  applyFourColumnGridSetting();
  applyHideShortsSetting();
  applyHideEndScreensSetting();
  applyPremiumBrandingSetting();
  applyEnsureCommentsSetting();
  applyCurateSidebarSetting();
  applySuperVolumeSetting();
  applyAmbientLightSetting();
  applyProgressColorSetting();
  applyPipButtonSetting();
  applyScreenshotButtonSetting();
  applyCustomSpeedSetting();
  applyVideoFilterSetting();
  applyCinemaModeSetting();
  applyCustomLoaderSetting();
  applyAutoQualitySetting();
  applyAbLooperSetting();
  applyVideoBookmarksSetting();
  applyReturnDislikeSetting();
  applyAutoSkipSegmentsSetting();
  applyHudSetting();
  applyAutoSelectChipsSetting();
  if (typeof applyToolbarLayout === "function") {
    applyToolbarLayout();
  }
}

const applyPremiumBranding = typeof applyPremiumBrandingSetting === "function" ? applyPremiumBrandingSetting : () => {};

function applySettingsUpdate(newSettings) {
  if (!newSettings) return;
  delete newSettings.showHud;
  currentSettings = { ...DEFAULT_SETTINGS, ...newSettings };
  delete currentSettings.showHud;
  window.currentSettings = currentSettings;
  globalThis.currentSettings = currentSettings;

  if (window.location.pathname.startsWith("/tv")) {
    if (newSettings.interfaceMode === "pc") {
      window.location.replace("https://www.youtube.com/");
      return;
    }
  } else {
    if (newSettings.interfaceMode === "tv" && newSettings.autoTvRedirect) {
      if (window.location.pathname === "/" || window.location.pathname === "") {
        window.location.replace("https://www.youtube.com/tv#/");
        return;
      }
    }
  }

  applyAllSettings();
  ensureHud();
}

async function loadStoredSettings() {
  try {
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      const data = await chrome.storage.local.get([
        "ctfSettings",
        "filterBrightness",
        "filterContrast",
        "filterSaturation",
        "filterWarmth",
        "filterInvert",
        "filterGrayscale"
      ]);
      if (data?.ctfSettings) {
        if (data.ctfSettings.showHud !== undefined) {
          delete data.ctfSettings.showHud;
          chrome.storage.local.set({ ctfSettings: data.ctfSettings }).catch(() => { });
        }
        currentSettings = { ...DEFAULT_SETTINGS, ...data.ctfSettings };
        delete currentSettings.showHud;
      }
      // Migrate any legacy top-level filter settings into ctfSettings if needed
      if (data?.filterBrightness !== undefined && (!data?.ctfSettings || data.ctfSettings.filterBrightness === undefined)) {
        currentSettings.filterBrightness = data.filterBrightness;
        currentSettings.filterContrast = data.filterContrast ?? currentSettings.filterContrast;
        currentSettings.filterSaturation = data.filterSaturation ?? currentSettings.filterSaturation;
        currentSettings.filterWarmth = data.filterWarmth ?? currentSettings.filterWarmth;
        chrome.storage.local.set({ ctfSettings: currentSettings }).catch(() => {});
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
  if (abBtnInterval) {
    clearInterval(abBtnInterval);
    abBtnInterval = null;
  }
  abStopLoop();
  removeAmbientLightDom();
  removePipButton();
  removeScreenshotButton();
  removeSpeedButton();
  document.getElementById(SCREENSHOT_FLASH_ID)?.remove();
  document.getElementById("tada-screenshot-toast")?.remove();
  removeAbBtn();
  document.getElementById(AB_TRACK_ID)?.remove();
  removeAutoSkipUI();
  removeCustomLoader();
  document.getElementById("tada-custom-overlay-style")?.remove();
  document.getElementById(PROGRESS_BAR_STYLE_ID)?.remove();
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
      applyPremiumBrandingSetting();
      if (currentSettings.ambientLight && isWatchPage()) {
        ensureAmbientLight();
      }
      if (currentSettings.pipButton && isWatchPage()) {
        ensurePipButton();
      }
      if (currentSettings.videoScreenshot && isWatchPage()) {
        ensureScreenshotButton();
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
      if (currentSettings.customLoader && isWatchPage()) {
        ensureBirdLoaderDom();
      }
      if (currentSettings.videoFilter && isWatchPage()) {
        ensureVideoFilterButton();
        applyFilterToVideoElements();
      }
      if (currentSettings.cinemaMode && isWatchPage()) {
        ensureCinemaButton();
      }
      if (isWatchPage() && currentSettings.ensureComments) {
        ensureCommentsVisible();
      }
      if (currentSettings.returnDislike && (isWatchPage() || isShortsPage())) {
        ensureDislikeUI();
      }
      if (hasSidebarCandidate && isWatchPage() && currentSettings.curateSidebar) {
        hasSidebarCandidate = false;
        scheduleSidebarCurate();
      }
      if (hasChipCandidate && currentSettings.autoSelectChips) {
        hasChipCandidate = false;
        scheduleChipSelection();
      }
      if (isWatchPage() && typeof applyToolbarLayout === "function") {
        applyToolbarLayout();
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

  // If currently on YouTube TV Leanback
  if (window.location.pathname.startsWith("/tv")) {
    initTvModeUi();
    return;
  }

  // If TV mode is chosen with auto redirect and user lands on YouTube root
  if (currentSettings.interfaceMode === "tv" && currentSettings.autoTvRedirect) {
    if (window.location.pathname === "/" || window.location.pathname === "") {
      window.location.replace("https://www.youtube.com/tv#/");
      return;
    }
  }

  ensureSuperVolumePreferenceLoaded();
  applyAllSettings();
  removeStaticAds();
  scrubPlayerAds();
  bindSidebarCurator();
  bindPageBridge();
  bindQualityMessageListener();
  initMutationObserver();
  if (isWatchPage()) {
    startPipButtonCheck();
    startScreenshotButtonCheck();
    startSpeedButtonCheck();
    startVideoFilterCheck();
    startCinemaButtonCheck();
    startAbCheck();
    startBookmarkCheck();
    startCustomLoaderCheck();
    notifyQualityNav();
    startAutoSkipCheck();
  }
  if (isWatchPage() || isShortsPage()) {
    startDislikeCheck();
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
      startSpeedButtonCheck();
      startVideoFilterCheck();
      startCinemaButtonCheck();
      cinemaResetOnNav();
      abResetOnNav();
      startAbCheck();
      onBookmarkNav();
      startBookmarkCheck();
      startCustomLoaderCheck();
      notifyQualityNav();
      startAutoSkipCheck();
    }
    if (isWatchPage() || isShortsPage()) {
      startDislikeCheck();
    }
    if (isWatchPage() && typeof applyToolbarLayout === "function") {
      applyToolbarLayout();
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
  if (now - lastControlCheck > 1500) {
    lastControlCheck = now;
    if (!isWatchPage()) return;
    if (currentSettings.pipButton && !document.getElementById(PIP_BUTTON_ID)) ensurePipButton();
    if (currentSettings.videoScreenshot && !document.getElementById(SCREENSHOT_BUTTON_ID)) ensureScreenshotButton();
    if (currentSettings.customSpeed && !document.getElementById(SPEED_BUTTON_ID)) ensureSpeedButton();
    if (currentSettings.abLooper && !document.getElementById(AB_BTN_ID)) ensureAbBtn();
    if (currentSettings.videoBookmarks && !document.getElementById(BOOKMARK_BTN_ID)) ensureBookmarkButton();
    if (currentSettings.videoFilter && !document.getElementById(VIDEO_FILTER_BUTTON_ID)) ensureVideoFilterButton();
    if (currentSettings.cinemaMode && !document.getElementById(CINEMA_BUTTON_ID)) ensureCinemaButton();
  }
}, { passive: true });

let lastMouseEnterCheck = 0;
document.addEventListener("mouseenter", (e) => {
  const now = Date.now();
  if (now - lastMouseEnterCheck < 1000) return;
  if (!isWatchPage()) return;
  if (!e.target?.closest?.("#movie_player, .html5-video-player, .ytp-chrome-bottom")) return;

  lastMouseEnterCheck = now;
  if (currentSettings.pipButton && !document.getElementById(PIP_BUTTON_ID)) ensurePipButton();
  if (currentSettings.videoScreenshot && !document.getElementById(SCREENSHOT_BUTTON_ID)) ensureScreenshotButton();
  if (currentSettings.customSpeed && !document.getElementById(SPEED_BUTTON_ID)) ensureSpeedButton();
  if (currentSettings.abLooper && !document.getElementById(AB_BTN_ID)) ensureAbBtn();
  if (currentSettings.videoBookmarks && !document.getElementById(BOOKMARK_BTN_ID)) ensureBookmarkButton();
  if (currentSettings.videoFilter && !document.getElementById(VIDEO_FILTER_BUTTON_ID)) ensureVideoFilterButton();
  if (currentSettings.cinemaMode && !document.getElementById(CINEMA_BUTTON_ID)) ensureCinemaButton();
}, true);



document.addEventListener("enterpictureinpicture", updatePipButtonState, true);
document.addEventListener("leavepictureinpicture", updatePipButtonState, true);
