/**
 * TADa for YouTube - SponsorBlock / Auto-Skip Segments Module
 */

/* ===== TADa AUTO-SKIP SEGMENTS (SPONSORBLOCK & INTRO/OUTRO) ===== */
let currentSkipVideoId = null;
let videoSkipSegments = [];
let lastSkippedRecord = null;
let ignoredSkipSegments = new Set();
let skipToastTimer = null;
let skipCheckInterval = null;
let isFetchingSkipSegments = false;
let boundVideoElement = null;
let skipHotkeyBound = false;

const SKIP_CATEGORIES = {
  sponsor: { label: "Nhà tài trợ", labelEn: "Sponsor", color: "#f59e0b" },
  intro: { label: "Đoạn mở đầu (Intro)", labelEn: "Intro", color: "#10b981" },
  outro: { label: "Đoạn kết thúc (Outro)", labelEn: "Outro", color: "#3b82f6" },
  selfpromo: { label: "Tự quảng bá", labelEn: "Self Promotion", color: "#8b5cf6" },
  interaction: { label: "Nhắc like & đăng ký", labelEn: "Interaction Reminder", color: "#ec4899" },
  preview: { label: "Đoạn xem trước", labelEn: "Preview Segment", color: "#06b6d4" },
  music_offtopic: { label: "Đoạn ngoài lề", labelEn: "Off-topic Segment", color: "#64748b" }
};

function formatSkipTime(sec) {
  if (isNaN(sec) || sec === null) return "0:00";
  const s = Math.floor(sec % 60);
  const m = Math.floor((sec / 60) % 60);
  const h = Math.floor(sec / 3600);
  const pad = (n) => n.toString().padStart(2, "0");
  if (h > 0) return `${h}:${pad(m)}:${pad(s)}`;
  return `${m}:${pad(s)}`;
}

function parseTimestampToSeconds(str) {
  if (!str) return null;
  const parts = str.trim().split(":").map(Number);
  if (parts.some(isNaN)) return null;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return null;
}

function parseYouTubeChaptersFallback() {
  const chapters = [];
  try {
    const markerItems = document.querySelectorAll("ytd-macro-markers-list-item-renderer");
    if (markerItems.length > 0) {
      markerItems.forEach((item) => {
        const timeText = item.querySelector("#time, .ytd-macro-markers-list-item-renderer #time, #thumbnail time")?.textContent?.trim();
        const titleText = item.querySelector("#details h4, #title, #endpoint")?.textContent?.trim();
        if (timeText && titleText) {
          const seconds = parseTimestampToSeconds(timeText);
          if (seconds !== null) {
            chapters.push({ seconds, title: titleText });
          }
        }
      });
    }

    if (chapters.length < 2) {
      const descEl = document.querySelector("#description-inline-expander, #description, ytd-text-inline-expander");
      if (descEl) {
        const lines = descEl.innerText.split("\n");
        const tsRegex = /(?:^|\s)(\d{1,2}:\d{2}(?::\d{2})?)\s+(.+)$/;
        for (const line of lines) {
          const match = line.trim().match(tsRegex);
          if (match) {
            const sec = parseTimestampToSeconds(match[1]);
            if (sec !== null) {
              chapters.push({ seconds: sec, title: match[2].trim() });
            }
          }
        }
      }
    }
  } catch (e) {
    console.debug("[TADa] chapter parse error", e);
  }
  return chapters;
}

async function computeSha256Prefix(text, len = 4) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").substring(0, len);
  } catch (e) {
    return "";
  }
}

