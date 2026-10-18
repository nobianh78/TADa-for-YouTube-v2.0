/**
 * TADa for YouTube - Return YouTube Dislike (RYD) Module
 */

/* ==========================================================================
   TADa RETURN YOUTUBE DISLIKE (RYD) MODULE
   Restores dislike counts and ratio bar on YouTube Watch page and Shorts.
   Data powered by Return YouTube Dislike API.
   ========================================================================== */

const DISLIKE_STYLE_ID = "tada-dislike-style";
const DISLIKE_RATIO_BAR_ID = "tada-dislike-ratio-bar";
let currentDislikeVideoId = null;
let currentDislikeData = null;
let localVotes = { likes: null, dislikes: null, userState: null };
let isFetchingDislike = false;

function getDislikeVideoId() {
  if (isWatchPage()) {
    return getCurrentVideoId();
  }
  if (isShortsPage()) {
    const match = window.location.pathname.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  }
  return null;
}

function parseYouTubeCount(str) {
  if (!str) return 0;
  const cleaned = str.trim().replace(/\s+/g, " ");
  if (/^\d+$/.test(cleaned)) return parseInt(cleaned, 10);
  const viMatch = cleaned.match(/^([\d.,]+)\s*(N|Tr)$/i);
  if (viMatch) {
    const val = parseFloat(viMatch[1].replace(",", "."));
    const unit = viMatch[2].toLowerCase();
    if (unit === "n") return Math.round(val * 1000);
    if (unit === "tr") return Math.round(val * 1000000);
  }
  const enMatch = cleaned.match(/^([\d.,]+)\s*(K|M|B)$/i);
  if (enMatch) {
    const val = parseFloat(enMatch[1]);
    const unit = enMatch[2].toUpperCase();
    if (unit === "K") return Math.round(val * 1000);
    if (unit === "M") return Math.round(val * 1000000);
    if (unit === "B") return Math.round(val * 1000000000);
  }
  const digits = cleaned.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

function formatDislikeCount(num) {
  if (num === null || num === undefined || isNaN(num)) return "0";
  const en = typeof isEn === "function" && isEn();
  const lang = (document.documentElement.lang || navigator.language || "vi").toLowerCase();
  const isVi = !en && (currentSettings.language === "vi" || lang.startsWith("vi"));
  if (num < 1000) return String(num);
  try {
    return new Intl.NumberFormat(isVi ? "vi" : "en-US", {
      notation: "compact",
      maximumFractionDigits: 1
    }).format(num);
  } catch (e) {
    if (num >= 1e6) return (num / 1e6).toFixed(1) + (isVi ? " Tr" : "M");
    if (num >= 1e3) return (num / 1e3).toFixed(1) + (isVi ? " N" : "K");
    return String(num);
  }
}

function getVisibleWatchReactionContainer() {
  const candidates = Array.from(
    document.querySelectorAll(
      "#menu-container #top-level-buttons-computed, " +
      "ytd-watch-metadata #top-level-buttons-computed, " +
      "ytd-watch-metadata ytd-menu-renderer > div, " +
      "ytd-menu-renderer.ytd-watch-metadata > div, " +
      "segmented-like-dislike-button-view-model, " +
      "ytd-segmented-like-dislike-button-renderer"
    )
  ).filter((candidate) => {
    if (candidate.closest("yt-player-quick-action-buttons, #movie_player:not(:has(ytd-watch-metadata))")) {
      return false;
    }
    return candidate.querySelector(
      "segmented-like-dislike-button-view-model, ytd-segmented-like-dislike-button-renderer, dislike-button-view-model, #segmented-dislike-button, like-button-view-model"
    ) || candidate.matches("segmented-like-dislike-button-view-model, ytd-segmented-like-dislike-button-renderer");
  });

  for (const candidate of candidates) {
    const rect = candidate.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      return candidate;
    }
  }

  return candidates[0] || null;
}

