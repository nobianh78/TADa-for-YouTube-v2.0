/**
 * TADa for YouTube - Super Volume Booster 500% Module
 */

let superVolumePercent = SUPER_VOLUME_DEFAULT;
let superVolumePreferenceLoaded = false;
let superVolumeAudioCtx = null;
let superVolumeGainNode = null;
let superVolumeSourceMap = new WeakMap();
let superVolumeHotkeysBound = false;
let suppressNativeVolumeEvent = false;
let sliderDragActive = false;

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
  if (currentSettings.hotkeysEnabled === false) {
    return;
  }
  if (!currentSettings.superVolume) {
    return;
  }
  if (event.defaultPrevented) {
    return;
  }
  if (shouldIgnoreKeyEvent(event)) {
    return;
  }

  if (matchesHotkey(event, "volumeUp")) {
    event.preventDefault();
    event.stopImmediatePropagation();
    resumeSuperVolumeContext();
    setSuperVolumePercent(superVolumePercent + SUPER_VOLUME_FAST_STEP);
    return;
  }

  if (matchesHotkey(event, "volumeDown")) {
    event.preventDefault();
    event.stopImmediatePropagation();
    resumeSuperVolumeContext();
    setSuperVolumePercent(superVolumePercent - SUPER_VOLUME_FAST_STEP);
    return;
  }
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

