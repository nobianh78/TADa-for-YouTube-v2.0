/**
 * TADa for YouTube - UI Layout Module
 * Grid layout, Hide Shorts, Hide End Screens, Comments, Branding & TV Mode
 */

function ensureCommentsVisible() {
  if (!currentSettings.ensureComments || !isWatchPage()) {
    return;
  }

  // Target selectors for comments section
  const commentsSelectors = [
    "ytd-comments#comments",
    "ytd-comments.ytd-watch-flexy",
    "#comments.ytd-watch-flexy",
    "#below.ytd-watch-flexy",
    "#below"
  ];

  commentsSelectors.forEach((selector) => {
    const element = document.querySelector(selector);
    if (element) {
      // Remove hidden attribute
      element.removeAttribute("hidden");
      element.removeAttribute("collapsed");

      // Force display via inline style as last resort
      if (getComputedStyle(element).display === "none") {
        element.style.setProperty("display", "block", "important");
      }
      if (getComputedStyle(element).visibility === "hidden") {
        element.style.setProperty("visibility", "visible", "important");
      }
    }
  });

  // Ensure item-section-renderer inside comments is visible
  const commentSections = document.querySelectorAll("ytd-comments ytd-item-section-renderer");
  commentSections.forEach((section) => {
    section.removeAttribute("hidden");
    if (getComputedStyle(section).display === "none") {
      section.style.setProperty("display", "block", "important");
    }
  });

  // HIDE the right-side engagement panel comments (keep only below-player comments)
  const engagementComments = document.querySelector(
    'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-comments-section"]'
  );
  if (engagementComments) {
    engagementComments.style.setProperty("display", "none", "important");
  }

  // Check for comment continuation
  const continuation = document.querySelector("ytd-comments ytd-continuation-item-renderer");
  if (continuation && !continuation.hasAttribute("data-ctf-triggered")) {
    continuation.setAttribute("data-ctf-triggered", "true");
  }
}


function applyFourColumnGridSetting() {
  const existing = document.getElementById(FOUR_COLUMN_GRID_STYLE_ID);
  if (currentSettings.fourColumnGrid) {
    if (!existing) {
      const style = document.createElement("style");
      style.id = FOUR_COLUMN_GRID_STYLE_ID;
      style.textContent = `
        /* ===== 4-ROW GRID LAYOUT FOR HOME PAGE ===== */
        ytd-rich-grid-renderer {
          --ytd-rich-grid-items-per-row: 4 !important;
          --ytd-rich-grid-posts-per-row: 4 !important;
          --ytd-rich-grid-movies-per-row: 4 !important;
          --ytd-rich-grid-game-cards-per-row: 4 !important;
        }

        ytd-rich-grid-renderer #contents.ytd-rich-grid-renderer {
          display: grid !important;
          grid-template-columns: repeat(4, 1fr) !important;
          gap: 16px !important;
          grid-auto-flow: row !important;
        }

        /* Force all rich items to respect grid sizing */
        ytd-rich-item-renderer[rendered-from-rich-grid] {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
          grid-column: span 1 !important;
        }
        
        ytd-rich-item-renderer[rendered-from-rich-grid] #content {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
        }

        /* Force all media containers to 100% width */
        ytd-rich-item-renderer[rendered-from-rich-grid] ytd-thumbnail,
        ytd-rich-item-renderer[rendered-from-rich-grid] ytd-rich-grid-media,
        ytd-rich-item-renderer[rendered-from-rich-grid] ytd-rich-grid-slim-media,
        ytd-rich-item-renderer[rendered-from-rich-grid] ytd-video-renderer,
        ytd-rich-item-renderer[rendered-from-rich-grid] ytd-grid-video-renderer,
        ytd-rich-item-renderer[rendered-from-rich-grid] ytd-playlist-renderer,
        ytd-rich-item-renderer[rendered-from-rich-grid] ytd-rich-grid-playlist-renderer,
        ytd-rich-item-renderer[rendered-from-rich-grid] yt-lockup-view-model,
        ytd-rich-item-renderer[rendered-from-rich-grid] yt-image {
          width: 100% !important;
          max-width: 100% !important;
          min-width: 0 !important;
        }

        ytd-rich-item-renderer[rendered-from-rich-grid] ytd-thumbnail a,
        ytd-rich-item-renderer[rendered-from-rich-grid] ytd-thumbnail #thumbnail,
        ytd-rich-item-renderer[rendered-from-rich-grid] ytd-thumbnail img,
        ytd-rich-item-renderer[rendered-from-rich-grid] yt-image img {
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
        }

        ytd-rich-grid-row {
          display: contents !important;
        }

        /* ===== CONSTRAIN RICH SECTION RENDERERS (MIXES, PROMOTIONS) ===== */
        ytd-rich-section-renderer {
          width: 100% !important;
          max-width: 100% !important;
          grid-column: span 4 !important;
        }

        /* Ensure any content within sections also respects grid */
        ytd-rich-section-renderer ytd-rich-item-renderer {
          width: calc(25% - 12px) !important;
          max-width: calc(25% - 12px) !important;
          min-width: 0 !important;
          display: inline-block !important;
          vertical-align: top !important;
          margin: 0 16px 16px 0 !important;
        }

        ytd-rich-section-renderer ytd-rich-item-renderer:nth-child(4n) {
          margin-right: 0 !important;
        }

        /* ===== REMOVE EMPTY SPACE / GAPS ===== */
        ytd-rich-grid-renderer #contents.ytd-rich-grid-renderer > ytd-rich-item-renderer:empty,
        ytd-rich-grid-renderer #contents.ytd-rich-grid-renderer > ytd-rich-section-renderer:empty {
          display: none !important;
        }

        ytd-two-column-browse-results-renderer {
          padding: 0 24px !important;
        }

        #primary.ytd-two-column-browse-results-renderer {
          padding-top: 24px !important;
        }

        ytd-rich-grid-renderer {
          margin: 0 !important;
          padding: 0 !important;
        }
      `;
      (document.head || document.documentElement).appendChild(style);
    }
  } else {
    existing?.remove();
  }
}

