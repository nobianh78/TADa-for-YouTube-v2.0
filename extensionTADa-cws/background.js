const STORAGE_KEY = "blockedRequestCount";

async function readCount() {
  try {
    const result = await chrome.storage.local.get([STORAGE_KEY]);
    return Number(result[STORAGE_KEY] ?? 0);
  } catch (error) {
    console.error("[TADa] Failed to read count", error);
    return 0;
  }
}

async function writeCount(next) {
  try {
    await chrome.storage.local.set({ [STORAGE_KEY]: next });
  } catch (error) {
    console.error("[TADa] Failed to persist count", error);
  }
}

async function incrementBlockedCount() {
  const current = await readCount();
  const next = current + 1;
  await writeCount(next);
  return next;
}

chrome.runtime.onInstalled.addListener(async () => {
  await writeCount(0);
  console.info("[TADa] Ready to block YouTube ads.");
});

if (chrome.declarativeNetRequest?.onRuleMatchedDebug) {
  chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(async (info) => {
    if (info?.rule?.id) {
      await incrementBlockedCount();
    }
  });
}

const dislikeCache = new Map();
const DISLIKE_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

async function fetchDislikeData(videoId) {
  if (!videoId || typeof videoId !== "string") {
    return { success: false, error: "Invalid videoId" };
  }

  const cached = dislikeCache.get(videoId);
  if (cached && Date.now() - cached.timestamp < DISLIKE_CACHE_TTL_MS) {
    return { success: true, data: cached.data };
  }

  try {
    const response = await fetch(
      `https://returnyoutubedislikeapi.com/votes?videoId=${encodeURIComponent(videoId)}`,
      {
        method: "GET",
        headers: { Accept: "application/json" }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    dislikeCache.set(videoId, { data, timestamp: Date.now() });

    if (dislikeCache.size > 200) {
      const oldestKey = dislikeCache.keys().next().value;
      dislikeCache.delete(oldestKey);
    }

    return { success: true, data };
  } catch (error) {
    console.debug("[TADa] Dislike API fetch failed:", error);
    return { success: false, error: error?.message || "Fetch failed" };
  }
}

const sponsorCache = new Map();
const SPONSOR_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

async function sha256Prefix(text, len = 4) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex.substring(0, len);
}

async function fetchSponsorSegments(videoId) {
  if (!videoId || typeof videoId !== "string") {
    return { success: false, segments: [] };
  }

  const cached = sponsorCache.get(videoId);
  if (cached && Date.now() - cached.timestamp < SPONSOR_CACHE_TTL_MS) {
    return { success: true, segments: cached.segments };
  }

  try {
    const prefix = await sha256Prefix(videoId, 4);
    const categories = JSON.stringify([
      "sponsor",
      "intro",
      "outro",
      "selfpromo",
      "interaction",
      "preview"
    ]);
    const url = `https://api.sponsor.ajay.app/api/skipSegments/${prefix}?categories=${encodeURIComponent(categories)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" }
    });

    if (response.status === 404) {
      sponsorCache.set(videoId, { segments: [], timestamp: Date.now() });
      return { success: true, segments: [] };
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    let segments = [];
    if (Array.isArray(data)) {
      const match = data.find((v) => v.videoID === videoId);
      if (match && Array.isArray(match.segments)) {
        segments = match.segments;
      }
    }

    sponsorCache.set(videoId, { segments, timestamp: Date.now() });

    if (sponsorCache.size > 200) {
      const oldestKey = sponsorCache.keys().next().value;
      sponsorCache.delete(oldestKey);
    }

    return { success: true, segments };
  } catch (error) {
    console.debug("[TADa] SponsorBlock API fetch failed:", error);
    return { success: false, segments: [], error: error?.message || "Fetch failed" };
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "GET_BLOCK_STATS") {
    readCount().then((blockedRequestCount) => {
      sendResponse({ blockedRequestCount });
    });
    return true;
  }

  if (message?.type === "INCREMENT_BLOCK_COUNT") {
    incrementBlockedCount().then((blockedRequestCount) => {
      sendResponse({ blockedRequestCount });
    });
    return true;
  }

  if (message?.type === "RESET_BLOCK_STATS") {
    writeCount(0).then(() => sendResponse({ ok: true }));
    return true;
  }

  if (message?.type === "GET_DISLIKE_DATA") {
    fetchDislikeData(message.videoId).then((result) => {
      sendResponse(result);
    });
    return true;
  }

  if (message?.type === "GET_SPONSOR_SEGMENTS") {
    fetchSponsorSegments(message.videoId).then((result) => {
      sendResponse(result);
    });
    return true;
  }

  if (message?.type === "OPEN_YOUTUBE_TV") {
    chrome.windows.create({
      url: "https://www.youtube.com/tv#/",
      type: "popup",
      state: "maximized"
    }).then((win) => {
      sendResponse({ success: true, windowId: win.id });
    }).catch(() => {
      chrome.tabs.create({ url: "https://www.youtube.com/tv#/" });
      sendResponse({ success: true });
    });
    return true;
  }

  return false;
});


