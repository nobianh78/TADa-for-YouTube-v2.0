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

  return false;
});