function applyHideEndScreensSetting() {
  const existing = document.getElementById(HIDE_END_SCREENS_STYLE_ID);
  if (currentSettings.hideEndScreens) {
    if (!existing) {
      const style = document.createElement("style");
      style.id = HIDE_END_SCREENS_STYLE_ID;
      style.textContent = `

        /* ===== HIDE END SCREEN OVERLAYS ===== */
        .ytp-ce-element,
        .ytp-ce-covering-overlay,
        .ytp-ce-element-show,
        .ytp-ce-channel,
        .ytp-ce-video,
        .ytp-ce-playlist,
        .ytp-ce-website-group,
        .ytp-endscreen-content,
        .ytp-ce-expanding-overlay,
        .ytp-ce-expanding-image,
        .ytp-ce-shadow,
        .html5-endscreen,
        .videowall-endscreen,
        .ytp-endscreen-previous,
        .ytp-endscreen-next,
        .ytp-show-tiles .ytp-videowall-still {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `;
      (document.head || document.documentElement).appendChild(style);
    }
    END_SCREEN_SELECTORS.forEach((selector) => {
      collectMatches(document, selector).forEach((node) => {
        node.style.setProperty("display", "none", "important");
        node.setAttribute("data-ctf-hidden-endscreen", "true");
      });
    });
  } else {
    existing?.remove();
    document.querySelectorAll('[data-ctf-hidden-endscreen="true"]').forEach((node) => {
      node.style.removeProperty("display");
      node.removeAttribute("data-ctf-hidden-endscreen");
    });
  }
}

function applyHideShortsSetting() {
  const existing = document.getElementById(HIDE_SHORTS_STYLE_ID);
  if (currentSettings.hideShorts) {
    if (!existing) {
      const style = document.createElement("style");
      style.id = HIDE_SHORTS_STYLE_ID;
      style.textContent = `

        /* ===== HIDE YOUTUBE SHORTS ===== */
        ytd-rich-shelf-renderer[is-shorts],
        ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts]),
        ytd-reel-shelf-renderer,
        ytd-guide-entry-renderer:has(a[title="Shorts"]),
        ytd-mini-guide-entry-renderer[aria-label="Shorts"],
        ytd-guide-entry-renderer a[href^="/shorts"],
        ytd-mini-guide-entry-renderer a[href^="/shorts"],
        ytd-video-renderer:has(a[href*="/shorts/"]) {
          display: none !important;
        }
      `;
      (document.head || document.documentElement).appendChild(style);
    }
    removeShortsShelves(document);
  } else {
    existing?.remove();
    document.querySelectorAll('[data-ctf-hidden-shorts="true"]').forEach((node) => {
      node.style.removeProperty("display");
      node.removeAttribute("data-ctf-hidden-shorts");
    });
  }
}


