/**
 * TADa for YouTube - Cinema Mode (Turn Off the Lights) Module
 * Deep-focus theater experience with customizable backdrop dimming.
 */

var isCinemaActive = false;
var cinemaCheckInterval = null;
var cinemaHotkeysBound = false;

function getCinemaOpacityValue() {
  const op = parseInt(currentSettings.cinemaOpacity, 10);
  return Number.isFinite(op) ? Math.min(Math.max(op, 40), 100) : 85;
}

function updateCinemaOpacity() {
  const op = getCinemaOpacityValue(); // 40 - 100 (default 85)
  const dimOpacity = Math.max(0, (100 - op) / 100);
  const dimBlur = op >= 75 ? "2px" : "0px";

  document.documentElement.style.setProperty("--tada-cinema-dim-opacity", dimOpacity.toFixed(2));
  document.documentElement.style.setProperty("--tada-cinema-dim-blur", dimBlur);
}

function ensureCinemaStyles() {
  if (!document.getElementById(CINEMA_STYLE_ID)) {
    const style = document.createElement("style");
    style.id = CINEMA_STYLE_ID;
    style.textContent = `
      /* ===== TADa CINEMA MODE (TURN OFF THE LIGHTS) ===== */
      
      /* Pitch dark backdrop for all surrounding layout containers */
      body.tada-cinema-active,
      body.tada-cinema-active ytd-app,
      body.tada-cinema-active #content,
      body.tada-cinema-active ytd-page-manager,
      body.tada-cinema-active ytd-watch-flexy,
      body.tada-cinema-active #columns,
      body.tada-cinema-active #primary,
      body.tada-cinema-active #primary-inner {
        background: #000000 !important;
        background-color: #000000 !important;
        transition: background-color 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
      }

      /* Dim all peripheral elements (top header, sidebar, comments, info) */
      body.tada-cinema-active #masthead-container,
      body.tada-cinema-active #below,
      body.tada-cinema-active #secondary,
      body.tada-cinema-active #chat-container,
      body.tada-cinema-active #guide-wrapper,
      body.tada-cinema-active ytd-live-chat-frame {
        opacity: var(--tada-cinema-dim-opacity, 0.15) !important;
        filter: blur(var(--tada-cinema-dim-blur, 2px)) !important;
        transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        cursor: pointer !important;
      }

      /* Hovering over dimmed peripheral elements shows clickable hint */
      body.tada-cinema-active #masthead-container:hover,
      body.tada-cinema-active #below:hover,
      body.tada-cinema-active #secondary:hover {
        opacity: calc(var(--tada-cinema-dim-opacity, 0.15) + 0.12) !important;
      }

      /* Ensure Video Player is 100% crystal clear with full opacity */
      body.tada-cinema-active #player,
      body.tada-cinema-active #player-container,
      body.tada-cinema-active #player-container-outer,
      body.tada-cinema-active #movie_player,
      body.tada-cinema-active .html5-video-player,
      body.tada-cinema-active #full-bleed-container {
        opacity: 1 !important;
        filter: none !important;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  if (!document.getElementById(CINEMA_BUTTON_STYLE_ID)) {
    const btnStyle = document.createElement("style");
    btnStyle.id = CINEMA_BUTTON_STYLE_ID;
    btnStyle.textContent = `
      .tada-cinema-button {
        position: relative;
        display: inline-flex !important;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        background: transparent;
        border: none;
        outline: none;
        width: 44px;
        height: 100%;
        opacity: 0.9;
        transition: opacity 0.15s ease, transform 0.15s ease;
        user-select: none;
        -webkit-user-select: none;
        vertical-align: top;
      }
      .tada-cinema-button:hover {
        opacity: 1;
        transform: scale(1.06);
      }
      .tada-cinema-button:active {
        transform: scale(0.94);
      }
      .tada-cinema-icon {
        width: 20px;
        height: 20px;
        color: #ffffff;
        transition: color 0.2s ease, filter 0.2s ease, fill 0.2s ease;
        pointer-events: none !important;
      }
      .tada-cinema-button svg,
      .tada-cinema-button span {
        pointer-events: none !important;
      }
      .tada-cinema-button:hover .tada-cinema-icon {
        color: #E8930C;
      }
      .tada-cinema-button.active .tada-cinema-icon {
        color: #E8930C;
        fill: rgba(232, 147, 12, 0.45);
        filter: drop-shadow(0 0 6px rgba(232, 147, 12, 0.8));
      }
      .tada-cinema-glow-dot {
        position: absolute;
        top: 10px;
        right: 9px;
        width: 6px;
        height: 6px;
        background: #E8930C;
        border-radius: 50%;
        box-shadow: 0 0 6px rgba(232, 147, 12, 0.9);
        display: none;
      }
      .tada-cinema-button.active .tada-cinema-glow-dot {
        display: block;
        animation: tadaCinemaDotPulse 2s infinite ease-in-out;
      }
      @keyframes tadaCinemaDotPulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.3); opacity: 0.7; }
      }
    `;
    (document.head || document.documentElement).appendChild(btnStyle);
  }
}

function handleCinemaOutsideClick(e) {
  if (!isCinemaActive) return;

  // If clicked inside player, video, or any TADa popovers/buttons, do nothing
  if (e.target.closest("#movie_player, .html5-video-player, video, #tada-cinema-btn, #tada-video-filter-btn, #tada-video-filter-popover, #tada-speed-btn, #tada-speed-preset-menu, #tada-bookmark-modal, #tada-bookmark-panel, #tada-ab-btn, #tada-pip-button, #tada-screenshot-button")) {
    return;
  }

  // Clicked on dimmed area (outside player) -> Turn off cinema mode
  setCinemaMode(false);
}

function setCinemaMode(active) {
  isCinemaActive = Boolean(active);

  if (isCinemaActive) {
    updateCinemaOpacity();
    document.body.classList.add("tada-cinema-active");
    setTimeout(() => {
      document.addEventListener("click", handleCinemaOutsideClick, true);
    }, 50);

    if (typeof showHudNotification === "function") {
      const en = typeof isEn === "function" && isEn();
      showHudNotification(en ? "Cinema Mode: Lights off (Click outside to turn on)" : "Rạp chiếu phim: Đã tắt đèn (Bấm ra ngoài để bật lại)");
    }
  } else {
    document.body.classList.remove("tada-cinema-active");
    document.removeEventListener("click", handleCinemaOutsideClick, true);

    if (typeof showHudNotification === "function") {
      const en = typeof isEn === "function" && isEn();
      showHudNotification(en ? "Cinema Mode: Lights on" : "Rạp chiếu phim: Đã bật đèn");
    }
  }

  updateCinemaButtonState();
}

function toggleCinemaMode(forceState) {
  if (typeof forceState === "boolean") {
    setCinemaMode(forceState);
  } else {
    setCinemaMode(!isCinemaActive);
  }
}

function updateCinemaButtonState() {
  const btn = document.getElementById(CINEMA_BUTTON_ID);
  if (!btn) return;

  btn.classList.toggle("active", isCinemaActive);
  const en = typeof isEn === "function" && isEn();
  btn.setAttribute("aria-label", en ? "Cinema Mode (Dim lights)" : "Rạp chiếu phim (Tắt đèn)");
  btn.setAttribute(
    "title",
    isCinemaActive
      ? (en ? "Turn lights on (Cinema mode active) - Shortcut Shift+L" : "Bật đèn lại (Rạp chiếu phim đang bật) - Phím tắt Shift+L")
      : (en ? "Cinema Mode (Dim lights) - Shortcut Shift+L" : "Rạp chiếu phim (Tắt đèn) - Phím tắt Shift+L")
  );
}

function ensureCinemaButton() {
  if (!currentSettings.cinemaMode) {
    removeCinemaButton();
    return;
  }

  ensureCinemaStyles();

  const settingsBtn = document.querySelector(".ytp-settings-button");
  const filterBtn = document.getElementById(VIDEO_FILTER_BUTTON_ID);
  const speedBtn = document.getElementById(SPEED_BUTTON_ID);
  const rightControls = document.querySelector(".ytp-right-controls") ||
    settingsBtn?.closest?.(".ytp-right-controls") ||
    settingsBtn?.parentElement;

  if (!rightControls && !settingsBtn) return;

  let isNew = false;
  let btn = document.getElementById(CINEMA_BUTTON_ID);
  if (!btn || !document.contains(btn)) {
    if (btn) btn.remove();
    isNew = true;

    btn = document.createElement("button");
    btn.id = CINEMA_BUTTON_ID;
    btn.className = "ytp-button tada-cinema-button";
    const en = typeof isEn === "function" && isEn();
    btn.setAttribute("aria-label", en ? "Cinema Mode (Dim lights)" : "Rạp chiếu phim (Tắt đèn)");
    btn.setAttribute("title", en ? "Cinema Mode (Dim lights) - Shortcut Shift+L" : "Rạp chiếu phim (Tắt đèn) - Phím tắt Shift+L");

    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tada-cinema-icon">
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
      </svg>
      <span class="tada-cinema-glow-dot"></span>
    `;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleCinemaMode();
    });

    if (settingsBtn) {
      settingsBtn.insertAdjacentElement("beforebegin", btn);
    } else if (rightControls) {
      rightControls.appendChild(btn);
    }
  }

  updateCinemaButtonState();
  if (isNew && typeof applyToolbarLayout === "function") {
    applyToolbarLayout();
  }
}

