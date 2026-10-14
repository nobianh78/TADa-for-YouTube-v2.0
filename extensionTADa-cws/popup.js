/**
 * TADa for YouTube - Extension Action Popup Controller
 * Manages feature toggles, persistence, and live stats.
 */

const DEFAULT_SETTINGS = {
  superVolume: true,
  ambientLight: true,
  ambientBrightness: 100,
  ambientSpread: 100,
  curateSidebar: true,
  fourColumnGrid: true,
  hideShorts: true,
  hideEndScreens: true,
  premiumBranding: true,
  ensureComments: true,
  autoSelectChips: false,
  pipButton: true,
  videoScreenshot: true,
  customSpeed: true,
  zenMode: true,
  abLooper: true,
  videoBookmarks: true
};

const TOGGLE_FEATURE_KEYS = [
  "superVolume",
  "ambientLight",
  "pipButton",
  "videoScreenshot",
  "customSpeed",
  "abLooper",
  "videoBookmarks",
  "curateSidebar",
  "fourColumnGrid",
  "hideShorts",
  "hideEndScreens",
  "ensureComments",
  "autoSelectChips"
];

// Phân nhóm các tính năng theo 3 danh mục
const CATEGORY_MAP = {
  player: ["superVolume", "ambientLight", "customSpeed", "pipButton", "abLooper"],
  tools: ["videoScreenshot", "videoBookmarks"],
  layout: ["curateSidebar", "fourColumnGrid", "hideShorts", "hideEndScreens", "ensureComments", "autoSelectChips"]
};

const CATEGORY_META = {
  player: {
    title: "Trình phát & Âm thanh",
    desc: "Âm lượng 500%, Ambient Light, tốc độ, PiP & A-B Loop"
  },
  tools: {
    title: "Công cụ & Tiện ích",
    desc: "Chụp ảnh màn hình 4K & Bookmarks ghi chú mốc"
  },
  layout: {
    title: "Giao diện & Tập trung",
    desc: "Bố cục 4 cột, lọc Sidebar, ẩn Shorts, cố định bình luận"
  }
};

let activeCategory = null;

let currentSettings = { ...DEFAULT_SETTINGS };
let toastTimeout = null;
let saveSettingsDebounce = null;

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function updateActiveCount() {
  // Cập nhật tổng số tính năng đang bật
  const activeCount = TOGGLE_FEATURE_KEYS.filter((key) => currentSettings[key]).length;
  const countEl = document.getElementById("active-features-count");
  if (countEl) {
    countEl.textContent = `${activeCount}/${TOGGLE_FEATURE_KEYS.length} bật`;
  }

  // Cập nhật bộ đếm real-time trên từng thẻ danh mục
  Object.entries(CATEGORY_MAP).forEach(([catId, keys]) => {
    const enabledInCat = keys.filter((k) => currentSettings[k]).length;
    const pill = document.getElementById(`cat-count-${catId}`);
    if (pill) {
      pill.textContent = `${enabledInCat}/${keys.length}`;
      pill.classList.toggle("has-active", enabledInCat > 0);
    }
  });

  // Cập nhật badge trên sub-view nếu đang mở
  if (activeCategory && CATEGORY_MAP[activeCategory]) {
    const keys = CATEGORY_MAP[activeCategory];
    const enabled = keys.filter((k) => currentSettings[k]).length;
    const badge = document.getElementById("sub-count-badge");
    if (badge) badge.textContent = `${enabled}/${keys.length}`;
  }
}

function renderToggles() {
  TOGGLE_FEATURE_KEYS.forEach((key) => {
    const checkbox = document.getElementById(`toggle-${key}`);
    if (checkbox) {
      checkbox.checked = Boolean(currentSettings[key]);
    }
  });

  const subSettings = document.getElementById("ambient-sub-settings");
  if (subSettings) {
    subSettings.classList.toggle("show", Boolean(currentSettings.ambientLight));
  }

  const brightnessSlider = document.getElementById("ambient-brightness");
  const brightnessVal = document.getElementById("ambient-brightness-val");
  if (brightnessSlider) {
    const val = currentSettings.ambientBrightness ?? 100;
    brightnessSlider.value = val;
    if (brightnessVal) brightnessVal.textContent = `${val}%`;
  }

  const spreadSlider = document.getElementById("ambient-spread");
  const spreadVal = document.getElementById("ambient-spread-val");
  if (spreadSlider) {
    const val = currentSettings.ambientSpread ?? 100;
    spreadSlider.value = val;
    if (spreadVal) spreadVal.textContent = `${val}%`;
  }

  updateActiveCount();
}

