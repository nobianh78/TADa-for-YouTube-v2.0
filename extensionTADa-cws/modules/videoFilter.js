/**
 * TADa for YouTube - Video Color & Brightness Filter Module
 * Real-time GPU-accelerated video enhancement & player controls
 */

const VIDEO_FILTER_PRESETS = {
  reset: {
    id: "reset",
    name: "Chuẩn",
    brightness: 100,
    contrast: 100,
    saturation: 100,
    warmth: 0,
    invert: 0,
    grayscale: 0
  },
  night: {
    id: "night",
    name: "Xem đêm",
    brightness: 85,
    contrast: 95,
    saturation: 90,
    warmth: 25,
    invert: 0,
    grayscale: 0
  },
  brighten: {
    id: "brighten",
    name: "Sáng rõ",
    brightness: 130,
    contrast: 115,
    saturation: 105,
    warmth: 0,
    invert: 0,
    grayscale: 0
  },
  cinema: {
    id: "cinema",
    name: "Cinema",
    brightness: 100,
    contrast: 125,
    saturation: 120,
    warmth: 5,
    invert: 0,
    grayscale: 0
  },
  vintage: {
    id: "vintage",
    name: "Hoài cổ",
    brightness: 95,
    contrast: 110,
    saturation: 85,
    warmth: 40,
    invert: 0,
    grayscale: 0
  },
  invert: {
    id: "invert",
    name: "Đảo màu",
    brightness: 100,
    contrast: 100,
    saturation: 100,
    warmth: 0,
    invert: 100,
    grayscale: 0
  },
  bw: {
    id: "bw",
    name: "Đen trắng",
    brightness: 105,
    contrast: 120,
    saturation: 0,
    warmth: 0,
    invert: 0,
    grayscale: 100
  }
};

let videoFilterSaveTimer = null;
let videoFilterCheckInterval = null;

function isFilterActive(settings = currentSettings) {
  if (!settings || !settings.videoFilter) return false;
  const b = Number(settings.filterBrightness ?? 100);
  const c = Number(settings.filterContrast ?? 100);
  const s = Number(settings.filterSaturation ?? 100);
  const w = Number(settings.filterWarmth ?? 0);
  const inv = Number(settings.filterInvert ?? 0);
  const g = Number(settings.filterGrayscale ?? 0);

  return b !== 100 || c !== 100 || s !== 100 || w > 0 || inv > 0 || g > 0;
}

function buildVideoFilterCss(settings = currentSettings) {
  if (!settings || !settings.videoFilter) return "none";

  const b = Number(settings.filterBrightness ?? 100);
  const c = Number(settings.filterContrast ?? 100);
  const s = Number(settings.filterSaturation ?? 100);
  const w = Number(settings.filterWarmth ?? 0);
  const inv = Number(settings.filterInvert ?? 0);
  const g = Number(settings.filterGrayscale ?? 0);

  if (b === 100 && c === 100 && s === 100 && w === 0 && inv === 0 && g === 0) {
    return "none";
  }

  const parts = [];
  if (b !== 100) parts.push(`brightness(${b}%)`);
  if (c !== 100) parts.push(`contrast(${c}%)`);
  if (s !== 100) parts.push(`saturate(${s}%)`);
  if (w > 0) parts.push(`sepia(${w}%)`);
  if (inv > 0) parts.push(`invert(${inv}%)`);
  if (g > 0) parts.push(`grayscale(${g}%)`);

  return parts.length > 0 ? parts.join(" ") : "none";
}

