/**
 * TADa for YouTube - Video Bookmarks & Notes Module
 */

/* ===== TADa VIDEO BOOKMARKS & NOTES ===== */
let currentVideoBookmarks = [];
let bookmarkPanelOpen = false;
let bookmarkHotkeysBound = false;
let bookmarkControlInterval = null;
let currentBookmarkVideoId = null;
let bookmarkPicking = false;

function formatBookmarkTime(sec) {
  if (sec === null || sec === undefined || isNaN(sec)) return "00:00";
  const total = Math.max(0, Math.floor(sec));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n) => (n < 10 ? "0" + n : "" + n);
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

function escapeBookmarkHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getCurrentVideoTitle() {
  const metaTitle = document.querySelector("h1.ytd-watch-metadata yt-formatted-string")?.textContent;
  if (metaTitle && metaTitle.trim()) return metaTitle.trim();
  const pageTitle = document.title || "";
  return pageTitle.replace(/ - YouTube$/, "").trim() || "Video YouTube";
}

function getCurrentVideoChannel() {
  const channelEl = document.querySelector("ytd-channel-name yt-formatted-string a, ytd-video-owner-renderer #channel-name a");
  return channelEl?.textContent?.trim() || "";
}

function bookmarkToast(msg) {
  const player = document.getElementById("movie_player") || document.querySelector(".html5-video-player");
  if (!player) return;
  let t = player.querySelector("#" + BOOKMARK_TOAST_ID);
  if (!t) {
    t = document.createElement("div");
    t.id = BOOKMARK_TOAST_ID;
    t.className = "tada-bm-toast info";
    player.appendChild(t);
  }
  t.innerHTML = `
    <div class="info__icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
        <path fill="#fff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path>
      </svg>
    </div>
    <div class="info__title">${escapeBookmarkHtml(msg)}</div>
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

/* --- Picking Mode --- */
function toggleBookmarkPicking() {
  if (bookmarkPicking) {
    stopBookmarkPicking();
    bookmarkToast("Đã hủy chọn mốc ghi chú");
  } else {
    startBookmarkPicking();
  }
}

function startBookmarkPicking() {
  if (typeof abPicking !== "undefined" && abPicking) {
    abPicking = false;
    if (typeof abUpdatePickingUI === "function") abUpdatePickingUI();
  }
  bookmarkPicking = true;
  updateBookmarkButtonUI();
  bookmarkUpdatePickingUI();
  bookmarkToast("Nhấp trên thanh tua để chọn mốc (Esc để hủy)");
}

function stopBookmarkPicking() {
  bookmarkPicking = false;
  updateBookmarkButtonUI();
  bookmarkUpdatePickingUI();
}

function bookmarkUpdatePickingUI() {
  const bar = document.querySelector(".ytp-progress-bar");
  const container = document.querySelector(".ytp-progress-bar-container");
  if (bar) {
    bar.classList.toggle("tada-bm-picking", bookmarkPicking);
  }
  if (container) {
    container.classList.toggle("tada-bm-picking", bookmarkPicking);
  }
  const addBtn = document.getElementById(BOOKMARK_ADD_BTN_ID);
  if (addBtn) {
    addBtn.classList.toggle("picking", bookmarkPicking);
  }
  if (!bookmarkPicking && typeof removeTimelineGuide === "function") {
    removeTimelineGuide();
  }
}

/* --- Storage & Data --- */
async function loadBookmarksForCurrentVideo() {
  const vId = getCurrentVideoId();
  currentBookmarkVideoId = vId;
  if (!vId) {
    currentVideoBookmarks = [];
    updateBookmarkButtonBadge();
    updateBookmarkPins();
    if (bookmarkPanelOpen) renderBookmarkPanelList();
    return;
  }
  try {
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      const data = await chrome.storage.local.get([BOOKMARKS_STORAGE_KEY]);
      const allBm = data?.[BOOKMARKS_STORAGE_KEY] || {};
      const videoEntry = allBm[vId];
      currentVideoBookmarks = Array.isArray(videoEntry?.items) ? [...videoEntry.items] : [];
      currentVideoBookmarks.sort((a, b) => (a.time || 0) - (b.time || 0));
    }
  } catch (err) {
    console.debug("[TADa] Failed to load bookmarks", err);
  }
  updateBookmarkButtonBadge();
  updateBookmarkPins();
  if (bookmarkPanelOpen) renderBookmarkPanelList();
}

async function saveNewBookmark(targetTime, noteText) {
  const vId = getCurrentVideoId();
  if (!vId) return;

  const v = getMainVideoElement();
  const time = typeof targetTime === "number" ? targetTime : (v?.currentTime || 0);
  const roundedTime = parseFloat(time.toFixed(1));
  const finalNote = (noteText && noteText.trim()) ? noteText.trim() : `Mốc ${formatBookmarkTime(roundedTime)}`;

  const newItem = {
    id: "bm_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
    time: roundedTime,
    note: finalNote,
    createdAt: Date.now()
  };

  try {
    const data = await chrome.storage.local.get([BOOKMARKS_STORAGE_KEY]);
    const allBm = data?.[BOOKMARKS_STORAGE_KEY] || {};
    const existing = allBm[vId] || {
      title: getCurrentVideoTitle(),
      channel: getCurrentVideoChannel(),
      duration: v?.duration || 0,
      items: []
    };

    existing.title = getCurrentVideoTitle() || existing.title;
    existing.channel = getCurrentVideoChannel() || existing.channel;
    existing.duration = v?.duration || existing.duration;
    existing.updatedAt = Date.now();

    const items = Array.isArray(existing.items) ? existing.items : [];
    items.push(newItem);
    items.sort((a, b) => (a.time || 0) - (b.time || 0));
    existing.items = items;
    allBm[vId] = existing;

    await chrome.storage.local.set({ [BOOKMARKS_STORAGE_KEY]: allBm });
    currentVideoBookmarks = items;

    updateBookmarkButtonBadge();
    updateBookmarkPins();
    if (bookmarkPanelOpen) renderBookmarkPanelList();
    bookmarkToast(`Đã lưu mốc [${formatBookmarkTime(roundedTime)}]: ${finalNote}`);
  } catch (err) {
    console.error("[TADa] Failed to save bookmark", err);
  }
}

async function updateBookmarkNote(bmId, newNote) {
  const vId = getCurrentVideoId();
  if (!vId) return;
  try {
    const data = await chrome.storage.local.get([BOOKMARKS_STORAGE_KEY]);
    const allBm = data?.[BOOKMARKS_STORAGE_KEY] || {};
    if (allBm[vId] && Array.isArray(allBm[vId].items)) {
      const item = allBm[vId].items.find(it => it.id === bmId);
      if (item) {
        item.note = (newNote && newNote.trim()) ? newNote.trim() : `Mốc ${formatBookmarkTime(item.time)}`;
        item.updatedAt = Date.now();
        allBm[vId].updatedAt = Date.now();
        await chrome.storage.local.set({ [BOOKMARKS_STORAGE_KEY]: allBm });
        currentVideoBookmarks = allBm[vId].items;
        updateBookmarkPins();
        if (bookmarkPanelOpen) renderBookmarkPanelList();
        bookmarkToast("Đã cập nhật ghi chú");
      }
    }
  } catch (err) {
    console.error("[TADa] Failed to update bookmark", err);
  }
}

async function removeBookmark(bmId) {
  const vId = getCurrentVideoId();
  if (!vId) return;

  try {
    const data = await chrome.storage.local.get([BOOKMARKS_STORAGE_KEY]);
    const allBm = data?.[BOOKMARKS_STORAGE_KEY] || {};
    if (allBm[vId] && Array.isArray(allBm[vId].items)) {
      allBm[vId].items = allBm[vId].items.filter(item => item.id !== bmId);
      allBm[vId].updatedAt = Date.now();
      if (allBm[vId].items.length === 0) {
        delete allBm[vId];
        currentVideoBookmarks = [];
      } else {
        currentVideoBookmarks = allBm[vId].items;
      }
      await chrome.storage.local.set({ [BOOKMARKS_STORAGE_KEY]: allBm });
      updateBookmarkButtonBadge();
      updateBookmarkPins();
      if (bookmarkPanelOpen) renderBookmarkPanelList();
      bookmarkToast("Đã xóa mốc thời gian");
    }
  } catch (err) {
    console.error("[TADa] Failed to remove bookmark", err);
  }
}

function exportBookmarksToMarkdown() {
  const vId = getCurrentVideoId();
  if (!vId || currentVideoBookmarks.length === 0) {
    bookmarkToast("Chưa có mốc nào để sao chép");
    return;
  }
  const title = getCurrentVideoTitle();
  const url = `https://www.youtube.com/watch?v=${vId}`;
  let md = `**${title}**\n${url}\n\n`;
  currentVideoBookmarks.forEach((bm) => {
    md += `- [${formatBookmarkTime(bm.time)}](${url}&t=${Math.floor(bm.time)}s) - ${bm.note}\n`;
  });

  navigator.clipboard.writeText(md).then(() => {
    bookmarkToast("Đã sao chép Markdown vào clipboard");
  }).catch(() => {
    bookmarkToast("Không thể sao chép vào clipboard");
  });
}