function findWatchDislikeButton() {
  const container = getVisibleWatchReactionContainer();
  if (container) {
    const btn = container.querySelector("dislike-button-view-model button") ||
      container.querySelector("#segmented-dislike-button button") ||
      container.querySelector("dislike-button-view-model") ||
      container.querySelector("#segmented-dislike-button");
    if (btn) return btn.tagName === "BUTTON" ? btn : (btn.querySelector("button") || btn);
  }

  const allDislikeBtns = Array.from(
    document.querySelectorAll("dislike-button-view-model button, #segmented-dislike-button button, dislike-button-view-model")
  ).filter(el => !el.closest("yt-player-quick-action-buttons"));

  const visibleBtn = allDislikeBtns.find((b) => {
    const rect = b.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });
  if (visibleBtn) {
    return visibleBtn.tagName === "BUTTON" ? visibleBtn : (visibleBtn.querySelector("button") || visibleBtn);
  }

  return allDislikeBtns[0] ? (allDislikeBtns[0].tagName === "BUTTON" ? allDislikeBtns[0] : (allDislikeBtns[0].querySelector("button") || allDislikeBtns[0])) : null;
}

function findWatchLikeButton() {
  const container = getVisibleWatchReactionContainer();
  if (container) {
    const btn = container.querySelector("like-button-view-model button") ||
      container.querySelector("#segmented-like-button button") ||
      container.querySelector("like-button-view-model") ||
      container.querySelector("#segmented-like-button");
    if (btn) return btn.tagName === "BUTTON" ? btn : (btn.querySelector("button") || btn);
  }

  const allLikeBtns = Array.from(
    document.querySelectorAll("like-button-view-model button, #segmented-like-button button")
  ).filter(el => !el.closest("yt-player-quick-action-buttons"));

  return allLikeBtns.find((b) => b.getBoundingClientRect().width > 0) || allLikeBtns[0] || null;
}

function getNativeLikeCount() {
  const likeBtn = findWatchLikeButton();
  if (!likeBtn) return 0;

  const text = (likeBtn.innerText || "").trim();
  if (text) {
    const parsed = parseYouTubeCount(text);
    if (parsed > 0) return parsed;
  }

  const aria = likeBtn.getAttribute("aria-label") || "";
  const digits = aria.replace(/[^\d]/g, "");
  if (digits) {
    const num = parseInt(digits, 10);
    if (!isNaN(num) && num > 0) return num;
  }

  return 0;
}

function findShortsDislikeButton() {
  const activeReel = document.querySelector([
    "ytd-reel-video-renderer[is-active]",
    "#shorts-container ytd-reel-video-renderer[is-active]",
    "ytd-reel-video-renderer.ytd-shorts[is-active]"
  ].join(", "));
  if (!activeReel) return null;
  return activeReel.querySelector("#dislike-button button, dislike-button-view-model button");
}

function getDislikeTooltip(likes, dislikes) {
  let effectiveLikes = Number(likes ?? localVotes.likes ?? 0);
  if (effectiveLikes === 0) {
    const nativeLikes = getNativeLikeCount();
    if (nativeLikes > 0) {
      effectiveLikes = nativeLikes;
    }
  }
  const effectiveDislikes = Number(dislikes ?? localVotes.dislikes ?? 0);
  const en = typeof isEn === "function" && isEn();
  const lang = (document.documentElement.lang || navigator.language || "vi").toLowerCase();
  const isVi = !en && (currentSettings.language === "vi" || lang.startsWith("vi"));
  const exactDislikes = effectiveDislikes.toLocaleString(isVi ? "vi-VN" : "en-US");
  const exactLikes = effectiveLikes.toLocaleString(isVi ? "vi-VN" : "en-US");
  const totalVotes = effectiveLikes + effectiveDislikes;
  const ratio = totalVotes > 0 ? ((effectiveLikes / totalVotes) * 100).toFixed(1) : "100.0";
  return isVi
    ? `${exactLikes} Thích / ${exactDislikes} Không thích (${ratio}%)`
    : `${exactLikes} Likes / ${exactDislikes} Dislikes (${ratio}%)`;
}