function applyFilterToVideoElements() {
  const cssFilter = buildVideoFilterCss(currentSettings);
  const videos = document.querySelectorAll(
    "#movie_player video, .html5-video-player video, ytd-player video, video.html5-main-video, video.video-stream"
  );
  videos.forEach((video) => {
    if (currentSettings.videoFilter && cssFilter !== "none") {
      video.style.setProperty("filter", cssFilter, "important");
    } else {
      video.style.removeProperty("filter");
    }
    if (!video.dataset.tadaFilterBound) {
      video.dataset.tadaFilterBound = "true";
      ["play", "playing", "loadeddata", "loadedmetadata"].forEach((evt) => {
        video.addEventListener(evt, () => {
          applyFilterToVideoElements();
        });
      });
    }
  });
}

function updateVideoFilterStyle() {
  let style = document.getElementById(VIDEO_FILTER_STYLE_ID);
  if (!currentSettings.videoFilter) {
    if (style) style.remove();
    applyFilterToVideoElements();
    return;
  }

  const cssFilter = buildVideoFilterCss(currentSettings);
  if (!style || !document.contains(style)) {
    if (style) style.remove();
    style = document.createElement("style");
    style.id = VIDEO_FILTER_STYLE_ID;
    (document.head || document.documentElement).appendChild(style);
  }

  style.textContent = `
    #movie_player video,
    .html5-video-player video,
    ytd-player video,
    video.html5-main-video,
    video.video-stream {
      filter: ${cssFilter} !important;
      transition: filter 0.15s ease-out !important;
    }
  `;

  applyFilterToVideoElements();
}

function updateVideoFilterButtonState() {
  const btn = document.getElementById(VIDEO_FILTER_BUTTON_ID);
  if (!btn) return;
  const active = isFilterActive(currentSettings);
  btn.classList.toggle("tada-filter-active", active);
  const en = typeof isEn === "function" && isEn();
  btn.setAttribute("title", active
    ? (en ? "Video Filter (Active)" : "Bộ lọc video (Đang kích hoạt)")
    : (en ? "Color & Lighting Filter (TADa)" : "Bộ lọc màu & Ánh sáng (TADa)"));
}

