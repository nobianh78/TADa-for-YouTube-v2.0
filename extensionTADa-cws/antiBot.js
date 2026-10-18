/**
 * Anti-Bot & Environment Compatibility Script
 * 
 * Runs at document_start in MAIN world.
 * Preserves native browser APIs (performance.now, userAgentData, WebGL, plugins)
 * to prevent YouTube BotGuard attestation failures and MSE buffer desync.
 */
(() => {
    "use strict";

    // ============================================
    // 1. SAFE AUTOMATION CLEANUP
    // ============================================
    // Only clean obvious third-party scraper artifacts if they exist
    const legacyArtifacts = [
        'callPhantom', '_phantom', '__nightmare', 'phantom',
        'domAutomation', 'domAutomationController'
    ];

    legacyArtifacts.forEach(prop => {
        try {
            if (prop in window) {
                delete window[prop];
            }
        } catch (e) { }
    });

    // ============================================
    // 2. YOUTUBE TV (LEANBACK) CLIENT-SIDE SPOOF
    // ============================================
    if (window.location.pathname.startsWith('/tv')) {
        const TV_UA = 'Mozilla/5.0 (PS4; Leanback Shell) Cobalt/26.lts.0-qa; compatible;';
        try {
            Object.defineProperty(navigator, 'userAgent', {
                get: () => TV_UA,
                configurable: true
            });
            Object.defineProperty(navigator, 'appVersion', {
                get: () => '5.0 (PS4; Leanback Shell) Cobalt/26.lts.0-qa; compatible;',
                configurable: true
            });
        } catch (e) { }
    }

    console.info('[TADa] Safe environment compatibility active');
})();
