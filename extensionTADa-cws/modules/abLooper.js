/**
 * TADa for YouTube - Smart A-B Looper Module
 */

/* ===== TADa SMART A-B LOOPER ===== */
const ab = { a: null, b: null, on: false };
let abInterval = null;
let abBtnInterval = null;
let abKeysBound = false;
let abDrag = null; // null | { type: "A"|"B"|"RANGE", startX, initA, initB }
let abPicking = false; // true = click-on-timeline mode active

function abFmt(sec) {
  if (sec === null || sec === undefined || isNaN(sec)) return "--:--";
  const s = Math.floor(sec);
  const ms = Math.floor((sec - s) * 10);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  const pad = (n) => n < 10 ? "0" + n : "" + n;
  return h > 0 ? h + ":" + pad(m) + ":" + pad(ss) + "." + ms : pad(m) + ":" + pad(ss) + "." + ms;
}

function abToast(text) {
  const player = document.getElementById("movie_player") || document.querySelector(".html5-video-player");
  if (!player) return;
  let t = player.querySelector(".tada-ab-toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "tada-ab-toast info";
    player.appendChild(t);
  }
  t.innerHTML = `
    <div class="info__icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
        <path fill="#fff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path>
      </svg>
    </div>
    <div class="info__title">${text}</div>
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
  t._timer = setTimeout(() => t.classList.remove("show"), 2400);
}

function abCheck() {
  if (!ab.on || ab.a === null || ab.b === null) return;
  const v = getMainVideoElement();
  if (!v || v.paused) return;
  if (v.currentTime >= ab.b) v.currentTime = ab.a;
}

function abStartLoop() {
  abStopLoop();
  if (ab.on && ab.a !== null && ab.b !== null) {
    abInterval = setInterval(abCheck, 50);
  }
}

function abStopLoop() {
  if (abInterval) { clearInterval(abInterval); abInterval = null; }
}

function abSetA(time) {
  const v = getMainVideoElement();
  if (!v) return;
  const t = typeof time === "number" ? time : v.currentTime;
  ab.a = Math.max(0, parseFloat(t.toFixed(1)));
  if (ab.b !== null && ab.a >= ab.b) { ab.b = null; ab.on = false; abStopLoop(); }
  abUpdateAll();
  abToast("Đã chọn A · Giờ chọn mốc B");
}

function abSetB(time) {
  const v = getMainVideoElement();
  if (!v) return;
  const t = typeof time === "number" ? time : v.currentTime;
  if (ab.a === null) ab.a = 0;
  if (t <= ab.a) { abToast("Điểm B phải sau điểm A"); return; }
  ab.b = parseFloat(t.toFixed(1));
  ab.on = true;
  abStartLoop();
  abUpdateAll();
  abToast("Đang lặp đoạn");
}

function abToggle() {
  if (ab.a === null || ab.b === null) { abToast("Cần đặt cả hai điểm A và B"); return; }
  ab.on = !ab.on;
  ab.on ? abStartLoop() : abStopLoop();
  if (ab.on) {
    const v = getMainVideoElement();
    if (v && (v.currentTime < ab.a || v.currentTime >= ab.b)) v.currentTime = ab.a;
  }
  abUpdateAll();
  abToast(ab.on ? "Đang lặp đoạn" : "Đã tắt lặp đoạn");
}

function abReset() {
  ab.a = null; ab.b = null; ab.on = false;
  abPicking = false;
  abStopLoop();
  abUpdateAll();
  abUpdatePickingUI();
  abToast("Đã xóa đoạn lặp");
}

/* --- Smart button click handler --- */
function abSmartClick() {
  if (typeof stopBookmarkPicking === "function" && typeof bookmarkPicking !== "undefined" && bookmarkPicking) {
    stopBookmarkPicking();
  }
  // If both points set → toggle loop
  if (ab.a !== null && ab.b !== null) {
    abToggle();
    return;
  }
  // Otherwise toggle pick mode
  abPicking = !abPicking;
  abUpdateAll();
  abUpdatePickingUI();
  if (abPicking) {
    abToast(ab.a === null ? "Nhấp trên thanh tua để chọn điểm A" : "Nhấp trên thanh tua để chọn điểm B");
  } else {
    abToast("Đã tắt chế độ chọn");
  }
}

function abUpdatePickingUI() {
  const bar = document.querySelector(".ytp-progress-bar");
  const container = document.querySelector(".ytp-progress-bar-container");
  if (bar) {
    bar.classList.toggle("tada-ab-picking", abPicking);
  }
  if (container) {
    container.classList.toggle("tada-ab-picking", abPicking);
  }
  const btn = document.getElementById(AB_BTN_ID);
  if (btn) {
    btn.classList.toggle("picking", abPicking);
  }
  if (!abPicking && typeof removeTimelineGuide === "function") {
    removeTimelineGuide();
  }
}

/* --- Button UI --- */
function abBtnLabel() {
  const en = typeof isEn === "function" && isEn();
  if (ab.a !== null && ab.b !== null) {
    return ab.on ? (en ? "Looping" : "Đang lặp") : (en ? "Paused" : "Đang tắt");
  }
  if (abPicking && ab.a !== null) return en ? "Pick B..." : "Chọn B...";
  if (abPicking) return en ? "Pick A..." : "Chọn A...";
  return "A-B";
}

function ensureAbBtn() {
  if (!currentSettings.abLooper) { removeAbBtn(); return; }
  const timeDisplay = document.querySelector(".ytp-time-display");
  const leftControls = document.querySelector(".ytp-left-controls") || timeDisplay?.parentElement;
  if (!timeDisplay && !leftControls) return;

  let isNew = false;
  let btn = document.getElementById(AB_BTN_ID);
  if (!btn || !document.contains(btn)) {
    if (btn) btn.remove();
    isNew = true;
    btn = document.createElement("button");
    btn.id = AB_BTN_ID;
    btn.className = "ytp-button tada-ab-btn";
    btn.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); abSmartClick(); });
    btn.addEventListener("dblclick", (e) => {
      e.preventDefault(); e.stopPropagation();
      abReset();
      abSmartClick();
    });
    btn.addEventListener("contextmenu", (e) => { e.preventDefault(); e.stopPropagation(); abReset(); });

    if (timeDisplay) {
      timeDisplay.insertAdjacentElement("afterend", btn);
    } else if (leftControls) {
      leftControls.appendChild(btn);
    }
  }

  const en = typeof isEn === "function" && isEn();
  btn.textContent = abBtnLabel();
  btn.title = en
    ? (ab.a !== null && ab.b !== null
        ? (ab.on ? "Looping · Click: Stop loop · Right-click: Clear" : "Loop paused · Click: Start loop · Right-click: Clear")
        : abPicking ? "Selecting on progress bar · Click to cancel" : "A-B Looper · Click to pick loop points")
    : (ab.a !== null && ab.b !== null
        ? (ab.on ? "Đang lặp · Click: Tắt lặp · Chuột phải: Xóa" : "Đang tắt · Click: Bật lặp · Chuột phải: Xóa")
        : abPicking ? "Đang chọn trên thanh tua · Click để hủy" : "A-B Looper · Click để chọn mốc");
  btn.classList.toggle("active", ab.on);
  btn.classList.toggle("has-points", ab.a !== null && ab.b !== null);
  btn.classList.toggle("picking", abPicking);

  // Clear / Cancel button
  let clearBtn = document.getElementById(AB_CLEAR_BTN_ID);
  const showClear = abPicking || (ab.a !== null || ab.b !== null);
  if (showClear) {
    if (!clearBtn || !document.contains(clearBtn)) {
      if (clearBtn) clearBtn.remove();
      isNew = true;
      clearBtn = document.createElement("button");
      clearBtn.id = AB_CLEAR_BTN_ID;
      clearBtn.className = "ytp-button tada-ab-clear-btn";
      clearBtn.addEventListener("click", (e) => {
        e.preventDefault(); e.stopPropagation();
        abReset();
      });
      btn.insertAdjacentElement("afterend", clearBtn);
    }
    clearBtn.textContent = en ? (abPicking ? "Cancel" : "Clear") : (abPicking ? "Hủy" : "Xóa");
    clearBtn.title = en ? (abPicking ? "Cancel picking" : "Clear loop points") : (abPicking ? "Hủy chọn mốc" : "Xóa mốc lặp");
  } else if (clearBtn) {
    clearBtn.remove();
  }

  if (isNew && typeof applyToolbarLayout === "function") {
    applyToolbarLayout();
  }
}

function removeAbBtn() {
  document.getElementById(AB_BTN_ID)?.remove();
  document.getElementById(AB_CLEAR_BTN_ID)?.remove();
}

/* --- Timeline markers & Picking Guide --- */
const TIMELINE_GUIDE_ID = "tada-timeline-picker-guide";
let lastTimelineActionTime = 0;

function updateTimelineGuide(time, duration, mode) {
  const container = document.querySelector(".ytp-progress-bar-container") || document.querySelector(".ytp-progress-bar");
  if (!container) return;

  let guide = document.getElementById(TIMELINE_GUIDE_ID);
  if (!guide || !document.contains(guide)) {
    if (guide) guide.remove();
    guide = document.createElement("div");
    guide.id = TIMELINE_GUIDE_ID;
    guide.className = "tada-timeline-picker-guide";
    container.appendChild(guide);
  }

  const pct = Math.max(0, Math.min(100, (time / duration) * 100));
  guide.style.left = `${pct}%`;

  guide.className = `tada-timeline-picker-guide guide-${mode.toLowerCase()}`;
  if (mode === "A") {
    guide.textContent = `Chọn mốc A: ${abFmt(time)}`;
  } else if (mode === "B") {
    guide.textContent = `Chọn mốc B: ${abFmt(time)}`;
  } else {
    guide.textContent = `Chọn mốc ghi chú: ${typeof formatBookmarkTime === "function" ? formatBookmarkTime(time) : abFmt(time)}`;
  }
}

function removeTimelineGuide() {
  document.getElementById(TIMELINE_GUIDE_ID)?.remove();
}

function abTimeFromEvent(e) {
  const bar = document.querySelector(".ytp-progress-bar") || document.querySelector(".ytp-progress-bar-container");
  const v = getMainVideoElement();
  if (!bar || !v || !v.duration || isNaN(v.duration)) return null;
  const r = bar.getBoundingClientRect();
  if (r.width <= 0) return null;
  const ratio = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
  return parseFloat((ratio * v.duration).toFixed(1));
}

function abSetupTimeline() {
  const container = document.querySelector(".ytp-progress-bar-container");
  const bar = document.querySelector(".ytp-progress-bar");
  if (!container && !bar) return;

  const targets = [container, bar].filter(Boolean);

  const handlePointerAction = (e) => {
    // Nếu click vào pin A/B hoặc bookmark pin thì để handler kéo/mở pin xử lý
    const pinOrRange = e.target.closest?.(".tada-ab-pin-a, .tada-ab-pin-b, .tada-ab-range, .tada-bm-pin");
    if (pinOrRange) return;

    const isAbShortcut = currentSettings.abLooper && (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey);
    const isAbActive = currentSettings.abLooper && (abPicking || isAbShortcut);
    const isBmActive = currentSettings.videoBookmarks && typeof bookmarkPicking !== "undefined" && bookmarkPicking;

    if (!isAbActive && !isBmActive) return;

    // Chặn YouTube scrub/seek ngay từ pointerdown/mousedown
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation?.();
    lastTimelineActionTime = Date.now();

    const t = abTimeFromEvent(e);
    if (t === null) return;

    // 1. Chế độ chọn Bookmark / Note trên thanh tua
    if (isBmActive) {
      stopBookmarkPicking();
      removeTimelineGuide();
      const v = getMainVideoElement();
      if (v) v.currentTime = t;
      openBookmarkInputModal(t);
      return;
    }

    // 2. Phím tắt Shift/Alt click cho A-B
    if (e.shiftKey) { abSetA(t); return; }
    if (e.altKey || e.ctrlKey || e.metaKey) { abSetB(t); return; }

    // 3. Chế độ chọn A-B Looper
    if (abPicking) {
      if (ab.a === null) {
        abSetA(t);
        abToast(`Đã chọn A (${abFmt(t)}) · Giờ click chọn mốc B`);
      } else {
        const timeA = ab.a;
        if (t < timeA) {
          ab.b = timeA;
          ab.a = t;
        } else {
          ab.b = t;
        }
        ab.on = true;
        abPicking = false;
        abUpdatePickingUI();
        removeTimelineGuide();
        const v = getMainVideoElement();
        if (v) v.currentTime = ab.a;
        abStartLoop();
        abToast(`Đang lặp: ${abFmt(ab.a)} ↔ ${abFmt(ab.b)}`);
      }
      abUpdateAll();
    }
  };

  const handleClick = (e) => {
    const pinOrRange = e.target.closest?.(".tada-ab-pin-a, .tada-ab-pin-b, .tada-ab-range, .tada-bm-pin");
    if (pinOrRange) return;

    const isAbShortcut = currentSettings.abLooper && (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey);
    const isAbActive = currentSettings.abLooper && (abPicking || isAbShortcut);
    const isBmActive = currentSettings.videoBookmarks && typeof bookmarkPicking !== "undefined" && bookmarkPicking;

    if (!isAbActive && !isBmActive) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation?.();

    // Nếu pointerdown đã xử lý trong vòng 450ms thì bỏ qua click trùng lặp
    if (Date.now() - lastTimelineActionTime < 450) return;
    lastTimelineActionTime = Date.now();

    const t = abTimeFromEvent(e);
    if (t === null) return;

    if (isBmActive) {
      stopBookmarkPicking();
      removeTimelineGuide();
      const v = getMainVideoElement();
      if (v) v.currentTime = t;
      openBookmarkInputModal(t);
      return;
    }

    if (e.shiftKey) { abSetA(t); return; }
    if (e.altKey || e.ctrlKey || e.metaKey) { abSetB(t); return; }

    if (abPicking) {
      if (ab.a === null) {
        abSetA(t);
        abToast(`Đã chọn A (${abFmt(t)}) · Giờ click chọn mốc B`);
      } else {
        const timeA = ab.a;
        if (t < timeA) {
          ab.b = timeA;
          ab.a = t;
        } else {
          ab.b = t;
        }
        ab.on = true;
        abPicking = false;
        abUpdatePickingUI();
        removeTimelineGuide();
        const v = getMainVideoElement();
        if (v) v.currentTime = ab.a;
        abStartLoop();
        abToast(`Đang lặp: ${abFmt(ab.a)} ↔ ${abFmt(ab.b)}`);
      }
      abUpdateAll();
    }
  };

  // Hover guide khi đang ở chế độ picking
  const handleMouseMove = (e) => {
    const isAbActive = currentSettings.abLooper && abPicking;
    const isBmActive = currentSettings.videoBookmarks && typeof bookmarkPicking !== "undefined" && bookmarkPicking;
    if (!isAbActive && !isBmActive) {
      removeTimelineGuide();
      return;
    }

    const t = abTimeFromEvent(e);
    const v = getMainVideoElement();
    if (t === null || !v || !v.duration) {
      removeTimelineGuide();
      return;
    }

    updateTimelineGuide(t, v.duration, isBmActive ? "BM" : (ab.a === null ? "A" : "B"));
  };

  const handleMouseLeave = () => {
    removeTimelineGuide();
  };

  targets.forEach((el) => {
    if (!el || el.dataset.tadaTimelineBound) return;
    el.dataset.tadaTimelineBound = "true";

    el.addEventListener("pointerdown", handlePointerAction, { capture: true, passive: false });
    el.addEventListener("mousedown", handlePointerAction, { capture: true, passive: false });
    el.addEventListener("click", handleClick, { capture: true, passive: false });
    el.addEventListener("mousemove", handleMouseMove, { capture: true, passive: true });
    el.addEventListener("mouseleave", handleMouseLeave, { capture: true, passive: true });
  });

  // Kéo thả mốc A, B và dải lặp Range
  if (bar && !bar.dataset.tadaAbDragBound) {
    bar.dataset.tadaAbDragBound = "true";
    bar.addEventListener("mousedown", (e) => {
      if (!currentSettings.abLooper) return;
      const pinA = e.target.closest(".tada-ab-pin-a");
      const pinB = e.target.closest(".tada-ab-pin-b");
      const range = e.target.closest(".tada-ab-range");
      if (!pinA && !pinB && !range) return;

      e.preventDefault(); e.stopPropagation();
      abDrag = {
        type: pinA ? "A" : pinB ? "B" : "RANGE",
        startX: e.clientX,
        initA: ab.a ?? 0,
        initB: ab.b ?? 0
      };

      const onMove = (me) => {
        if (!abDrag) return;
        me.preventDefault(); me.stopPropagation();
        const bar2 = document.querySelector(".ytp-progress-bar");
        const v = getMainVideoElement();
        if (!bar2 || !v || !v.duration) return;
        const rect = bar2.getBoundingClientRect();
        if (rect.width <= 0) return;
        const dur = v.duration;

        if (abDrag.type === "A") {
          let nA = parseFloat(((me.clientX - rect.left) / rect.width * dur).toFixed(1));
          nA = Math.max(0, Math.min(nA, ab.b !== null ? ab.b - 0.2 : dur));
          ab.a = nA;
        } else if (abDrag.type === "B") {
          let nB = parseFloat(((me.clientX - rect.left) / rect.width * dur).toFixed(1));
          nB = Math.max(ab.a !== null ? ab.a + 0.2 : 0, Math.min(nB, dur));
          ab.b = nB; ab.on = true;
        } else if (abDrag.type === "RANGE") {
          const delta = (me.clientX - abDrag.startX) / rect.width * dur;
          const len = Math.max(0.5, abDrag.initB - abDrag.initA);
          let nA = Math.max(0, Math.min(dur - len, abDrag.initA + delta));
          ab.a = parseFloat(nA.toFixed(1));
          ab.b = parseFloat((nA + len).toFixed(1));
        }
        abUpdateAll();
        abToast(abDrag.type === "A" ? "A: " + abFmt(ab.a) : abDrag.type === "B" ? "B: " + abFmt(ab.b) : "Đoạn: " + abFmt(ab.a) + " ↔ " + abFmt(ab.b));
      };

      const onUp = (ue) => {
        ue.preventDefault(); ue.stopPropagation();
        document.removeEventListener("mousemove", onMove, true);
        document.removeEventListener("mouseup", onUp, true);
        abDrag = null;
        if (ab.on) abStartLoop();
        abUpdateAll();
        abToast("Đang lặp đoạn");
      };

      document.addEventListener("mousemove", onMove, true);
      document.addEventListener("mouseup", onUp, true);
    }, true);
  }
}

function abUpdateTrack() {
  const bar = document.querySelector(".ytp-progress-bar");
  if (!bar) return;
  abSetupTimeline();

  let track = document.getElementById(AB_TRACK_ID);
  if (!currentSettings.abLooper || (ab.a === null && ab.b === null)) {
    if (track) track.remove();
    return;
  }

  const v = getMainVideoElement();
  const dur = v?.duration;
  if (!dur || isNaN(dur) || dur <= 0) { if (track) track.remove(); return; }

  if (!track) {
    track = document.createElement("div");
    track.id = AB_TRACK_ID;
    track.className = "tada-ab-track";
    bar.appendChild(track);
  }

  const aPct = ab.a !== null ? (ab.a / dur) * 100 : null;
  const bPct = ab.b !== null ? (ab.b / dur) * 100 : null;

  let html = "";
  if (aPct !== null && bPct !== null && bPct > aPct) {
    html += `<div class="tada-ab-range ${ab.on ? "looping" : ""}" style="left:${aPct}%;width:${bPct - aPct}%" title="Kéo đoạn"></div>`;
  }
  if (aPct !== null) html += `<div class="tada-ab-pin tada-ab-pin-a" style="left:${aPct}%" title="A: ${abFmt(ab.a)}"><span>A</span></div>`;
  if (bPct !== null) html += `<div class="tada-ab-pin tada-ab-pin-b" style="left:${bPct}%" title="B: ${abFmt(ab.b)}"><span>B</span></div>`;
  track.innerHTML = html;
}

function abUpdateAll() {
  ensureAbBtn();
  abUpdateTrack();
}

/* --- Hotkeys --- */
function abHotkey(e) {
  if (currentSettings.hotkeysEnabled === false) return;
  if (!currentSettings.abLooper || e.defaultPrevented) return;
  if (shouldIgnoreKeyEvent(e)) return;
  if (matchesHotkey(e, "abSetA")) { e.preventDefault(); e.stopPropagation(); abSetA(); }
  else if (matchesHotkey(e, "abSetB")) { e.preventDefault(); e.stopPropagation(); abSetB(); }
  else if (matchesHotkey(e, "abToggle")) { e.preventDefault(); e.stopPropagation(); abToggle(); }
}

function abEnsureKeys() {
  if (abKeysBound) return;
  window.addEventListener("keydown", abHotkey, true);
  abKeysBound = true;
}

function abBindVideo() {
  const v = getMainVideoElement();
  if (!v || v.dataset.tadaAbV) return;
  v.dataset.tadaAbV = "1";
  v.addEventListener("timeupdate", abCheck);
  v.addEventListener("play", () => { if (ab.on) abStartLoop(); });
  v.addEventListener("pause", abStopLoop);
}

function startAbCheck() {
  if (abBtnInterval) { clearInterval(abBtnInterval); abBtnInterval = null; }
  let c = 0;
  ensureAbBtn();
  abBtnInterval = setInterval(() => {
    c++;
    if (isWatchPage()) { ensureAbBtn(); abUpdateTrack(); }
    if (c > 25 && document.getElementById(AB_BTN_ID)) { clearInterval(abBtnInterval); abBtnInterval = null; }
  }, 300);
}

function abResetOnNav() {
  ab.a = null; ab.b = null; ab.on = false;
  abPicking = false;
  abStopLoop();
  abUpdateAll();
  abUpdatePickingUI();
}

function applyAbLooperSetting() {
  const existing = document.getElementById(AB_STYLE_ID);
  if (currentSettings.abLooper) {
    if (!existing) {
      const s = document.createElement("style");
      s.id = AB_STYLE_ID;
      s.textContent = `
        /* ===== TADa Smart A-B Looper ===== */
        .tada-ab-btn {
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: transparent;
          border: none;
          outline: none;
          padding: 0 6px;
          height: 100%;
          opacity: 0.85;
          transition: all 0.18s ease;
          user-select: none;
          -webkit-user-select: none;
          vertical-align: top;
          font-family: "Roboto", "Segoe UI", sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,0.85);
          letter-spacing: 0.3px;
          white-space: nowrap;
          border-radius: 4px;
        }
        .tada-ab-btn:hover {
          opacity: 1;
          background: rgba(255,255,255,0.1);
        }
        .tada-ab-btn:active { transform: scale(0.94); }
        .tada-ab-btn.has-points {
          color: #fbbf24;
        }
        .tada-ab-btn.active {
          color: #E8930C;
          text-shadow: 0 0 8px rgba(232,147,12,0.7);
        }
        .tada-ab-btn.picking {
          color: #38bdf8;
          background: rgba(56,189,248,0.15);
          animation: tadaAbBlink 1s ease-in-out infinite;
        }
        @keyframes tadaAbBlink {
          0%,100% { opacity: 0.85; }
          50% { opacity: 1; }
        }

        .tada-ab-clear-btn {
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: rgba(239, 68, 68, 0.16) !important;
          border: 1px solid rgba(239, 68, 68, 0.35) !important;
          outline: none;
          padding: 0 6px;
          height: 22px;
          margin-left: 4px;
          opacity: 0.85;
          transition: all 0.18s ease;
          user-select: none;
          -webkit-user-select: none;
          font-family: "Roboto", "Segoe UI", sans-serif;
          font-size: 11px;
          font-weight: 600;
          color: #fca5a5 !important;
          border-radius: 4px;
          vertical-align: middle;
        }
        .tada-ab-clear-btn:hover {
          opacity: 1;
          background: rgba(239, 68, 68, 0.35) !important;
          color: #ffffff !important;
          border-color: rgba(239, 68, 68, 0.6) !important;
        }
        .tada-ab-clear-btn:active {
          transform: scale(0.94);
        }

        /* Pick mode - progress bar glow & container cursor */
        .ytp-progress-bar-container.tada-ab-picking,
        .ytp-progress-bar.tada-ab-picking {
          cursor: crosshair !important;
        }
        .ytp-progress-bar.tada-ab-picking {
          box-shadow: 0 0 0 2px #38bdf8, 0 0 12px rgba(56,189,248,0.6) !important;
          border-radius: 4px;
        }

        /* Timeline hover guide badge */
        .tada-timeline-picker-guide {
          position: absolute;
          top: -28px;
          transform: translateX(-50%);
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          pointer-events: none;
          white-space: nowrap;
          z-index: 1000;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.7);
          transition: left 0.04s ease-out;
        }
        .tada-timeline-picker-guide.guide-a {
          background: #38bdf8;
          color: #0c4a6e;
          border: 1px solid #7dd3fc;
        }
        .tada-timeline-picker-guide.guide-b {
          background: #E8930C;
          color: #1A1410;
          border: 1px solid #fcd34d;
        }
        .tada-timeline-picker-guide.guide-bm {
          background: #E8930C;
          color: #1A1410;
          border: 1px solid #fcd34d;
        }
        .tada-timeline-picker-guide::after {
          content: "";
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
        }
        .tada-timeline-picker-guide.guide-a::after {
          border-top: 5px solid #38bdf8;
        }
        .tada-timeline-picker-guide.guide-b::after,
        .tada-timeline-picker-guide.guide-bm::after {
          border-top: 5px solid #E8930C;
        }

        /* Toast */
        .tada-ab-toast {
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
        .tada-ab-toast.show {
          opacity: 1;
          transform: translate(-50%, 0) scale(1);
        }
        .tada-ab-toast .info__icon {
          width: 20px;
          height: 20px;
          margin-right: 8px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tada-ab-toast .info__icon path { fill: #fff; }
        .tada-ab-toast .info__title {
          font-weight: 500;
          font-size: 13px;
          color: #fff;
          line-height: 1.35;
          flex: 1;
        }
        .tada-ab-toast .info__close {
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
        .tada-ab-toast .info__close:hover {
          opacity: 1;
          transform: scale(1.15);
        }
        .tada-ab-toast .info__close path { fill: #fff; }

        /* Timeline track */
        .tada-ab-track {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          pointer-events: none;
          z-index: 35;
        }
        .tada-ab-range {
          position: absolute;
          top: 0; height: 100%;
          background: rgba(232,147,12,0.30);
          border-left: 2px solid #38bdf8;
          border-right: 2px solid #E8930C;
          pointer-events: auto;
          cursor: grab;
          transition: background 0.15s ease;
        }
        .tada-ab-range:hover { background: rgba(232,147,12,0.48); }
        .tada-ab-range.looping {
          background: rgba(232,147,12,0.42);
          animation: tadaAbPulse 2s ease-in-out infinite;
        }
        @keyframes tadaAbPulse {
          0%,100% { opacity: 0.85; }
          50% { opacity: 1; }
        }
        .tada-ab-pin {
          position: absolute;
          top: -16px;
          transform: translateX(-50%);
          width: 18px; height: 18px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 800;
          pointer-events: auto;
          cursor: grab;
          user-select: none;
          -webkit-user-select: none;
          z-index: 40;
          transition: transform 0.1s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.7);
        }
        .tada-ab-pin::before {
          content: "";
          position: absolute;
          top: -8px; bottom: -8px; left: -8px; right: -8px;
        }
        .tada-ab-pin:hover { transform: translateX(-50%) scale(1.15); }
        .tada-ab-pin:active { cursor: grabbing; transform: translateX(-50%) scale(1.22); }
        .tada-ab-pin::after {
          content: "";
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: 20px;
          pointer-events: none;
        }
        .tada-ab-pin-a { background: #38bdf8; color: #0c4a6e; }
        .tada-ab-pin-a::after { background: #38bdf8; box-shadow: 0 0 5px #38bdf8; }
        .tada-ab-pin-b { background: #E8930C; color: #1A1410; }
        .tada-ab-pin-b::after { background: #E8930C; box-shadow: 0 0 5px #E8930C; }
      `;
      (document.head || document.documentElement).appendChild(s);
    }
    abEnsureKeys();
    abBindVideo();
    ensureAbBtn();
    startAbCheck();
  } else {
    existing?.remove();
    abStopLoop();
    removeAbBtn();
    document.getElementById(AB_TRACK_ID)?.remove();
    document.querySelector(".tada-ab-toast")?.remove();
  }
}