function navigateToCategory(categoryId) {
  activeCategory = categoryId;
  const meta = CATEGORY_META[categoryId];

  // Cập nhật tiêu đề sub-view
  const titleEl = document.getElementById("sub-header-title");
  if (titleEl && meta) titleEl.textContent = meta.title;

  // Ẩn tất cả feat-panel, hiện panel đúng
  document.querySelectorAll(".feat-panel").forEach((p) => {
    p.style.display = "none";
  });
  const panel = document.getElementById(`panel-${categoryId}`);
  if (panel) {
    panel.style.display = "flex";
  }

  // Cập nhật badge
  updateActiveCount();

  // Slide sang màn hình chi tiết
  const slider = document.getElementById("views-slider");
  if (slider) slider.classList.add("show-detail");
}

function navigateBackToMain() {
  activeCategory = null;
  const slider = document.getElementById("views-slider");
  if (slider) slider.classList.remove("show-detail");
}

async function loadSettings() {
  try {
    const data = await chrome.storage.local.get(["ctfSettings", "blockedRequestCount"]);
    if (data.ctfSettings) {
      if (data.ctfSettings.showHud !== undefined) {
        delete data.ctfSettings.showHud;
        chrome.storage.local.set({ ctfSettings: data.ctfSettings }).catch(() => { });
      }
      currentSettings = { ...DEFAULT_SETTINGS, ...data.ctfSettings };
    } else {
      currentSettings = { ...DEFAULT_SETTINGS };
      // Save default settings if never saved before
      await chrome.storage.local.set({ ctfSettings: currentSettings });
    }

    renderToggles();

    const countEl = document.getElementById("blocked-count");
    if (countEl) {
      countEl.textContent = (data.blockedRequestCount ?? 0).toLocaleString();
    }
  } catch (error) {
    console.error("[TADa] Failed to load settings", error);
  }
}

async function notifyYouTubeTabs() {
  try {
    const tabs = await chrome.tabs.query({ url: ["*://*.youtube.com/*", "*://youtube.com/*"] });
    for (const tab of tabs) {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, {
          type: "TADA_SETTINGS_CHANGED",
          settings: currentSettings
        }).catch(() => { });
      }
    }
  } catch (error) {
    console.debug("[TADa] notify tabs error", error);
  }
}

async function saveSettings() {
  try {
    await chrome.storage.local.set({ ctfSettings: currentSettings });
    updateActiveCount();
    notifyYouTubeTabs();
  } catch (error) {
    console.error("[TADa] Failed to save settings", error);
    showToast("Không thể lưu cài đặt!");
  }
}

function handleSliderChange(key, value, badgeId) {
  const numericVal = parseInt(value, 10) || 100;
  currentSettings[key] = numericVal;
  const badge = document.getElementById(badgeId);
  if (badge) {
    badge.textContent = `${numericVal}%`;
  }
  // Notify YouTube tab immediately for live 60fps adjustment
  notifyYouTubeTabs();

  // Debounce storage persistence to avoid unnecessary write spam
  if (saveSettingsDebounce) {
    clearTimeout(saveSettingsDebounce);
  }
  saveSettingsDebounce = setTimeout(() => {
    chrome.storage.local.set({ ctfSettings: currentSettings }).catch((err) => {
      console.error("[TADa] Failed to save slider setting", err);
    });
  }, 120);
}