const YOUTUBE_DEFAULT_SVG_MARKUP = `
<svg viewBox="97 68 623 139" xmlns="http://www.w3.org/2000/svg" class="ctf-brand-logo ctf-brand-default-svg" style="height: 20px; width: auto; overflow: visible;">
  <g>
    <path fill="#FF0000" d="M 176.882812 166.699219 L 228.007812 137.03125 L 176.882812 107.507812 Z M 119.570312 201.980469 C 111.070312 199.675781 104.445312 192.90625 102 184.554688 C 97.964844 169.144531 97.964844 137.03125 97.964844 137.03125 C 97.964844 137.03125 97.964844 104.917969 102 89.652344 C 104.445312 81.15625 111.070312 74.53125 119.570312 72.226562 C 134.832031 68.050781 196.46875 68.050781 196.46875 68.050781 C 196.46875 68.050781 258.25 68.050781 273.519531 72.226562 C 282.15625 74.53125 288.636719 81.15625 290.945312 89.652344 C 295.117188 104.917969 295.117188 137.03125 295.117188 137.03125 C 295.117188 137.03125 295.117188 169.144531 290.945312 184.554688 C 288.636719 192.90625 282.15625 199.675781 273.519531 201.980469 C 258.25 206.15625 196.46875 206.15625 196.46875 206.15625 C 196.46875 206.15625 134.832031 206.15625 119.570312 201.980469 "/>
    <path fill="#FFFFFF" d="M 176.882812 166.699219 L 228.007812 137.03125 L 176.882812 107.507812 Z"/>
  </g>
  <g fill="currentColor">
    <path d="M 337.078125 197.660156 L 337.078125 159.855469 L 314.253906 76.6875 L 334.054688 76.6875 L 342.265625 113.554688 C 344.136719 122.054688 346.078125 134.222656 346.945312 138.617188 L 347.089844 138.617188 C 347.953125 134.367188 349.824219 122.199219 351.769531 113.703125 L 360.265625 76.6875 L 380.066406 76.6875 L 356.953125 159.855469 L 356.953125 197.660156 Z"/>
    <path d="M 408.21875 143.078125 C 408.21875 126.085938 406.632812 121.191406 401.019531 121.191406 C 395.257812 121.191406 393.527344 126.085938 393.527344 143.078125 L 393.527344 163.386719 C 393.527344 180.953125 395.257812 185.417969 400.730469 185.417969 C 406.632812 185.417969 408.21875 180.953125 408.21875 163.386719 Z M 428.378906 149.847656 L 428.378906 156.90625 C 428.378906 188.300781 421.464844 198.957031 400.871094 198.957031 C 379.703125 198.957031 373.367188 188.011719 373.367188 156.90625 L 373.367188 149.847656 C 373.367188 117.734375 381.574219 107.507812 401.304688 107.507812 C 421.035156 107.507812 428.378906 118.164062 428.378906 149.847656 "/>
    <path d="M 436.726562 175.625 L 436.726562 109.234375 L 456.601562 109.234375 L 456.601562 173.539062 C 456.601562 181.316406 458.328125 184.769531 462.433594 184.769531 C 465.53125 184.769531 468.550781 183.402344 470.710938 177.644531 L 470.710938 109.234375 L 490.585938 109.234375 L 490.585938 197.515625 L 473.738281 197.515625 L 472.585938 185.636719 L 472.511719 185.636719 C 470.066406 194.058594 465.242188 199.246094 455.230469 199.246094 C 441.980469 199.246094 436.726562 190.75 436.726562 175.625 "/>
    <path d="M 504.550781 197.515625 L 504.550781 93.683594 L 484.894531 93.683594 L 484.894531 76.6875 L 544.082031 76.6875 L 544.082031 93.683594 L 524.425781 93.683594 L 524.425781 197.515625 Z"/>
    <path d="M 538.605469 175.625 L 538.605469 109.234375 L 558.480469 109.234375 L 558.480469 173.539062 C 558.480469 181.316406 560.210938 184.769531 564.3125 184.769531 C 567.410156 184.769531 570.433594 183.402344 572.59375 177.644531 L 572.59375 109.234375 L 592.46875 109.234375 L 592.46875 197.515625 L 575.617188 197.515625 L 574.464844 185.636719 L 574.394531 185.636719 C 571.945312 194.058594 567.121094 199.246094 557.113281 199.246094 C 543.863281 199.246094 538.605469 190.75 538.605469 175.625 "/>
    <path d="M 638.328125 146.535156 C 638.328125 126.085938 636.601562 121.621094 631.054688 121.621094 C 627.3125 121.621094 623.710938 124.933594 622.273438 131.269531 L 622.273438 180.019531 C 624 183.402344 627.023438 184.84375 630.191406 184.84375 C 636.167969 184.84375 638.328125 178.507812 638.328125 159.351562 Z M 658.636719 146.535156 L 658.636719 158.34375 C 658.636719 186.859375 652.585938 198.8125 639.191406 198.8125 C 631.054688 198.8125 624.933594 195.210938 621.765625 189.164062 L 621.695312 189.164062 L 620.398438 197.515625 L 603.117188 197.515625 L 603.117188 72.226562 L 622.273438 72.226562 L 622.273438 97.570312 C 622.273438 104.195312 622.414062 110.820312 621.839844 118.742188 L 622.054688 118.742188 C 625.367188 112.117188 631.054688 107.507812 639.984375 107.507812 C 652.800781 107.507812 658.636719 115.859375 658.636719 146.535156 "/>
    <path d="M 686.0625 141.925781 L 686.0625 148.625 L 699.164062 148.625 L 699.164062 141.925781 C 699.164062 125.65625 698.519531 121.046875 692.542969 121.046875 C 686.566406 121.046875 686.0625 125.796875 686.0625 141.925781 M 718.96875 159.714844 L 686.0625 159.714844 L 686.0625 164.539062 C 686.0625 180.089844 686.421875 185.417969 692.832031 185.417969 C 699.164062 185.417969 700.605469 180.523438 700.75 170.441406 L 718.25 171.234375 C 719.542969 190.460938 709.609375 198.957031 692.757812 198.957031 C 672.308594 198.957031 666.261719 185.5625 666.261719 161.226562 L 666.261719 145.816406 C 666.261719 120.179688 673.027344 107.652344 693.332031 107.652344 C 713.785156 107.652344 718.96875 118.308594 718.96875 144.953125 Z M 718.96875 159.714844 "/>
  </g>
</svg>
`;