/* --- Note Input Popup Modal --- */
function openBookmarkInputModal(targetTime, existingItem = null) {
  if (!currentSettings.videoBookmarks || !isWatchPage()) return;
  const player = document.getElementById("movie_player") || document.querySelector(".html5-video-player");
  if (!player) return;

  removeBookmarkModal();

  const isEdit = Boolean(existingItem);
  const time = typeof targetTime === "number" ? targetTime : (existingItem?.time || 0);
  const roundedTime = parseFloat(time.toFixed(1));

  const overlay = document.createElement("div");
  overlay.id = BOOKMARK_MODAL_ID;
  overlay.className = "tada-bm-modal-overlay";

  overlay.innerHTML = `
    <div class="tada-bm-modal" role="dialog" aria-modal="true">
      <div class="tada-bm-modal-header">
        <div class="tada-bm-modal-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" class="tada-bm-modal-icon">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          <span>${isEdit ? "Chỉnh sửa ghi chú" : "Thêm ghi chú mốc thời gian"}</span>
        </div>
        <button class="tada-bm-modal-btn-close" id="tada-bm-modal-close" title="Đóng (Esc)">×</button>
      </div>

      <div class="tada-bm-modal-body">
        <div class="tada-bm-modal-time-row">
          <span class="tada-bm-modal-time-label">Mốc thời gian:</span>
          <span class="tada-bm-modal-time-pill" title="Mốc thời gian ghi chú">${formatBookmarkTime(roundedTime)}</span>
        </div>
        <textarea id="tada-bm-modal-textarea" class="tada-bm-modal-textarea" placeholder="Nhập ghi chú cho mốc này... (Nhấn Enter để lưu)" rows="3" maxlength="250">${isEdit ? escapeBookmarkHtml(existingItem.note) : ""}</textarea>
        <div class="tada-bm-modal-hint">
          <span>Nhấn <b>Enter</b> để lưu · <b>Shift+Enter</b> xuống dòng · <b>Esc</b> để hủy</span>
        </div>
      </div>

      <div class="tada-bm-modal-footer">
        <button class="tada-bm-modal-btn-cancel" id="tada-bm-modal-cancel">Hủy</button>
        <button class="tada-bm-modal-btn-save" id="tada-bm-modal-save">
          <div class="bookmark-icon-wrap">
            <svg viewBox="0 0 24 24" class="bookmark-checkbox__icon">
              <defs>
                <linearGradient y2="100%" x2="100%" y1="0%" x1="0%" id="gradientFillSave">
                  <stop style="stop-color:#ff5a5f;stop-opacity:1" offset="0%"></stop>
                  <stop style="stop-color:#ff9a44;stop-opacity:1" offset="100%"></stop>
                </linearGradient>
              </defs>
              <path
                fill="url(#gradientFillSave)"
                d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
                class="bookmark-checkbox__icon-back"
              ></path>
              <path d="M8 11l3 3 5-5" class="bookmark-checkbox__icon-check"></path>
            </svg>
          </div>
          <span>${isEdit ? "Cập nhật" : "Lưu ghi chú"}</span>
        </button>
      </div>
    </div>
  `;

  player.appendChild(overlay);

  const textarea = overlay.querySelector("#tada-bm-modal-textarea");
  const saveBtn = overlay.querySelector("#tada-bm-modal-save");
  const cancelBtn = overlay.querySelector("#tada-bm-modal-cancel");
  const closeBtn = overlay.querySelector("#tada-bm-modal-close");

  const doSave = async () => {
    const text = textarea?.value?.trim() || "";
    if (isEdit && existingItem) {
      await updateBookmarkNote(existingItem.id, text);
    } else {
      await saveNewBookmark(roundedTime, text);
    }
    removeBookmarkModal();
  };

  saveBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    saveBtn.classList.add("is-saving");
    setTimeout(() => {
      doSave();
    }, 280);
  });

  cancelBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    removeBookmarkModal();
  });

  closeBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    removeBookmarkModal();
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      removeBookmarkModal();
    }
  });

  textarea?.addEventListener("keydown", (e) => {
    e.stopPropagation();
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      doSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      removeBookmarkModal();
    }
  });

  setTimeout(() => {
    if (textarea) {
      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }
  }, 50);
}