function initEventListeners() {
  // Drill-down navigation: click cat-row → slide to sub-view
  document.querySelectorAll(".cat-row[data-category]").forEach((card) => {
    card.addEventListener("click", () => {
      const cat = card.dataset.category;
      if (cat) navigateToCategory(cat);
    });
  });

  // Back button: slide back to main
  const btnBack = document.getElementById("btn-back");
  if (btnBack) {
    btnBack.addEventListener("click", navigateBackToMain);
  }

  // Sub-view: Bật hết trong danh mục đang xem
  const btnSubEnableAll = document.getElementById("btn-sub-enable-all");
  if (btnSubEnableAll) {
    btnSubEnableAll.addEventListener("click", async () => {
      if (!activeCategory) return;
      CATEGORY_MAP[activeCategory].forEach((key) => { currentSettings[key] = true; });
      await saveSettings();
      renderToggles();
      showToast(`Đã bật hết ${CATEGORY_META[activeCategory]?.title}!`);
    });
  }

  // Sub-view: Tắt hết trong danh mục đang xem
  const btnSubDisableAll = document.getElementById("btn-sub-disable-all");
  if (btnSubDisableAll) {
    btnSubDisableAll.addEventListener("click", async () => {
      if (!activeCategory) return;
      CATEGORY_MAP[activeCategory].forEach((key) => { currentSettings[key] = false; });
      await saveSettings();
      renderToggles();
      showToast(`Đã tắt hết ${CATEGORY_META[activeCategory]?.title}!`);
    });
  }

  // Sub-view reload tab button
  const btnSubReloadTab = document.getElementById("btn-sub-reload-tab");
  if (btnSubReloadTab) {
    btnSubReloadTab.addEventListener("click", async () => {
      try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs && tabs[0]?.id) {
          await chrome.tabs.reload(tabs[0].id);
          showToast("Đang làm mới trang...");
        }
      } catch (error) {
        console.warn("Could not reload tab:", error);
      }
    });
  }


  // Toggle switches
  TOGGLE_FEATURE_KEYS.forEach((key) => {
    const checkbox = document.getElementById(`toggle-${key}`);
    if (checkbox) {
      checkbox.addEventListener("change", (e) => {
        currentSettings[key] = e.target.checked;

        if (key === "ambientLight") {
          const subSettings = document.getElementById("ambient-sub-settings");
          if (subSettings) {
            subSettings.classList.toggle("show", e.target.checked);
          }
        }

        saveSettings();
        const actionText = e.target.checked ? "Đã bật" : "Đã tắt";
        const labelText = checkbox.closest(".feature-item")?.querySelector(".feature-name")?.textContent || key;
        showToast(`${actionText} ${labelText}`);
      });
    }
  });

  // Ambient light customization sliders
  const brightnessSlider = document.getElementById("ambient-brightness");
  if (brightnessSlider) {
    brightnessSlider.addEventListener("input", (e) => {
      handleSliderChange("ambientBrightness", e.target.value, "ambient-brightness-val");
    });
  }

  const spreadSlider = document.getElementById("ambient-spread");
  if (spreadSlider) {
    spreadSlider.addEventListener("input", (e) => {
      handleSliderChange("ambientSpread", e.target.value, "ambient-spread-val");
    });
  }

  // Locked Ad Blocker toggle click
  const lockedTrigger = document.getElementById("lock-tooltip-trigger");
  if (lockedTrigger) {
    lockedTrigger.addEventListener("click", () => {
      showToast("Chặn quảng cáo là tính năng cốt lõi và luôn hoạt động!");
    });
  }

  // Enable all optional features
  const btnEnableAll = document.getElementById("btn-enable-all");
  if (btnEnableAll) {
    btnEnableAll.addEventListener("click", async () => {
      TOGGLE_FEATURE_KEYS.forEach((key) => {
        currentSettings[key] = true;
      });
      await saveSettings();
      renderToggles();
      showToast("Đã bật tất cả tính năng bổ sung!");
    });
  }

  // Disable all optional features
  const btnDisableAll = document.getElementById("btn-disable-all");
  if (btnDisableAll) {
    btnDisableAll.addEventListener("click", async () => {
      TOGGLE_FEATURE_KEYS.forEach((key) => {
        currentSettings[key] = false;
      });
      await saveSettings();
      renderToggles();
      showToast("Đã tắt tất cả (quảng cáo vẫn chặn)!");
    });
  }

  // Reset stats
  const btnResetStats = document.getElementById("btn-reset-stats");
  if (btnResetStats) {
    btnResetStats.addEventListener("click", () => {
      chrome.runtime.sendMessage({ type: "RESET_BLOCK_STATS" }, (response) => {
        const countEl = document.getElementById("blocked-count");
        if (countEl) {
          countEl.textContent = "0";
        }
        showToast("Đã đặt lại số lượng quảng cáo về 0!");
      });
    });
  }

  // Reload current YouTube tab (header button)
  const btnReloadTab = document.getElementById("btn-reload-tab");
  if (btnReloadTab) {
    btnReloadTab.addEventListener("click", async () => {
      try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs && tabs[0]?.id) {
          await chrome.tabs.reload(tabs[0].id);
          showToast("Đang làm mới trang...");
        }
      } catch (error) {
        console.warn("Could not reload tab:", error);
      }
    });
  }

  // Real-time storage listener
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local") {
      if (changes.ctfSettings) {
        currentSettings = { ...DEFAULT_SETTINGS, ...changes.ctfSettings.newValue };
        renderToggles();
      }
      if (changes.blockedRequestCount) {
        const countEl = document.getElementById("blocked-count");
        if (countEl) {
          countEl.textContent = (changes.blockedRequestCount.newValue ?? 0).toLocaleString();
        }
      }
    if (changes.tada_video_bookmarks_v1) {
        loadBookmarksSummary();
      }
    }
  });

  // Bookmarks Modal Management
  initBookmarksModal();
}