const YOUTUBE_PREMIUM_SVG_MARKUP = `
<svg viewBox="0 0 101 20" width="101" height="20" xmlns="http://www.w3.org/2000/svg" class="ctf-brand-logo ctf-brand-premium-svg" style="height: 20px; width: auto; overflow: visible;">
  <g>
    <path d="M14.4848 20C14.4848 20 23.5695 20 25.8229 19.4C27.0917 19.06 28.0459 18.08 28.3808 16.87C29 14.65 29 9.98 29 9.98C29 9.98 29 5.34 28.3808 3.14C28.0459 1.9 27.0917 0.94 25.8229 0.61C23.5695 0 14.4848 0 14.4848 0C14.4848 0 5.42037 0 3.17711 0.61C1.9286 0.94 0.954148 1.9 0.59888 3.14C0 5.34 0 9.98 0 9.98C0 9.98 0 14.65 0.59888 16.87C0.954148 18.08 1.9286 19.06 3.17711 19.4C5.42037 20 14.4848 20 14.4848 20Z" fill="#FF0033"/>
    <path d="M19 10L11.5 5.75V14.25L19 10Z" fill="white"/>
  </g>
  <g fill="currentColor">
    <path d="M32.1819 2.10016V18.9002H34.7619V12.9102H35.4519C38.8019 12.9102 40.5619 11.1102 40.5619 7.57016V6.88016C40.5619 3.31016 39.0019 2.10016 35.7219 2.10016H32.1819ZM37.8619 7.63016C37.8619 10.0002 37.1419 11.0802 35.4019 11.0802H34.7619V3.95016H35.4519C37.4219 3.95016 37.8619 4.76016 37.8619 7.13016V7.63016Z"/>
    <path d="M41.982 18.9002H44.532V10.0902C44.952 9.37016 45.992 9.05016 47.302 9.32016L47.462 6.33016C47.292 6.31016 47.142 6.29016 47.002 6.29016C45.802 6.29016 44.832 7.20016 44.342 8.86016H44.162L43.952 6.54016H41.982V18.9002Z"/>
    <path d="M55.7461 11.5002C55.7461 8.52016 55.4461 6.31016 52.0161 6.31016C48.7861 6.31016 48.0661 8.46016 48.0661 11.6202V13.7902C48.0661 16.8702 48.7261 19.1102 51.9361 19.1102C54.4761 19.1102 55.7861 17.8402 55.6361 15.3802L53.3861 15.2602C53.3561 16.7802 53.0061 17.4002 51.9961 17.4002C50.7261 17.4002 50.6661 16.1902 50.6661 14.3902V13.5502H55.7461V11.5002ZM51.9561 7.97016C53.1761 7.97016 53.2661 9.12016 53.2661 11.0702V12.0802H50.6661V11.0702C50.6661 9.14016 50.7461 7.97016 51.9561 7.97016Z"/>
    <path d="M60.1945 18.9002V8.92016C60.5745 8.39016 61.1945 8.07016 61.7945 8.07016C62.5645 8.07016 62.8445 8.61016 62.8445 9.69016V18.9002H65.5045L65.4845 8.93016C65.8545 8.37016 66.4845 8.04016 67.1045 8.04016C67.7745 8.04016 68.1445 8.61016 68.1445 9.69016V18.9002H70.8045V9.49016C70.8045 7.28016 70.0145 6.27016 68.3445 6.27016C67.1845 6.27016 66.1945 6.69016 65.2845 7.67016C64.9045 6.76016 64.1545 6.27016 63.0845 6.27016C61.8745 6.27016 60.7345 6.79016 59.9345 7.76016H59.7845L59.5945 6.54016H57.5445V18.9002H60.1945Z"/>
    <path d="M74.0858 4.97016C74.9858 4.97016 75.4058 4.67016 75.4058 3.43016C75.4058 2.27016 74.9558 1.91016 74.0858 1.91016C73.2058 1.91016 72.7758 2.23016 72.7758 3.43016C72.7758 4.67016 73.1858 4.97016 74.0858 4.97016ZM72.8658 18.9002H75.3958V6.54016H72.8658V18.9002Z"/>
    <path d="M79.9516 19.0902C81.4116 19.0902 82.3216 18.4802 83.0716 17.3802H83.1816L83.2916 18.9002H85.2816V6.54016H82.6416V16.4702C82.3616 16.9602 81.7116 17.3202 81.1016 17.3202C80.3316 17.3202 80.0916 16.7102 80.0916 15.6902V6.54016H77.4616V15.8102C77.4616 17.8202 78.0416 19.0902 79.9516 19.0902Z"/>
    <path d="M90.0031 18.9002V8.92016C90.3831 8.39016 91.0031 8.07016 91.6031 8.07016C92.3731 8.07016 92.6531 8.61016 92.6531 9.69016V18.9002H95.3131L95.2931 8.93016C95.6631 8.37016 96.2931 8.04016 96.9131 8.04016C97.5831 8.04016 97.9531 8.61016 97.9531 9.69016V18.9002H100.613V9.49016C100.613 7.28016 99.8231 6.27016 98.1531 6.27016C96.9931 6.27016 96.0031 6.69016 95.0931 7.67016C94.7131 6.76016 93.9631 6.27016 92.8931 6.27016C91.6831 6.27016 90.5431 6.79016 89.7431 7.76016H89.5931L89.4031 6.54016H87.3531V18.9002H90.0031Z"/>
  </g>
</svg>
`;