function removeBookmarkModal() {
  document.getElementById(BOOKMARK_MODAL_ID)?.remove();
}

/* --- Buttons in Player Controls --- */
function ensureBookmarkButton() {
  if (!currentSettings.videoBookmarks || !isWatchPage()) {
    removeBookmarkButton();
    return;
  }

  const pipBtn = document.getElementById(PIP_BUTTON_ID);
  const settingsBtn = document.querySelector(".ytp-settings-button");
  const rightControls = document.querySelector(".ytp-right-controls") ||
    settingsBtn?.closest?.(".ytp-right-controls") ||
    settingsBtn?.parentElement;

  if (!rightControls && !settingsBtn && !pipBtn) return;

  // 1. Nút Thêm Note (Bật chế độ chọn điểm trên thanh tua)
  let isNew = false;
  let addBtn = document.getElementById(BOOKMARK_ADD_BTN_ID);
  if (!addBtn || !document.contains(addBtn)) {
    if (addBtn) addBtn.remove();
    isNew = true;
    addBtn = document.createElement("button");
    addBtn.id = BOOKMARK_ADD_BTN_ID;
    addBtn.className = "ytp-button tada-bookmark-button tada-bookmark-add-button";
    addBtn.setAttribute("aria-label", "Thêm ghi chú mốc thời gian");
    addBtn.innerHTML = `
      <div class="tada-bm-btn-icon-wrap" style="position:relative;display:inline-flex;align-items:center;justify-content:center;">
        <svg viewBox="0 0 24 24" class="tada-bm-add-icon" style="width:22px;height:22px;">
          <defs>
            <linearGradient y2="100%" x2="100%" y1="0%" x1="0%" id="tadaAddOrangeGrad">
              <stop style="stop-color:#ff9a44;stop-opacity:1" offset="0%"></stop>
              <stop style="stop-color:#E8930C;stop-opacity:1" offset="100%"></stop>
            </linearGradient>
          </defs>
          <path
            d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
            class="tada-bm-add-ribbon"
          ></path>
          <path d="M12 7.5v6M9 10.5h6" class="tada-bm-add-plus"></path>
        </svg>
      </div>
    `;
    addBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleBookmarkPicking();
    });

    if (settingsBtn) {
      settingsBtn.insertAdjacentElement("beforebegin", addBtn);
    } else if (rightControls) {
      rightControls.appendChild(addBtn);
    }
  }

  // 2. Nút Xem tất cả ghi chú (mở panel danh sách - proud-husky-10)
  let listBtn = document.getElementById(BOOKMARK_BTN_ID);
  if (!listBtn || !document.contains(listBtn)) {
    if (listBtn) listBtn.remove();
    isNew = true;
    listBtn = document.createElement("button");
    listBtn.id = BOOKMARK_BTN_ID;
    listBtn.className = "ytp-button tada-bookmark-button";
    listBtn.setAttribute("aria-label", "Xem tất cả ghi chú");
    listBtn.innerHTML = `
      <div class="bookmark-icon-wrap" style="position:relative;display:inline-flex;align-items:center;justify-content:center;">
        <svg viewBox="0 0 24 24" class="bookmark-checkbox__icon tada-bm-list-icon" style="width:22px;height:22px;">
          <defs>
            <linearGradient y2="100%" x2="100%" y1="0%" x1="0%" id="gradientFillList">
              <stop style="stop-color:#ff5a5f;stop-opacity:1" offset="0%"></stop>
              <stop style="stop-color:#ff9a44;stop-opacity:1" offset="100%"></stop>
            </linearGradient>
          </defs>
          <path
            fill="url(#gradientFillList)"
            d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
            class="bookmark-checkbox__icon-back"
          ></path>
          <path d="M8 11l3 3 5-5" class="bookmark-checkbox__icon-check"></path>
        </svg>
        <span class="tada-bm-btn-badge" id="tada-bm-btn-badge" style="display:none;"></span>
      </div>
    `;

    listBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleBookmarkPanel();
    });

    if (addBtn && document.contains(addBtn)) {
      addBtn.insertAdjacentElement("afterend", listBtn);
    } else if (settingsBtn) {
      settingsBtn.insertAdjacentElement("beforebegin", listBtn);
    } else if (rightControls) {
      rightControls.appendChild(listBtn);
    }
  }

  updateBookmarkButtonUI();
  if (isNew && typeof applyToolbarLayout === "function") {
    applyToolbarLayout();
  }
}

