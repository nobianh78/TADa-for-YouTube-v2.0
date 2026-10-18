/**
 * TADa for YouTube - Ad Blocker & Sidebar Curator Module
 */

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