let logoAltClickBound = false;

function showLogoToast(message) {
  let toast = document.getElementById("tada-logo-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "tada-logo-toast";
    toast.style.cssText = `
      position: fixed;
      top: 60px;
      left: 24px;
      z-index: 9999999;
      background: rgba(18, 12, 8, 0.92);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(232, 147, 12, 0.55);
      border-radius: 8px;
      padding: 7px 14px;
      color: #ffffff;
      font-size: 12px;
      font-weight: 700;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.45), 0 0 8px rgba(232, 147, 12, 0.25);
      pointer-events: none;
      transition: opacity 0.25s ease, transform 0.25s ease;
      opacity: 0;
      transform: translateY(-4px);
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-4px)";
  }, 2200);
}

function setupLogoAltClickListener() {
  if (logoAltClickBound) return;
  const logoAnchor = document.querySelector("ytd-topbar-logo-renderer #logo, a#logo");
  if (!logoAnchor) return;
  logoAltClickBound = true;

  logoAnchor.addEventListener("click", (e) => {
    if (e.altKey && currentSettings.hotkeysEnabled !== false) {
      e.preventDefault();
      e.stopPropagation();

      const sequence = ["tada", "premium", "default"];
      const current = currentSettings.logoType || (currentSettings.premiumBranding ? "tada" : "default");
      const nextIdx = (sequence.indexOf(current) + 1) % sequence.length;
      const nextLogo = sequence[nextIdx];

      currentSettings.logoType = nextLogo;
      currentSettings.premiumBranding = (nextLogo !== "default");
      applyPremiumBrandingSetting();

      try {
        if (typeof chrome !== "undefined" && chrome.runtime?.id && chrome.storage?.local) {
          chrome.storage.local.set({ ctfSettings: currentSettings }).catch(() => {});
        }
      } catch {
        // Suppress error if extension context was invalidated by reload
      }

      const labels = {
        tada: "TADa",
        premium: "YouTube Premium",
        default: "Mặc định (YouTube)"
      };
      showLogoToast(`Đã đổi Logo: ${labels[nextLogo]}`);
    }
  }, true);
}

function applyPremiumBrandingSetting() {
  // Clean up any residual elements
  document.querySelectorAll(".ctf-brand-logo-container").forEach((el) => el.remove());
  document.querySelectorAll("svg[id*='yt-ringo2-svg'], g[id*='youtube-paths'], a#logo svg").forEach((el) => {
    el.style.removeProperty("display");
    el.style.removeProperty("visibility");
    el.style.removeProperty("width");
    el.style.removeProperty("height");
    el.style.removeProperty("opacity");
    if (el.parentElement && el.parentElement.tagName.toLowerCase() === "div") {
      el.parentElement.style.removeProperty("display");
      el.parentElement.style.removeProperty("width");
      el.parentElement.style.removeProperty("height");
    }
  });

  const existingStyle = document.getElementById(PREMIUM_BRANDING_STYLE_ID);
  const logoIcon = document.querySelector("ytd-topbar-logo-renderer #logo-icon");
  const label = document.querySelector("ytd-topbar-logo-renderer #logo-icon-label");
  const masthead = document.querySelector("ytd-masthead");

  const logoType = currentSettings.logoType || (currentSettings.premiumBranding ? "tada" : "default");

  if (!existingStyle) {
    const style = document.createElement("style");
    style.id = PREMIUM_BRANDING_STYLE_ID;
    style.textContent = `
      /* ===== TADa BRAND LOGO (CLEAN, NO GLOW, NO MASTHEAD BORDER) ===== */
      ytd-topbar-logo-renderer #logo-icon {
        display: flex !important;
        align-items: center !important;
        width: auto !important;
        height: auto !important;
        position: relative !important;
      }

      ytd-topbar-logo-renderer #logo-icon-label {
        display: none !important;
      }

      ytd-topbar-logo-renderer #logo-icon .ctf-brand-logo {
        height: 20px !important;
        width: auto !important;
        max-width: 175px !important;
        object-fit: contain !important;
        display: block !important;
        cursor: pointer !important;
        transition: opacity 0.2s ease, transform 0.2s ease !important;
        box-shadow: none !important;
        filter: none !important;
        animation: none !important;
      }

      ytd-topbar-logo-renderer #logo-icon .ctf-brand-default-svg,
      ytd-topbar-logo-renderer #logo-icon .ctf-brand-premium-svg {
        color: var(--yt-spec-text-primary, currentColor) !important;
      }

      ytd-topbar-logo-renderer #logo-icon:hover .ctf-brand-logo {
        opacity: 0.85 !important;
        transform: scale(1.02) !important;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  if (logoIcon) {
    const needsUpdate = logoIcon.dataset.ctfLogoType !== logoType || !logoIcon.querySelector(".ctf-brand-logo");
    if (needsUpdate) {
      if (logoType === "tada") {
        let logoSrc = null;
        try {
          if (typeof chrome !== "undefined" && chrome?.runtime?.id) {
            logoSrc = chrome.runtime.getURL("icons/youtube-tada-logo.png");
          }
        } catch {
          return;
        }
        if (logoSrc) {
          logoIcon.innerHTML = `<img class="ctf-brand-logo" src="${logoSrc}" alt="YouTube TADa">`;
          logoIcon.dataset.ctfLogoType = "tada";
        }
      } else if (logoType === "premium") {
        logoIcon.innerHTML = YOUTUBE_PREMIUM_SVG_MARKUP;
        logoIcon.dataset.ctfLogoType = "premium";
      } else {
        logoIcon.innerHTML = YOUTUBE_DEFAULT_SVG_MARKUP;
        logoIcon.dataset.ctfLogoType = "default";
      }
    }
  }

  if (label) {
    if (logoType === "tada") {
      label.textContent = "TADa";
    } else if (logoType === "premium") {
      label.textContent = "Premium";
    } else {
      label.textContent = "";
    }
  }

  if (masthead) {
    masthead.style.removeProperty("border-bottom");
    delete masthead.dataset.ctfPremium;
  }

  applyFaviconBrandingSetting(logoType !== "default");
  setupLogoAltClickListener();
}