const BOOKMARKS_STORAGE_KEY = "tada_video_bookmarks_v1";

function formatTimestamp(sec) {
  if (sec === null || sec === undefined || isNaN(sec)) return "00:00";
  const total = Math.max(0, Math.floor(sec));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n) => (n < 10 ? "0" + n : "" + n);
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

async function loadBookmarksSummary() {
  const summaryEl = document.getElementById("bm-lib-summary");
  if (!summaryEl) return;
  try {
    const data = await chrome.storage.local.get([BOOKMARKS_STORAGE_KEY]);
    const allBm = data?.[BOOKMARKS_STORAGE_KEY] || {};
    const videoKeys = Object.keys(allBm);
    let totalItems = 0;
    videoKeys.forEach((key) => {
      totalItems += Array.isArray(allBm[key]?.items) ? allBm[key].items.length : 0;
    });

    if (totalItems === 0) {
      summaryEl.textContent = "0 mốc đã lưu";
    } else {
      summaryEl.textContent = `${totalItems} mốc (${videoKeys.length} video)`;
    }
  } catch (err) {
    summaryEl.textContent = "0 mốc đã lưu";
  }
}

async function renderBookmarksModalList() {
  const bodyEl = document.getElementById("bm-modal-body");
  if (!bodyEl) return;

  try {
    const data = await chrome.storage.local.get([BOOKMARKS_STORAGE_KEY]);
    const allBm = data?.[BOOKMARKS_STORAGE_KEY] || {};
    const videoKeys = Object.keys(allBm);

    if (videoKeys.length === 0) {
      bodyEl.innerHTML = `
        <div class="bm-empty-modal">
          <p>Chưa có mốc thời gian nào được lưu.</p>
          <p style="margin-top: 6px; font-size: 11px; opacity: 0.8;">Mở bất kỳ video nào và bấm phím <b>B</b> trên bàn phím để ghim mốc!</p>
        </div>
      `;
      return;
    }

    let html = "";
    videoKeys.forEach((vId) => {
      const entry = allBm[vId];
      const items = Array.isArray(entry?.items) ? entry.items : [];
      if (items.length === 0) return;

      const title = entry.title || `Video (${vId})`;
      html += `
        <div class="bm-video-group" data-video-id="${vId}">
          <div class="bm-video-header">
            <span class="bm-video-title" title="${title}">${title}</span>
            <button class="btn-del-video-bm" data-video-id="${vId}" title="Xóa toàn bộ mốc của video này">Xóa tất cả</button>
          </div>
          <div class="bm-item-list">
      `;

      items.forEach((bm) => {
        const timeStr = formatTimestamp(bm.time);
        const url = `https://www.youtube.com/watch?v=${vId}&t=${Math.floor(bm.time)}s`;
        html += `
          <div class="bm-item-row">
            <div class="bm-item-left">
              <a href="${url}" target="_blank" class="bm-pill-time" title="Mở video tại ${timeStr}">${timeStr}</a>
              <span class="bm-item-note-text" title="${bm.note}">${bm.note}</span>
            </div>
            <button class="btn-del-single-bm" data-video-id="${vId}" data-bm-id="${bm.id}" title="Xóa mốc">×</button>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    bodyEl.innerHTML = html;

    // Delete single bookmark
    bodyEl.querySelectorAll(".btn-del-single-bm").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const vId = btn.dataset.videoId;
        const bmId = btn.dataset.bmId;
        const freshData = await chrome.storage.local.get([BOOKMARKS_STORAGE_KEY]);
        const store = freshData?.[BOOKMARKS_STORAGE_KEY] || {};
        if (store[vId] && Array.isArray(store[vId].items)) {
          store[vId].items = store[vId].items.filter((item) => item.id !== bmId);
          if (store[vId].items.length === 0) {
            delete store[vId];
          }
          await chrome.storage.local.set({ [BOOKMARKS_STORAGE_KEY]: store });
          renderBookmarksModalList();
          loadBookmarksSummary();
          showToast("Đã xóa mốc thời gian!");
        }
      });
    });

    // Delete all bookmarks of a video
    bodyEl.querySelectorAll(".btn-del-video-bm").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const vId = btn.dataset.videoId;
        const freshData = await chrome.storage.local.get([BOOKMARKS_STORAGE_KEY]);
        const store = freshData?.[BOOKMARKS_STORAGE_KEY] || {};
        if (store[vId]) {
          delete store[vId];
          await chrome.storage.local.set({ [BOOKMARKS_STORAGE_KEY]: store });
          renderBookmarksModalList();
          loadBookmarksSummary();
          showToast("Đã xóa toàn bộ mốc của video!");
        }
      });
    });
  } catch (err) {
    console.error("Error rendering bookmarks modal", err);
  }
}

function initBookmarksModal() {
  const backdrop = document.getElementById("bm-modal-backdrop");
  const openBtn = document.getElementById("btn-open-bm-modal");
  const closeBtn = document.getElementById("btn-close-bm-modal");
  const exportAllBtn = document.getElementById("btn-export-all-bm");
  const clearAllBtn = document.getElementById("btn-clear-all-bm");

  if (openBtn && backdrop) {
    openBtn.addEventListener("click", () => {
      renderBookmarksModalList();
      backdrop.classList.add("show");
    });
  }

  if (closeBtn && backdrop) {
    closeBtn.addEventListener("click", () => {
      backdrop.classList.remove("show");
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove("show");
      }
    });
  }

  if (exportAllBtn) {
    exportAllBtn.addEventListener("click", async () => {
      const data = await chrome.storage.local.get([BOOKMARKS_STORAGE_KEY]);
      const allBm = data?.[BOOKMARKS_STORAGE_KEY] || {};
      const videoKeys = Object.keys(allBm);
      if (videoKeys.length === 0) {
        showToast("Không có mốc nào để sao chép!");
        return;
      }

      let md = "# Danh sách Video Bookmarks (TADa for YouTube)\n\n";
      videoKeys.forEach((vId) => {
        const entry = allBm[vId];
        const items = Array.isArray(entry?.items) ? entry.items : [];
        if (items.length === 0) return;
        const title = entry.title || vId;
        const url = `https://www.youtube.com/watch?v=${vId}`;
        md += `### [${title}](${url})\n`;
        items.forEach((item) => {
          md += `- [${formatTimestamp(item.time)}](${url}&t=${Math.floor(item.time)}s) — ${item.note}\n`;
        });
        md += "\n";
      });

      navigator.clipboard.writeText(md).then(() => {
        showToast("Đã sao chép tất cả mốc ra Markdown!");
      }).catch(() => {
        showToast("Không thể chép vào clipboard!");
      });
    });
  }

  if (clearAllBtn) {
    clearAllBtn.addEventListener("click", async () => {
      if (confirm("Bạn có chắc chắn muốn xóa TẤT CẢ bookmark đã lưu của mọi video không?")) {
        await chrome.storage.local.set({ [BOOKMARKS_STORAGE_KEY]: {} });
        renderBookmarksModalList();
        loadBookmarksSummary();
        showToast("Đã xóa sạch thư viện bookmark!");
      }
    });
  }

  loadBookmarksSummary();
}

