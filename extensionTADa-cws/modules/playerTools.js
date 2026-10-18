/**
 * TADa for YouTube - Player Tools Module
 * PiP Button, 4K Screenshot, and Fine Playback Speed Controls
 */

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
  const en = typeof isEn === "function" && isEn();
  if (isPipActive) {
    btn.classList.add("tada-pip-active");
    btn.setAttribute("aria-label", en ? "Exit Picture-in-Picture (P)" : "Thoát hình trong hình (P)");
    btn.setAttribute("title", en ? "Exit Picture-in-Picture (P)" : "Thoát hình trong hình (P)");
  } else {
    btn.classList.remove("tada-pip-active");
    btn.setAttribute("aria-label", en ? "Picture-in-Picture (P)" : "Hình trong hình (P)");
    btn.setAttribute("title", en ? "Picture-in-Picture (P)" : "Hình trong hình (P)");
  }
}

function handleGlobalPipHotkeys(event) {
  if (currentSettings.hotkeysEnabled === false) return;
  if (!currentSettings.pipButton) return;
  if (event.defaultPrevented) return;

  if (shouldIgnoreKeyEvent(event) || event.target?.closest?.("ytd-comments, #comments, #search-input, [role='textbox']")) {
    return;
  }

  if (matchesHotkey(event, "pip")) {
    const video = getMainVideoElement();
    if (!video) return;

    event.preventDefault();
    event.stopPropagation();
    togglePictureInPicture();
  }
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

  let isNew = false;
  let btn = document.getElementById(PIP_BUTTON_ID);
  if (!btn || !document.contains(btn)) {
    if (btn) btn.remove();
    isNew = true;

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
      settingsBtn.insertAdjacentElement("beforebegin", btn);
    } else if (rightControls) {
      rightControls.appendChild(btn);
    }
  }

  updatePipButtonState();
  bindVideoPipListeners();
  if (isNew && typeof applyToolbarLayout === "function") {
    applyToolbarLayout();
  }
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
    t.className = "tada-screenshot-toast info";
    player.appendChild(t);
  }
  t.innerHTML = `
    <div class="info__icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
        <path fill="#fff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path>
      </svg>
    </div>
    <div class="info__title">${msg}</div>
    <div class="info__close" title="Đóng">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
        <path fill="#fff" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
      </svg>
    </div>
  `;
  const closeBtn = t.querySelector(".info__close");
  if (closeBtn) {
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      t.classList.remove("show");
      if (t._timer) clearTimeout(t._timer);
    };
  }
  t.classList.remove("show");
  void t.offsetWidth;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => {
    t.classList.remove("show");
  }, 2600);
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

    if (typeof buildVideoFilterCss === "function") {
      const activeFilter = buildVideoFilterCss(currentSettings);
      if (activeFilter && activeFilter !== "none") {
        ctx.filter = activeFilter;
      }
    }

    ctx.drawImage(video, 0, 0, width, height);

    // Hiệu ứng chớp sáng màn trập máy ảnh
    triggerScreenshotFlash();

    // Hiệu ứng bấm máy ảnh 3D Toy Camera (wet-jellyfish-8)
    const camBtn = document.getElementById(SCREENSHOT_BUTTON_ID);
    if (camBtn) {
      camBtn.classList.remove("snapping");
      void camBtn.offsetWidth;
      camBtn.classList.add("snapping");
      setTimeout(() => camBtn.classList.remove("snapping"), 1100);
    }

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
  if (currentSettings.hotkeysEnabled === false) return;
  if (!currentSettings.videoScreenshot) return;
  if (event.defaultPrevented) return;

  if (shouldIgnoreKeyEvent(event) || event.target?.closest?.("ytd-comments, #comments, #search-input, [role='textbox']")) {
    return;
  }

  const video = getMainVideoElement();
  if (!video) return;

  if (matchesHotkey(event, "screenshotClipboard")) {
    event.preventDefault();
    event.stopPropagation();
    takeVideoScreenshot({ copyToClipboard: true });
    return;
  }

  if (matchesHotkey(event, "screenshot")) {
    event.preventDefault();
    event.stopPropagation();
    takeVideoScreenshot({ copyToClipboard: false });
    return;
  }
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

  let isNew = false;
  let btn = document.getElementById(SCREENSHOT_BUTTON_ID);
  if (!btn || !document.contains(btn)) {
    if (btn) btn.remove();
    isNew = true;

    btn = document.createElement("button");
    btn.id = SCREENSHOT_BUTTON_ID;
    btn.className = "ytp-button tada-screenshot-button";
    const scEn = typeof isEn === "function" && isEn();
    btn.setAttribute("aria-label", scEn ? "Screenshot (S)" : "Chụp ảnh màn hình (S)");
    btn.setAttribute("title", scEn ? "Capture Screenshot (S) • Right-click / Shift: Copy to Clipboard" : "Chụp ảnh màn hình (S) • Chuột phải / Shift: Sao chép Clipboard");
    btn.innerHTML = `
      <div class="toy-camera-wrapper">
        <div class="toy-camera-body">
          <div class="toy-camera-button"></div>
          <div class="toy-camera-lens"></div>
          <div class="toy-camera-photo">
            <div class="photo-image"></div>
            <div class="photo-text"></div>
          </div>
        </div>
        <div class="toy-camera-shadow"></div>
      </div>
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

    if (settingsBtn) {
      settingsBtn.insertAdjacentElement("beforebegin", btn);
    } else if (rightControls) {
      rightControls.appendChild(btn);
    }
  }

  if (isNew && typeof applyToolbarLayout === "function") {
    applyToolbarLayout();
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
        /* ===== TADa SCREENSHOT & TOY CAMERA (UIVERSE WET-JELLYFISH-8) ===== */
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
          width: 46px;
          height: 100%;
          opacity: 0.95;
          user-select: none;
          -webkit-user-select: none;
          vertical-align: top;
          overflow: visible !important;
          transition: opacity 0.15s ease;
        }
        .tada-screenshot-button:hover {
          opacity: 1;
        }

        .tada-screenshot-button .toy-camera-wrapper,
        .tada-screenshot-button .toy-camera-wrapper * {
          pointer-events: none !important;
        }

        .tada-screenshot-button .toy-camera-wrapper {
          --cam-main: #00d2d3;
          --cam-dark: #01a3a4;
          --cam-accent: #ff9f43;
          --cam-shutter: #ff4757;
          --photo-bg: #ffffff;
          --toy-size: 26px;
          --elastic: cubic-bezier(0.68, -0.6, 0.32, 1.6);
          font-size: 4.8px;

          position: relative;
          width: var(--toy-size);
          height: calc(var(--toy-size) * 0.85);
          perspective: 800px;
          cursor: pointer;
          overflow: visible;
          transition: transform 0.2s ease;
        }

        .tada-screenshot-button:hover .toy-camera-wrapper {
          transform: scale(1.08);
        }

        .tada-screenshot-button .toy-camera-body {
          position: absolute;
          inset: 0;
          background: var(--cam-main);
          border-radius: 1.2em;
          transform-style: preserve-3d;
          transform: translateZ(10px);
          transition: all 0.4s var(--elastic);
          box-shadow:
            0 0.5em 0 var(--cam-dark),
            0 0.8em 1.5em rgba(0, 0, 0, 0.35),
            inset 0 0.2em 0.3em rgba(255, 255, 255, 0.4);
          z-index: 10;
        }

        .tada-screenshot-button:hover .toy-camera-body {
          transform: translateZ(18px) rotateX(10deg);
        }

        .tada-screenshot-button .toy-camera-body::before {
          content: "";
          position: absolute;
          top: 20%;
          left: 0;
          width: 100%;
          height: 15%;
          background: var(--cam-accent);
          box-shadow: inset 0 0.1em 0.2em rgba(0, 0, 0, 0.1);
        }

        .tada-screenshot-button .toy-camera-button {
          position: absolute;
          top: -0.55em;
          right: 15%;
          width: 1.2em;
          height: 0.75em;
          background: var(--cam-shutter);
          border-radius: 0.3em 0.3em 0 0;
          box-shadow:
            0 0.2em 0 #cc3643,
            inset 0 0.1em 0.1em rgba(255, 255, 255, 0.3);
          transition: all 0.2s ease;
        }

        .tada-screenshot-button.snapping .toy-camera-button,
        .tada-screenshot-button:active .toy-camera-button {
          transform: translateY(0.35em);
          box-shadow: 0 0.05em 0 #cc3643;
        }

        .tada-screenshot-button .toy-camera-lens {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 58%;
          height: 64%;
          background: #2d3436;
          border-radius: 50%;
          transform: translate(-50%, -40%) translateZ(8px);
          border: 0.3em solid var(--cam-dark);
          box-shadow:
            0 0.3em 0.6em rgba(0, 0, 0, 0.4),
            inset 0 0.2em 0.4em rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .tada-screenshot-button .toy-camera-lens::after {
          content: "";
          position: absolute;
          top: 15%;
          left: 20%;
          width: 32%;
          height: 22%;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: rotate(-25deg);
        }

        .tada-screenshot-button .toy-camera-photo {
          position: absolute;
          top: 0;
          left: 50%;
          width: 80%;
          height: 85%;
          background: var(--photo-bg);
          border-radius: 0.4em;
          transform: translateX(-50%) translateZ(-10px) translateY(0);
          transition: all 0.6s var(--elastic);
          box-shadow:
            0 0.2em 0.6em rgba(0, 0, 0, 0.35),
            inset 0 0 0 0.2em #f1f2f6;
          display: flex;
          flex-direction: column;
          padding: 0.4em;
          box-sizing: border-box;
          opacity: 0;
          pointer-events: none;
          z-index: 20;
        }

        .tada-screenshot-button .photo-image {
          width: 100%;
          height: 65%;
          background: #74b9ff;
          border-radius: 0.2em;
          position: relative;
          overflow: hidden;
        }

        .tada-screenshot-button .photo-image::after {
          content: "";
          position: absolute;
          top: 15%;
          right: 15%;
          width: 0.5em;
          height: 0.5em;
          background: #ffeaa7;
          border-radius: 50%;
        }

        .tada-screenshot-button .photo-text {
          width: 60%;
          height: 0.25em;
          background: #dfe6e9;
          margin-top: 0.35em;
          border-radius: 0.1em;
        }

        .tada-screenshot-button.snapping .toy-camera-body {
          transform: translateZ(25px) scale(0.96);
        }

        .tada-screenshot-button.snapping .toy-camera-photo {
          opacity: 1;
          animation: photo-bounce-up 0.9s var(--elastic) forwards;
        }

        .tada-screenshot-button.snapping .toy-camera-lens::before {
          content: "";
          position: absolute;
          inset: 0;
          background: white;
          opacity: 0;
          animation: lens-flash 0.4s ease-out;
          border-radius: 50%;
        }

        @keyframes photo-bounce-up {
          0% {
            transform: translateX(-50%) translateY(0) scale(0.7);
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
          100% {
            transform: translateX(-50%) translateY(-135%) rotate(-8deg) scale(1.05);
            opacity: 1;
          }
        }

        @keyframes lens-flash {
          0% {
            opacity: 1;
            transform: scale(0.1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.5);
          }
          100% {
            opacity: 0;
            transform: scale(2);
          }
        }

        .tada-screenshot-button .toy-camera-shadow {
          position: absolute;
          bottom: -0.6em;
          left: 50%;
          width: 85%;
          height: 1.2em;
          background: radial-gradient(circle, rgba(0, 0, 0, 0.4) 0%, transparent 70%);
          transform: translateX(-50%);
          transition: all 0.4s ease;
          pointer-events: none;
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
          transform: translate(-50%, -14px) scale(0.96);
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          min-width: 260px;
          max-width: 420px;
          width: fit-content;
          padding: 10px 14px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          background: #509AF8;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5), 0 0 5px -2px #111;
          color: #fff;
          box-sizing: border-box;
          pointer-events: auto;
          opacity: 0;
          z-index: 1000;
          transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .tada-screenshot-toast.show {
          opacity: 1;
          transform: translate(-50%, 0) scale(1);
        }
        .tada-screenshot-toast .info__icon {
          width: 20px;
          height: 20px;
          margin-right: 8px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tada-screenshot-toast .info__icon path { fill: #fff; }
        .tada-screenshot-toast .info__title {
          font-weight: 500;
          font-size: 13px;
          color: #fff;
          line-height: 1.35;
          flex: 1;
        }
        .tada-screenshot-toast .info__close {
          width: 20px;
          height: 20px;
          margin-left: 12px;
          cursor: pointer;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.85;
          transition: opacity 0.15s, transform 0.15s;
        }
        .tada-screenshot-toast .info__close:hover {
          opacity: 1;
          transform: scale(1.15);
        }
        .tada-screenshot-toast .info__close path { fill: #fff; }
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
  const spEn = typeof isEn === "function" && isEn();
  btn.setAttribute("title", spEn ? `Speed: ${rateText} • Click: Menu • Right-click: 1.0x • Scroll: ±0.05x • Keys [>] [<] [=]` : `Tốc độ: ${rateText} • Click: Menu • Chuột phải: 1.0x • Cuộn: ±0.05x • Phím [>] [<] [=]`);
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

let speedOutsideHandler = null;

function toggleSpeedPresetMenu() {
  const player = document.getElementById("movie_player") || document.querySelector(".html5-video-player");
  if (!player) return;

  if (speedOutsideHandler) {
    document.removeEventListener("click", speedOutsideHandler, true);
    speedOutsideHandler = null;
  }

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
      if (speedOutsideHandler) {
        document.removeEventListener("click", speedOutsideHandler, true);
        speedOutsideHandler = null;
      }
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
      if (speedOutsideHandler) {
        document.removeEventListener("click", speedOutsideHandler, true);
        speedOutsideHandler = null;
      }
      menu.remove();
      return;
    }
  });

  player.appendChild(menu);

  speedOutsideHandler = (evt) => {
    if (!menu.contains(evt.target) && !evt.target.closest("#" + SPEED_BUTTON_ID)) {
      menu.remove();
      if (speedOutsideHandler) {
        document.removeEventListener("click", speedOutsideHandler, true);
        speedOutsideHandler = null;
      }
    }
  };
  setTimeout(() => {
    if (menu.isConnected && speedOutsideHandler) {
      document.addEventListener("click", speedOutsideHandler, true);
    }
  }, 50);
}

function handleGlobalSpeedHotkeys(event) {
  if (currentSettings.hotkeysEnabled === false) return;
  if (!currentSettings.customSpeed) return;
  if (event.defaultPrevented) return;

  if (shouldIgnoreKeyEvent(event) || event.target?.closest?.("ytd-comments, #comments, #search-input, [role='textbox']")) {
    return;
  }

  if (matchesHotkey(event, "speedUp")) {
    event.preventDefault();
    event.stopPropagation();
    const step = event.altKey ? SPEED_FINE_STEP : SPEED_STEP;
    setCustomPlaybackRate(currentCustomSpeed + step);
    return;
  }

  if (matchesHotkey(event, "speedDown")) {
    event.preventDefault();
    event.stopPropagation();
    const step = event.altKey ? SPEED_FINE_STEP : SPEED_STEP;
    setCustomPlaybackRate(currentCustomSpeed - step);
    return;
  }

  if (matchesHotkey(event, "speedReset")) {
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

  let isNew = false;
  let btn = document.getElementById(SPEED_BUTTON_ID);
  if (!btn || !document.contains(btn)) {
    if (btn) btn.remove();
    isNew = true;

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
      settingsBtn.insertAdjacentElement("beforebegin", btn);
    } else if (rightControls) {
      rightControls.appendChild(btn);
    }
  }

  updateSpeedButtonText();
  bindVideoSpeedListeners();
  if (isNew && typeof applyToolbarLayout === "function") {
    applyToolbarLayout();
  }
}

function removeSpeedButton() {
  const btn = document.getElementById(SPEED_BUTTON_ID);
  if (btn) btn.remove();
  document.getElementById(SPEED_PRESET_MENU_ID)?.remove();
  document.getElementById(SPEED_HUD_ID)?.remove();
  if (speedOutsideHandler) {
    document.removeEventListener("click", speedOutsideHandler, true);
    speedOutsideHandler = null;
  }
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
          pointer-events: none !important;
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

/* ======================================================= */
/* [TOOLBAR MANAGER] Toolbar Order & Visibility Controller */
/* ======================================================= */

const TADA_TOOLBAR_GROUP_ID = "tada-toolbar-group";

const TOOLBAR_ITEM_MAP = {
  cinemaMode: { domIds: [CINEMA_BUTTON_ID], settingKey: "cinemaMode" },
  videoFilter: { domIds: [VIDEO_FILTER_BUTTON_ID], settingKey: "videoFilter" },
  customSpeed: { domIds: [SPEED_BUTTON_ID], settingKey: "customSpeed" },
  pipButton: { domIds: [PIP_BUTTON_ID], settingKey: "pipButton" },
  videoScreenshot: { domIds: [SCREENSHOT_BUTTON_ID], settingKey: "videoScreenshot" },
  videoBookmarks: { domIds: [BOOKMARK_ADD_BTN_ID, BOOKMARK_BTN_ID], settingKey: "videoBookmarks" },
  abLooper: { domIds: [AB_BTN_ID, AB_CLEAR_BTN_ID], settingKey: "abLooper" }
};

let isApplyingToolbarLayout = false;

function applyToolbarLayout() {
  if (!isWatchPage()) return;
  if (isApplyingToolbarLayout) return;
  isApplyingToolbarLayout = true;

  try {
    const order = Array.isArray(currentSettings.toolbarOrder) && currentSettings.toolbarOrder.length > 0
      ? currentSettings.toolbarOrder
      : (window.DEFAULT_TOOLBAR_ORDER || ["abLooper", "cinemaMode", "videoFilter", "customSpeed", "pipButton", "videoScreenshot", "videoBookmarks"]);
    const hidden = currentSettings.toolbarHidden || {};
    const abPos = currentSettings.abLooperPosition || "left";
    const anchorPref = currentSettings.toolbarAnchor || "beforeSettings";

    // Clean up any legacy #tada-toolbar-group wrapper if present
    const oldGroup = document.getElementById(TADA_TOOLBAR_GROUP_ID);
    if (oldGroup) {
      while (oldGroup.firstChild) {
        oldGroup.parentNode?.insertBefore(oldGroup.firstChild, oldGroup);
      }
      oldGroup.remove();
    }
    const oldStyle = document.getElementById("tada-toolbar-group-style");
    if (oldStyle) oldStyle.remove();

    const timeDisplay = document.querySelector(".ytp-time-display");

    // 1. Process A-B Looper placement
    const abBtn = document.getElementById(AB_BTN_ID);
    const abClearBtn = document.getElementById(AB_CLEAR_BTN_ID);
    const isAbFeatureOn = Boolean(currentSettings.abLooper);
    const isAbHidden = Boolean(hidden.abLooper);

    if (abBtn) {
      if (!isAbFeatureOn || isAbHidden) {
        abBtn.style.setProperty("display", "none", "important");
        if (abClearBtn) abClearBtn.style.setProperty("display", "none", "important");
      } else {
        abBtn.style.removeProperty("display");
        if (abClearBtn) abClearBtn.style.removeProperty("display");

        if (abPos === "left") {
          if (timeDisplay && abBtn.previousElementSibling !== timeDisplay) {
            timeDisplay.insertAdjacentElement("afterend", abBtn);
            if (abClearBtn) abBtn.insertAdjacentElement("afterend", abClearBtn);
          }
        }
      }
    }

    const settingsBtn = document.querySelector(".ytp-settings-button");
    const rightControls = document.querySelector(".ytp-right-controls") ||
      settingsBtn?.closest?.(".ytp-right-controls") ||
      settingsBtn?.parentElement;

    if (!settingsBtn && !rightControls) return;

    // 2. Position right-controls buttons
    const buttonsToInsert = [];

    order.forEach((id) => {
      if (id === "abLooper" && abPos === "left") return;
      const def = TOOLBAR_ITEM_MAP[id];
      if (!def) return;

      const isFeatureOn = Boolean(currentSettings[def.settingKey]);
      const isHidden = Boolean(hidden[id]);
      const domIds = def.domIds || (def.domId ? [def.domId] : []);

      domIds.forEach((domId) => {
        if (!domId) return;
        const btn = document.getElementById(domId);
        if (!btn) return;

        if (!isFeatureOn || isHidden) {
          btn.style.setProperty("display", "none", "important");
        } else {
          btn.style.removeProperty("display");
          buttonsToInsert.push(btn);
        }
      });
    });

    if (buttonsToInsert.length === 0) return;

    // 3. Anchor placement (Idempotent: do not touch DOM if already in correct order)
    if (settingsBtn && document.contains(settingsBtn)) {
      if (anchorPref === "afterSettings") {
        let isAlreadyInOrder = true;
        let prev = settingsBtn;
        for (let i = 0; i < buttonsToInsert.length; i++) {
          const btn = buttonsToInsert[i];
          if (btn.previousElementSibling !== prev || btn.parentElement !== settingsBtn.parentElement) {
            isAlreadyInOrder = false;
            break;
          }
          prev = btn;
        }

        if (!isAlreadyInOrder) {
          let currentRef = settingsBtn;
          buttonsToInsert.forEach((btn) => {
            if (btn.previousElementSibling !== currentRef) {
              currentRef.insertAdjacentElement("afterend", btn);
            }
            currentRef = btn;
          });
        }
      } else {
        // "beforeSettings": buttonsToInsert should precede settingsBtn in exact sequence
        let isAlreadyInOrder = true;
        for (let i = 0; i < buttonsToInsert.length; i++) {
          const btn = buttonsToInsert[i];
          const expectedNext = (i === buttonsToInsert.length - 1) ? settingsBtn : buttonsToInsert[i + 1];
          if (btn.nextElementSibling !== expectedNext || btn.parentElement !== settingsBtn.parentElement) {
            isAlreadyInOrder = false;
            break;
          }
        }

        if (!isAlreadyInOrder) {
          settingsBtn.insertAdjacentElement("beforebegin", buttonsToInsert[0]);
          for (let i = 1; i < buttonsToInsert.length; i++) {
            buttonsToInsert[i - 1].insertAdjacentElement("afterend", buttonsToInsert[i]);
          }
        }
      }
    } else if (rightControls) {
      let isAlreadyInOrder = true;
      for (let i = 0; i < buttonsToInsert.length; i++) {
        if (buttonsToInsert[i].parentElement !== rightControls) {
          isAlreadyInOrder = false;
          break;
        }
      }
      if (!isAlreadyInOrder) {
        buttonsToInsert.forEach((btn) => {
          try {
            if (btn.parentElement !== rightControls) {
              rightControls.appendChild(btn);
            }
          } catch {}
        });
      }
    }
  } catch (err) {
    console.debug("[TADa] applyToolbarLayout error:", err);
  } finally {
    isApplyingToolbarLayout = false;
  }
}
window.applyToolbarLayout = applyToolbarLayout;
globalThis.applyToolbarLayout = applyToolbarLayout;