function updateBookmarkButtonUI() {
  const addBtn = document.getElementById(BOOKMARK_ADD_BTN_ID);
  if (addBtn) {
    addBtn.classList.toggle("picking", bookmarkPicking);
    addBtn.setAttribute("title", bookmarkPicking
      ? "Đang chọn trên thanh tua · Click để hủy"
      : "Thêm ghi chú mốc thời gian · Bật để click chọn điểm trên thanh tua (N)");
  }

  const listBtn = document.getElementById(BOOKMARK_BTN_ID);
  if (listBtn) {
    listBtn.classList.toggle("active", bookmarkPanelOpen);
    listBtn.setAttribute("title", bookmarkPanelOpen
      ? "Đang mở danh sách ghi chú · Click để đóng (B)"
      : "Xem tất cả ghi chú (B)");
    updateBookmarkButtonBadge();
  }
}

function updateBookmarkButtonBadge() {
  const btn = document.getElementById(BOOKMARK_BTN_ID);
  if (!btn) return;
  const badge = document.getElementById("tada-bm-btn-badge");
  const count = currentVideoBookmarks.length;
  if (badge) {
    if (count > 0) {
      badge.textContent = count > 99 ? "99+" : count;
      badge.style.display = "flex";
      btn.classList.add("has-bookmarks");
    } else {
      badge.style.display = "none";
      btn.classList.remove("has-bookmarks");
    }
  }
  btn.classList.toggle("active", bookmarkPanelOpen);
}

function removeBookmarkButton() {
  document.getElementById(BOOKMARK_ADD_BTN_ID)?.remove();
  document.getElementById(BOOKMARK_BTN_ID)?.remove();
  removeBookmarkPanel();
  removeBookmarkModal();
  removeBookmarkTrack();
  stopBookmarkPicking();
}

/* --- Timeline Track & Diamond Pins --- */
function ensureBookmarkTrack() {
  const bar = document.querySelector(".ytp-progress-bar");
  if (!bar) return;
  if (typeof abSetupTimeline === "function") {
    abSetupTimeline();
  }
  let track = document.getElementById(BOOKMARK_TRACK_ID);
  if (!track || !document.contains(track)) {
    if (track) track.remove();
    track = document.createElement("div");
    track.id = BOOKMARK_TRACK_ID;
    track.className = "tada-bm-track";
    bar.appendChild(track);
  }
}

function updateBookmarkPins() {
  const bar = document.querySelector(".ytp-progress-bar");
  if (!bar || !currentSettings.videoBookmarks) {
    removeBookmarkTrack();
    return;
  }
  ensureBookmarkTrack();
  const track = document.getElementById(BOOKMARK_TRACK_ID);
  if (!track) return;

  const v = getMainVideoElement();
  const dur = v?.duration;
  if (!dur || isNaN(dur) || dur <= 0 || currentVideoBookmarks.length === 0) {
    track.innerHTML = "";
    return;
  }

  let html = "";
  currentVideoBookmarks.forEach((bm) => {
    const pct = Math.max(0, Math.min(100, (bm.time / dur) * 100));
    html += `
      <div class="tada-bm-pin" style="left: ${pct}%;" data-time="${bm.time}" data-id="${bm.id}">
        <div class="tada-bm-pin-diamond"></div>
        <div class="tada-bm-tooltip">${formatBookmarkTime(bm.time)}: ${escapeBookmarkHtml(bm.note)}</div>
      </div>
    `;
  });
  track.innerHTML = html;

  if (!track.dataset.listenerBound) {
    track.dataset.listenerBound = "true";
    track.addEventListener("click", (e) => {
      const pin = e.target.closest(".tada-bm-pin");
      if (!pin) return;
      e.preventDefault();
      e.stopPropagation();
      const time = parseFloat(pin.dataset.time);
      if (!isNaN(time)) {
        const video = getMainVideoElement();
        if (video) {
          video.currentTime = time;
          video.play().catch(() => { });
          bookmarkToast(`Đã nhảy tới ${formatBookmarkTime(time)}`);
        }
      }
    });
  }
}

function removeBookmarkTrack() {
  document.getElementById(BOOKMARK_TRACK_ID)?.remove();
}

/* --- View All Notes Panel --- */
function toggleBookmarkPanel() {
  if (bookmarkPanelOpen) {
    closeBookmarkPanel();
  } else {
    openBookmarkPanel();
  }
}

function openBookmarkPanel() {
  if (!currentSettings.videoBookmarks || !isWatchPage()) return;
  const player = document.getElementById("movie_player") || document.querySelector(".html5-video-player");
  if (!player) return;

  bookmarkPanelOpen = true;
  let panel = document.getElementById(BOOKMARK_PANEL_ID);
  if (!panel || !document.contains(panel)) {
    if (panel) panel.remove();
    panel = document.createElement("div");
    panel.id = BOOKMARK_PANEL_ID;
    panel.className = "tada-bm-panel";
    player.appendChild(panel);
  }

  const v = getMainVideoElement();
  const curTime = v?.currentTime || 0;

  panel.innerHTML = `
    <div class="tada-bm-header">
      <div class="tada-bm-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="tada-bm-title-icon">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
        <span>Tất cả ghi chú</span>
        <span class="tada-bm-header-count" id="tada-bm-header-count">${currentVideoBookmarks.length}</span>
      </div>
      <div class="tada-bm-actions">
        <button id="tada-bm-btn-export" class="tada-bm-btn-action" title="Sao chép Markdown / Ghi chú">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          Chép MD
        </button>
        <button id="tada-bm-btn-close" class="tada-bm-btn-action tada-bm-btn-close" title="Đóng panel (Esc hoặc B)">
          ×
        </button>
      </div>
    </div>

    <!-- Quick Action Bar -->
    <div class="tada-bm-add-bar">
      <button id="tada-bm-btn-pick-new" class="tada-bm-btn-pick-action" title="Bật chế độ click chọn mốc trên thanh tua">
        Chọn mốc trên thanh tua
      </button>
      <button id="tada-bm-btn-curtime" class="tada-bm-time-pill" title="Thêm ghi chú ngay tại giây hiện tại của video">
        + Ghim tại <span id="tada-bm-curtime-display">${formatBookmarkTime(curTime)}</span>
      </button>
    </div>

    <!-- Bookmarks List -->
    <div class="tada-bm-list-container" id="tada-bm-list-container">
      <!-- Injected list -->
    </div>
  `;

  renderBookmarkPanelList();

  const closeBtn = panel.querySelector("#tada-bm-btn-close");
  closeBtn?.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); closeBookmarkPanel(); });

  const exportBtn = panel.querySelector("#tada-bm-btn-export");
  exportBtn?.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); exportBookmarksToMarkdown(); });

  const pickNewBtn = panel.querySelector("#tada-bm-btn-pick-new");
  pickNewBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeBookmarkPanel();
    startBookmarkPicking();
  });

  const curTimeBtn = panel.querySelector("#tada-bm-btn-curtime");
  curTimeBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const video = getMainVideoElement();
    const time = video?.currentTime || 0;
    openBookmarkInputModal(time);
  });

  updateBookmarkButtonUI();
}

