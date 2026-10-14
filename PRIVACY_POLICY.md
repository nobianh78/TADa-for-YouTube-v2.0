# Privacy Policy — TADa for YouTube

**Last Updated:** October 14, 2026  
**Effective Date:** October 14, 2026  
**Developer:** Nguyen Tuan Anh (TADa Team)  
**Repository:** [https://github.com/nobianh78/TADa-for-YouTube-v2.0](https://github.com/nobianh78/TADa-for-YouTube-v2.0)

---

## 1. Introduction

Thank you for choosing **TADa for YouTube** ("the Extension"), developed by **Nguyen Tuan Anh** as part of the **TADa Team**. Your privacy is our top priority. This Privacy Policy describes how TADa for YouTube handles information and demonstrates our commitment to protecting your personal data.

**TADa for YouTube is built on a "Local-First, Zero-Data-Collection" philosophy.** We do not collect, transmit, sell, or store any personal information on external servers. All operations happen strictly on your local device.

---

## 2. Information Collection and Usage

### A. Personal Information (PII)
* **We DO NOT collect personal data:** We do not collect names, email addresses, phone numbers, IP addresses, location data, passwords, payment info, or any government-issued identifiers.

### B. Browsing History & Web Activity
* **We DO NOT track your browsing history:** The Extension does not monitor, log, or transmit the websites you visit, search queries you make, or your viewing history.

### C. Local Storage (`chrome.storage.local`)
The Extension uses your browser’s local storage API (`chrome.storage.local`) exclusively to save your personal preferences on your machine. This includes:
* **Feature Toggles:** Your choices for enabling/disabling volume booster, ambient light, picture-in-picture button, video screenshots, custom playback speed, and A-B looper.
* **Volume & Lighting Preferences:** Your chosen volume multiplier (up to 500%) and ambient spread/brightness values.
* **Video Bookmarks & Notes:** Timestamps and notes that you explicitly create for YouTube videos are saved locally to your device and never uploaded to any remote server.
* **Blocked Ad Counter:** A local numerical counter tracking how many ad requests have been filtered locally on your device.

---

## 3. Explanation of Requested Permissions

TADa for YouTube only requests the minimal set of permissions required to function:

| Permission | Purpose |
| :--- | :--- |
| `declarativeNetRequest` | Used to block intrusive video advertisements, tracking beacons, and analytics requests on YouTube at the network level using predefined, static filter rules. **No network traffic contents or URLs are recorded or transmitted.** |
| `activeTab` | Grants temporary, user-initiated access to reload and synchronize custom settings with the active YouTube tab when you interact with the extension popup. |
| `storage` | Stores your local configuration, volume level, and saved video timestamps inside your browser's local sandbox (`chrome.storage.local`). |
| Host Permissions (`*://*.youtube.com/*`, `*://*.googlevideo.com/*`) | Required solely to inject custom player controls (Volume slider, Ambient lighting canvas, PiP button, Screenshot trigger, A-B loop pins) onto YouTube video watch pages and filter video stream ads. |

---

## 4. Third-Party Sharing and Data Sales

* **Zero Third-Party Sharing:** We do not sell, rent, monetize, or trade any user data to third parties, data brokers, advertisers, or analytics companies.
* **No Remote Tracking or Analytics:** The Extension does not bundle Google Analytics, Firebase, Sentry, Facebook Pixel, or any telemetry SDKs.
* **Single Purpose Compliance:** The Extension uses permissions strictly for enhancing the YouTube viewing experience and nothing else.

---

## 5. Remote Code Policy

In strict compliance with **Manifest V3** and the **Chrome Web Store Developer Program Policies**, TADa for YouTube:
* **Does not load remote code:** All JavaScript, HTML, CSS, and icons are packaged directly inside the extension archive.
* **Does not use `eval()`** or dynamically load external scripts from CDN or third-party servers.

---

## 6. Data Retention and Deletion

* All settings and bookmarks are stored solely in your local browser sandbox.
* **To delete all data:**
  1. Open the TADa popup ➜ Click **"Thư viện Bookmarks"** ➜ Click **"Xóa hết"** (Clear all).
  2. Or simply uninstall the extension from `chrome://extensions/`. All associated local data will be permanently and immediately purged by your browser.

---

## 7. Compliance with Chrome Web Store Limited Use Policy

TADa for YouTube complies with the [Chrome Web Store User Data Policy](https://developer.chrome.com/docs/webstore/user_data/), including the **Limited Use** requirements:
1. The use of information is strictly limited to providing and improving user-facing features.
2. The transfer of data is prohibited except where necessary to provide user-facing features, comply with applicable laws, or as part of a merger/acquisition.
3. Human inspection of data is not performed because no data is transferred to the developer.
4. Data is never used for creditworthiness, lending, or personalized advertising.

---

## 8. Changes to this Privacy Policy

We may update this Privacy Policy from time to time. Any changes will be posted in this repository with an updated revision date.

---

## 9. Contact Us

If you have any questions, feedback, or concerns regarding this Privacy Policy, please open an issue on GitHub:
* **GitHub Repository:** [https://github.com/nobianh78/TADa-for-YouTube-v2.0/issues](https://github.com/nobianh78/TADa-for-YouTube-v2.0/issues)
* **Author:** Nguyen Tuan Anh (TADa Team)