function ensureVideoFilterButtonStyle() {
  if (document.getElementById(VIDEO_FILTER_BUTTON_STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = VIDEO_FILTER_BUTTON_STYLE_ID;
  style.textContent = `
    /* Filter Button in Player Controls */
    .tada-filter-button {
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
    .tada-filter-button:hover {
      opacity: 1;
      transform: scale(1.06);
    }
    .tada-filter-button:active {
      transform: scale(0.94);
    }
    .tada-filter-icon {
      width: 20px;
      height: 20px;
      color: #ffffff;
      transition: color 0.2s ease, transform 0.2s ease;
      pointer-events: none !important;
    }
    .tada-filter-button svg,
    .tada-filter-button span {
      pointer-events: none !important;
    }
    .tada-filter-button:hover .tada-filter-icon {
      color: #E8930C;
    }
    .tada-filter-button.tada-filter-active .tada-filter-icon {
      color: #E8930C;
    }
    .tada-filter-dot {
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
    .tada-filter-button.tada-filter-active .tada-filter-dot {
      display: block;
      animation: tadaFilterPulse 2s infinite ease-in-out;
    }
    @keyframes tadaFilterPulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.3); opacity: 0.7; }
    }

    /* Floating Popover */
    .tada-filter-popover {
      position: absolute;
      bottom: 58px;
      right: 150px;
      width: 286px;
      background: rgba(18, 14, 11, 0.96);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border: 1px solid rgba(232, 147, 12, 0.55);
      border-radius: 14px;
      padding: 14px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.85);
      z-index: 1001;
      font-family: "Roboto", "Segoe UI", sans-serif;
      color: #FDF6EC;
      animation: tadaFilterSlideUp 0.15s cubic-bezier(0.16, 1, 0.3, 1);
      user-select: none;
      -webkit-user-select: none;
    }
    @keyframes tadaFilterSlideUp {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .tada-filter-pop-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      margin-bottom: 12px;
    }
    .tada-filter-pop-title {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 13px;
      font-weight: 700;
      color: #FDF6EC;
    }
    .tada-filter-pop-icon {
      width: 17px;
      height: 17px;
      color: #E8930C;
    }
    .tada-filter-pop-reset {
      font-size: 11px;
      font-weight: 600;
      color: rgba(253, 246, 236, 0.7);
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 6px;
      padding: 3px 8px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .tada-filter-pop-reset:hover {
      background: rgba(232, 147, 12, 0.25);
      color: #E8930C;
      border-color: rgba(232, 147, 12, 0.5);
    }
    .tada-filter-presets-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 14px;
    }
    .tada-filter-preset-pill {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      font-weight: 600;
      padding: 5px 9px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      color: #FDF6EC;
      cursor: pointer;
      transition: all 0.12s ease;
    }
    .tada-filter-preset-pill:hover {
      background: rgba(255, 255, 255, 0.14);
      border-color: rgba(255, 255, 255, 0.3);
      transform: translateY(-1px);
    }
    .tada-filter-preset-pill.active {
      background: rgba(232, 147, 12, 0.25);
      border-color: #E8930C;
      color: #E8930C;
    }
    .tada-filter-slider-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .tada-filter-slider-item {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .tada-filter-slider-meta {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      font-weight: 600;
      color: rgba(253, 246, 236, 0.8);
    }
    .tada-filter-slider-val {
      font-size: 11px;
      font-weight: 700;
      color: #E8930C;
    }
    .tada-filter-range {
      appearance: none;
      -webkit-appearance: none;
      width: 100%;
      height: 4px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.15);
      outline: none;
      cursor: pointer;
      accent-color: #E8930C;
    }
    .tada-filter-range::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 13px;
      height: 13px;
      border-radius: 50%;
      background: #E8930C;
      border: 2px solid #ffffff;
      box-shadow: 0 1px 4px rgba(0,0,0,0.4);
      cursor: pointer;
      transition: transform 0.1s ease;
    }
    .tada-filter-range::-webkit-slider-thumb:hover {
      transform: scale(1.2);
    }
  `;
  document.head.appendChild(style);
}

async function persistFilterSettings(immediate = false) {
  if (videoFilterSaveTimer) {
    clearTimeout(videoFilterSaveTimer);
    videoFilterSaveTimer = null;
  }

  const doSave = async () => {
    try {
      if (typeof chrome !== "undefined" && chrome.storage?.local) {
        const data = await chrome.storage.local.get(["ctfSettings"]);
        const settings = data?.ctfSettings ? { ...data.ctfSettings } : { ...DEFAULT_SETTINGS };
        settings.videoFilter = currentSettings.videoFilter;
        settings.filterBrightness = currentSettings.filterBrightness;
        settings.filterContrast = currentSettings.filterContrast;
        settings.filterSaturation = currentSettings.filterSaturation;
        settings.filterWarmth = currentSettings.filterWarmth;
        settings.filterInvert = currentSettings.filterInvert;
        settings.filterGrayscale = currentSettings.filterGrayscale;
        await chrome.storage.local.set({ ctfSettings: settings });
      }
    } catch (err) {
      console.warn("[TADa] Failed to persist filter settings:", err);
    }
  };

  if (immediate) {
    await doSave();
  } else {
    videoFilterSaveTimer = setTimeout(doSave, 120);
  }
}

// Flush pending filter saves on navigation / page unload
window.addEventListener("beforeunload", () => {
  if (videoFilterSaveTimer) {
    persistFilterSettings(true);
  }
});
window.addEventListener("yt-navigate-start", () => {
  if (videoFilterSaveTimer) {
    persistFilterSettings(true);
  }
});

function applyPresetValues(presetKey) {
  const preset = VIDEO_FILTER_PRESETS[presetKey];
  if (!preset) return;

  currentSettings.filterBrightness = preset.brightness;
  currentSettings.filterContrast = preset.contrast;
  currentSettings.filterSaturation = preset.saturation;
  currentSettings.filterWarmth = preset.warmth;
  currentSettings.filterInvert = preset.invert;
  currentSettings.filterGrayscale = preset.grayscale;
  currentSettings.videoFilter = true;

  updateVideoFilterStyle();
  updateVideoFilterButtonState();
  persistFilterSettings(true);

  // Sync popover sliders if open
  const popover = document.getElementById(VIDEO_FILTER_POPOVER_ID);
  if (popover) {
    const bSlider = popover.querySelector("#pop-filter-brightness");
    const cSlider = popover.querySelector("#pop-filter-contrast");
    const sSlider = popover.querySelector("#pop-filter-saturation");
    const wSlider = popover.querySelector("#pop-filter-warmth");

    if (bSlider) {
      bSlider.value = preset.brightness;
      popover.querySelector("#pop-filter-brightness-val").textContent = `${preset.brightness}%`;
    }
    if (cSlider) {
      cSlider.value = preset.contrast;
      popover.querySelector("#pop-filter-contrast-val").textContent = `${preset.contrast}%`;
    }
    if (sSlider) {
      sSlider.value = preset.saturation;
      popover.querySelector("#pop-filter-saturation-val").textContent = `${preset.saturation}%`;
    }
    if (wSlider) {
      wSlider.value = preset.warmth;
      popover.querySelector("#pop-filter-warmth-val").textContent = `${preset.warmth}%`;
    }

    popover.querySelectorAll(".tada-filter-preset-pill").forEach(pill => {
      pill.classList.toggle("active", pill.dataset.preset === presetKey);
    });
  }
}

let videoFilterOutsideHandler = null;

function toggleVideoFilterPopover() {
  const player = document.getElementById("movie_player") || document.querySelector(".html5-video-player");
  if (!player) return;

  if (videoFilterOutsideHandler) {
    document.removeEventListener("click", videoFilterOutsideHandler, true);
    videoFilterOutsideHandler = null;
  }

  let popover = document.getElementById(VIDEO_FILTER_POPOVER_ID);
  if (popover) {
    popover.remove();
    return;
  }

  ensureVideoFilterButtonStyle();

  popover = document.createElement("div");
  popover.id = VIDEO_FILTER_POPOVER_ID;
  popover.className = "tada-filter-popover";

  const bVal = currentSettings.filterBrightness ?? 100;
  const cVal = currentSettings.filterContrast ?? 100;
  const sVal = currentSettings.filterSaturation ?? 100;
  const wVal = currentSettings.filterWarmth ?? 0;

  const en = typeof isEn === "function" && isEn();
  const presetNamesEn = {
    reset: "Default",
    night: "Night",
    brighten: "Brighten",
    cinema: "Cinema",
    vintage: "Vintage",
    invert: "Invert",
    bw: "B&W"
  };

  popover.innerHTML = `
    <div class="tada-filter-pop-header">
      <div class="tada-filter-pop-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="tada-filter-pop-icon">
          <circle cx="6" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <line x1="20" y1="4" x2="8.5" y2="4" />
          <line x1="20" y1="12" x2="4" y2="12" />
          <line x1="20" y1="20" x2="8.5" y2="20" />
        </svg>
        <span>${en ? "Video Filter & Effects" : "Bộ lọc video & Ánh sáng"}</span>
      </div>
      <button class="tada-filter-pop-reset" id="tada-filter-reset-btn" title="${en ? "Reset to default" : "Đặt lại về mặc định"}">${en ? "Reset" : "Đặt lại"}</button>
    </div>

    <div class="tada-filter-presets-wrap">
      ${Object.entries(VIDEO_FILTER_PRESETS).map(([key, p]) => `
        <button class="tada-filter-preset-pill" data-preset="${key}">
          <span>${en ? (presetNamesEn[key] || p.name) : p.name}</span>
        </button>
      `).join("")}
    </div>

    <div class="tada-filter-slider-group">
      <div class="tada-filter-slider-item">
        <div class="tada-filter-slider-meta">
          <span>${en ? "Brightness" : "Độ sáng"}</span>
          <span class="tada-filter-slider-val" id="pop-filter-brightness-val">${bVal}%</span>
        </div>
        <input type="range" class="tada-filter-range" id="pop-filter-brightness" min="50" max="200" step="5" value="${bVal}">
      </div>

      <div class="tada-filter-slider-item">
        <div class="tada-filter-slider-meta">
          <span>${en ? "Contrast" : "Độ tương phản"}</span>
          <span class="tada-filter-slider-val" id="pop-filter-contrast-val">${cVal}%</span>
        </div>
        <input type="range" class="tada-filter-range" id="pop-filter-contrast" min="50" max="200" step="5" value="${cVal}">
      </div>

      <div class="tada-filter-slider-item">
        <div class="tada-filter-slider-meta">
          <span>${en ? "Saturation" : "Độ bão hòa màu"}</span>
          <span class="tada-filter-slider-val" id="pop-filter-saturation-val">${sVal}%</span>
        </div>
        <input type="range" class="tada-filter-range" id="pop-filter-saturation" min="0" max="200" step="5" value="${sVal}">
      </div>

      <div class="tada-filter-slider-item">
        <div class="tada-filter-slider-meta">
          <span>${en ? "Warmth / Eye Care" : "Tông ấm / Dịu mắt"}</span>
          <span class="tada-filter-slider-val" id="pop-filter-warmth-val">${wVal}%</span>
        </div>
        <input type="range" class="tada-filter-range" id="pop-filter-warmth" min="0" max="100" step="5" value="${wVal}">
      </div>
    </div>
  `;

  // Attach Listeners
  popover.addEventListener("click", (e) => {
    e.stopPropagation();
    const presetBtn = e.target.closest("[data-preset]");
    if (presetBtn) {
      applyPresetValues(presetBtn.dataset.preset);
      return;
    }
    const resetBtn = e.target.closest("#tada-filter-reset-btn");
    if (resetBtn) {
      applyPresetValues("reset");
      return;
    }
  });

  const bindSlider = (sliderId, valId, settingKey) => {
    const slider = popover.querySelector(`#${sliderId}`);
    const valLabel = popover.querySelector(`#${valId}`);
    if (!slider || !valLabel) return;

    slider.addEventListener("input", (e) => {
      const val = Number(e.target.value);
      valLabel.textContent = `${val}%`;
      currentSettings[settingKey] = val;
      updateVideoFilterStyle();
      updateVideoFilterButtonState();
      persistFilterSettings(false);

      popover.querySelectorAll(".tada-filter-preset-pill").forEach(pill => pill.classList.remove("active"));
    });

    slider.addEventListener("change", () => {
      persistFilterSettings(true);
    });
  };

  bindSlider("pop-filter-brightness", "pop-filter-brightness-val", "filterBrightness");
  bindSlider("pop-filter-contrast", "pop-filter-contrast-val", "filterContrast");
  bindSlider("pop-filter-saturation", "pop-filter-saturation-val", "filterSaturation");
  bindSlider("pop-filter-warmth", "pop-filter-warmth-val", "filterWarmth");

  player.appendChild(popover);

  // Position popover safely relative to player button
  const filterBtn = document.getElementById(VIDEO_FILTER_BUTTON_ID);
  if (filterBtn && player) {
    const pRect = player.getBoundingClientRect();
    const bRect = filterBtn.getBoundingClientRect();
    const rightOffset = Math.max(16, pRect.right - bRect.right - 10);
    popover.style.right = `${rightOffset}px`;
  }

  videoFilterOutsideHandler = (evt) => {
    if (!popover.contains(evt.target) && !evt.target.closest("#" + VIDEO_FILTER_BUTTON_ID)) {
      popover.remove();
      if (videoFilterOutsideHandler) {
        document.removeEventListener("click", videoFilterOutsideHandler, true);
        videoFilterOutsideHandler = null;
      }
    }
  };
  setTimeout(() => {
    if (popover.isConnected && videoFilterOutsideHandler) {
      document.addEventListener("click", videoFilterOutsideHandler, true);
    }
  }, 50);
}

function ensureVideoFilterButton() {
  if (!currentSettings.videoFilter) {
    removeVideoFilterButton();
    return;
  }

  ensureVideoFilterButtonStyle();

  const settingsBtn = document.querySelector(".ytp-settings-button");
  const speedBtn = document.getElementById(SPEED_BUTTON_ID);
  const rightControls = document.querySelector(".ytp-right-controls") ||
    settingsBtn?.closest?.(".ytp-right-controls") ||
    settingsBtn?.parentElement;

  if (!rightControls && !settingsBtn) return;

  let isNew = false;
  let btn = document.getElementById(VIDEO_FILTER_BUTTON_ID);
  if (!btn || !document.contains(btn)) {
    if (btn) btn.remove();
    isNew = true;

    btn = document.createElement("button");
    btn.id = VIDEO_FILTER_BUTTON_ID;
    btn.className = "ytp-button tada-filter-button";
    const vfEn = typeof isEn === "function" && isEn();
    btn.setAttribute("aria-label", vfEn ? "Color & Lighting Filter" : "Bộ lọc màu & Ánh sáng");
    btn.setAttribute("title", vfEn ? "Color & Lighting Filter (TADa)" : "Bộ lọc màu & Ánh sáng (TADa)");

    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tada-filter-icon">
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <line x1="20" y1="4" x2="8.5" y2="4" />
        <line x1="20" y1="12" x2="4" y2="12" />
        <line x1="20" y1="20" x2="8.5" y2="20" />
      </svg>
      <span class="tada-filter-dot"></span>
    `;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleVideoFilterPopover();
    });

    btn.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
      applyPresetValues("reset");
      if (typeof showHudNotification === "function") {
        const resetEn = typeof isEn === "function" && isEn();
        showHudNotification(resetEn ? "Video filter: Reset to default" : "Bộ lọc video: Đã đặt lại mặc định");
      }
    });

    if (settingsBtn) {
      settingsBtn.insertAdjacentElement("beforebegin", btn);
    } else if (rightControls) {
      rightControls.appendChild(btn);
    }
  }

  updateVideoFilterButtonState();
  if (isNew && typeof applyToolbarLayout === "function") {
    applyToolbarLayout();
  }
}

function removeVideoFilterButton() {
  const btn = document.getElementById(VIDEO_FILTER_BUTTON_ID);
  if (btn) btn.remove();
  const popover = document.getElementById(VIDEO_FILTER_POPOVER_ID);
  if (popover) popover.remove();
  if (videoFilterOutsideHandler) {
    document.removeEventListener("click", videoFilterOutsideHandler, true);
    videoFilterOutsideHandler = null;
  }
}

function startVideoFilterCheck() {
  if (videoFilterCheckInterval) {
    clearInterval(videoFilterCheckInterval);
    videoFilterCheckInterval = null;
  }

  let count = 0;
  ensureVideoFilterButton();
  updateVideoFilterStyle();
  applyFilterToVideoElements();

  videoFilterCheckInterval = setInterval(() => {
    count++;
    if (isWatchPage()) {
      ensureVideoFilterButton();
      applyFilterToVideoElements();
    }
    if (count > 25 && document.getElementById(VIDEO_FILTER_BUTTON_ID)) {
      clearInterval(videoFilterCheckInterval);
      videoFilterCheckInterval = null;
    }
  }, 300);
}

function applyVideoFilterSetting() {
  updateVideoFilterStyle();
  if (currentSettings.videoFilter) {
    startVideoFilterCheck();
  } else {
    removeVideoFilterButton();
  }
}