async function fetchSkipSegments(videoId) {
  if (!videoId || isFetchingSkipSegments) return;
  currentSkipVideoId = videoId;
  videoSkipSegments = [];
  ignoredSkipSegments.clear();
  lastSkippedRecord = null;
  isFetchingSkipSegments = true;

  try {
    let rawSegments = null;

    // 1. Try background message
    try {
      const response = await new Promise((resolve) => {
        if (typeof chrome !== "undefined" && chrome.runtime?.id && chrome.runtime?.sendMessage) {
          chrome.runtime.sendMessage({ type: "GET_SPONSOR_SEGMENTS", videoId }, (res) => {
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

      if (response?.success && Array.isArray(response.segments)) {
        rawSegments = response.segments;
      }
    } catch (bgErr) {
      console.debug("[TADa] Background sponsor fetch error:", bgErr);
    }

    // 2. Direct fetch fallback
    if (!rawSegments) {
      try {
        const prefix = await computeSha256Prefix(videoId, 4);
        if (prefix) {
          const categories = JSON.stringify([
            "sponsor",
            "intro",
            "outro",
            "selfpromo",
            "interaction",
            "preview"
          ]);
          const directRes = await fetch(
            `https://api.sponsor.ajay.app/api/skipSegments/${prefix}?categories=${encodeURIComponent(categories)}`
          );
          if (directRes.ok) {
            const list = await directRes.json();
            if (Array.isArray(list)) {
              const match = list.find((v) => v.videoID === videoId);
              if (match && Array.isArray(match.segments)) {
                rawSegments = match.segments;
              }
            }
          }
        }
      } catch (directErr) {
        console.debug("[TADa] Direct sponsor fetch error:", directErr);
      }
    }

    if (currentSkipVideoId === videoId) {
      const parsed = [];
      if (Array.isArray(rawSegments)) {
        for (const item of rawSegments) {
          if (item?.segment && Array.isArray(item.segment) && item.segment.length === 2) {
            const start = Number(item.segment[0]);
            const end = Number(item.segment[1]);
            if (!isNaN(start) && !isNaN(end) && end > start) {
              const catKey = item.category || "sponsor";
              const catInfo = SKIP_CATEGORIES[catKey] || { label: "Đoạn bỏ qua", labelEn: "Skipped Segment", color: "#38bdf8" };
              parsed.push({
                start,
                end,
                category: catKey,
                label: (typeof isEn === "function" && isEn() ? (catInfo.labelEn || catInfo.label) : catInfo.label),
                color: catInfo.color,
                actionType: item.actionType || "skip"
              });
            }
          }
        }
      }

      const hasIntro = parsed.some((p) => p.category === "intro");
      const video = getMainVideoElement();
      const dur = video?.duration || 0;
      const chapters = parseYouTubeChaptersFallback();
      if (chapters.length >= 2) {
        if (!hasIntro) {
          const c0 = chapters[0];
          const c1 = chapters[1];
          if (c0.seconds <= 5 && /intro|mở đầu|giới thiệu|chào mừng|opening|recap|lời chào/i.test(c0.title)) {
            parsed.push({
              start: 0,
              end: c1.seconds,
              category: "intro",
              label: (typeof isEn === "function" && isEn() ? `Intro (${c0.title})` : `Đoạn mở đầu (${c0.title})`),
              color: "#10b981",
              actionType: "skip"
            });
          }
        }
        const hasOutro = parsed.some((p) => p.category === "outro");
        if (!hasOutro && dur > 0) {
          const lastC = chapters[chapters.length - 1];
          if (lastC.seconds > 10 && dur > lastC.seconds && /outro|kết thúc|tạm biệt|end credits|credits/i.test(lastC.title)) {
            parsed.push({
              start: lastC.seconds,
              end: dur,
              category: "outro",
              label: (typeof isEn === "function" && isEn() ? `Outro (${lastC.title})` : `Đoạn kết thúc (${lastC.title})`),
              color: "#3b82f6",
              actionType: "skip"
            });
          }
        }
      }

      parsed.sort((a, b) => a.start - b.start);
      videoSkipSegments = parsed;
      updateSkipTimelineTrack();
    }
  } finally {
    isFetchingSkipSegments = false;
  }
}

function handleVideoTimeUpdate() {
  if (!currentSettings.autoSkipSegments || !videoSkipSegments.length) return;
  const video = getMainVideoElement();
  if (!video || video.paused || video.seeking) return;
  const currentTime = video.currentTime;

  for (const seg of videoSkipSegments) {
    const segKey = `${seg.start.toFixed(1)}-${seg.end.toFixed(1)}`;
    if (ignoredSkipSegments.has(segKey)) continue;

    if (currentTime >= (seg.start - 0.15) && currentTime < (seg.end - 0.35) && (seg.end - seg.start >= 1.0)) {
      const skippedFrom = currentTime;
      const skippedTo = seg.end;
      lastSkippedRecord = {
        videoId: currentSkipVideoId,
        segKey,
        from: skippedFrom,
        to: skippedTo,
        seg,
        timestamp: Date.now()
      };

      video.currentTime = skippedTo;
      showSkipToast(seg, skippedFrom, skippedTo);
      break;
    }
  }
}

function ensureSkipToastContainer() {
  let toast = document.getElementById(SKIP_TOAST_ID);
  const player = document.querySelector("#movie_player") || document.querySelector(".html5-video-player") || document.fullscreenElement || document.body;
  if (!toast) {
    toast = document.createElement("div");
    toast.id = SKIP_TOAST_ID;
    toast.className = "tada-skip-toast";
    player.appendChild(toast);
  } else if (toast.parentElement !== player) {
    player.appendChild(toast);
  }
  return toast;
}

function showSkipToast(seg, fromTime, toTime) {
  const toast = ensureSkipToastContainer();
  const savedSec = Math.max(1, Math.round(toTime - fromTime));
  const en = typeof isEn === "function" && isEn();

  const skipIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
    <path fill="#fff" d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/>
  </svg>`;

  toast.innerHTML = `
    <div class="info__icon">${skipIconSvg}</div>
    <div class="info__title">
      ${en ? `Skipped <strong>${seg.label}</strong> <span style="opacity:0.85;font-size:11px;">(saved ${savedSec}s)</span>` : `Đã bỏ qua <strong>${seg.label}</strong> <span style="opacity:0.85;font-size:11px;">(tiết kiệm ${savedSec}s)</span>`}
    </div>
    <button id="tada-skip-undo-btn" class="tada-skip-undo-btn" title="${en ? "Undo skip (key Z)" : "Hoàn tác đoạn vừa bỏ qua (phím Z)"}">
      <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
        <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/>
      </svg>
      <span>${en ? "Undo (Z)" : "Hoàn tác (Z)"}</span>
    </button>
    <div class="info__close" id="tada-skip-close-btn" title="${en ? "Close" : "Đóng"}">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
        <path fill="#fff" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
      </svg>
    </div>
  `;

  const undoBtn = toast.querySelector("#tada-skip-undo-btn");
  if (undoBtn) {
    undoBtn.onclick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      revertLastSkip();
    };
  }

  const closeBtn = toast.querySelector("#tada-skip-close-btn");
  if (closeBtn) {
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      toast.classList.remove("tada-skip-toast-show");
      if (skipToastTimer) clearTimeout(skipToastTimer);
    };
  }

  requestAnimationFrame(() => {
    toast.classList.add("tada-skip-toast-show");
  });

  if (skipToastTimer) clearTimeout(skipToastTimer);
  skipToastTimer = setTimeout(() => {
    toast.classList.remove("tada-skip-toast-show");
  }, 4500);
}

function showRevertedToast() {
  const toast = ensureSkipToastContainer();
  const en = typeof isEn === "function" && isEn();
  const undoIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
    <path fill="#fff" d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/>
  </svg>`;

  toast.innerHTML = `
    <div class="info__icon">${undoIconSvg}</div>
    <div class="info__title">${en ? "Reverted and kept playback segment" : "Đã hoàn tác và giữ lại đoạn phát"}</div>
    <div class="info__close" id="tada-skip-close-btn" title="${en ? "Close" : "Đóng"}">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
        <path fill="#fff" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
      </svg>
    </div>
  `;
  const closeBtn = toast.querySelector("#tada-skip-close-btn");
  if (closeBtn) {
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      toast.classList.remove("tada-skip-toast-show");
      if (skipToastTimer) clearTimeout(skipToastTimer);
    };
  }
  toast.classList.add("tada-skip-toast-show");
  if (skipToastTimer) clearTimeout(skipToastTimer);
  skipToastTimer = setTimeout(() => {
    toast.classList.remove("tada-skip-toast-show");
  }, 2400);
}

function revertLastSkip() {
  if (!lastSkippedRecord) return false;
  const now = Date.now();
  if (now - lastSkippedRecord.timestamp > 10000) return false;

  const video = getMainVideoElement();
  if (!video) return false;

  if (lastSkippedRecord.segKey) {
    ignoredSkipSegments.add(lastSkippedRecord.segKey);
  }

  video.currentTime = Math.max(0, lastSkippedRecord.from - 0.2);
  showRevertedToast();
  lastSkippedRecord = null;
  return true;
}

function bindSkipHotkeys() {
  if (skipHotkeyBound) return;
  skipHotkeyBound = true;
  document.addEventListener("keydown", (e) => {
    if (currentSettings.hotkeysEnabled === false) return;
    if (!currentSettings.autoSkipSegments) return;
    const activeEl = document.activeElement;
    const isInput = activeEl && (
      activeEl.tagName === "INPUT" ||
      activeEl.tagName === "TEXTAREA" ||
      activeEl.isContentEditable ||
      activeEl.getAttribute("role") === "textbox"
    );
    if (isInput) return;

    if (matchesHotkey(e, "sponsorRevert")) {
      const toast = document.getElementById(SKIP_TOAST_ID);
      if (toast && toast.classList.contains("tada-skip-toast-show") && lastSkippedRecord) {
        e.preventDefault();
        e.stopPropagation();
        revertLastSkip();
      }
    }
  }, true);
}

function updateSkipTimelineTrack() {
  const bar = document.querySelector(".ytp-progress-bar");
  if (!bar) return;

  let track = document.getElementById(SKIP_TRACK_ID);
  if (!currentSettings.autoSkipSegments || !videoSkipSegments.length) {
    if (track) track.remove();
    return;
  }

  const v = getMainVideoElement();
  const dur = v?.duration;
  if (!dur || isNaN(dur) || dur <= 0) {
    if (track) track.remove();
    return;
  }

  if (!track) {
    track = document.createElement("div");
    track.id = SKIP_TRACK_ID;
    track.className = "tada-skip-track";
    bar.appendChild(track);
  }

  let html = "";
  for (const seg of videoSkipSegments) {
    const leftPct = Math.max(0, Math.min(100, (seg.start / dur) * 100));
    const rightPct = Math.max(0, Math.min(100, (seg.end / dur) * 100));
    const widthPct = Math.max(0.3, rightPct - leftPct);
    const title = `${seg.label} (${formatSkipTime(seg.start)} - ${formatSkipTime(seg.end)})`;
    html += `<div class="tada-skip-segment-mark" style="left:${leftPct.toFixed(2)}%;width:${widthPct.toFixed(2)}%;background:${seg.color};" title="${title}"></div>`;
  }
  track.innerHTML = html;
}

function attachSkipVideoListeners() {
  const video = getMainVideoElement();
  if (!video) return;
  if (boundVideoElement === video) return;

  if (boundVideoElement) {
    boundVideoElement.removeEventListener("timeupdate", handleVideoTimeUpdate);
    boundVideoElement.removeEventListener("durationchange", updateSkipTimelineTrack);
    boundVideoElement.removeEventListener("loadedmetadata", updateSkipTimelineTrack);
  }

  boundVideoElement = video;
  video.addEventListener("timeupdate", handleVideoTimeUpdate);
  video.addEventListener("durationchange", updateSkipTimelineTrack, { passive: true });
  video.addEventListener("loadedmetadata", updateSkipTimelineTrack, { passive: true });
}

function startAutoSkipCheck() {
  if (!currentSettings.autoSkipSegments) {
    removeAutoSkipUI();
    return;
  }

  attachSkipVideoListeners();
  bindSkipHotkeys();

  const videoId = getCurrentVideoId();
  if (videoId && videoId !== currentSkipVideoId) {
    fetchSkipSegments(videoId);
  }

  let attempts = 0;
  if (skipCheckInterval) clearInterval(skipCheckInterval);
  skipCheckInterval = setInterval(() => {
    attempts++;
    attachSkipVideoListeners();
    const vid = getCurrentVideoId();
    if (vid && vid !== currentSkipVideoId) {
      fetchSkipSegments(vid);
    }
    if (videoSkipSegments.length > 0) {
      updateSkipTimelineTrack();
    }
    if (attempts >= 15 && boundVideoElement) {
      clearInterval(skipCheckInterval);
      skipCheckInterval = null;
    }
  }, 500);
}

function removeAutoSkipUI() {
  document.getElementById(SKIP_TOAST_ID)?.remove();
  document.getElementById(SKIP_TRACK_ID)?.remove();
  document.getElementById(SKIP_STYLE_ID)?.remove();
  if (boundVideoElement) {
    boundVideoElement.removeEventListener("timeupdate", handleVideoTimeUpdate);
    boundVideoElement.removeEventListener("durationchange", updateSkipTimelineTrack);
    boundVideoElement.removeEventListener("loadedmetadata", updateSkipTimelineTrack);
    boundVideoElement = null;
  }
  if (skipCheckInterval) {
    clearInterval(skipCheckInterval);
    skipCheckInterval = null;
  }
  videoSkipSegments = [];
  lastSkippedRecord = null;
  ignoredSkipSegments.clear();
}

function applyAutoSkipSegmentsSetting() {
  const existingStyle = document.getElementById(SKIP_STYLE_ID);
  if (currentSettings.autoSkipSegments) {
    if (!existingStyle) {
      const style = document.createElement("style");
      style.id = SKIP_STYLE_ID;
      style.textContent = `
        /* ===== TADa AUTO-SKIP SEGMENTS ===== */
        #tada-skip-toast {
          position: absolute;
          bottom: 68px;
          left: 20px;
          z-index: 60;
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 280px;
          max-width: 440px;
          width: fit-content;
          padding: 10px 14px;
          background: #509AF8;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.55), 0 0 5px -2px #111;
          color: #fff;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 13px;
          pointer-events: auto;
          opacity: 0;
          transform: translateY(12px) scale(0.96);
          transition: opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          box-sizing: border-box;
        }

        #tada-skip-toast.tada-skip-toast-show {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        #tada-skip-toast .info__icon {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        #tada-skip-toast .info__icon path { fill: #fff; }

        #tada-skip-toast .info__title {
          color: #fff;
          font-weight: 500;
          line-height: 1.35;
          flex: 1;
        }

        #tada-skip-toast .info__title strong {
          color: #fff;
          font-weight: 700;
        }

        .tada-skip-undo-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(255, 255, 255, 0.22);
          border: 1px solid rgba(255, 255, 255, 0.45);
          color: #fff;
          padding: 4px 9px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          margin-left: 2px;
          transition: all 0.15s ease;
          user-select: none;
          -webkit-user-select: none;
          flex-shrink: 0;
        }

        .tada-skip-undo-btn:hover {
          background: rgba(255, 255, 255, 0.35);
          transform: scale(1.04);
        }

        #tada-skip-toast .info__close {
          width: 20px;
          height: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.85;
          transition: opacity 0.15s, transform 0.15s;
          flex-shrink: 0;
          margin-left: 4px;
        }

        #tada-skip-toast .info__close:hover {
          opacity: 1;
          transform: scale(1.15);
        }

        #tada-skip-toast .info__close path { fill: #fff; }

        .tada-skip-track {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 24;
        }

        .tada-skip-segment-mark {
          position: absolute;
          top: 0;
          height: 100%;
          opacity: 0.85;
          border-radius: 1px;
          pointer-events: auto;
          box-shadow: 0 0 4px rgba(0,0,0,0.4);
        }
      `;
      (document.head || document.documentElement).appendChild(style);
    }
    if (isWatchPage()) {
      startAutoSkipCheck();
    }
  } else {
    removeAutoSkipUI();
  }
}