function renderWatchDislikeUI(likes, dislikes) {
  if (dislikes === null || dislikes === undefined) return false;
  const dislikeBtn = findWatchDislikeButton();
  if (!dislikeBtn) return false;

  const formattedCount = formatDislikeCount(dislikes);
  const tooltip = getDislikeTooltip(likes, dislikes);

  dislikeBtn.classList.remove("yt-spec-button-shape-next--icon-only-default", "yt-spec-button-shape-next--icon-button");
  dislikeBtn.classList.add("yt-spec-button-shape-next--icon-leading", "tada-dislike-expanded");
  dislikeBtn.style.setProperty("width", "auto", "important");
  dislikeBtn.style.setProperty("min-width", "unset", "important");
  dislikeBtn.style.setProperty("padding-left", "6px", "important");
  dislikeBtn.style.setProperty("padding-right", "12px", "important");
  dislikeBtn.style.setProperty("display", "inline-flex", "important");
  dislikeBtn.style.setProperty("align-items", "center", "important");
  dislikeBtn.style.setProperty("box-sizing", "border-box", "important");
  dislikeBtn.style.setProperty("overflow", "visible", "important");

  const dislikeModel = dislikeBtn.closest("dislike-button-view-model");
  if (dislikeModel) {
    dislikeModel.style.setProperty("width", "auto", "important");
    dislikeModel.style.setProperty("min-width", "unset", "important");
    dislikeModel.style.setProperty("flex", "0 0 auto", "important");
  }

  // 1. Text container inside dislike button
  let textContainer = dislikeBtn.querySelector(".tada-dislike-text-container");
  if (!textContainer) {
    textContainer = document.createElement("div");
    textContainer.className = "yt-spec-button-shape-next__button-text-content tada-dislike-text-container";
    const iconEl = dislikeBtn.querySelector(".ytSpecButtonShapeNextIcon, .yt-spec-button-shape-next__icon") || dislikeBtn.firstElementChild;
    if (iconEl && iconEl.nextSibling) {
      dislikeBtn.insertBefore(textContainer, iconEl.nextSibling);
    } else {
      dislikeBtn.appendChild(textContainer);
    }
  }

  textContainer.style.setProperty("display", "inline-flex", "important");
  textContainer.style.setProperty("align-items", "center", "important");
  textContainer.style.setProperty("margin-left", "6px", "important");
  textContainer.style.setProperty("margin-right", "2px", "important");
  textContainer.style.setProperty("font-size", "14px", "important");
  textContainer.style.setProperty("font-weight", "500", "important");
  textContainer.style.setProperty("line-height", "normal", "important");
  textContainer.style.setProperty("color", "inherit", "important");
  textContainer.style.setProperty("white-space", "nowrap", "important");

  let textSpan = textContainer.querySelector(".tada-dislike-text");
  if (!textSpan) {
    textSpan = document.createElement("span");
    textSpan.className = "yt-core-attributed-string yt-core-attributed-string--white-space-no-wrap tada-dislike-text";
    textSpan.setAttribute("role", "text");
    textContainer.appendChild(textSpan);
  }
  textSpan.textContent = formattedCount;
  dislikeBtn.setAttribute("title", tooltip);
  if (dislikeModel) {
    dislikeModel.setAttribute("title", tooltip);
  }

  // Remove ratio bar if previously present
  const existingBar = document.getElementById(DISLIKE_RATIO_BAR_ID);
  if (existingBar) existingBar.remove();

  // 2. Set ratio tooltip on like button so hovering over Like shows the ratio too
  const likeBtn = findWatchLikeButton();
  if (likeBtn) {
    likeBtn.setAttribute("title", tooltip);
    const likeModel = likeBtn.closest("like-button-view-model");
    if (likeModel) {
      likeModel.setAttribute("title", tooltip);
    }
  }

  // 3. Bind hover and click interactions for optimistic feedback
  if (!dislikeBtn.dataset.tadaHoverBound) {
    dislikeBtn.dataset.tadaHoverBound = "true";
    dislikeBtn.addEventListener("mouseenter", () => {
      const fresh = getDislikeTooltip(localVotes.likes, localVotes.dislikes);
      dislikeBtn.setAttribute("title", fresh);
      dislikeBtn.closest("dislike-button-view-model")?.setAttribute("title", fresh);
    });
  }

  if (likeBtn && !likeBtn.dataset.tadaHoverBound) {
    likeBtn.dataset.tadaHoverBound = "true";
    likeBtn.addEventListener("mouseenter", () => {
      const fresh = getDislikeTooltip(localVotes.likes, localVotes.dislikes);
      likeBtn.setAttribute("title", fresh);
      likeBtn.closest("like-button-view-model")?.setAttribute("title", fresh);
    });
  }

  if (!dislikeBtn.dataset.tadaDislikeBound) {
    dislikeBtn.dataset.tadaDislikeBound = "true";
    dislikeBtn.addEventListener("click", () => {
      setTimeout(() => {
        const isPressed = dislikeBtn.getAttribute("aria-pressed") === "true";
        if (isPressed) {
          if (localVotes.userState !== "dislike") {
            localVotes.dislikes = (localVotes.dislikes || 0) + 1;
            if (localVotes.userState === "like") {
              localVotes.likes = Math.max(0, (localVotes.likes || 0) - 1);
            }
            localVotes.userState = "dislike";
          }
        } else {
          if (localVotes.userState === "dislike") {
            localVotes.dislikes = Math.max(0, (localVotes.dislikes || 0) - 1);
            localVotes.userState = null;
          }
        }
        renderWatchDislikeUI(localVotes.likes, localVotes.dislikes);
      }, 100);
    });
  }

  if (likeBtn && !likeBtn.dataset.tadaDislikeBound) {
    likeBtn.dataset.tadaDislikeBound = "true";
    likeBtn.addEventListener("click", () => {
      setTimeout(() => {
        const isPressed = likeBtn.getAttribute("aria-pressed") === "true";
        if (isPressed) {
          if (localVotes.userState === "dislike") {
            localVotes.dislikes = Math.max(0, (localVotes.dislikes || 0) - 1);
          }
          localVotes.userState = "like";
        } else {
          if (localVotes.userState === "like") {
            localVotes.userState = null;
          }
        }
        renderWatchDislikeUI(localVotes.likes, localVotes.dislikes);
      }, 100);
    });
  }

  return true;
}