let originalFaviconsBackup = null;

function applyFaviconBrandingSetting(forceEnable) {
  const isEnabled = typeof forceEnable === "boolean"
    ? forceEnable
    : Boolean(currentSettings.premiumBranding);
  let icon32Url = null;
  let icon48Url = null;
  let icon16Url = null;
  try {
    if (typeof chrome !== "undefined" && chrome?.runtime?.id) {
      icon32Url = chrome.runtime.getURL("icons/icon32.png");
      icon48Url = chrome.runtime.getURL("icons/icon48.png");
      icon16Url = chrome.runtime.getURL("icons/icon16.png");
    }
  } catch {
    return;
  }
  if (!icon32Url) return;

  if (isEnabled) {
    const foreignIcons = document.querySelectorAll(
      "link[rel*='icon']:not([data-ctf-favicon='true'])"
    );

    if (foreignIcons.length > 0) {
      if (!originalFaviconsBackup) {
        originalFaviconsBackup = Array.from(foreignIcons).map((link) => ({
          rel: link.getAttribute("rel") || "icon",
          href: link.getAttribute("href") || "",
          type: link.getAttribute("type") || "",
          sizes: link.getAttribute("sizes") || "",
        }));
      }
      foreignIcons.forEach((link) => link.remove());
    }

    let ctfFavicon32 = document.querySelector(
      "link[data-ctf-favicon='true'][sizes='32x32']"
    );
    if (!ctfFavicon32) {
      ctfFavicon32 = document.createElement("link");
      ctfFavicon32.rel = "icon";
      ctfFavicon32.type = "image/png";
      ctfFavicon32.sizes = "32x32";
      ctfFavicon32.href = icon32Url;
      ctfFavicon32.dataset.ctfFavicon = "true";
      (document.head || document.documentElement).appendChild(ctfFavicon32);
    } else if (ctfFavicon32.href !== icon32Url) {
      ctfFavicon32.href = icon32Url;
    }

    let ctfFavicon48 = document.querySelector(
      "link[data-ctf-favicon='true'][sizes='48x48']"
    );
    if (!ctfFavicon48) {
      ctfFavicon48 = document.createElement("link");
      ctfFavicon48.rel = "shortcut icon";
      ctfFavicon48.type = "image/png";
      ctfFavicon48.sizes = "48x48";
      ctfFavicon48.href = icon48Url;
      ctfFavicon48.dataset.ctfFavicon = "true";
      (document.head || document.documentElement).appendChild(ctfFavicon48);
    } else if (ctfFavicon48.href !== icon48Url) {
      ctfFavicon48.href = icon48Url;
    }

    let ctfFavicon16 = document.querySelector(
      "link[data-ctf-favicon='true'][sizes='16x16']"
    );
    if (!ctfFavicon16) {
      ctfFavicon16 = document.createElement("link");
      ctfFavicon16.rel = "icon";
      ctfFavicon16.type = "image/png";
      ctfFavicon16.sizes = "16x16";
      ctfFavicon16.href = icon16Url;
      ctfFavicon16.dataset.ctfFavicon = "true";
      (document.head || document.documentElement).appendChild(ctfFavicon16);
    } else if (ctfFavicon16.href !== icon16Url) {
      ctfFavicon16.href = icon16Url;
    }
  } else {
    const ctfIcons = document.querySelectorAll("link[data-ctf-favicon='true']");
    if (ctfIcons.length > 0) {
      ctfIcons.forEach((link) => link.remove());
    }

    if (originalFaviconsBackup && originalFaviconsBackup.length > 0) {
      originalFaviconsBackup.forEach((item) => {
        const link = document.createElement("link");
        if (item.rel) link.setAttribute("rel", item.rel);
        if (item.href) link.setAttribute("href", item.href);
        if (item.type) link.setAttribute("type", item.type);
        if (item.sizes) link.setAttribute("sizes", item.sizes);
        (document.head || document.documentElement).appendChild(link);
      });
      originalFaviconsBackup = null;
    } else if (!document.querySelector("link[rel*='icon']")) {
      const link = document.createElement("link");
      link.rel = "shortcut icon";
      link.href = "https://www.youtube.com/s/desktop/d97607a7/img/favicon.ico";
      (document.head || document.documentElement).appendChild(link);
    }
  }
}