function initAboutModal() {
  const backdrop = document.getElementById("about-modal-backdrop");
  const openBtn = document.getElementById("btn-open-about-modal");
  const openHeaderBtn = document.getElementById("btn-header-about");
  const closeBtn = document.getElementById("btn-close-about-modal");
  const closeFooterBtn = document.getElementById("btn-close-about-modal-footer");
  const githubLink = document.getElementById("link-github-repo");

  function openModal() {
    if (backdrop) backdrop.classList.add("show");
  }
  function closeModal() {
    if (backdrop) backdrop.classList.remove("show");
  }

  if (openBtn) openBtn.addEventListener("click", openModal);
  if (openHeaderBtn) openHeaderBtn.addEventListener("click", openModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (closeFooterBtn) closeFooterBtn.addEventListener("click", closeModal);

  if (backdrop) {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeModal();
    });
  }

  if (githubLink) {
    githubLink.addEventListener("click", (e) => {
      e.preventDefault();
      const targetUrl = "https://github.com/nobianh78/TADa-for-YouTube-v2.0";
      if (typeof chrome !== "undefined" && chrome.tabs && typeof chrome.tabs.create === "function") {
        chrome.tabs.create({ url: targetUrl });
      } else {
        window.open(targetUrl, "_blank");
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadSettings();
  initEventListeners();
  initAboutModal();
});