function updateShortsDislikeUI(dislikes) {
  if (dislikes === null || dislikes === undefined) return false;
  const dislikeBtn = findShortsDislikeButton();
  if (!dislikeBtn) return false;

  const formattedCount = formatDislikeCount(dislikes);
  let label = dislikeBtn.parentElement?.querySelector(".tada-shorts-dislike-label");
  if (!label) {
    label = document.createElement("span");
    label.className = "tada-shorts-dislike-label";
    dislikeBtn.parentElement?.appendChild(label);
  }
  label.textContent = formattedCount;
  return true;
}

async function fetchAndRenderDislike(videoId) {
  if (!videoId || isFetchingDislike) return;
  currentDislikeVideoId = videoId;
  localVotes = { likes: null, dislikes: null, userState: null };
  currentDislikeData = null;
  isFetchingDislike = true;

  try {
    let data = null;

    // 1. Try background message
    try {
      const response = await new Promise((resolve) => {
        if (typeof chrome !== "undefined" && chrome.runtime?.id && chrome.runtime?.sendMessage) {
          chrome.runtime.sendMessage({ type: "GET_DISLIKE_DATA", videoId }, (res) => {
            if (chrome.runtime?.lastError) {
              resolve(null);
            } else {
              resolve(res);
            }
          });
        } else {
          resolve(null);
        }
      });
      if (response?.success && response.data) {
        data = response.data;
      }
    } catch (msgErr) {
      // background message failed, will try direct fetch
    }

    // 2. Direct fetch fallback (RYD API has full CORS support: access-control-allow-origin: *)
    if (!data) {
      try {
        const directRes = await fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${encodeURIComponent(videoId)}`);
        if (directRes.ok) {
          data = await directRes.json();
        }
      } catch (fetchErr) {
        console.debug("[TADa] Direct RYD fetch error:", fetchErr);
      }
    }

    if (data && currentDislikeVideoId === videoId) {
      currentDislikeData = data;
      localVotes.likes = Number(currentDislikeData.likes || 0);
      localVotes.dislikes = Number(currentDislikeData.dislikes || 0);
      localVotes.userState = null;

      if (isWatchPage()) {
        renderWatchDislikeUI(localVotes.likes, localVotes.dislikes);
      } else if (isShortsPage()) {
        updateShortsDislikeUI(localVotes.dislikes);
      }
    }
  } catch (error) {
    console.debug("[TADa] Dislike fetch exception:", error);
  } finally {
    isFetchingDislike = false;
  }
}

function ensureDislikeUI() {
  if (!currentSettings.returnDislike) return;

  const videoId = getDislikeVideoId();
  if (!videoId) return;

  if (videoId !== currentDislikeVideoId) {
    fetchAndRenderDislike(videoId);
    return;
  }

  if (localVotes.dislikes !== null) {
    if (isWatchPage()) {
      const dislikeBtn = findWatchDislikeButton();
      const hasText = dislikeBtn?.querySelector(".tada-dislike-text");
      const expectedText = formatDislikeCount(localVotes.dislikes);
      const likeBtn = findWatchLikeButton();
      if (!hasText || hasText.textContent !== expectedText || !likeBtn?.getAttribute("title")) {
        renderWatchDislikeUI(localVotes.likes, localVotes.dislikes);
      }
    } else if (isShortsPage()) {
      const dislikeBtn = findShortsDislikeButton();
      const hasLabel = dislikeBtn?.parentElement?.querySelector(".tada-shorts-dislike-label");
      const expectedText = formatDislikeCount(localVotes.dislikes);
      if (!hasLabel || hasLabel.textContent !== expectedText) {
        updateShortsDislikeUI(localVotes.dislikes);
      }
    }
  }
}

function startDislikeCheck() {
  ensureDislikeUI();

  let count = 0;
  const timer = setInterval(() => {
    count++;
    ensureDislikeUI();
    const dislikeBtn = isWatchPage() ? findWatchDislikeButton() : findShortsDislikeButton();
    const hasRendered = dislikeBtn?.querySelector(".tada-dislike-text") || dislikeBtn?.parentElement?.querySelector(".tada-shorts-dislike-label");
    if (hasRendered && localVotes.dislikes !== null) {
      clearInterval(timer);
    } else if (count >= 20) {
      clearInterval(timer);
    }
  }, 300);
}

function removeDislikeElements() {
  document.querySelectorAll(".tada-dislike-text-container").forEach((el) => el.remove());
  document.querySelectorAll(`#${DISLIKE_RATIO_BAR_ID}`).forEach((el) => el.remove());
  document.querySelectorAll(".tada-shorts-dislike-label").forEach((el) => el.remove());
  document.querySelectorAll(".tada-dislike-expanded").forEach((el) => {
    el.classList.remove("tada-dislike-expanded");
    el.style.width = "";
    el.style.minWidth = "";
    el.style.paddingLeft = "";
    el.style.paddingRight = "";
  });
  const likeBtn = findWatchLikeButton();
  if (likeBtn) {
    likeBtn.removeAttribute("title");
    likeBtn.closest("like-button-view-model")?.removeAttribute("title");
  }
}

function applyReturnDislikeSetting() {
  const existingStyle = document.getElementById(DISLIKE_STYLE_ID);

  if (currentSettings.returnDislike) {
    if (!existingStyle) {
      const style = document.createElement("style");
      style.id = DISLIKE_STYLE_ID;
      style.textContent = `
        /* ===== TADa RETURN YOUTUBE DISLIKE ===== */
        #segmented-dislike-button,
        #segmented-dislike-button yt-button-shape,
        #segmented-dislike-button button,
        dislike-button-view-model,
        dislike-button-view-model yt-button-shape,
        dislike-button-view-model button,
        button.tada-dislike-expanded,
        button.ytSpecButtonShapeNextIconButton.tada-dislike-expanded,
        .yt-spec-button-shape-next--segmented-end.tada-dislike-expanded {
          width: auto !important;
          min-width: unset !important;
          max-width: none !important;
          padding-left: 6px !important;
          padding-right: 12px !important;
          display: inline-flex !important;
          align-items: center !important;
          box-sizing: border-box !important;
          overflow: visible !important;
        }

        .tada-dislike-text-container {
          display: inline-flex !important;
          align-items: center !important;
          margin-left: 6px !important;
          margin-right: 2px !important;
          color: inherit !important;
          font-family: "Roboto", "Arial", sans-serif !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          line-height: normal !important;
          white-space: nowrap !important;
          overflow: visible !important;
          user-select: none !important;
          -webkit-user-select: none !important;
          pointer-events: none !important;
        }

        .tada-dislike-text {
          color: inherit !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          line-height: normal !important;
          white-space: nowrap !important;
        }


        .tada-shorts-dislike-label {
          display: block !important;
          font-size: 12px !important;
          line-height: 14px !important;
          font-weight: 500 !important;
          text-align: center !important;
          color: #fff !important;
          text-shadow: 0 1px 2px rgba(0,0,0,0.8) !important;
          margin-top: 4px !important;
          user-select: none !important;
        }
      `;
      (document.head || document.documentElement).appendChild(style);
    }
    startDislikeCheck();
  } else {
    existingStyle?.remove();
    removeDislikeElements();
  }
}

/* Note: Video Downloader module is omitted from this build for Chrome Web Store compliance. */