function removeCinemaButton() {
  const btn = document.getElementById(CINEMA_BUTTON_ID);
  if (btn) btn.remove();
  setCinemaMode(false);
  const overlay = document.getElementById(CINEMA_OVERLAY_ID);
  if (overlay) overlay.remove();
}

function handleCinemaHotkeys(event) {
  if (currentSettings.hotkeysEnabled === false) return;
  if (!currentSettings.cinemaMode) return;
  if (event.defaultPrevented) return;
  if (event.altKey || event.ctrlKey || event.metaKey) return;

  // Escape key: exit cinema mode if active
  if (event.key === "Escape" && isCinemaActive) {
    event.preventDefault();
    event.stopPropagation();
    setCinemaMode(false);
    return;
  }

  if (shouldIgnoreKeyEvent(event) || event.target?.closest?.("ytd-comments, #comments, #search-input, [role='textbox']")) {
    return;
  }

  if (matchesHotkey(event, "cinemaMode")) {
    event.preventDefault();
    event.stopPropagation();
    toggleCinemaMode();
  }
}

function ensureCinemaHotkeys() {
  if (cinemaHotkeysBound) return;
  window.addEventListener("keydown", handleCinemaHotkeys, true);
  cinemaHotkeysBound = true;
}

function startCinemaButtonCheck() {
  if (cinemaCheckInterval) {
    clearInterval(cinemaCheckInterval);
    cinemaCheckInterval = null;
  }

  let count = 0;
  ensureCinemaButton();
  cinemaCheckInterval = setInterval(() => {
    count++;
    if (isWatchPage()) {
      ensureCinemaButton();
    }
    if (count > 25 && document.getElementById(CINEMA_BUTTON_ID)) {
      clearInterval(cinemaCheckInterval);
      cinemaCheckInterval = null;
    }
  }, 300);
}

function cinemaResetOnNav() {
  if (isCinemaActive) {
    setCinemaMode(false);
  }
}

function applyCinemaModeSetting() {
  ensureCinemaStyles();
  updateCinemaOpacity();

  if (currentSettings.cinemaMode) {
    ensureCinemaHotkeys();
    startCinemaButtonCheck();
  } else {
    removeCinemaButton();
  }
}
