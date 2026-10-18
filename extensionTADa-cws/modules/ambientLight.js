/**
 * TADa for YouTube - Real-time Ambient Light Engine
 */

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