function applyEnsureCommentsSetting() {
  const existing = document.getElementById(ENSURE_COMMENTS_STYLE_ID);
  if (currentSettings.ensureComments) {
    if (!existing) {
      const style = document.createElement("style");
      style.id = ENSURE_COMMENTS_STYLE_ID;
      style.textContent = `
        /* ===== HIDE RIGHT-SIDE COMMENTS PANEL ===== */
        ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-comments-section"] {
          display: none !important;
          visibility: hidden !important;
        }
      `;
      (document.head || document.documentElement).appendChild(style);
    }
    if (isWatchPage()) {
      ensureCommentsVisible();
    }
  } else {
    existing?.remove();
  }
}


function applyProgressColorSetting() {
  const existing = document.getElementById(PROGRESS_BAR_STYLE_ID);
  if (!currentSettings.progressColor) {
    if (existing) existing.remove();
    return;
  }

  const color = currentSettings.progressBarColor || "#E8930C";

  let styleEl = existing;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = PROGRESS_BAR_STYLE_ID;
    (document.head || document.documentElement).appendChild(styleEl);
  }

  styleEl.textContent = `
    :root {
      --tada-progress-color: ${color} !important;
    }
    .ytp-play-progress,
    .ytp-swatch-background-color,
    .ytp-cairo-refresh-signature-moments .ytp-play-progress,
    .ytp-volume-slider-handle:before,
    ytd-thumbnail-overlay-resume-playback-renderer #progress,
    yt-page-navigation-progress #progress-bar {
      background: ${color} !important;
      background-color: ${color} !important;
    }
    .ytp-scrubber-button,
    .ytp-scrubber-button.ytp-swatch-background-color {
      background: ${color} !important;
      background-color: ${color} !important;
    }
    .ytp-swatch-color {
      color: ${color} !important;
    }
    .ytp-scrubber-container:hover .ytp-scrubber-button,
    .ytp-scrubber-button:hover {
      box-shadow: 0 0 10px ${color} !important;
    }
  `;
}