function renderBookmarkPanelList() {
  const container = document.getElementById("tada-bm-list-container");
  if (!container) return;

  const countBadge = document.getElementById("tada-bm-header-count");
  if (countBadge) countBadge.textContent = currentVideoBookmarks.length;

  if (currentVideoBookmarks.length === 0) {
    container.innerHTML = `
      <div class="tada-bm-empty">
        <div class="tada-bm-empty-dot"></div>
        <div class="tada-bm-empty-text">Chưa có ghi chú nào cho video này</div>
        <div class="tada-bm-empty-sub">Bấm nút bên dưới để chọn mốc trên thanh tua</div>
        <button id="tada-bm-empty-pick-btn" class="tada-bm-empty-btn">
          Chọn điểm trên thanh tua
        </button>
      </div>
    `;
    const pickBtn = container.querySelector("#tada-bm-empty-pick-btn");
    pickBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeBookmarkPanel();
      startBookmarkPicking();
    });
    return;
  }

  let html = "";
  currentVideoBookmarks.forEach((bm) => {
    html += `
      <div class="tada-bm-item" data-id="${bm.id}">
        <button class="tada-bm-item-jump" data-time="${bm.time}" title="Nhảy tới ${formatBookmarkTime(bm.time)} và phát">
          ${formatBookmarkTime(bm.time)}
        </button>
        <div class="tada-bm-item-note" title="${escapeBookmarkHtml(bm.note)}">
          ${escapeBookmarkHtml(bm.note)}
        </div>
        <div class="tada-bm-item-actions">
          <button class="tada-bm-item-edit" data-id="${bm.id}" title="Chỉnh sửa ghi chú này">
            Sửa
          </button>
          <button class="tada-bm-item-delete" data-id="${bm.id}" title="Xóa mốc này">
            ×
          </button>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;

  container.querySelectorAll(".tada-bm-item-jump").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation();
      const time = parseFloat(btn.dataset.time);
      if (!isNaN(time)) {
        const video = getMainVideoElement();
        if (video) {
          video.currentTime = time;
          video.play().catch(() => { });
          bookmarkToast(`Đã nhảy tới ${formatBookmarkTime(time)}`);
        }
      }
    });
  });

  container.querySelectorAll(".tada-bm-item-edit").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation();
      const id = btn.dataset.id;
      const item = currentVideoBookmarks.find(it => it.id === id);
      if (item) {
        openBookmarkInputModal(item.time, item);
      }
    });
  });

  container.querySelectorAll(".tada-bm-item-delete").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation();
      const id = btn.dataset.id;
      if (id) removeBookmark(id);
    });
  });
}

function closeBookmarkPanel() {
  bookmarkPanelOpen = false;
  document.getElementById(BOOKMARK_PANEL_ID)?.remove();
  updateBookmarkButtonUI();
}

function removeBookmarkPanel() {
  bookmarkPanelOpen = false;
  document.getElementById(BOOKMARK_PANEL_ID)?.remove();
}

/* --- Hotkeys --- */
function handleGlobalBookmarkHotkeys(e) {
  if (!currentSettings.videoBookmarks || !isWatchPage()) return;
  if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;

  if (e.key === "Escape") {
    if (document.getElementById(BOOKMARK_MODAL_ID)) {
      e.preventDefault(); e.stopPropagation();
      removeBookmarkModal();
      return;
    }
    if (bookmarkPicking) {
      e.preventDefault(); e.stopPropagation();
      stopBookmarkPicking();
      bookmarkToast("Đã hủy chọn mốc");
      return;
    }
    if (bookmarkPanelOpen) {
      e.preventDefault(); e.stopPropagation();
      closeBookmarkPanel();
      return;
    }
    return;
  }

  if (currentSettings.hotkeysEnabled === false) return;

  if (shouldIgnoreKeyEvent(e) || e.target?.closest?.("ytd-comments, #comments, #search-input, [role='textbox']")) {
    return;
  }

  if (matchesHotkey(e, "bookmarkAdd") || (!currentSettings.customHotkeys?.bookmarkAdd && (e.key === "n" || e.key === "N"))) {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmarkPicking();
    return;
  }

  if (matchesHotkey(e, "bookmarkPanel")) {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmarkPanel();
    return;
  }
}

function ensureBookmarkHotkeys() {
  if (bookmarkHotkeysBound) return;
  window.addEventListener("keydown", handleGlobalBookmarkHotkeys, true);
  bookmarkHotkeysBound = true;
}

function bindVideoBookmarkListeners() {
  const v = getMainVideoElement();
  if (!v || v.dataset.tadaBmBound) return;
  v.dataset.tadaBmBound = "true";
  v.addEventListener("durationchange", () => {
    updateBookmarkPins();
  });
  v.addEventListener("loadedmetadata", () => {
    updateBookmarkPins();
  });
  v.addEventListener("play", () => {
    ensureBookmarkButton();
    updateBookmarkPins();
  });
}

function startBookmarkCheck() {
  if (bookmarkControlInterval) {
    clearInterval(bookmarkControlInterval);
    bookmarkControlInterval = null;
  }
  let count = 0;
  ensureBookmarkButton();
  updateBookmarkPins();
  bindVideoBookmarkListeners();
  bookmarkControlInterval = setInterval(() => {
    count++;
    if (isWatchPage()) {
      ensureBookmarkButton();
      updateBookmarkPins();
      bindVideoBookmarkListeners();
    }
    if (count > 25 && document.getElementById(BOOKMARK_BTN_ID) && document.getElementById(BOOKMARK_ADD_BTN_ID)) {
      clearInterval(bookmarkControlInterval);
      bookmarkControlInterval = null;
    }
  }, 300);
}

function onBookmarkNav() {
  loadBookmarksForCurrentVideo();
  if (bookmarkPanelOpen) {
    closeBookmarkPanel();
  }
  removeBookmarkModal();
  stopBookmarkPicking();
}

function applyVideoBookmarksSetting() {
  const existingStyle = document.getElementById(BOOKMARK_STYLE_ID);
  if (currentSettings.videoBookmarks) {
    if (!existingStyle) {
      const style = document.createElement("style");
      style.id = BOOKMARK_STYLE_ID;
      style.textContent = `
        /* ===== TADa VIDEO BOOKMARKS ===== */
        .tada-bookmark-button {
          position: relative;
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: transparent;
          border: none;
          outline: none;
          padding: 0;
          width: 44px;
          height: 100%;
          opacity: 0.88;
          transition: opacity 0.15s ease, transform 0.15s ease, background 0.15s ease;
          user-select: none;
          -webkit-user-select: none;
          vertical-align: top;
        }
        .tada-bookmark-button:hover {
          opacity: 1;
          background: rgba(255, 255, 255, 0.08);
        }
        .tada-bookmark-button:active { transform: scale(0.92); }
        .tada-bookmark-button svg,
        .tada-bookmark-button * {
          pointer-events: none !important;
        }
        .tada-bookmark-button.active { opacity: 1; }

        /* --- 1. Add Bookmark Button (Nút Thêm) --- */
        /* Clean ribbon with plus, NO checkmark */
        .tada-bookmark-add-button .tada-bm-add-icon {
          width: 22px !important;
          height: 22px !important;
          fill: none;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
          transition: transform 0.25s ease, filter 0.25s ease;
        }
        .tada-bookmark-add-button .tada-bm-add-ribbon {
          stroke: #ffffff;
          stroke-width: 2;
          fill: rgba(255, 255, 255, 0.08);
          transition: stroke 0.25s ease, fill 0.25s ease;
        }
        .tada-bookmark-add-button .tada-bm-add-plus {
          stroke: #ffffff;
          stroke-width: 2.2;
          stroke-linecap: round;
          transition: stroke 0.25s ease, transform 0.25s ease;
        }
        .tada-bookmark-add-button:hover .tada-bm-add-ribbon {
          stroke: #ffffff;
          fill: rgba(255, 255, 255, 0.2);
        }
        .tada-bookmark-add-button:hover .tada-bm-add-icon {
          transform: scale(1.08);
        }

        /* Nút thêm khi BẬT (picking) -> Màu cam rực rỡ, phát sáng, KHÔNG có tick */
        .tada-bookmark-add-button.picking {
          opacity: 1 !important;
          background: rgba(232, 147, 12, 0.22) !important;
          border-radius: 6px;
          animation: tadaBmPulse 1.2s ease-in-out infinite;
        }
        .tada-bookmark-add-button.picking .tada-bm-add-icon {
          filter: drop-shadow(0 0 7px rgba(232, 147, 12, 0.9));
        }
        .tada-bookmark-add-button.picking .tada-bm-add-ribbon {
          stroke: #ff9a44 !important;
          fill: url(#tadaAddOrangeGrad) !important;
        }
        .tada-bookmark-add-button.picking .tada-bm-add-plus {
          stroke: #ffffff !important;
          stroke-width: 2.5;
        }

        /* --- 2. List Bookmarks Button (Nút Xem danh sách - proud-husky-10) --- */
        .tada-bm-list-icon {
          width: 22px !important;
          height: 22px !important;
          fill: none;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
          filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.4));
          transition: transform 0.25s ease, filter 0.25s ease;
        }
        .tada-bm-list-icon .bookmark-checkbox__icon-back {
          stroke: #ff9a44;
          fill: url(#gradientFillList) !important;
          transition: transform 0.3s ease, stroke 0.3s ease;
        }
        .tada-bm-list-icon .bookmark-checkbox__icon-check {
          stroke: #ffffff;
          stroke-dasharray: 16;
          stroke-dashoffset: 0;
          stroke-width: 2.2;
          stroke-linecap: round;
          stroke-linejoin: round;
          transform: translateX(1px);
        }
        .tada-bookmark-button:hover .tada-bm-list-icon .bookmark-checkbox__icon-back,
        .tada-bookmark-button.active .tada-bm-list-icon .bookmark-checkbox__icon-back,
        .tada-bookmark-button.has-bookmarks:hover .tada-bm-list-icon .bookmark-checkbox__icon-back {
          stroke: #ffffff;
          animation: bookmark-pop 0.4s ease;
        }
        .tada-bookmark-button.active .tada-bm-list-icon {
          filter: drop-shadow(0 2px 10px rgba(255, 90, 95, 0.75));
          transform: scale(1.08);
        }

        /* Badge số lượng ghi chú */
        .tada-bm-btn-badge {
          position: absolute;
          top: -5px;
          right: -7px;
          background: linear-gradient(135deg, #ff5a5f, #ff9a44);
          color: #ffffff;
          font-size: 9px;
          font-weight: 800;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          min-width: 15px;
          height: 15px;
          padding: 0 4px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          pointer-events: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.45);
        }

        /* Timeline picking crosshair & glow */
        .ytp-progress-bar-container.tada-bm-picking,
        .ytp-progress-bar.tada-bm-picking {
          cursor: crosshair !important;
        }
        .ytp-progress-bar.tada-bm-picking {
          box-shadow: 0 0 0 2px #E8930C, 0 0 14px rgba(232, 147, 12, 0.75) !important;
          border-radius: 4px;
        }

        @keyframes tadaBmPulse {
          0%, 100% { opacity: 0.85; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        .tada-bm-track {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 39;
        }
        .tada-bm-pin {
          position: absolute;
          top: -3px;
          transform: translateX(-50%);
          width: 14px;
          height: 14px;
          pointer-events: auto;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 41;
          transition: transform 0.15s ease;
        }
        .tada-bm-pin:hover {
          transform: translateX(-50%) scale(1.35);
          z-index: 45;
        }
        .tada-bm-pin-diamond {
          width: 8px;
          height: 8px;
          background: #E8930C;
          border: 1.5px solid #FFFFFF;
          border-radius: 1px;
          transform: rotate(45deg);
          box-shadow: 0 0 6px rgba(232, 147, 12, 0.9), 0 2px 4px rgba(0,0,0,0.5);
        }
        .tada-bm-tooltip {
          position: absolute;
          bottom: 22px;
          left: 50%;
          transform: translateX(-50%) translateY(4px);
          background: rgba(18, 14, 10, 0.94);
          color: #FDF6EC;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 4px;
          border: 1px solid rgba(232, 147, 12, 0.4);
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: all 0.15s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.6);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .tada-bm-pin:hover .tada-bm-tooltip {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        /* ===== Note Input Modal ===== */
        .tada-bm-modal-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: tadaBmFadeIn 0.18s ease-out;
        }
        .tada-bm-modal {
          background: rgba(22, 17, 13, 0.96);
          border: 1px solid rgba(232, 147, 12, 0.45);
          border-radius: 14px;
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.85), 0 0 24px rgba(232, 147, 12, 0.25);
          width: 90%;
          max-width: 400px;
          padding: 16px 18px;
          color: #FDF6EC;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          display: flex;
          flex-direction: column;
          gap: 12px;
          animation: tadaBmScaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: auto;
          user-select: none;
        }
        .tada-bm-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 8px;
        }
        .tada-bm-modal-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          color: #FDF6EC;
        }
        .tada-bm-modal-icon {
          width: 16px;
          height: 16px;
          color: #E8930C;
        }
        .tada-bm-modal-btn-close {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
          cursor: pointer;
          padding: 2px 6px;
          border-radius: 4px;
          transition: all 0.15s ease;
        }
        .tada-bm-modal-btn-close:hover {
          color: #FDF6EC;
          background: rgba(255, 255, 255, 0.1);
        }
        .tada-bm-modal-body {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .tada-bm-modal-time-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
        }
        .tada-bm-modal-time-label {
          color: rgba(255, 255, 255, 0.65);
        }
        .tada-bm-modal-time-pill {
          background: rgba(232, 147, 12, 0.2);
          border: 1px solid rgba(232, 147, 12, 0.45);
          color: #FDF6EC;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 6px;
        }
        .tada-bm-modal-textarea {
          width: 100%;
          box-sizing: border-box;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          color: #FDF6EC;
          font-size: 12px;
          padding: 8px 10px;
          outline: none;
          font-family: inherit;
          resize: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .tada-bm-modal-textarea:focus {
          border-color: #E8930C;
          box-shadow: 0 0 0 2px rgba(232, 147, 12, 0.25);
        }
        .tada-bm-modal-textarea::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }
        .tada-bm-modal-hint {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.45);
        }
        .tada-bm-modal-hint b {
          color: rgba(255, 255, 255, 0.75);
        }
        .tada-bm-modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          padding-top: 4px;
        }
        .tada-bm-modal-btn-cancel {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #FDF6EC;
          font-size: 11px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .tada-bm-modal-btn-cancel:hover {
          background: rgba(255, 255, 255, 0.15);
        }
        /* ===== PROUD-HUSKY-10 BOOKMARK SAVE BUTTON ===== */
        .tada-bm-modal-btn-save {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, rgba(255, 90, 95, 0.18), rgba(255, 154, 68, 0.18));
          border: 1.5px solid rgba(255, 154, 68, 0.55);
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          padding: 6px 16px;
          border-radius: 20px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(255, 90, 95, 0.25);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          user-select: none;
        }

        .tada-bm-modal-btn-save:hover {
          background: linear-gradient(135deg, #ff5a5f, #ff9a44);
          border-color: transparent;
          color: #ffffff;
          transform: translateY(-1px) scale(1.02);
          box-shadow: 0 6px 20px rgba(255, 90, 95, 0.45);
        }

        .tada-bm-modal-btn-save:active {
          transform: translateY(1px) scale(0.97);
        }

        .bookmark-icon-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .bookmark-checkbox__icon {
          width: 17px;
          height: 17px;
          fill: none;
          stroke-width: 2.2;
          stroke-linecap: round;
          stroke-linejoin: round;
          transition: stroke 0.3s, fill 0.3s;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.35));
        }

        .bookmark-checkbox__icon-back {
          stroke: #ff9a44;
          fill: url(#gradientFillSave);
          transition: transform 0.3s, stroke 0.3s;
        }

        .bookmark-checkbox__icon-check {
          stroke: #ffffff;
          stroke-dasharray: 16;
          stroke-dashoffset: 0;
          transition: stroke-dashoffset 0.3s, transform 0.3s;
          transform: translateX(1px);
        }

        .tada-bm-modal-btn-save:hover .bookmark-checkbox__icon-back,
        .tada-bm-modal-btn-save.is-saving .bookmark-checkbox__icon-back {
          stroke: #ffffff;
          animation: bookmark-pop 0.4s ease;
        }

        @keyframes bookmark-pop {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.25);
          }
          100% {
            transform: scale(1.1);
          }
        }
        @keyframes tadaBmScaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }

        /* ===== View All Notes Panel ===== */
        .tada-bm-panel {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 330px;
          max-height: calc(100% - 75px);
          background: rgba(22, 17, 13, 0.96);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(232, 147, 12, 0.35);
          border-radius: 12px;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.7);
          color: #FDF6EC;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          display: flex;
          flex-direction: column;
          z-index: 61;
          overflow: hidden;
          animation: tadaBmFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .tada-bm-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.25);
        }
        .tada-bm-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          color: #FDF6EC;
        }
        .tada-bm-title-icon { width: 15px; height: 15px; color: #E8930C; }
        .tada-bm-header-count {
          font-size: 10px;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 9999px;
          background: rgba(232, 147, 12, 0.2);
          color: #E8930C;
        }
        .tada-bm-actions { display: flex; align-items: center; gap: 6px; }
        .tada-bm-btn-action {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #FDF6EC;
          font-size: 10px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 6px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: all 0.15s ease;
        }
        .tada-bm-btn-action:hover {
          background: rgba(232, 147, 12, 0.2);
          border-color: rgba(232, 147, 12, 0.4);
          color: #E8930C;
        }
        .tada-bm-btn-action svg { width: 11px; height: 11px; }
        .tada-bm-btn-close { padding: 3px 7px; font-size: 11px; }

        .tada-bm-add-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
          padding: 8px 10px;
          background: rgba(255, 255, 255, 0.04);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .tada-bm-btn-pick-action {
          background: rgba(232, 147, 12, 0.18);
          border: 1px solid rgba(232, 147, 12, 0.4);
          color: #FDF6EC;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 6px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: all 0.15s ease;
        }
        .tada-bm-btn-pick-action:hover {
          background: #E8930C;
          color: #1A1410;
        }
        .tada-bm-time-pill {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #FDF6EC;
          font-size: 10px;
          font-weight: 600;
          padding: 4px 7px;
          border-radius: 6px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }
        .tada-bm-time-pill:hover {
          background: rgba(232, 147, 12, 0.25);
          border-color: rgba(232, 147, 12, 0.4);
        }

        .tada-bm-list-container {
          padding: 6px 10px 10px;
          overflow-y: auto;
          max-height: 280px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          scrollbar-width: thin;
          scrollbar-color: rgba(232, 147, 12, 0.35) transparent;
        }
        .tada-bm-list-container::-webkit-scrollbar { width: 4px; }
        .tada-bm-list-container::-webkit-scrollbar-thumb {
          background: rgba(232, 147, 12, 0.35);
          border-radius: 4px;
        }
        .tada-bm-item {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          padding: 4px 6px;
          transition: all 0.15s ease;
        }
        .tada-bm-item:hover {
          background: rgba(255, 255, 255, 0.09);
          border-color: rgba(232, 147, 12, 0.3);
        }
        .tada-bm-item-jump {
          background: rgba(232, 147, 12, 0.18);
          border: 1px solid rgba(232, 147, 12, 0.35);
          color: #FDF6EC;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }
        .tada-bm-item-jump:hover { background: #E8930C; color: #1A1410; }
        .tada-bm-item-note {
          flex: 1;
          min-width: 0;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.9);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .tada-bm-item-actions {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .tada-bm-item-edit {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          font-size: 11px;
          cursor: pointer;
          padding: 2px 4px;
          border-radius: 4px;
          transition: all 0.15s ease;
        }
        .tada-bm-item-edit:hover {
          color: #E8930C;
          background: rgba(232, 147, 12, 0.15);
        }
        .tada-bm-item-delete {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.4);
          font-size: 11px;
          cursor: pointer;
          padding: 2px 5px;
          border-radius: 4px;
          transition: all 0.15s ease;
        }
        .tada-bm-item-delete:hover {
          color: #EF4444;
          background: rgba(239, 68, 68, 0.15);
        }

        .tada-bm-empty {
          padding: 24px 10px;
          text-align: center;
          color: rgba(255, 255, 255, 0.5);
        }
        .tada-bm-empty-icon { font-size: 24px; margin-bottom: 6px; }
        .tada-bm-empty-text { font-size: 12px; font-weight: 600; color: #FDF6EC; }
        .tada-bm-empty-sub {
          font-size: 10px;
          margin-top: 4px;
          color: rgba(255, 255, 255, 0.45);
        }
        .tada-bm-empty-btn {
          margin-top: 10px;
          background: #E8930C;
          border: none;
          color: #1A1410;
          font-size: 11px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .tada-bm-empty-btn:hover {
          background: #F59E0B;
          transform: scale(1.02);
        }

        .tada-bm-empty-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #E8930C;
          box-shadow: 0 0 10px rgba(232, 147, 12, 0.6);
          margin-bottom: 4px;
        }

        .tada-bm-toast {
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
        .tada-bm-toast.show {
          opacity: 1;
          transform: translate(-50%, 0) scale(1);
        }
        .tada-bm-toast .info__icon {
          width: 20px;
          height: 20px;
          margin-right: 8px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tada-bm-toast .info__icon path { fill: #fff; }
        .tada-bm-toast .info__title {
          font-weight: 500;
          font-size: 13px;
          color: #fff;
          line-height: 1.35;
          flex: 1;
        }
        .tada-bm-toast .info__close {
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
        .tada-bm-toast .info__close:hover {
          opacity: 1;
          transform: scale(1.15);
        }
        .tada-bm-toast .info__close path { fill: #fff; }
      `;
      (document.head || document.documentElement).appendChild(style);
    }
    ensureBookmarkHotkeys();
    ensureBookmarkButton();
    loadBookmarksForCurrentVideo();
    startBookmarkCheck();
  } else {
    existingStyle?.remove();
    removeBookmarkButton();
  }
}

