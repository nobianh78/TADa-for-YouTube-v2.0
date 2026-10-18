/**
 * TADa for YouTube - Auto Highest Quality Controller
 * Enforces highest available resolution (4K / 2K / 1080p 60fps) or preferred quality
 */

const QUALITY_BADGE_STYLE_ID = "tada-quality-badge-style";
let qualityBadgeTimeout = null;

function ensureQualityBadgeStyle() {
  if (document.getElementById(QUALITY_BADGE_STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = QUALITY_BADGE_STYLE_ID;
  style.textContent = `
    /* ===== TADa QUALITY BADGE ===== */
    .tada-quality-badge {
      position: absolute !important;
      top: 18px !important;
      right: 18px !important;
      z-index: 55 !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 6px !important;
      padding: 6px 12px !important;
      background: rgba(18, 12, 8, 0.85) !important;
      backdrop-filter: blur(10px) !important;
      -webkit-backdrop-filter: blur(10px) !important;
      border: 1px solid rgba(232, 147, 12, 0.5) !important;
      border-radius: 8px !important;
      color: #ffffff !important;
      font-family: "YouTube Noto", Roboto, Arial, sans-serif !important;
      font-size: 12px !important;
      font-weight: 700 !important;
      letter-spacing: 0.3px !important;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.45), 0 0 10px rgba(232, 147, 12, 0.3) !important;
      pointer-events: none !important;
      opacity: 0 !important;
      transform: translateY(-8px) scale(0.96) !important;
      transition: opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1), transform 0.28s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }

    .tada-quality-badge.show {
      opacity: 1 !important;
      transform: translateY(0) scale(1) !important;
    }

    .tada-quality-badge-icon {
      width: 14px !important;
      height: 14px !important;
      color: var(--tada-progress-color, #E8930C) !important;
      flex-shrink: 0 !important;
    }

    .tada-quality-badge-text {
      color: #ffffff !important;
    }

    .tada-quality-badge-sub {
      color: var(--tada-progress-color, #E8930C) !important;
      font-size: 10px !important;
      text-transform: uppercase !important;
      font-weight: 800 !important;
      padding-left: 2px !important;
    }
  `;
  (document.head || document.documentElement).appendChild(style);
}

function showQualityBadgeToast(qualityLabel) {
  if (currentSettings.qualityBadge === false) return;

  const player = document.querySelector(".html5-video-player") || document.getElementById("movie_player");
  if (!player) return;

  ensureQualityBadgeStyle();

  let badge = player.querySelector(".tada-quality-badge");
  if (!badge) {
    badge = document.createElement("div");
    badge.className = "tada-quality-badge";
    badge.innerHTML = `
      <svg class="tada-quality-badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
        <polyline points="17 2 12 7 7 2"/>
      </svg>
      <span class="tada-quality-badge-text"></span>
      <span class="tada-quality-badge-sub">TADa HD</span>
    `;
    player.appendChild(badge);
  }

  const textEl = badge.querySelector(".tada-quality-badge-text");
  if (textEl) {
    textEl.textContent = qualityLabel;
  }

  // Animate in
  badge.classList.remove("show");
  // Trigger reflow
  void badge.offsetWidth;
  badge.classList.add("show");

  if (qualityBadgeTimeout) {
    clearTimeout(qualityBadgeTimeout);
  }

  qualityBadgeTimeout = setTimeout(() => {
    badge.classList.remove("show");
  }, 2600);
}

function sendQualityUpdateToMain() {
  try {
    window.postMessage(
      {
        source: "TADA_QUALITY_CONTROLLER_REQUEST",
        type: "UPDATE_SETTINGS",
        enabled: Boolean(currentSettings.autoQuality),
        preferredQuality: currentSettings.preferredQuality || "highest"
      },
      "*"
    );
  } catch (e) {}
}

function notifyQualityNav() {
  try {
    window.postMessage(
      {
        source: "TADA_QUALITY_CONTROLLER_REQUEST",
        type: "NAVIGATE"
      },
      "*"
    );
  } catch (e) {}
}

let qualityBridgeBound = false;
function bindQualityMessageListener() {
  if (qualityBridgeBound) return;
  qualityBridgeBound = true;

  window.addEventListener("message", (event) => {
    if (event.source !== window || !event.data) return;
    if (event.data.source === "TADA_QUALITY_CONTROLLER" && event.data.type === "QUALITY_APPLIED") {
      const label = event.data.label || event.data.quality;
      if (label && isWatchPage()) {
        showQualityBadgeToast(label);
      }
    }
  });
}

function applyAutoQualitySetting() {
  sendQualityUpdateToMain();
  if (!currentSettings.autoQuality) {
    const badge = document.querySelector(".tada-quality-badge");
    if (badge) badge.classList.remove("show");
  }
}