function initTvModeUi() {
  if (document.getElementById("tada-tv-floating-badge")) return;

  const style = document.createElement("style");
  style.id = "tada-tv-style";
  style.textContent = `
    #tada-tv-floating-badge {
      position: fixed;
      bottom: 24px;
      right: 28px;
      z-index: 2147483647;
      display: flex;
      align-items: center;
      gap: 9px;
      background: rgba(20, 20, 22, 0.92);
      border: 1px solid rgba(232, 147, 12, 0.4);
      border-radius: 26px;
      padding: 6px 14px;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(12px);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      opacity: 0.45;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      user-select: none;
    }
    #tada-tv-floating-badge:hover {
      opacity: 1;
      transform: translateY(-2px);
      box-shadow: 0 6px 22px rgba(232, 147, 12, 0.3);
      border-color: rgba(232, 147, 12, 0.9);
    }
    .tada-tv-dot {
      width: 8px;
      height: 8px;
      background: #22c55e;
      border-radius: 50%;
      box-shadow: 0 0 6px #22c55e;
      flex-shrink: 0;
    }
    .tada-tv-title {
      font-size: 12px;
      font-weight: 700;
      color: #E8930C;
      letter-spacing: 0.3px;
    }
    .tada-tv-hint {
      font-size: 11px;
      color: #94a3b8;
    }
    .tada-tv-btn {
      font-size: 11px;
      font-weight: 600;
      color: #ffffff;
      background: rgba(232, 147, 12, 0.25);
      border: 1px solid rgba(232, 147, 12, 0.5);
      padding: 3px 9px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .tada-tv-btn:hover {
      background: #E8930C;
      color: #ffffff;
      border-color: #E8930C;
    }
  `;
  (document.head || document.documentElement).appendChild(style);

  const badge = document.createElement("div");
  badge.id = "tada-tv-floating-badge";
  badge.innerHTML = `
    <span class="tada-tv-dot"></span>
    <span class="tada-tv-title">TADa TV</span>
    <span class="tada-tv-hint">(Alt+M)</span>
    <button type="button" class="tada-tv-btn" id="tada-tv-switch-pc" title="Quay về giao diện YouTube PC máy tính">Về PC</button>
  `;
  (document.body || document.documentElement).appendChild(badge);

  document.getElementById("tada-tv-switch-pc")?.addEventListener("click", () => {
    try {
      if (typeof chrome !== "undefined" && chrome.runtime?.id && chrome.storage?.local) {
        chrome.storage.local.get(["ctfSettings"]).then((data) => {
          const next = { ...(data?.ctfSettings || {}), interfaceMode: "pc" };
          chrome.storage.local.set({ ctfSettings: next }).finally(() => {
            window.location.replace("https://www.youtube.com/");
          });
        }).catch(() => {
          window.location.replace("https://www.youtube.com/");
        });
        return;
      }
    } catch {
      // Suppress error if extension context was invalidated
    }
    window.location.replace("https://www.youtube.com/");
  });

  // Shortcut Alt + M to return to PC interface
  window.addEventListener("keydown", (e) => {
    if (currentSettings.hotkeysEnabled === false) return;
    if (e.altKey && (e.key === "m" || e.key === "M")) {
      e.preventDefault();
      window.location.replace("https://www.youtube.com/");
    }
  });
}

