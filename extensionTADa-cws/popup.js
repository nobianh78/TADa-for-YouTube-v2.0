/**
 * TADa for YouTube - Extension Action Popup Controller
 * Manages feature toggles, persistence, and live stats.
 */

const DEFAULT_SETTINGS = {
  language: "vi",
  hasChosenLanguage: false,
  superVolume: true,
  ambientLight: true,
  ambientBrightness: 100,
  ambientSpread: 100,
  curateSidebar: true,
  fourColumnGrid: true,
  hideShorts: true,
  hideEndScreens: true,
  premiumBranding: true,
  logoType: "tada",
  ensureComments: true,
  autoSelectChips: false,
  pipButton: true,
  videoScreenshot: true,
  customSpeed: true,
  zenMode: true,
  abLooper: true,
  videoBookmarks: true,
  returnDislike: true,
  autoSkipSegments: true,
  interfaceMode: "pc",
  autoTvRedirect: false,
  progressColor: true,
  progressBarColor: "#E8930C",
  videoFilter: true,
  filterBrightness: 100,
  filterContrast: 100,
  filterSaturation: 100,
  filterWarmth: 0,
  filterInvert: 0,
  filterGrayscale: 0,
  cinemaMode: true,
  cinemaOpacity: 85,
  customLoader: true,
  autoQuality: true,
  preferredQuality: "highest",
  qualityBadge: true,
  hotkeysEnabled: true,
  customHotkeys: {},
  toolbarOrder: [
    "abLooper",
    "cinemaMode",
    "videoFilter",
    "customSpeed",
    "pipButton",
    "videoScreenshot",
    "videoBookmarks"
  ],
  toolbarHidden: {},
  abLooperPosition: "left",
  toolbarAnchor: "beforeSettings"
};

const DEFAULT_TOOLBAR_ORDER = [
  "abLooper",
  "cinemaMode",
  "videoFilter",
  "customSpeed",
  "pipButton",
  "videoScreenshot",
  "videoBookmarks"
];

const DEFAULT_HOTKEYS = {
  screenshot: "s",
  screenshotClipboard: "Shift+s",
  cinemaMode: "w",
  pip: "p",
  speedUp: ">",
  speedDown: "<",
  speedReset: "=",
  abSetA: "[",
  abSetB: "]",
  abToggle: "\\",
  bookmarkAdd: "Shift+b",
  bookmarkPanel: "b",
  volumeUp: "Shift+ArrowUp",
  volumeDown: "Shift+ArrowDown",
  sponsorRevert: "z"
};

const TOGGLE_FEATURE_KEYS = [
  "superVolume",
  "ambientLight",
  "progressColor",
  "videoFilter",
  "cinemaMode",
  "customLoader",
  "autoQuality",
  "pipButton",
  "videoScreenshot",
  "customSpeed",
  "abLooper",
  "videoBookmarks",
  "returnDislike",
  "autoSkipSegments",
  "curateSidebar",
  "fourColumnGrid",
  "hideShorts",
  "hideEndScreens",
  "ensureComments",
  "autoSelectChips",
  "hotkeysEnabled"
];

// Phân nhóm các tính năng theo các danh mục
const CATEGORY_MAP = {
  player: ["superVolume", "ambientLight", "progressColor", "videoFilter", "cinemaMode", "customLoader", "autoQuality", "customSpeed", "pipButton", "abLooper"],
  tools: ["videoScreenshot", "videoBookmarks", "returnDislike", "autoSkipSegments"],
  layout: ["curateSidebar", "fourColumnGrid", "hideShorts", "hideEndScreens", "ensureComments", "autoSelectChips"],
  shortcuts: ["hotkeysEnabled"],
  toolbar: []
};

const CATEGORY_META = {
  player: {
    title: "Trình phát & Âm thanh",
    desc: "Âm lượng 500%, Ambient Light, màu thanh thời gian, PiP"
  },
  tools: {
    title: "Công cụ & Tiện ích",
    desc: "Chụp ảnh 4K, Bookmarks, Dislike & Bỏ qua Intro/Sponsor"
  },
  layout: {
    title: "Giao diện & Tập trung",
    desc: "Logo tùy biến, lưới 4 cột, lọc Sidebar, ẩn Shorts, cố định bình luận"
  },
  shortcuts: {
    title: "Phím tắt nhanh (Hotkeys)",
    desc: "Bảng phím tắt pro, chụp ảnh, tua tốc độ, rạp phim, bookmark"
  },
  toolbar: {
    title: "Sắp xếp thanh công cụ",
    desc: "Đổi thứ tự, ẩn/hiện nút tiện ích trên thanh điều khiển YouTube"
  }
};

const I18N = {
  vi: {
    brandSub: "Tùy chỉnh thông minh",
    aboutTitle: "Giới thiệu TADa & Tác giả",
    reloadTabTitle: "Tải lại tab YouTube",
    switchLangTitle: "Đổi sang Tiếng Anh (Switch to English)",
    switchLangToast: "Đã chuyển sang Tiếng Việt 🇻🇳",
    adBlockLabel: "Chặn quảng cáo",
    alwaysOn: "LUÔN BẬT",
    blockedUnit: "đã chặn",
    resetStatsTitle: "Đặt lại thống kê",
    resetStatsToast: "Đã đặt lại bộ đếm quảng cáo về 0!",
    logoTitle: "Logo YouTube",
    logoDefault: "Mặc định",
    modeTitle: "Chế độ giao diện",
    openTvNow: "Mở YouTube TV ngay",
    tvAutoRedirectLabel: "Tự động chuyển sang TV khi vào youtube.com",
    openTvSub: "Mở YouTube TV trong cửa sổ riêng",
    featuresLabel: "Tính năng",
    enableAll: "Bật hết",
    disableAll: "Tắt hết",
    catPlayer: "Trình phát & Âm thanh",
    catTools: "Công cụ & Tiện ích",
    catLayout: "Giao diện & Tập trung",
    catShortcuts: "Phím tắt nhanh",
    catToolbar: "Sắp xếp thanh công cụ",
    catBookmarks: "Thư viện Bookmarks",
    catAbout: "Giới thiệu TADa",
    catAboutSub: "Nguyễn Tuấn Anh • TADa Team",
    btnBackTitle: "Quay lại",
    btnSubEnable: "Bật",
    btnSubDisable: "Tắt",
    reloadPage: "Làm mới trang",
    lblBrightness: "Độ sáng",
    lblSpread: "Lan tỏa",
    ambientBrightness: "Độ sáng",
    ambientSpread: "Lan tỏa",
    presetPalette: "Bảng màu gợi ý",
    customColorLabel: "Tự chọn mã màu:",
    presetFiltersHeader: "Mẫu lọc có sẵn (1-chạm)",
    filterResetBtn: "Đặt lại",
    filterPresetReset: "Chuẩn",
    filterPresetNight: "Xem đêm",
    filterPresetBrighten: "Sáng rõ",
    filterPresetCinema: "Cinema",
    filterPresetVintage: "Hoài cổ",
    filterPresetInvert: "Đảo màu",
    filterPresetBw: "Đen trắng",
    filterContrast: "Độ tương phản",
    filterSaturation: "Độ bão hòa màu",
    filterWarmth: "Tông ấm / Dịu mắt",
    cinemaOpacity: "Độ mờ màn đen",
    cinemaHint: "Phím tắt: <strong>Shift + L</strong> hoặc bấm bóng đèn trên Player",
    preferredQualityLabel: "Mức chất lượng ưu tiên:",
    qualityHighest: "Cao nhất có thể (4K / 8K)",
    qualitySaveNet: "Tiết kiệm mạng (480p)",
    qualityBadgeLabel: "Hiện thông báo chất lượng trên video",
    qualityHint: "Tự động ép mức phân giải cao nhất ngay khi mở video, chống bị YouTube tự hạ xuống 480p/720p.",
    modePcTitle: "Giao diện máy tính",
    modeTvTitle: "Giao diện Smart TV",
    openTvNowTitle: "Mở YouTube TV trong cửa sổ ứng dụng riêng biệt",
    logoTadaTitle: "Logo YouTube TADa (Mặc định)",
    logoPremiumTitle: "Logo YouTube Premium",
    logoDefaultTitle: "Logo YouTube gốc mặc định",
    masterHotkeysTitle: "Kích hoạt phím tắt TADa",
    masterHotkeysDesc: "Bật / Tắt tất cả phím tắt tiện ích trên YouTube",
    hotkeysIntroTip: "Bấm vào phím để tùy chỉnh phím mới (nhấn phím mong muốn, Esc để hủy, ↺ để khôi phục).",
    resetAllHotkeys: "Khôi phục tất cả phím tắt mặc định",
    tbPreviewTag: "MÔ PHỎNG TRỰC TIẾP",
    tbPreviewSub: "Thanh phát video YouTube",
    tbGuideBanner: "Kéo thả từng dòng hoặc bấm <b>▲ / ▼</b> để đổi vị trí nút. Tắt công tắc để ẩn nút khỏi thanh video (phím tắt vẫn dùng được).",
    tbLooperPosTitle: "Vị trí nút Lặp đoạn A-B:",
    tbLooperPosSub: "Đặt cạnh mốc thời gian hoặc cùng cụm công cụ",
    tbLooperPosLeft: "Cạnh thời gian (Bên trái)",
    tbLooperPosRight: "Thanh công cụ (Bên phải)",
    tbAnchorTitle: "Vị trí cụm nút TADa:",
    tbAnchorSub: "Vị trí tương đối với nút Cài đặt bánh răng",
    tbAnchorBefore: "Trước nút Cài đặt (Bên trái)",
    tbAnchorAfter: "Sau nút Cài đặt (Bên phải)",
    tbResetOrder: "Khôi phục thứ tự mặc định",
    bmModalTitle: "Bookmarks đã lưu",
    bmExportAll: "Sao chép tất cả",
    bmClearAll: "Xóa hết",
    aboutModalTitle: "Giới thiệu TADa for YouTube",
    aboutHeroDesc: "Tiện ích mở rộng thông minh, tối ưu trải nghiệm xem video YouTube sạch sẽ, không quảng cáo, tích hợp bộ công cụ hỗ trợ người dùng toàn diện. Thuộc hệ sinh thái <strong>TADa Manager</strong>.",
    aboutDevRole: "Phát triển bởi",
    aboutDevTeam: "Thành viên Team TADa",
    aboutSourceSec: "Mã nguồn & Đóng góp",
    aboutGithubTitle: "Xem mã nguồn & Tặng sao trên GitHub",
    aboutShareSec: "Chia sẻ tiện ích",
    aboutCopyCwsTitle: "Sao chép link cài đặt tiện ích",
    aboutCopyLinkBtn: "Sao chép link",
    aboutShareBtnTitle: "Chia sẻ link tiện ích",
    aboutShareBtn: "Chia sẻ",
    aboutDonateSec: "Ủng hộ tôi",
    aboutDonateTitle: "Ủng hộ tác giả TADa for YouTube",
    aboutTapCopyStk: "Chạm để sao chép STK",
    aboutMbBankSub: "Ngân hàng Quân Đội",
    aboutAccNumLabel: "SỐ TÀI KHOẢN / THẺ",
    aboutCopyStkTitle: "Sao chép số tài khoản",
    aboutCopyStkBtn: "Sao chép",
    aboutAccHolderLabel: "CHỦ TÀI KHOẢN:",
    aboutShowQrBtn: "Hiện mã QR MB Bank ▼",
    aboutHideQrBtn: "Ẩn mã QR ▲",
    aboutQrHint: "Quét mã bằng app ngân hàng (MB Bank, VCB, MoMo, VNPay,...)",
    aboutCloseTitle: "Đóng",
    aboutCloseBtn: "Đóng",
    onboardingTitle: "Chào mừng đến với TADa!",
    onboardingSubtitle: "Vui lòng chọn ngôn ngữ bạn muốn sử dụng",
    onboardingSubEn: "Please select your preferred language",
    langCardDescVi: "Giao diện tiếng Việt chuẩn",
    langCardDescEn: "International English UI",
    btnLangConfirm: "Bắt đầu ngay • Get Started",
    featSuperVolume: "Booster âm lượng 500%",
    featAmbientLight: "Ambient Light",
    featProgressColor: "Màu thanh thời gian",
    featVideoFilter: "Bộ lọc màu & Ánh sáng",
    featCinemaMode: "Rạp phim (Tắt đèn)",
    featCustomSpeed: "Tốc độ phát (0.1x – 4x)",
    featPipButton: "Hình trong hình (PiP)",
    featAbLooper: "Lặp đoạn A-B",
    featCustomLoader: "Loader cánh chim (Giant Bird)",
    featAutoQuality: "Tự động chọn độ phân giải cao nhất",
    featVideoScreenshot: "Chụp ảnh màn hình (4K)",
    featVideoBookmarks: "Đánh dấu mốc & Ghi chú",
    featReturnDislike: "Hiện số lượt Dislike",
    featAutoSkipSegments: "Bỏ qua Intro & Sponsor",
    featCurateSidebar: "Lọc gợi ý Sidebar",
    featFourColumnGrid: "Lưới 4 video / hàng",
    featHideShorts: "Ẩn YouTube Shorts",
    featHideEndScreens: "Ẩn màn hình kết thúc",
    featEnsureComments: "Cố định bình luận",
    featAutoSelectChips: "Tự chọn thẻ lọc",
    featInterfaceMode: "Giả lập giao diện TV",
    featMasterHotkeys: "Kích hoạt phím tắt TADa",
    hotkeyRecordTitle: "Bấm để đổi phím tắt",
    hotkeyResetTitle: "Khôi phục mặc định",
    shortcutScreenshotTitle: "Chụp ảnh màn hình 4K",
    shortcutScreenshotDesc: "Tải về ảnh khung hình gốc chất lượng cao nhất",
    shortcutScreenshotClipboardTitle: "Sao chép ảnh vào Clipboard",
    shortcutScreenshotClipboardDesc: "Dán ảnh nhanh vào Zalo, Facebook, Discord",
    shortcutCinemaModeTitle: "Chế độ rạp phim (Cinema)",
    shortcutCinemaModeDesc: "Tối đen toàn bộ giao diện xung quanh để tập trung",
    shortcutPipTitle: "Hình trong hình (PiP)",
    shortcutPipDesc: "Thu nhỏ video góc màn hình để vừa làm việc vừa xem",
    shortcutSpeedUpTitle: "Tăng tốc độ phát (+0.25x)",
    shortcutSpeedUpDesc: "Tăng tốc độ phát video (giữ Alt để tăng vi mô +0.05x)",
    shortcutSpeedDownTitle: "Giảm tốc độ phát (-0.25x)",
    shortcutSpeedDownDesc: "Giảm tốc độ phát video (giữ Alt để giảm vi mô -0.05x)",
    shortcutSpeedResetTitle: "Đặt lại tốc độ (1.0x)",
    shortcutSpeedResetDesc: "Trả tốc độ phát về chuẩn bình thường",
    shortcutAbSetATitle: "Đoạn lặp: Đặt điểm [A]",
    shortcutAbSetADesc: "Ghim thời điểm bắt đầu lặp A-B",
    shortcutAbSetBTitle: "Đoạn lặp: Đặt điểm [B]",
    shortcutAbSetBDesc: "Ghim thời điểm kết thúc đoạn lặp",
    shortcutAbToggleTitle: "Đoạn lặp: Bật / Tắt lặp",
    shortcutAbToggleDesc: "Kích hoạt hoặc dừng lặp vòng A-B",
    shortcutBookmarkAddTitle: "Đánh dấu mốc Bookmark",
    shortcutBookmarkAddDesc: "Ghim nhanh mốc thời gian kèm ghi chú",
    shortcutBookmarkPanelTitle: "Mở thư viện Bookmarks",
    shortcutBookmarkPanelDesc: "Xem và nhảy nhanh tới các mốc đã lưu",
    shortcutVolumeUpTitle: "Tăng âm lượng 500% (+20%)",
    shortcutVolumeUpDesc: "Tăng mức khuếch đại âm lượng cực đại",
    shortcutVolumeDownTitle: "Giảm âm lượng 500% (-20%)",
    shortcutVolumeDownDesc: "Giảm mức khuếch đại âm lượng cực đại",
    shortcutSponsorRevertTitle: "Hoàn tác bỏ qua tài trợ",
    shortcutSponsorRevertDesc: "Quay lại đoạn intro / sponsor vừa tự động nhảy",
    shortcutSwitchLogoTitle: "Đổi nhanh Logo YouTube",
    shortcutSwitchLogoDesc: "Chuyển qua lại Logo TADa / Premium / Mặc định",
    shortcutEscTitle: "Đóng nhanh bảng / Popup",
    shortcutEscDesc: "Đóng bảng Bookmarks, Looper hoặc cửa sổ đang mở",
    logoControlAria: "Tùy chọn logo YouTube",
    modeControlAria: "Tùy chọn giao diện YouTube",
    swatchTadaTitle: "Cam TADa (Mặc định)",
    swatchCyanTitle: "Xanh Cyan Neon",
    swatchEmeraldTitle: "Xanh Ngọc Emerald",
    swatchPurpleTitle: "Tím Neon Purple",
    swatchPinkTitle: "Hồng Pastel Pink",
    swatchGoldTitle: "Vàng Gold",
    swatchRedTitle: "Đỏ gốc YouTube"
  },
  en: {
    brandSub: "Smart Customizer",
    aboutTitle: "About TADa & Author",
    reloadTabTitle: "Reload YouTube tab",
    switchLangTitle: "Chuyển sang Tiếng Việt (Switch to Vietnamese)",
    switchLangToast: "Switched to English 🇬🇧",
    adBlockLabel: "Ad Blocker",
    alwaysOn: "ALWAYS ON",
    blockedUnit: "blocked",
    resetStatsTitle: "Reset statistics",
    resetStatsToast: "Ad blocker counter reset to 0!",
    logoTitle: "YouTube Logo",
    logoDefault: "Default",
    modeTitle: "Interface Mode",
    featInterfaceMode: "Smart TV Simulation",
    openTvNow: "Open YouTube TV now",
    tvAutoRedirectLabel: "Automatically switch to TV mode on youtube.com",
    openTvSub: "Open YouTube TV in standalone window",
    featuresLabel: "Features",
    enableAll: "Enable All",
    disableAll: "Disable All",
    catPlayer: "Player & Audio",
    catTools: "Tools & Utilities",
    catLayout: "Interface & Focus",
    catShortcuts: "Quick Hotkeys",
    catToolbar: "Toolbar Arrangement",
    catBookmarks: "Bookmarks Library",
    catAbout: "About TADa",
    catAboutSub: "Nguyen Tuan Anh • TADa Team",
    btnBackTitle: "Back",
    btnSubEnable: "Enable",
    btnSubDisable: "Disable",
    reloadPage: "Reload Page",
    lblBrightness: "Brightness",
    lblSpread: "Spread",
    ambientBrightness: "Brightness",
    ambientSpread: "Spread",
    presetPalette: "Preset Colors",
    customColorLabel: "Custom Hex Color:",
    presetFiltersHeader: "1-Click Presets",
    filterResetBtn: "Reset",
    filterPresetReset: "Default",
    filterPresetNight: "Night",
    filterPresetBrighten: "Brighten",
    filterPresetCinema: "Cinema",
    filterPresetVintage: "Vintage",
    filterPresetInvert: "Invert",
    filterPresetBw: "B&W",
    filterContrast: "Contrast",
    filterSaturation: "Saturation",
    filterWarmth: "Warmth / Eye Care",
    cinemaOpacity: "Dim Opacity",
    cinemaHint: "Shortcut: <strong>Shift + L</strong> or click the lamp on Player",
    preferredQualityLabel: "Preferred Quality:",
    qualityHighest: "Highest Possible (4K / 8K)",
    qualitySaveNet: "Data Saver (480p)",
    qualityBadgeLabel: "Show quality badge on video",
    qualityHint: "Forces highest resolution on video load to prevent YouTube auto-downgrading.",
    modePcTitle: "Desktop Interface",
    modeTvTitle: "Smart TV Interface",
    openTvNowTitle: "Open YouTube TV in standalone application window",
    logoTadaTitle: "TADa YouTube Logo (Default)",
    logoPremiumTitle: "YouTube Premium Logo",
    logoDefaultTitle: "Original YouTube Logo",
    masterHotkeysTitle: "Enable TADa Hotkeys",
    masterHotkeysDesc: "Toggle all custom keyboard shortcuts on YouTube",
    hotkeysIntroTip: "Click any key to rebind (press desired key, Esc to cancel, ↺ to reset).",
    resetAllHotkeys: "Reset All Shortcuts to Default",
    tbPreviewTag: "LIVE SIMULATION",
    tbPreviewSub: "YouTube Video Player Bar",
    tbGuideBanner: "Drag & drop rows or click <b>▲ / ▼</b> to reorder buttons. Toggle switch to hide buttons.",
    tbLooperPosTitle: "A-B Looper Button Position:",
    tbLooperPosSub: "Place next to time display or in right toolbar",
    tbLooperPosLeft: "Next to Time (Left side)",
    tbLooperPosRight: "Main Toolbar (Right side)",
    tbAnchorTitle: "TADa Buttons Position:",
    tbAnchorSub: "Position relative to YouTube Settings gear icon",
    tbAnchorBefore: "Before Settings Icon (Left)",
    tbAnchorAfter: "After Settings Icon (Right)",
    tbResetOrder: "Reset to Default Order",
    bmModalTitle: "Saved Bookmarks",
    bmExportAll: "Copy All",
    bmClearAll: "Clear All",
    aboutModalTitle: "About TADa for YouTube",
    aboutHeroDesc: "Smart YouTube extension optimizing clean ad-free playback with comprehensive productivity and viewing tools. Part of the <strong>TADa Manager</strong> ecosystem.",
    aboutDevRole: "Developed by",
    aboutDevTeam: "TADa Team Member",
    aboutSourceSec: "Source Code & Contributions",
    aboutGithubTitle: "View source code & Star on GitHub",
    aboutShareSec: "Share Extension",
    aboutCopyCwsTitle: "Copy extension installation link",
    aboutCopyLinkBtn: "Copy Link",
    aboutShareBtnTitle: "Share extension link",
    aboutShareBtn: "Share",
    aboutDonateSec: "Support Me",
    aboutDonateTitle: "Support TADa for YouTube author",
    aboutTapCopyStk: "Tap to copy bank account",
    aboutMbBankSub: "Military Commercial Bank (MB Bank)",
    aboutAccNumLabel: "ACCOUNT / CARD NUMBER",
    aboutCopyStkTitle: "Copy account number",
    aboutCopyStkBtn: "Copy",
    aboutAccHolderLabel: "ACCOUNT HOLDER:",
    aboutShowQrBtn: "Show MB Bank VietQR ▼",
    aboutHideQrBtn: "Hide QR Code ▲",
    aboutQrHint: "Scan with banking app (MB Bank, Vietcombank, MoMo, e-Wallets,...)",
    aboutCloseTitle: "Close",
    aboutCloseBtn: "Close",
    onboardingTitle: "Welcome to TADa!",
    onboardingSubtitle: "Please select your preferred language",
    onboardingSubEn: "You can change this anytime from the top bar",
    langCardDescVi: "Vietnamese standard UI",
    langCardDescEn: "International English UI",
    btnLangConfirm: "Get Started • Bắt đầu ngay",
    featSuperVolume: "Volume Booster 500%",
    featAmbientLight: "Ambient Light",
    featProgressColor: "Progress Bar Color",
    featVideoFilter: "Color & Lighting Filter",
    featCinemaMode: "Cinema Mode (Dim Lights)",
    featCustomSpeed: "Playback Speed (0.1x – 4x)",
    featPipButton: "Picture-in-Picture (PiP)",
    featAbLooper: "A-B Looper",
    featCustomLoader: "Bird Wing Loading Animation",
    featAutoQuality: "Auto Select Highest Quality",
    featVideoScreenshot: "Screenshot Capture (4K)",
    featVideoBookmarks: "Video Bookmarks & Notes",
    featReturnDislike: "Show Dislike Count",
    featAutoSkipSegments: "Skip Intro & Sponsors",
    featCurateSidebar: "Curate Sidebar Suggestions",
    featFourColumnGrid: "4-Column Video Grid",
    featHideShorts: "Hide YouTube Shorts",
    featHideEndScreens: "Hide End Screen Cards",
    featEnsureComments: "Keep Comments Visible",
    featAutoSelectChips: "Auto-Select Chips",
    featInterfaceMode: "Smart TV Simulation",
    featMasterHotkeys: "Enable TADa Hotkeys",
    hotkeyRecordTitle: "Click to rebind shortcut",
    hotkeyResetTitle: "Reset to default",
    shortcutScreenshotTitle: "Capture 4K Screenshot",
    shortcutScreenshotDesc: "Download pristine frame at highest resolution",
    shortcutScreenshotClipboardTitle: "Copy Frame to Clipboard",
    shortcutScreenshotClipboardDesc: "Quick paste to Discord, Slack, Messenger",
    shortcutCinemaModeTitle: "Cinema Mode (Dim Lights)",
    shortcutCinemaModeDesc: "Darken surroundings for focused viewing",
    shortcutPipTitle: "Picture-in-Picture (PiP)",
    shortcutPipDesc: "Floating video window for multitasking",
    shortcutSpeedUpTitle: "Speed Up Playback (+0.25x)",
    shortcutSpeedUpDesc: "Speed up video playback (hold Alt for fine +0.05x)",
    shortcutSpeedDownTitle: "Slow Down Playback (-0.25x)",
    shortcutSpeedDownDesc: "Slow down video playback (hold Alt for fine -0.05x)",
    shortcutSpeedResetTitle: "Reset Playback Speed (1.0x)",
    shortcutSpeedResetDesc: "Instantly restore normal 1.0x playback speed",
    shortcutAbSetATitle: "A-B Looper: Set Start [A]",
    shortcutAbSetADesc: "Pin start timestamp for loop segment",
    shortcutAbSetBTitle: "A-B Looper: Set End [B]",
    shortcutAbSetBDesc: "Pin end timestamp and start A-B looping",
    shortcutAbToggleTitle: "A-B Looper: Toggle Looping",
    shortcutAbToggleDesc: "Pause or resume current loop interval",
    shortcutBookmarkAddTitle: "Add Video Bookmark",
    shortcutBookmarkAddDesc: "Save current timestamp and open note field",
    shortcutBookmarkPanelTitle: "Open Bookmarks Library",
    shortcutBookmarkPanelDesc: "View and jump to saved bookmarks for this video",
    shortcutVolumeUpTitle: "Increase Volume (+20%)",
    shortcutVolumeUpDesc: "Boost audio output beyond standard 100%",
    shortcutVolumeDownTitle: "Decrease Volume (-20%)",
    shortcutVolumeDownDesc: "Reduce audio booster amplification",
    shortcutSponsorRevertTitle: "Undo Sponsor Skip",
    shortcutSponsorRevertDesc: "Jump back to skipped sponsor or intro segment",
    shortcutSwitchLogoTitle: "Quick YouTube Logo Switcher",
    shortcutSwitchLogoDesc: "Cycle through TADa / Premium / Default YouTube Logo",
    shortcutEscTitle: "Quick Close Panel / Modal",
    shortcutEscDesc: "Dismiss Bookmarks panel, Looper or active popups",
    logoControlAria: "YouTube logo options",
    modeControlAria: "YouTube interface options",
    swatchTadaTitle: "TADa Orange (Default)",
    swatchCyanTitle: "Neon Cyan",
    swatchEmeraldTitle: "Emerald Green",
    swatchPurpleTitle: "Neon Purple",
    swatchPinkTitle: "Pastel Pink",
    swatchGoldTitle: "Gold Yellow",
    swatchRedTitle: "Original YouTube Red"
  }
};

const FEATURE_NAMES_I18N = {
  superVolume: { vi: "Booster âm lượng 500%", en: "Volume Booster 500%" },
  ambientLight: { vi: "Ambient Light", en: "Ambient Light" },
  progressColor: { vi: "Màu thanh thời gian", en: "Progress Bar Color" },
  videoFilter: { vi: "Bộ lọc màu & Ánh sáng", en: "Color & Lighting Filter" },
  cinemaMode: { vi: "Rạp phim (Tắt đèn)", en: "Cinema Mode (Dim Lights)" },
  customSpeed: { vi: "Tốc độ phát (0.1x – 4x)", en: "Playback Speed (0.1x – 4x)" },
  pipButton: { vi: "Hình trong hình (PiP)", en: "Picture-in-Picture (PiP)" },
  abLooper: { vi: "Lặp đoạn A-B", en: "A-B Looper" },
  customLoader: { vi: "Loader cánh chim (Giant Bird)", en: "Bird Wing Loading Animation" },
  autoQuality: { vi: "Tự động chọn độ phân giải cao nhất", en: "Auto Select Highest Quality" },
  videoScreenshot: { vi: "Chụp ảnh màn hình (4K)", en: "Screenshot Capture (4K)" },
  videoBookmarks: { vi: "Đánh dấu mốc & Ghi chú", en: "Video Bookmarks & Notes" },
  returnDislike: { vi: "Hiện số lượt Dislike", en: "Show Dislike Count" },
  autoSkipSegments: { vi: "Bỏ qua Intro & Sponsor", en: "Skip Intro & Sponsors" },
  curateSidebar: { vi: "Lọc gợi ý Sidebar", en: "Curate Sidebar Suggestions" },
  fourColumnGrid: { vi: "Lưới 4 video / hàng", en: "4-Column Video Grid" },
  hideShorts: { vi: "Ẩn YouTube Shorts", en: "Hide YouTube Shorts" },
  hideEndScreens: { vi: "Ẩn màn hình kết thúc", en: "Hide End Screen Cards" },
  ensureComments: { vi: "Cố định bình luận", en: "Keep Comments Visible" },
  autoSelectChips: { vi: "Tự chọn thẻ lọc", en: "Auto-Select Chips" },
  interfaceMode: { vi: "Giả lập giao diện TV", en: "Smart TV Simulation" },
  hotkeysEnabled: { vi: "Kích hoạt phím tắt TADa", en: "Enable TADa Hotkeys" }
};

const SHORTCUT_I18N = {
  screenshot: {
    title: { vi: "Chụp ảnh màn hình 4K", en: "Capture 4K Screenshot" },
    desc: { vi: "Tải về ảnh khung hình gốc chất lượng cao nhất", en: "Download pristine frame at highest resolution" }
  },
  screenshotClipboard: {
    title: { vi: "Sao chép ảnh vào Clipboard", en: "Copy Frame to Clipboard" },
    desc: { vi: "Dán ảnh nhanh vào Zalo, Facebook, Discord", en: "Quick paste to Discord, Slack, Messenger" }
  },
  cinemaMode: {
    title: { vi: "Chế độ rạp phim (Cinema)", en: "Cinema Mode (Dim Lights)" },
    desc: { vi: "Tối đen toàn bộ giao diện xung quanh để tập trung", en: "Darken surroundings for focused viewing" }
  },
  pip: {
    title: { vi: "Hình trong hình (PiP)", en: "Picture-in-Picture (PiP)" },
    desc: { vi: "Thu nhỏ video góc màn hình để vừa làm việc vừa xem", en: "Floating video window for multitasking" }
  },
  speedUp: {
    title: { vi: "Tăng tốc độ phát (+0.25x)", en: "Speed Up Playback (+0.25x)" },
    desc: { vi: "Tăng tốc độ phát video (giữ Alt để tăng vi mô +0.05x)", en: "Speed up video playback (hold Alt for fine +0.05x)" }
  },
  speedDown: {
    title: { vi: "Giảm tốc độ phát (-0.25x)", en: "Slow Down Playback (-0.25x)" },
    desc: { vi: "Giảm tốc độ phát video (giữ Alt để giảm vi mô -0.05x)", en: "Slow down video playback (hold Alt for fine -0.05x)" }
  },
  speedReset: {
    title: { vi: "Đặt lại tốc độ (1.0x)", en: "Reset Playback Speed (1.0x)" },
    desc: { vi: "Trả tốc độ phát về chuẩn bình thường", en: "Instantly restore normal 1.0x playback speed" }
  },
  abSetA: {
    title: { vi: "Đoạn lặp: Đặt điểm [A]", en: "A-B Looper: Set Start [A]" },
    desc: { vi: "Ghim thời điểm bắt đầu lặp A-B", en: "Pin start timestamp for loop segment" }
  },
  abSetB: {
    title: { vi: "Đoạn lặp: Đặt điểm [B]", en: "A-B Looper: Set End [B]" },
    desc: { vi: "Ghim thời điểm kết thúc đoạn lặp", en: "Pin end timestamp and start A-B looping" }
  },
  abToggle: {
    title: { vi: "Đoạn lặp: Bật / Tắt lặp", en: "A-B Looper: Toggle Looping" },
    desc: { vi: "Kích hoạt hoặc dừng lặp vòng A-B", en: "Pause or resume current loop interval" }
  },
  bookmarkAdd: {
    title: { vi: "Đánh dấu mốc Bookmark", en: "Add Video Bookmark" },
    desc: { vi: "Ghim nhanh mốc thời gian kèm ghi chú", en: "Save current timestamp and open note field" }
  },
  bookmarkPanel: {
    title: { vi: "Mở thư viện Bookmarks", en: "Open Bookmarks Library" },
    desc: { vi: "Xem và nhảy nhanh tới các mốc đã lưu", en: "View and jump to saved bookmarks for this video" }
  },
  volumeUp: {
    title: { vi: "Tăng âm lượng 500% (+20%)", en: "Increase Volume (+20%)" },
    desc: { vi: "Tăng mức khuếch đại âm lượng cực đại", en: "Boost audio output beyond standard 100%" }
  },
  volumeDown: {
    title: { vi: "Giảm âm lượng 500% (-20%)", en: "Decrease Volume (-20%)" },
    desc: { vi: "Giảm mức khuếch đại âm lượng cực đại", en: "Reduce audio booster amplification" }
  },
  sponsorRevert: {
    title: { vi: "Hoàn tác bỏ qua tài trợ", en: "Undo Sponsor Skip" },
    desc: { vi: "Quay lại đoạn intro / sponsor vừa tự động nhảy", en: "Jump back to skipped sponsor or intro segment" }
  },
  switchLogo: {
    title: { vi: "Đổi nhanh Logo YouTube", en: "Quick YouTube Logo Switcher" },
    desc: { vi: "Chuyển qua lại Logo TADa / Premium / Mặc định", en: "Cycle through TADa / Premium / Default YouTube Logo" }
  },
  esc: {
    title: { vi: "Đóng nhanh bảng / Popup", en: "Quick Close Panel / Modal" },
    desc: { vi: "Đóng bảng Bookmarks, Looper hoặc cửa sổ đang mở", en: "Dismiss Bookmarks panel, Looper or active popups" }
  }
};

let activeCategory = null;

let currentSettings = { ...DEFAULT_SETTINGS };
let toastTimeout = null;
let saveSettingsDebounce = null;

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  toast.innerHTML = `
    <div class="info__icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
        <path fill="#fff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path>
      </svg>
    </div>
    <div class="info__title">${escapeHtml(message)}</div>
    <div class="info__close" id="toast-close-btn" title="Đóng">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
        <path fill="#fff" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
      </svg>
    </div>
  `;

  const closeBtn = toast.querySelector("#toast-close-btn");
  if (closeBtn) {
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      toast.classList.remove("show");
      if (toastTimeout) clearTimeout(toastTimeout);
    };
  }

  toast.classList.add("show");

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function updateActiveCount() {
  const isEnglish = currentSettings.language === "en";
  // Cập nhật tổng số tính năng đang bật (không tính toggle hotkeys master vào tổng 20 tính năng giao diện)
  const mainFeatureKeys = TOGGLE_FEATURE_KEYS.filter((key) => key !== "hotkeysEnabled");
  const activeCount = mainFeatureKeys.filter((key) => currentSettings[key]).length;
  const countEl = document.getElementById("active-features-count");
  if (countEl) {
    countEl.textContent = `${activeCount}/${mainFeatureKeys.length} ${isEnglish ? "active" : "bật"}`;
  }

  // Cập nhật bộ đếm real-time trên từng thẻ danh mục
  Object.entries(CATEGORY_MAP).forEach(([catId, keys]) => {
    const enabledInCat = keys.filter((k) => currentSettings[k]).length;
    const pill = document.getElementById(`cat-count-${catId}`);
    if (pill) {
      if (catId === "shortcuts") {
        const isEnabled = currentSettings.hotkeysEnabled !== false;
        pill.textContent = isEnabled ? (isEnglish ? "On" : "Bật") : (isEnglish ? "Off" : "Tắt");
        pill.classList.toggle("has-active", isEnabled);
      } else if (catId === "toolbar") {
        const order = Array.isArray(currentSettings.toolbarOrder) ? currentSettings.toolbarOrder : DEFAULT_TOOLBAR_ORDER;
        const hidden = currentSettings.toolbarHidden || {};
        const visible = order.filter((id) => !hidden[id]).length;
        pill.textContent = `${visible}/${order.length} ${isEnglish ? "btns" : "nút"}`;
        pill.classList.toggle("has-active", visible > 0);
      } else {
        pill.textContent = `${enabledInCat}/${keys.length}`;
        pill.classList.toggle("has-active", enabledInCat > 0);
      }
    }
  });

  // Cập nhật badge trên sub-view nếu đang mở
  if (activeCategory && CATEGORY_MAP[activeCategory]) {
    const keys = CATEGORY_MAP[activeCategory];
    const enabled = keys.filter((k) => currentSettings[k]).length;
    const badge = document.getElementById("sub-count-badge");
    if (badge) {
      if (activeCategory === "shortcuts") {
        badge.textContent = currentSettings.hotkeysEnabled !== false ? (isEnglish ? "Active" : "Đang bật") : (isEnglish ? "Off" : "Đã tắt");
      } else if (activeCategory === "toolbar") {
        const order = Array.isArray(currentSettings.toolbarOrder) ? currentSettings.toolbarOrder : DEFAULT_TOOLBAR_ORDER;
        const hidden = currentSettings.toolbarHidden || {};
        const visible = order.filter((id) => !hidden[id]).length;
        badge.textContent = `${visible}/${order.length} ${isEnglish ? "btns" : "nút"}`;
      } else {
        badge.textContent = `${enabled}/${keys.length}`;
      }
    }
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


  renderProgressColor();
  renderVideoFilter();
  renderCinemaMode();
  renderAutoQuality();
  renderInterfaceMode();
  renderLogoType();
  renderHotkeys();
  renderToolbarManager();
  updateActiveCount();
}

function formatKeyForDisplay(key) {
  if (!key) return "";
  if (key === "ArrowUp") return "↑";
  if (key === "ArrowDown") return "↓";
  if (key === "ArrowLeft") return "←";
  if (key === "ArrowRight") return "→";
  if (key === "Space" || key === " ") return "Space";
  if (key === ">") return "&gt;";
  if (key === "<") return "&lt;";
  if (key === "\"") return "&quot;";
  if (key === "&") return "&amp;";
  if (key.length === 1) return key.toUpperCase();
  return key;
}

function renderHotkeys() {
  const hotkeys = currentSettings.customHotkeys || {};

  Object.entries(DEFAULT_HOTKEYS).forEach(([action, defaultKey]) => {
    const displayEl = document.getElementById(`hotkey-display-${action}`);
    if (!displayEl) return;
    const wrapEl = displayEl.closest(".shortcut-action-wrap");

    const currentKey = hotkeys[action] || defaultKey;
    const isCustom = Boolean(hotkeys[action] && hotkeys[action] !== defaultKey);

    if (wrapEl) {
      wrapEl.classList.toggle("is-custom", isCustom);
    }

    const parts = currentKey.split("+");
    const kbdHtml = parts.map((part) => {
      return `<kbd class="tada-kbd">${formatKeyForDisplay(part)}</kbd>`;
    }).join(`<span class="tada-kbd-plus">+</span>`);

    displayEl.innerHTML = kbdHtml;
  });
}

let recordingAction = null;
let recordingCleanup = null;

function startRecordingHotkey(action, btn) {
  if (recordingCleanup) {
    recordingCleanup();
  }

  recordingAction = action;
  btn.classList.add("recording");
  const isEnglish = currentSettings.language === "en";
  const displayEl = btn.querySelector(".hotkey-display");
  if (displayEl) {
    displayEl.innerHTML = `<span class="recording-badge"><span class="recording-dot"></span>${isEnglish ? "Press key..." : "Nhấn phím..."}</span>`;
  }

  const handleKeyDown = async (e) => {
    // Ignore lone modifier keys
    if (["Shift", "Control", "Alt", "Meta"].includes(e.key)) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    // Escape cancels recording
    if (e.key === "Escape") {
      cleanup();
      renderHotkeys();
      const isEn = currentSettings.language === "en";
      showToast(isEn ? "Shortcut rebind cancelled" : "Đã hủy đổi phím tắt");
      return;
    }

    // Backspace or Delete resets to default
    if (e.key === "Backspace" || e.key === "Delete") {
      if (currentSettings.customHotkeys) {
        delete currentSettings.customHotkeys[action];
      }
      cleanup();
      await saveSettings();
      renderHotkeys();
      notifyYouTubeTabs();
      const isEn = currentSettings.language === "en";
      showToast(isEn ? "Restored shortcut to default" : "Đã khôi phục phím tắt mặc định");
      return;
    }

    // Build shortcut string
    const parts = [];
    if (e.ctrlKey) parts.push("Ctrl");
    if (e.altKey) parts.push("Alt");
    if (e.shiftKey) parts.push("Shift");
    if (e.metaKey) parts.push("Meta");

    let key = e.key;
    if (key === " ") key = "Space";
    else if (key.length === 1) key = key.toLowerCase();

    parts.push(key);
    const newHotkeyStr = parts.join("+");

    if (!currentSettings.customHotkeys) {
      currentSettings.customHotkeys = {};
    }
    currentSettings.customHotkeys[action] = newHotkeyStr;

    cleanup();
    await saveSettings();
    renderHotkeys();
    notifyYouTubeTabs();
    const isEn = currentSettings.language === "en";
    showToast(isEn ? `Saved new shortcut: ${parts.map(formatKeyForDisplay).join(" + ")}` : `Đã lưu phím tắt mới: ${parts.map(formatKeyForDisplay).join(" + ")}`);
  };

  const handleOutsideClick = (e) => {
    if (!btn.contains(e.target)) {
      cleanup();
      renderHotkeys();
    }
  };

  const cleanup = () => {
    window.removeEventListener("keydown", handleKeyDown, true);
    document.removeEventListener("click", handleOutsideClick, true);
    btn.classList.remove("recording");
    recordingAction = null;
    recordingCleanup = null;
  };

  recordingCleanup = cleanup;
  window.addEventListener("keydown", handleKeyDown, true);
  setTimeout(() => {
    document.addEventListener("click", handleOutsideClick, true);
  }, 100);
}

const POPUP_FILTER_PRESETS = {
  reset: { brightness: 100, contrast: 100, saturation: 100, warmth: 0, invert: 0, grayscale: 0 },
  night: { brightness: 85, contrast: 95, saturation: 90, warmth: 25, invert: 0, grayscale: 0 },
  brighten: { brightness: 130, contrast: 115, saturation: 105, warmth: 0, invert: 0, grayscale: 0 },
  cinema: { brightness: 100, contrast: 125, saturation: 120, warmth: 5, invert: 0, grayscale: 0 },
  vintage: { brightness: 95, contrast: 110, saturation: 85, warmth: 40, invert: 0, grayscale: 0 },
  invert: { brightness: 100, contrast: 100, saturation: 100, warmth: 0, invert: 100, grayscale: 0 },
  bw: { brightness: 105, contrast: 120, saturation: 0, warmth: 0, invert: 0, grayscale: 100 }
};

function updateFilterPresetChipsActiveState() {
  const b = currentSettings.filterBrightness ?? 100;
  const c = currentSettings.filterContrast ?? 100;
  const s = currentSettings.filterSaturation ?? 100;
  const w = currentSettings.filterWarmth ?? 0;
  const inv = currentSettings.filterInvert ?? 0;
  const g = currentSettings.filterGrayscale ?? 0;

  document.querySelectorAll(".filter-chip-btn").forEach((chip) => {
    const key = chip.dataset.preset;
    const p = POPUP_FILTER_PRESETS[key];
    if (!p) return;
    const match =
      b === p.brightness &&
      c === p.contrast &&
      s === p.saturation &&
      w === p.warmth &&
      inv === p.invert &&
      g === p.grayscale;
    chip.classList.toggle("active", match);
  });
}

function renderVideoFilter() {
  const isEnabled = Boolean(currentSettings.videoFilter);
  const subSettings = document.getElementById("videoFilter-sub-settings");
  if (subSettings) {
    subSettings.classList.toggle("show", isEnabled);
  }

  const bSlider = document.getElementById("filter-brightness");
  const bVal = document.getElementById("filter-brightness-val");
  if (bSlider) {
    const val = currentSettings.filterBrightness ?? 100;
    bSlider.value = val;
    if (bVal) bVal.textContent = `${val}%`;
  }

  const cSlider = document.getElementById("filter-contrast");
  const cVal = document.getElementById("filter-contrast-val");
  if (cSlider) {
    const val = currentSettings.filterContrast ?? 100;
    cSlider.value = val;
    if (cVal) cVal.textContent = `${val}%`;
  }

  const sSlider = document.getElementById("filter-saturation");
  const sVal = document.getElementById("filter-saturation-val");
  if (sSlider) {
    const val = currentSettings.filterSaturation ?? 100;
    sSlider.value = val;
    if (sVal) sVal.textContent = `${val}%`;
  }

  const wSlider = document.getElementById("filter-warmth");
  const wVal = document.getElementById("filter-warmth-val");
  if (wSlider) {
    const val = currentSettings.filterWarmth ?? 0;
    wSlider.value = val;
    if (wVal) wVal.textContent = `${val}%`;
  }

  updateFilterPresetChipsActiveState();
}

function renderCinemaMode() {
  const isEnabled = Boolean(currentSettings.cinemaMode);
  const subSettings = document.getElementById("cinemaMode-sub-settings");
  if (subSettings) {
    subSettings.classList.toggle("show", isEnabled);
  }

  const opSlider = document.getElementById("cinema-opacity");
  const opVal = document.getElementById("cinema-opacity-val");
  if (opSlider) {
    const val = currentSettings.cinemaOpacity ?? 85;
    opSlider.value = val;
    if (opVal) opVal.textContent = `${val}%`;
  }
}

function renderAutoQuality() {
  const isEnabled = Boolean(currentSettings.autoQuality);
  const subSettings = document.getElementById("autoQuality-sub-settings");
  if (subSettings) {
    subSettings.classList.toggle("show", isEnabled);
  }

  const select = document.getElementById("select-preferredQuality");
  if (select) {
    select.value = currentSettings.preferredQuality || "highest";
  }

  const badgeCheck = document.getElementById("toggle-qualityBadge");
  if (badgeCheck) {
    badgeCheck.checked = currentSettings.qualityBadge !== false;
  }
}

function renderProgressColor() {
  const isEnabled = Boolean(currentSettings.progressColor);
  const color = currentSettings.progressBarColor || "#E8930C";

  const subSettings = document.getElementById("progressColor-sub-settings");
  if (subSettings) {
    subSettings.classList.toggle("show", isEnabled);
  }

  const preview = document.getElementById("progress-color-preview");
  if (preview) {
    preview.style.backgroundColor = color;
  }

  const picker = document.getElementById("input-progress-color-picker");
  if (picker) {
    picker.value = color;
  }

  const hexInput = document.getElementById("input-progress-color-hex");
  if (hexInput) {
    hexInput.value = color.toUpperCase();
  }

  document.querySelectorAll(".color-swatch-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.color.toLowerCase() === color.toLowerCase());
  });
}

function renderLogoType() {
  const currentLogo = currentSettings.logoType || (currentSettings.premiumBranding ? "tada" : "default");
  const isEn = currentSettings.language === "en";

  const badgeMain = document.getElementById("topbar-logo-badge-main");
  if (badgeMain) {
    const labels = {
      tada: "TADa",
      premium: "Premium",
      default: isEn ? "Default" : "Mặc định"
    };
    badgeMain.textContent = labels[currentLogo] || "TADa";
  }

  document.querySelectorAll(".logo-seg-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.logo === currentLogo);
  });
}

function renderInterfaceMode() {
  const currentMode = currentSettings.interfaceMode || "pc";
  const isTv = currentMode === "tv";

  const badgeMain = document.getElementById("topbar-interface-badge-main");
  if (badgeMain) {
    badgeMain.textContent = isTv ? "TV (Smart TV)" : "PC";
  }

  const badgeLayout = document.getElementById("interface-mode-badge");
  if (badgeLayout) {
    badgeLayout.textContent = isTv ? "TV" : "PC";
  }

  document.querySelectorAll(".mode-seg-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === currentMode);
  });

  const tvActionRow = document.getElementById("tv-mode-action-row");
  if (tvActionRow) {
    tvActionRow.style.display = isTv ? "block" : "none";
  }

  const tvOptions = document.getElementById("tv-mode-options");
  if (tvOptions) {
    tvOptions.style.display = isTv ? "flex" : "none";
  }

  const autoTvCheck = document.getElementById("toggle-autoTvRedirect");
  if (autoTvCheck) {
    autoTvCheck.checked = Boolean(currentSettings.autoTvRedirect);
  }
}

const TOOLBAR_BUTTONS_DEF = {
  abLooper: {
    id: "abLooper",
    name: "Lặp đoạn A-B",
    desc: "Đánh dấu điểm A & B để lặp lại đoạn video",
    settingKey: "abLooper",
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`
  },
  cinemaMode: {
    id: "cinemaMode",
    name: "Chế độ Rạp phim",
    desc: "Làm tối nền video giúp tập trung xem",
    settingKey: "cinemaMode",
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
  },
  videoFilter: {
    id: "videoFilter",
    name: "Bộ lọc màu & Hiệu ứng",
    desc: "Chỉnh Độ sáng, Tương phản, Bão hòa & Tone ấm",
    settingKey: "videoFilter",
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>`
  },
  customSpeed: {
    id: "customSpeed",
    name: "Nút Tốc độ phát (Speed)",
    desc: "Chỉnh tốc độ phát video linh hoạt (1.0x, 1.25x...)",
    settingKey: "customSpeed",
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 19 22 12 13 5 13 19"/><polygon points="2 19 11 12 2 5 2 19"/></svg>`
  },
  pipButton: {
    id: "pipButton",
    name: "Hình trong hình (PiP)",
    desc: "Thu nhỏ video phát nổi để vừa làm việc vừa xem",
    settingKey: "pipButton",
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><rect x="12" y="11" width="8" height="7" rx="1"/></svg>`
  },
  videoScreenshot: {
    id: "videoScreenshot",
    name: "Chụp ảnh Video (Camera)",
    desc: "Chụp khung hình gốc độ nét cao",
    settingKey: "videoScreenshot",
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`
  },
  videoBookmarks: {
    id: "videoBookmarks",
    name: "Đánh dấu thời gian (Bookmarks)",
    desc: "Lưu mốc thời gian kèm ghi chú vào bộ nhớ",
    settingKey: "videoBookmarks",
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`
  }
};

function getSanitizedToolbarOrder() {
  const defaultList = [...DEFAULT_TOOLBAR_ORDER];
  if (!Array.isArray(currentSettings.toolbarOrder)) {
    return defaultList;
  }
  const result = [];
  const seen = new Set();
  currentSettings.toolbarOrder.forEach((id) => {
    if (TOOLBAR_BUTTONS_DEF[id] && !seen.has(id)) {
      result.push(id);
      seen.add(id);
    }
  });
  defaultList.forEach((id) => {
    if (!seen.has(id)) {
      result.push(id);
      seen.add(id);
    }
  });
  return result;
}

function renderToolbarPreview() {
  const track = document.getElementById("toolbar-preview-track");
  if (!track) return;
  const isEnglish = currentSettings.language === "en";

  const order = getSanitizedToolbarOrder();
  const hidden = currentSettings.toolbarHidden || {};
  const abPos = currentSettings.abLooperPosition || "left";
  const anchor = currentSettings.toolbarAnchor || "beforeSettings";

  const renderItemPill = (id) => {
    const def = TOOLBAR_BUTTONS_DEF[id];
    if (!def) return "";
    const isHidden = Boolean(hidden[id]);
    const hiddenTag = isHidden ? (isEnglish ? " (Hidden)" : " (Đang ẩn)") : "";
    return `
      <div class="preview-tb-item ${isHidden ? 'preview-hidden' : ''}" title="${def.name}${hiddenTag}">
        ${def.iconSvg}
      </div>
    `;
  };

  const leftAbPill = abPos === "left" ? renderItemPill("abLooper") : "";

  const leftHtml = `
    <div class="preview-fixed-left">
      <span>▶</span>
      <span>⏭</span>
      <span>🔊</span>
      <span>1:37 / 4:06</span>
      ${leftAbPill}
    </div>
  `;

  const tadaButtonsHtml = order
    .filter((id) => !(id === "abLooper" && abPos === "left"))
    .map((id) => renderItemPill(id))
    .join("");

  const ytSettingsPill = `<span title="${isEnglish ? 'YouTube Settings' : 'Cài đặt YouTube'}" style="opacity:0.8;font-size:12px;cursor:default;">⚙️</span>`;
  const ytEndPills = `<span title="${isEnglish ? 'Native PiP' : 'Hình trong hình gốc'}" style="opacity:0.5;font-size:11px;">⧉</span><span title="${isEnglish ? 'Full screen' : 'Toàn màn hình'}" style="opacity:0.7;font-size:11px;">⛶</span>`;

  const rightHtml = `
    <div class="preview-fixed-right">
      <span title="${isEnglish ? 'YouTube Captions' : 'Phụ đề YouTube'}" style="opacity:0.6;font-size:10px;">CC</span>
      ${anchor === "beforeSettings" ? tadaButtonsHtml + ytSettingsPill : ytSettingsPill + tadaButtonsHtml}
      ${ytEndPills}
    </div>
  `;

  track.innerHTML = leftHtml + rightHtml;
}

function renderToolbarManager() {
  const listContainer = document.getElementById("toolbar-items-list");
  if (!listContainer) return;
  const isEnglish = currentSettings.language === "en";

  const order = getSanitizedToolbarOrder();
  currentSettings.toolbarOrder = order;
  const hidden = currentSettings.toolbarHidden || {};

  // Render options dropdowns
  const abSelect = document.getElementById("select-abLooperPosition");
  if (abSelect) {
    abSelect.value = currentSettings.abLooperPosition || "left";
  }
  const anchorSelect = document.getElementById("select-toolbarAnchor");
  if (anchorSelect) {
    anchorSelect.value = currentSettings.toolbarAnchor || "beforeSettings";
  }

  // Render items list
  listContainer.innerHTML = order.map((id, index) => {
    const item = TOOLBAR_BUTTONS_DEF[id];
    if (!item) return "";
    const isHidden = Boolean(hidden[id]);
    const isFirst = index === 0;
    const isLast = index === order.length - 1;

    const dragTitle = isEnglish ? "Drag to reorder" : "Kéo thả để đổi thứ tự";
    const upTitle = isEnglish ? "Move up" : "Đưa lên trên";
    const downTitle = isEnglish ? "Move down" : "Đưa xuống dưới";
    const toggleTitle = isHidden
      ? (isEnglish ? "Click to show this button" : "Bấm để hiển thị nút này")
      : (isEnglish ? "Click to hide this button" : "Bấm để ẩn nút này");

    return `
      <div class="toolbar-item-row ${isHidden ? 'is-hidden' : ''}" data-id="${item.id}" draggable="true">
        <div class="tb-drag-handle" title="${dragTitle}">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
            <circle cx="9" cy="6" r="1.5"/>
            <circle cx="15" cy="6" r="1.5"/>
            <circle cx="9" cy="12" r="1.5"/>
            <circle cx="15" cy="12" r="1.5"/>
            <circle cx="9" cy="18" r="1.5"/>
            <circle cx="15" cy="18" r="1.5"/>
          </svg>
        </div>
        <span class="tb-item-drag-idx">#${index + 1}</span>
        <div class="tb-item-icon">
          ${item.iconSvg}
        </div>
        <div class="tb-item-info">
          <div class="tb-item-title">${item.name}</div>
          <div class="tb-item-desc">${item.desc}</div>
        </div>
        <div class="tb-actions-wrap">
          <div class="tb-move-btns">
            <button type="button" class="btn-tb-move btn-tb-up" data-id="${item.id}" title="${upTitle}" ${isFirst ? 'disabled' : ''}>▲</button>
            <button type="button" class="btn-tb-move btn-tb-down" data-id="${item.id}" title="${downTitle}" ${isLast ? 'disabled' : ''}>▼</button>
          </div>
          <div class="checkbox-wrapper-41" title="${toggleTitle}">
            <input type="checkbox" class="toggle-checkbox tb-visibility-checkbox" data-id="${item.id}" ${!isHidden ? 'checked' : ''}>
          </div>
        </div>
      </div>
    `;
  }).join("");

  // Drag and Drop reordering logic (Both HTML5 DnD and Pointer Events)
  let draggedId = null;

  listContainer.querySelectorAll(".toolbar-item-row").forEach((row) => {
    // 1. Native HTML5 Drag and Drop
    row.addEventListener("dragstart", (e) => {
      draggedId = row.dataset.id;
      e.dataTransfer.setData("text/plain", draggedId);
      e.dataTransfer.effectAllowed = "move";
      setTimeout(() => {
        row.classList.add("is-dragging");
      }, 0);
    });

    row.addEventListener("dragend", () => {
      draggedId = null;
      listContainer.querySelectorAll(".toolbar-item-row").forEach((r) => {
        r.classList.remove("is-dragging", "drag-over", "drag-over-top", "drag-over-bottom");
      });
    });

    row.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (!draggedId || draggedId === row.dataset.id) return;
      row.classList.add("drag-over");
    });

    row.addEventListener("dragleave", () => {
      row.classList.remove("drag-over", "drag-over-top", "drag-over-bottom");
    });

    row.addEventListener("drop", async (e) => {
      e.preventDefault();
      row.classList.remove("drag-over", "drag-over-top", "drag-over-bottom");
      const targetId = row.dataset.id;
      if (!draggedId || draggedId === targetId) return;

      const curOrder = getSanitizedToolbarOrder();
      const fromIdx = curOrder.indexOf(draggedId);
      const toIdx = curOrder.indexOf(targetId);
      if (fromIdx >= 0 && toIdx >= 0 && fromIdx !== toIdx) {
        curOrder.splice(fromIdx, 1);
        curOrder.splice(toIdx, 0, draggedId);
        currentSettings.toolbarOrder = curOrder;
        await saveSettings();
        renderToolbarManager();
        const isEn = currentSettings.language === "en";
        showToast(isEn ? `Moved "${TOOLBAR_BUTTONS_DEF[draggedId]?.name}"!` : `Đã di chuyển "${TOOLBAR_BUTTONS_DEF[draggedId]?.name}"!`);
      }
    });

    // 2. Pointer Events on drag handle (smooth & reliable across Linux/Windows/Mac)
    const dragHandle = row.querySelector(".tb-drag-handle");
    if (dragHandle) {
      dragHandle.addEventListener("pointerdown", (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();

        const startRow = row;
        const startId = row.dataset.id;
        let lastTargetRow = null;

        try {
          dragHandle.setPointerCapture(e.pointerId);
        } catch {}

        startRow.classList.add("is-dragging");

        const onPointerMove = (moveEvt) => {
          moveEvt.preventDefault();
          const elem = document.elementFromPoint(moveEvt.clientX, moveEvt.clientY);
          const targetRow = elem?.closest(".toolbar-item-row");

          listContainer.querySelectorAll(".toolbar-item-row").forEach((r) => {
            if (r !== startRow) r.classList.remove("drag-over");
          });

          if (targetRow && targetRow !== startRow && listContainer.contains(targetRow)) {
            targetRow.classList.add("drag-over");
            lastTargetRow = targetRow;
          } else {
            lastTargetRow = null;
          }
        };

        const onPointerUp = async () => {
          try {
            dragHandle.releasePointerCapture(e.pointerId);
          } catch {}

          window.removeEventListener("pointermove", onPointerMove);
          window.removeEventListener("pointerup", onPointerUp);
          window.removeEventListener("pointercancel", onPointerUp);

          startRow.classList.remove("is-dragging");
          listContainer.querySelectorAll(".toolbar-item-row").forEach((r) => {
            r.classList.remove("drag-over", "drag-over-top", "drag-over-bottom");
          });

          if (lastTargetRow && lastTargetRow !== startRow) {
            const targetId = lastTargetRow.dataset.id;
            const curOrder = getSanitizedToolbarOrder();
            const fromIdx = curOrder.indexOf(startId);
            const toIdx = curOrder.indexOf(targetId);
            if (fromIdx >= 0 && toIdx >= 0 && fromIdx !== toIdx) {
              curOrder.splice(fromIdx, 1);
              curOrder.splice(toIdx, 0, startId);
              currentSettings.toolbarOrder = curOrder;
              await saveSettings();
              renderToolbarManager();
              const isEn = currentSettings.language === "en";
              showToast(isEn ? `Moved "${TOOLBAR_BUTTONS_DEF[startId]?.name}"!` : `Đã di chuyển "${TOOLBAR_BUTTONS_DEF[startId]?.name}"!`);
            }
          }
        };

        window.addEventListener("pointermove", onPointerMove, { passive: false });
        window.addEventListener("pointerup", onPointerUp);
        window.addEventListener("pointercancel", onPointerUp);
      });
    }
  });

  // Attach event handlers to Up / Down buttons
  listContainer.querySelectorAll(".btn-tb-move.btn-tb-up").forEach((btn) => {
    btn.onclick = async (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const curOrder = getSanitizedToolbarOrder();
      const idx = curOrder.indexOf(id);
      if (idx > 0) {
        const temp = curOrder[idx - 1];
        curOrder[idx - 1] = curOrder[idx];
        curOrder[idx] = temp;
        currentSettings.toolbarOrder = curOrder;
        await saveSettings();
        renderToolbarManager();
        const isEn = currentSettings.language === "en";
        showToast(isEn ? `Moved "${TOOLBAR_BUTTONS_DEF[id]?.name}" up` : `Đã chuyển "${TOOLBAR_BUTTONS_DEF[id]?.name}" lên trước`);
      }
    };
  });

  listContainer.querySelectorAll(".btn-tb-move.btn-tb-down").forEach((btn) => {
    btn.onclick = async (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const curOrder = getSanitizedToolbarOrder();
      const idx = curOrder.indexOf(id);
      if (idx >= 0 && idx < curOrder.length - 1) {
        const temp = curOrder[idx + 1];
        curOrder[idx + 1] = curOrder[idx];
        curOrder[idx] = temp;
        currentSettings.toolbarOrder = curOrder;
        await saveSettings();
        renderToolbarManager();
        const isEn = currentSettings.language === "en";
        showToast(isEn ? `Moved "${TOOLBAR_BUTTONS_DEF[id]?.name}" down` : `Đã chuyển "${TOOLBAR_BUTTONS_DEF[id]?.name}" xuống sau`);
      }
    };
  });

  // Attach event handlers to visibility checkboxes
  listContainer.querySelectorAll(".tb-visibility-checkbox").forEach((cb) => {
    cb.onchange = async (e) => {
      e.stopPropagation();
      const id = cb.dataset.id;
      if (!currentSettings.toolbarHidden) {
        currentSettings.toolbarHidden = {};
      }
      if (cb.checked) {
        delete currentSettings.toolbarHidden[id];
      } else {
        currentSettings.toolbarHidden[id] = true;
      }
      await saveSettings();
      renderToolbarManager();
      const isEn = currentSettings.language === "en";
      showToast(cb.checked
        ? (isEn ? `Shown "${TOOLBAR_BUTTONS_DEF[id]?.name}" button` : `Đã hiện nút "${TOOLBAR_BUTTONS_DEF[id]?.name}"`)
        : (isEn ? `Hidden "${TOOLBAR_BUTTONS_DEF[id]?.name}" button` : `Đã ẩn nút "${TOOLBAR_BUTTONS_DEF[id]?.name}"`));
    };
  });

  renderToolbarPreview();
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

  if (categoryId === "toolbar") {
    renderToolbarManager();
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

function applyLanguage(lang) {
  const currentLang = (lang === "en") ? "en" : "vi";
  const isEnglish = currentLang === "en";
  document.documentElement.lang = currentLang;

  // 1. Update header toggle button
  const flagEl = document.getElementById("header-lang-flag");
  const codeEl = document.getElementById("header-lang-code");
  const switchBtn = document.getElementById("btn-switch-lang");
  if (flagEl) flagEl.textContent = isEnglish ? "🇬🇧" : "🇻🇳";
  if (codeEl) codeEl.textContent = isEnglish ? "EN" : "VI";
  if (switchBtn) {
    switchBtn.title = isEnglish ? "Chuyển sang Tiếng Việt (Switch to Vietnamese)" : "Đổi sang Tiếng Anh (Switch to English)";
  }

  // 2. Translate all [data-i18n] text elements
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (I18N[currentLang] && I18N[currentLang][key]) {
      el.textContent = I18N[currentLang][key];
    }
  });

  // 3. Translate all [data-i18n-title] elements
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.getAttribute("data-i18n-title");
    if (I18N[currentLang] && I18N[currentLang][key]) {
      const text = I18N[currentLang][key];
      el.setAttribute("title", text);
      if (el.hasAttribute("aria-label")) {
        el.setAttribute("aria-label", text);
      }
    }
  });

  // 4. Translate all [data-i18n-html] elements
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.getAttribute("data-i18n-html");
    if (I18N[currentLang] && I18N[currentLang][key]) {
      el.innerHTML = I18N[currentLang][key];
    }
  });

  // 5. Update dynamic CATEGORY_META
  if (isEnglish) {
    CATEGORY_META.player.title = "Player & Audio";
    CATEGORY_META.player.desc = "500% Volume, Ambient Light, Progress bar color, PiP";
    CATEGORY_META.tools.title = "Tools & Utilities";
    CATEGORY_META.tools.desc = "4K Screenshot, Bookmarks, Dislike & Skip Intro/Sponsor";
    CATEGORY_META.layout.title = "Interface & Focus";
    CATEGORY_META.layout.desc = "Custom logo, 4-column grid, sidebar curation, hide Shorts, sticky comments";
    CATEGORY_META.shortcuts.title = "Quick Hotkeys";
    CATEGORY_META.shortcuts.desc = "Pro shortcuts, screenshot, speed dial, cinema mode, bookmarks";
    CATEGORY_META.toolbar.title = "Toolbar Arrangement";
    CATEGORY_META.toolbar.desc = "Reorder, show/hide player toolbar buttons";
  } else {
    CATEGORY_META.player.title = "Trình phát & Âm thanh";
    CATEGORY_META.player.desc = "Âm lượng 500%, Ambient Light, màu thanh thời gian, PiP";
    CATEGORY_META.tools.title = "Công cụ & Tiện ích";
    CATEGORY_META.tools.desc = "Chụp ảnh 4K, Bookmarks, Dislike & Bỏ qua Intro/Sponsor";
    CATEGORY_META.layout.title = "Giao diện & Tập trung";
    CATEGORY_META.layout.desc = "Logo tùy biến, lưới 4 cột, lọc Sidebar, ẩn Shorts, cố định bình luận";
    CATEGORY_META.shortcuts.title = "Phím tắt nhanh (Hotkeys)";
    CATEGORY_META.shortcuts.desc = "Bảng phím tắt pro, chụp ảnh, tua tốc độ, rạp phim, bookmark";
    CATEGORY_META.toolbar.title = "Sắp xếp thanh công cụ";
    CATEGORY_META.toolbar.desc = "Đổi thứ tự, ẩn/hiện nút tiện ích trên thanh điều khiển YouTube";
  }

  // 6. Update Sub-header title
  const subTitleEl = document.getElementById("sub-header-title");
  if (subTitleEl) {
    const cat = activeCategory || "player";
    if (CATEGORY_META[cat]) {
      subTitleEl.textContent = CATEGORY_META[cat].title;
    }
  }

  // 7. Update Feature Names
  Object.entries(FEATURE_NAMES_I18N).forEach(([key, tr]) => {
    const toggle = document.getElementById(`toggle-${key}`);
    if (toggle) {
      const featRow = toggle.closest(".feat-row, .shortcuts-master-row");
      if (featRow) {
        const nameEl = featRow.querySelector(".feat-name");
        if (nameEl) nameEl.textContent = tr[currentLang];
      }
    }
  });

  // 8. Update Shortcuts list titles & descriptions
  Object.entries(SHORTCUT_I18N).forEach(([action, tr]) => {
    const item = document.querySelector(`.shortcut-item[data-action="${action}"]`);
    if (item) {
      const tEl = item.querySelector(".shortcut-title");
      const dEl = item.querySelector(".shortcut-desc");
      if (tEl) tEl.textContent = tr.title[currentLang];
      if (dEl) dEl.textContent = tr.desc[currentLang];
    }
  });

  // 9. Update TOOLBAR_BUTTONS_DEF
  if (isEnglish) {
    if (TOOLBAR_BUTTONS_DEF.abLooper) {
      TOOLBAR_BUTTONS_DEF.abLooper.name = "A-B Looper";
      TOOLBAR_BUTTONS_DEF.abLooper.desc = "Pin points A & B to loop video segment";
    }
    if (TOOLBAR_BUTTONS_DEF.cinemaMode) {
      TOOLBAR_BUTTONS_DEF.cinemaMode.name = "Cinema Mode";
      TOOLBAR_BUTTONS_DEF.cinemaMode.desc = "Darken video surroundings for focus";
    }
    if (TOOLBAR_BUTTONS_DEF.videoFilter) {
      TOOLBAR_BUTTONS_DEF.videoFilter.name = "Video Filter & Effects";
      TOOLBAR_BUTTONS_DEF.videoFilter.desc = "Adjust Brightness, Contrast, Saturation & Warmth";
    }
    if (TOOLBAR_BUTTONS_DEF.customSpeed) {
      TOOLBAR_BUTTONS_DEF.customSpeed.name = "Speed Button";
      TOOLBAR_BUTTONS_DEF.customSpeed.desc = "Flexible playback speed adjustment (1.0x, 1.25x...)";
    }
    if (TOOLBAR_BUTTONS_DEF.pipButton) {
      TOOLBAR_BUTTONS_DEF.pipButton.name = "Picture-in-Picture (PiP)";
      TOOLBAR_BUTTONS_DEF.pipButton.desc = "Floating mini-player for multitasking";
    }
    if (TOOLBAR_BUTTONS_DEF.videoScreenshot) {
      TOOLBAR_BUTTONS_DEF.videoScreenshot.name = "Screenshot Capture";
      TOOLBAR_BUTTONS_DEF.videoScreenshot.desc = "Capture pristine high-res video frame";
    }
    if (TOOLBAR_BUTTONS_DEF.videoBookmarks) {
      TOOLBAR_BUTTONS_DEF.videoBookmarks.name = "Video Bookmarks";
      TOOLBAR_BUTTONS_DEF.videoBookmarks.desc = "Save timestamps and notes to local storage";
    }
  } else {
    if (TOOLBAR_BUTTONS_DEF.abLooper) {
      TOOLBAR_BUTTONS_DEF.abLooper.name = "Lặp đoạn A-B";
      TOOLBAR_BUTTONS_DEF.abLooper.desc = "Đánh dấu điểm A & B để lặp lại đoạn video";
    }
    if (TOOLBAR_BUTTONS_DEF.cinemaMode) {
      TOOLBAR_BUTTONS_DEF.cinemaMode.name = "Chế độ Rạp phim";
      TOOLBAR_BUTTONS_DEF.cinemaMode.desc = "Làm tối nền video giúp tập trung xem";
    }
    if (TOOLBAR_BUTTONS_DEF.videoFilter) {
      TOOLBAR_BUTTONS_DEF.videoFilter.name = "Bộ lọc màu & Hiệu ứng";
      TOOLBAR_BUTTONS_DEF.videoFilter.desc = "Chỉnh Độ sáng, Tương phản, Bão hòa & Tone ấm";
    }
    if (TOOLBAR_BUTTONS_DEF.customSpeed) {
      TOOLBAR_BUTTONS_DEF.customSpeed.name = "Nút Tốc độ phát (Speed)";
      TOOLBAR_BUTTONS_DEF.customSpeed.desc = "Chỉnh tốc độ phát video linh hoạt (1.0x, 1.25x...)";
    }
    if (TOOLBAR_BUTTONS_DEF.pipButton) {
      TOOLBAR_BUTTONS_DEF.pipButton.name = "Hình trong hình (PiP)";
      TOOLBAR_BUTTONS_DEF.pipButton.desc = "Thu nhỏ video phát nổi để vừa làm việc vừa xem";
    }
    if (TOOLBAR_BUTTONS_DEF.videoScreenshot) {
      TOOLBAR_BUTTONS_DEF.videoScreenshot.name = "Chụp ảnh Video (Camera)";
      TOOLBAR_BUTTONS_DEF.videoScreenshot.desc = "Chụp khung hình gốc độ nét cao";
    }
    if (TOOLBAR_BUTTONS_DEF.videoBookmarks) {
      TOOLBAR_BUTTONS_DEF.videoBookmarks.name = "Đánh dấu thời gian (Bookmarks)";
      TOOLBAR_BUTTONS_DEF.videoBookmarks.desc = "Lưu mốc thời gian kèm ghi chú vào bộ nhớ";
    }
  }

  // 10. Update buttons tooltips and labels
  document.querySelectorAll(".btn-hotkey-record").forEach((btn) => {
    btn.title = isEnglish ? "Click to rebind shortcut" : "Bấm để đổi phím tắt";
  });
  document.querySelectorAll(".btn-hotkey-reset").forEach((btn) => {
    btn.title = isEnglish ? "Reset to default" : "Khôi phục mặc định";
  });

  // 11. Update swatch button tooltips
  const swatchTitles = {
    "#E8930C": { vi: "Cam TADa (Mặc định)", en: "TADa Orange (Default)" },
    "#00D2FF": { vi: "Xanh Cyan Neon", en: "Neon Cyan" },
    "#10B981": { vi: "Xanh Ngọc Emerald", en: "Emerald Green" },
    "#A855F7": { vi: "Tím Neon Purple", en: "Neon Purple" },
    "#EC4899": { vi: "Hồng Pastel Pink", en: "Pastel Pink" },
    "#EAB308": { vi: "Vàng Gold", en: "Gold Yellow" },
    "#FF0000": { vi: "Đỏ gốc YouTube", en: "Original YouTube Red" }
  };
  document.querySelectorAll(".color-swatch-btn").forEach((btn) => {
    const color = btn.dataset.color;
    if (swatchTitles[color]) {
      btn.title = swatchTitles[color][currentLang];
    }
  });

  // 12. Update Filter preset chips text
  const filterTitles = {
    reset: { vi: "Chuẩn", en: "Default" },
    night: { vi: "Xem đêm", en: "Night" },
    brighten: { vi: "Sáng rõ", en: "Brighten" },
    cinema: { vi: "Cinema", en: "Cinema" },
    vintage: { vi: "Hoài cổ", en: "Vintage" },
    invert: { vi: "Đảo màu", en: "Invert" },
    bw: { vi: "Đen trắng", en: "B&W" }
  };
  document.querySelectorAll(".filter-chip-btn").forEach((btn) => {
    const p = btn.dataset.preset;
    if (filterTitles[p]) {
      btn.textContent = filterTitles[p][currentLang];
    }
  });

  // 13. Update segmented badges and dropdowns
  renderLogoType();
  renderInterfaceMode();
  loadBookmarksSummary();

  const qualitySelect = document.getElementById("select-preferredQuality");
  if (qualitySelect) {
    const optHighest = qualitySelect.querySelector("option[value='highest']");
    if (optHighest) optHighest.textContent = isEnglish ? "Highest Possible (4K / 8K)" : "Cao nhất có thể (4K / 8K)";
    const optSave = qualitySelect.querySelector("option[value='large']");
    if (optSave) optSave.textContent = isEnglish ? "Data Saver (480p)" : "Tiết kiệm mạng (480p)";
  }

  // 14. Update Toolbar Preview & List
  renderToolbarPreview();
  if (activeCategory === "toolbar") {
    renderToolbarManager();
  }

  // 15. Universal fallback text replacement for any static text nodes
  const TEXT_REPLACEMENTS = isEnglish ? [
    ["Tải lại tab YouTube", "Reload YouTube tab"],
    ["Chặn quảng cáo", "Ad Blocker"],
    ["LUÔN BẬT", "ALWAYS ON"],
    ["đã chặn", "blocked"],
    ["Đặt lại thống kê", "Reset statistics"],
    ["Logo YouTube", "YouTube Logo"],
    ["Mặc định", "Default"],
    ["Chế độ giao diện", "Interface Mode"],
    ["Mở YouTube TV ngay", "Open YouTube TV now"],
    ["Tính năng", "Features"],
    ["Bật hết", "Enable All"],
    ["Tắt hết", "Disable All"],
    ["Trình phát & Âm thanh", "Player & Audio"],
    ["Trình phát", "Player"],
    ["Công cụ & Tiện ích", "Tools & Utilities"],
    ["Giao diện & Tập trung", "Interface & Focus"],
    ["Phím tắt nhanh", "Quick Hotkeys"],
    ["Sắp xếp thanh công cụ", "Toolbar Arrangement"],
    ["Thư viện Bookmarks", "Bookmarks Library"],
    ["Giới thiệu TADa", "About TADa"],
    ["Quay lại", "Back"],
    ["Làm mới trang", "Reload Page"],
    ["Độ sáng", "Brightness"],
    ["Lan tỏa", "Spread"],
    ["Bảng màu gợi ý", "Preset Colors"],
    ["Tự chọn mã màu:", "Custom Hex Color:"],
    ["Mẫu lọc có sẵn (1-chạm)", "1-Click Presets"],
    ["Đặt lại", "Reset"],
    ["Độ tương phản", "Contrast"],
    ["Độ bão hòa màu", "Saturation"],
    ["Tông ấm / Dịu mắt", "Warmth / Eye Care"],
    ["Độ mờ màn đen", "Dim Opacity"],
    ["Mức chất lượng ưu tiên:", "Preferred Quality:"],
    ["Hiện thông báo chất lượng trên video", "Show quality badge on video"],
    ["Kích hoạt phím tắt TADa", "Enable TADa Hotkeys"],
    ["Khôi phục tất cả phím tắt mặc định", "Reset All Shortcuts to Default"],
    ["MÔ PHỎNG TRỰC TIẾP", "LIVE SIMULATION"],
    ["Thanh phát video YouTube", "YouTube Video Player Bar"],
    ["Vị trí nút Lặp đoạn A-B:", "A-B Looper Button Position:"],
    ["Đặt cạnh mốc thời gian hoặc cùng cụm công cụ", "Place next to time display or in right toolbar"],
    ["Cạnh thời gian (Bên trái)", "Next to Time (Left side)"],
    ["Thanh công cụ (Bên phải)", "Main Toolbar (Right side)"],
    ["Vị trí cụm nút TADa:", "TADa Buttons Position:"],
    ["Vị trí tương đối với nút Cài đặt bánh răng", "Position relative to YouTube Settings gear icon"],
    ["Trước nút Cài đặt (Bên trái)", "Before Settings Icon (Left)"],
    ["Sau nút Cài đặt (Bên phải)", "After Settings Icon (Right)"],
    ["Khôi phục thứ tự mặc định", "Reset to Default Order"],
    ["Bookmarks đã lưu", "Saved Bookmarks"],
    ["Sao chép tất cả", "Copy All"],
    ["Xóa hết", "Clear All"],
    ["Phát triển bởi", "Developed by"],
    ["Thành viên Team TADa", "TADa Team Member"],
    ["Mã nguồn & Đóng góp", "Source Code & Contributions"],
    ["Chia sẻ tiện ích", "Share Extension"],
    ["Sao chép link", "Copy Link"],
    ["Chia sẻ", "Share"],
    ["Ủng hộ tôi", "Support Me"],
    ["Chạm để sao chép STK", "Tap to copy bank account"],
    ["Ngân hàng Quân Đội", "Military Commercial Bank (MB Bank)"],
    ["SỐ TÀI KHOẢN / THẺ", "ACCOUNT / CARD NUMBER"],
    ["Sao chép", "Copy"],
    ["CHỦ TÀI KHOẢN:", "ACCOUNT HOLDER:"],
    ["Hiện mã QR MB Bank ▼", "Show MB Bank VietQR ▼"],
    ["Đóng", "Close"],
    ["Chào mừng đến với TADa!", "Welcome to TADa!"],
    ["Vui lòng chọn ngôn ngữ bạn muốn sử dụng", "Please select your preferred language"],
    ["Giao diện tiếng Việt chuẩn", "Vietnamese standard UI"],
    ["Bắt đầu ngay • Get Started", "Get Started"]
  ] : [
    ["Reload YouTube tab", "Tải lại tab YouTube"],
    ["Ad Blocker", "Chặn quảng cáo"],
    ["ALWAYS ON", "LUÔN BẬT"],
    ["blocked", "đã chặn"],
    ["Reset statistics", "Đặt lại thống kê"],
    ["YouTube Logo", "Logo YouTube"],
    ["Default", "Mặc định"],
    ["Interface Mode", "Chế độ giao diện"],
    ["Open YouTube TV now", "Mở YouTube TV ngay"],
    ["Features", "Tính năng"],
    ["Enable All", "Bật hết"],
    ["Disable All", "Tắt hết"],
    ["Player & Audio", "Trình phát & Âm thanh"],
    ["Tools & Utilities", "Công cụ & Tiện ích"],
    ["Interface & Focus", "Giao diện & Tập trung"],
    ["Quick Hotkeys", "Phím tắt nhanh"],
    ["Toolbar Arrangement", "Sắp xếp thanh công cụ"],
    ["Bookmarks Library", "Thư viện Bookmarks"],
    ["About TADa", "Giới thiệu TADa"],
    ["Back", "Quay lại"],
    ["Reload Page", "Làm mới trang"],
    ["Brightness", "Độ sáng"],
    ["Spread", "Lan tỏa"],
    ["Preset Colors", "Bảng màu gợi ý"],
    ["Custom Hex Color:", "Tự chọn mã màu:"],
    ["1-Click Presets", "Mẫu lọc có sẵn (1-chạm)"],
    ["Reset", "Đặt lại"],
    ["Contrast", "Độ tương phản"],
    ["Saturation", "Độ bão hòa màu"],
    ["Warmth / Eye Care", "Tông ấm / Dịu mắt"],
    ["Dim Opacity", "Độ mờ màn đen"],
    ["Preferred Quality:", "Mức chất lượng ưu tiên:"],
    ["Show quality badge on video", "Hiện thông báo chất lượng trên video"],
    ["Enable TADa Hotkeys", "Kích hoạt phím tắt TADa"],
    ["Reset All Shortcuts to Default", "Khôi phục tất cả phím tắt mặc định"],
    ["LIVE SIMULATION", "MÔ PHỎNG TRỰC TIẾP"],
    ["YouTube Video Player Bar", "Thanh phát video YouTube"],
    ["A-B Looper Button Position:", "Vị trí nút Lặp đoạn A-B:"],
    ["Place next to time display or in right toolbar", "Đặt cạnh mốc thời gian hoặc cùng cụm công cụ"],
    ["Next to Time (Left side)", "Cạnh thời gian (Bên trái)"],
    ["Main Toolbar (Right side)", "Thanh công cụ (Bên phải)"],
    ["TADa Buttons Position:", "Vị trí cụm nút TADa:"],
    ["Position relative to YouTube Settings gear icon", "Vị trí tương đối với nút Cài đặt bánh răng"],
    ["Before Settings Icon (Left)", "Trước nút Cài đặt (Bên trái)"],
    ["After Settings Icon (Right)", "Sau nút Cài đặt (Bên phải)"],
    ["Reset to Default Order", "Khôi phục thứ tự mặc định"],
    ["Saved Bookmarks", "Bookmarks đã lưu"],
    ["Copy All", "Sao chép tất cả"],
    ["Clear All", "Xóa hết"],
    ["Developed by", "Phát triển bởi"],
    ["TADa Team Member", "Thành viên Team TADa"],
    ["Source Code & Contributions", "Mã nguồn & Đóng góp"],
    ["Share Extension", "Chia sẻ tiện ích"],
    ["Copy Link", "Sao chép link"],
    ["Share", "Chia sẻ"],
    ["Support Me", "Ủng hộ tôi"],
    ["Tap to copy bank account", "Chạm để sao chép STK"],
    ["Military Commercial Bank (MB Bank)", "Ngân hàng Quân Đội"],
    ["ACCOUNT / CARD NUMBER", "SỐ TÀI KHOẢN / THẺ"],
    ["Copy", "Sao chép"],
    ["ACCOUNT HOLDER:", "CHỦ TÀI KHOẢN:"],
    ["Show MB Bank VietQR ▼", "Hiện mã QR MB Bank ▼"],
    ["Hide QR Code ▲", "Ẩn mã QR ▲"],
    ["Close", "Đóng"],
    ["Welcome to TADa!", "Chào mừng đến với TADa!"],
    ["Please select your preferred language", "Vui lòng chọn ngôn ngữ bạn muốn sử dụng"],
    ["Vietnamese standard UI", "Giao diện tiếng Việt chuẩn"],
    ["Get Started", "Bắt đầu ngay • Get Started"]
  ];

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  let node;
  while ((node = walker.nextNode())) {
    const text = node.nodeValue.trim();
    if (!text) continue;
    for (const [fromText, toText] of TEXT_REPLACEMENTS) {
      if (text === fromText) {
        node.nodeValue = node.nodeValue.replace(fromText, toText);
        break;
      }
    }
  }

  // 16. Update counts
  updateActiveCount();
}

let languageOnboardingInitialized = false;
function initLanguageOnboarding() {
  if (languageOnboardingInitialized) return;
  languageOnboardingInitialized = true;

  const modal = document.getElementById("lang-modal-backdrop");
  const urlParams = new URLSearchParams(window.location.search);
  const isOnboardingParam = urlParams.get("onboarding") === "1";
  const shouldShowModal = isOnboardingParam || currentSettings.hasChosenLanguage === false;

  if (isOnboardingParam) {
    document.body.classList.add("is-onboarding-mode");
  }

  let selectedLang = currentSettings.language || "vi";

  if (modal) {
    const cards = modal.querySelectorAll(".lang-card");
    const updateCardSelection = (lang) => {
      selectedLang = lang;
      cards.forEach((c) => {
        c.classList.toggle("active", c.dataset.lang === lang);
      });
      const confirmText = document.getElementById("btn-lang-confirm-text");
      if (confirmText) {
        confirmText.textContent = lang === "en" ? "Get Started" : "Bắt đầu ngay";
      }
      const titleEl = document.getElementById("lang-modal-title");
      if (titleEl) {
        titleEl.textContent = lang === "en" ? "Welcome to TADa!" : "Chào mừng đến với TADa!";
      }
    };
    updateCardSelection(selectedLang);

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        const l = card.dataset.lang;
        if (l) updateCardSelection(l);
      });
    });

    const confirmBtn = document.getElementById("btn-lang-confirm");
    if (confirmBtn) {
      confirmBtn.addEventListener("click", async () => {
        currentSettings.language = selectedLang;
        currentSettings.hasChosenLanguage = true;
        await saveSettings();
        applyLanguage(selectedLang);
        modal.classList.remove("show");

        if (isOnboardingParam) {
          showToast(selectedLang === "en" ? "Setup complete! Ready to enjoy YouTube." : "Cài đặt hoàn tất! Chúc bạn xem YouTube vui vẻ.");
          setTimeout(() => {
            chrome.tabs.create({ url: "https://www.youtube.com" });
          }, 1000);
        } else {
          showToast(selectedLang === "en" ? "Switched to English 🇬🇧" : "Đã chọn Tiếng Việt 🇻🇳");
        }
      });
    }

    if (shouldShowModal) {
      modal.classList.add("show");
    }
  }

  // Header quick language toggle button
  const switchBtn = document.getElementById("btn-switch-lang");
  if (switchBtn) {
    switchBtn.addEventListener("click", async () => {
      const newLang = currentSettings.language === "en" ? "vi" : "en";
      currentSettings.language = newLang;
      currentSettings.hasChosenLanguage = true;
      await saveSettings();
      applyLanguage(newLang);
      showToast(newLang === "en" ? "Switched to English 🇬🇧" : "Đã chuyển sang Tiếng Việt 🇻🇳");
    });
  }
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

    applyLanguage(currentSettings.language || "vi");
    initLanguageOnboarding();
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
      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, {
          type: "TADA_SETTINGS_CHANGED",
          settings: currentSettings
        }).catch(() => { });
      }
    }
  } catch { }

  try {
    const allTabs = await chrome.tabs.query({});
    for (const tab of allTabs) {
      if (tab?.id) {
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
    showToast(currentSettings.language === "en" ? "Unable to save settings!" : "Không thể lưu cài đặt!");
  }
}

function handleSliderChange(key, value, badgeId) {
  const parsed = parseInt(value, 10);
  const numericVal = Number.isFinite(parsed) ? parsed : 100;
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
      const isEn = currentSettings.language === "en";
      if (activeCategory === "toolbar") {
        currentSettings.toolbarHidden = {};
        await saveSettings();
        renderToolbarManager();
        showToast(isEn ? "All player buttons visible!" : "Đã hiện tất cả nút trên thanh phát!");
        return;
      }
      CATEGORY_MAP[activeCategory].forEach((key) => { currentSettings[key] = true; });
      await saveSettings();
      renderToggles();
      showToast(isEn ? `Enabled all in ${CATEGORY_META[activeCategory]?.title}!` : `Đã bật hết ${CATEGORY_META[activeCategory]?.title}!`);
    });
  }

  // Sub-view: Tắt hết trong danh mục đang xem
  const btnSubDisableAll = document.getElementById("btn-sub-disable-all");
  if (btnSubDisableAll) {
    btnSubDisableAll.addEventListener("click", async () => {
      if (!activeCategory) return;
      const isEn = currentSettings.language === "en";
      if (activeCategory === "toolbar") {
        const order = getSanitizedToolbarOrder();
        const newHidden = {};
        order.forEach((id) => { newHidden[id] = true; });
        currentSettings.toolbarHidden = newHidden;
        await saveSettings();
        renderToolbarManager();
        showToast(isEn ? "All player buttons hidden!" : "Đã ẩn tất cả nút khỏi thanh phát!");
        return;
      }
      CATEGORY_MAP[activeCategory].forEach((key) => { currentSettings[key] = false; });
      await saveSettings();
      renderToggles();
      showToast(isEn ? `Disabled all in ${CATEGORY_META[activeCategory]?.title}!` : `Đã tắt hết ${CATEGORY_META[activeCategory]?.title}!`);
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
          showToast(currentSettings.language === "en" ? "Reloading YouTube tab..." : "Đang làm mới trang...");
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


        if (key === "progressColor") {
          const subSettings = document.getElementById("progressColor-sub-settings");
          if (subSettings) {
            subSettings.classList.toggle("show", e.target.checked);
          }
        }

        if (key === "videoFilter") {
          const subSettings = document.getElementById("videoFilter-sub-settings");
          if (subSettings) {
            subSettings.classList.toggle("show", e.target.checked);
          }
        }

        if (key === "cinemaMode") {
          const subSettings = document.getElementById("cinemaMode-sub-settings");
          if (subSettings) {
            subSettings.classList.toggle("show", e.target.checked);
          }
        }

        if (key === "autoQuality") {
          const subSettings = document.getElementById("autoQuality-sub-settings");
          if (subSettings) {
            subSettings.classList.toggle("show", e.target.checked);
          }
        }

        saveSettings();
        const isEn = currentSettings.language === "en";
        const actionText = e.target.checked ? (isEn ? "Enabled" : "Đã bật") : (isEn ? "Disabled" : "Đã tắt");
        const labelText = FEATURE_NAMES_I18N[key]?.[isEn ? "en" : "vi"] || checkbox.closest(".feat-row, .feat-item, .shortcuts-master-row, .feature-item")?.querySelector(".feat-name, .feature-name")?.textContent?.trim() || key;
        showToast(`${actionText}: ${labelText}`);
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

  // Auto quality settings
  const qualitySelect = document.getElementById("select-preferredQuality");
  if (qualitySelect) {
    qualitySelect.addEventListener("change", (e) => {
      currentSettings.preferredQuality = e.target.value;
      saveSettings();
      showToast(currentSettings.language === "en" ? "Preferred resolution saved!" : "Đã lưu độ phân giải ưu tiên!");
    });
  }

  const qualityBadgeToggle = document.getElementById("toggle-qualityBadge");
  if (qualityBadgeToggle) {
    qualityBadgeToggle.addEventListener("change", (e) => {
      currentSettings.qualityBadge = e.target.checked;
      saveSettings();
    });
  }


  // Progress bar color swatches
  document.querySelectorAll(".color-swatch-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const color = btn.dataset.color;
      if (!color) return;
      currentSettings.progressBarColor = color;
      currentSettings.progressColor = true;
      const toggle = document.getElementById("toggle-progressColor");
      if (toggle) toggle.checked = true;
      renderProgressColor();
      await saveSettings();
      showToast(currentSettings.language === "en" ? `Progress bar color updated: ${color}` : `Đã đổi màu thanh thời gian: ${color}`);
    });
  });

  // Progress bar custom color picker
  const colorPicker = document.getElementById("input-progress-color-picker");
  if (colorPicker) {
    colorPicker.addEventListener("input", (e) => {
      const color = e.target.value;
      currentSettings.progressBarColor = color;
      const preview = document.getElementById("progress-color-preview");
      if (preview) preview.style.backgroundColor = color;
      const hexInput = document.getElementById("input-progress-color-hex");
      if (hexInput) hexInput.value = color.toUpperCase();
      document.querySelectorAll(".color-swatch-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.color.toLowerCase() === color.toLowerCase());
      });
      notifyYouTubeTabs();

      if (saveSettingsDebounce) clearTimeout(saveSettingsDebounce);
      saveSettingsDebounce = setTimeout(() => {
        chrome.storage.local.set({ ctfSettings: currentSettings });
      }, 150);
    });
  }

  // Progress bar hex text input
  const hexInput = document.getElementById("input-progress-color-hex");
  if (hexInput) {
    hexInput.addEventListener("change", async (e) => {
      let val = e.target.value.trim();
      if (!val.startsWith("#")) val = "#" + val;
      const isEn = currentSettings.language === "en";
      if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
        currentSettings.progressBarColor = val;
        renderProgressColor();
        await saveSettings();
        showToast(isEn ? `Color saved: ${val}` : `Đã lưu màu: ${val}`);
      } else {
        hexInput.value = currentSettings.progressBarColor || "#E8930C";
        showToast(isEn ? "Invalid hex color! (e.g. #E8930C)" : "Mã màu không hợp lệ! (Ví dụ: #E8930C)");
      }
    });
  }

  // Video Filter Sliders
  const filterBrightSlider = document.getElementById("filter-brightness");
  if (filterBrightSlider) {
    filterBrightSlider.addEventListener("input", (e) => {
      handleSliderChange("filterBrightness", e.target.value, "filter-brightness-val");
      updateFilterPresetChipsActiveState();
    });
  }

  const filterContrastSlider = document.getElementById("filter-contrast");
  if (filterContrastSlider) {
    filterContrastSlider.addEventListener("input", (e) => {
      handleSliderChange("filterContrast", e.target.value, "filter-contrast-val");
      updateFilterPresetChipsActiveState();
    });
  }

  const filterSatSlider = document.getElementById("filter-saturation");
  if (filterSatSlider) {
    filterSatSlider.addEventListener("input", (e) => {
      handleSliderChange("filterSaturation", e.target.value, "filter-saturation-val");
      updateFilterPresetChipsActiveState();
    });
  }

  const filterWarmthSlider = document.getElementById("filter-warmth");
  if (filterWarmthSlider) {
    filterWarmthSlider.addEventListener("input", (e) => {
      handleSliderChange("filterWarmth", e.target.value, "filter-warmth-val");
      updateFilterPresetChipsActiveState();
    });
  }

  // Filter Preset Chips
  document.querySelectorAll(".filter-chip-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const presetKey = btn.dataset.preset;
      const p = POPUP_FILTER_PRESETS[presetKey];
      if (!p) return;

      currentSettings.filterBrightness = p.brightness;
      currentSettings.filterContrast = p.contrast;
      currentSettings.filterSaturation = p.saturation;
      currentSettings.filterWarmth = p.warmth;
      currentSettings.filterInvert = p.invert;
      currentSettings.filterGrayscale = p.grayscale;
      currentSettings.videoFilter = true;

      const toggle = document.getElementById("toggle-videoFilter");
      if (toggle) toggle.checked = true;

      renderVideoFilter();
      await saveSettings();
      notifyYouTubeTabs();
      const isEn = currentSettings.language === "en";
      showToast(isEn ? `Applied filter preset: ${btn.textContent.trim()}` : `Đã áp dụng mẫu: ${btn.textContent.trim()}`);
    });
  });

  // Filter Reset Button
  const filterResetBtn = document.getElementById("btn-filter-reset");
  if (filterResetBtn) {
    filterResetBtn.addEventListener("click", async () => {
      const p = POPUP_FILTER_PRESETS.reset;
      currentSettings.filterBrightness = p.brightness;
      currentSettings.filterContrast = p.contrast;
      currentSettings.filterSaturation = p.saturation;
      currentSettings.filterWarmth = p.warmth;
      currentSettings.filterInvert = p.invert;
      currentSettings.filterGrayscale = p.grayscale;

      renderVideoFilter();
      await saveSettings();
      notifyYouTubeTabs();
      showToast(currentSettings.language === "en" ? "Reset video filters to default" : "Đã đặt lại bộ lọc về mặc định");
    });
  }

  // Cinema Mode Opacity Slider
  const cinemaOpacitySlider = document.getElementById("cinema-opacity");
  if (cinemaOpacitySlider) {
    cinemaOpacitySlider.addEventListener("input", (e) => {
      handleSliderChange("cinemaOpacity", e.target.value, "cinema-opacity-val");
    });
  }

  // Interface Mode segmented selector buttons (PC vs TV)
  document.querySelectorAll(".mode-seg-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const selected = btn.dataset.mode;
      if (!selected) return;
      currentSettings.interfaceMode = selected;
      renderInterfaceMode();
      await saveSettings();
      const isTv = selected === "tv";
      const isEn = currentSettings.language === "en";
      showToast(isEn ? (isTv ? "Switched to YouTube TV (Smart TV)!" : "Switched to Desktop PC interface!") : (isTv ? "Đã chuyển sang giao diện YouTube TV (Smart TV)!" : "Đã chuyển sang giao diện PC máy tính!"));

      // If active tab is on YouTube, redirect tab to matching interface
      try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const currentTab = tabs[0];
        if (currentTab?.url && (currentTab.url.includes("youtube.com") || currentTab.url.includes("youtu.be"))) {
          if (isTv && !currentTab.url.includes("/tv")) {
            await chrome.tabs.update(currentTab.id, { url: "https://www.youtube.com/tv#/" });
          } else if (!isTv && currentTab.url.includes("/tv")) {
            await chrome.tabs.update(currentTab.id, { url: "https://www.youtube.com/" });
          }
        }
      } catch (err) {
        console.debug("[TADa] Tab redirect on mode change error:", err);
      }
    });
  });

  // Logo Selector segmented buttons (TADa vs Premium vs Default)
  document.querySelectorAll(".logo-seg-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const selected = btn.dataset.logo;
      if (!selected) return;
      currentSettings.logoType = selected;
      currentSettings.premiumBranding = (selected !== "default");
      renderLogoType();
      await saveSettings();

      const isEn = currentSettings.language === "en";
      const nameMap = {
        tada: isEn ? "TADa YouTube (Default)" : "Logo YouTube TADa",
        premium: isEn ? "YouTube Premium Logo" : "Logo YouTube Premium",
        default: isEn ? "Original YouTube Logo" : "Logo YouTube gốc mặc định"
      };
      showToast(`${isEn ? "Selected" : "Đã chọn"}: ${nameMap[selected] || selected}!`);
    });
  });

  // Open YouTube TV in dedicated window
  const openTvWindowHandler = () => {
    chrome.runtime.sendMessage({ type: "OPEN_YOUTUBE_TV" }, () => {
      if (chrome.runtime.lastError) {
        chrome.tabs.create({ url: "https://www.youtube.com/tv#/" });
      }
    });
  };
  document.getElementById("btn-open-tv-window")?.addEventListener("click", openTvWindowHandler);
  document.getElementById("btn-open-tv-window-sub")?.addEventListener("click", openTvWindowHandler);

  // Auto TV redirect toggle
  document.getElementById("toggle-autoTvRedirect")?.addEventListener("change", async (e) => {
    currentSettings.autoTvRedirect = e.target.checked;
    await saveSettings();
    const isEn = currentSettings.language === "en";
    showToast(isEn ? (e.target.checked ? "Enabled auto TV mode redirect" : "Disabled auto TV mode redirect") : (e.target.checked ? "Đã bật tự động chuyển sang TV" : "Đã tắt tự động chuyển sang TV"));
  });

  // Locked Ad Blocker toggle click
  const lockedTrigger = document.getElementById("lock-tooltip-trigger");
  if (lockedTrigger) {
    lockedTrigger.addEventListener("click", () => {
      showToast(currentSettings.language === "en" ? "Ad blocker is a core feature and is always active!" : "Chặn quảng cáo là tính năng cốt lõi và luôn hoạt động!");
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
      showToast(currentSettings.language === "en" ? "Enabled all extra features!" : "Đã bật tất cả tính năng bổ sung!");
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
      showToast(currentSettings.language === "en" ? "Disabled all extra features (ad blocking stays active)!" : "Đã tắt tất cả (quảng cáo vẫn chặn)!");
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
        showToast(currentSettings.language === "en" ? "Blocked ads counter reset to 0!" : "Đã đặt lại số lượng quảng cáo về 0!");
      });
    });
  }

  // Hotkey customizer: Record key
  document.querySelectorAll(".btn-hotkey-record").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const action = btn.dataset.action;
      if (action) {
        startRecordingHotkey(action, btn);
      }
    });
  });

  // Hotkey customizer: Reset single hotkey
  document.querySelectorAll(".btn-hotkey-reset").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const action = btn.dataset.action;
      if (!action) return;
      if (currentSettings.customHotkeys) {
        delete currentSettings.customHotkeys[action];
      }
      await saveSettings();
      renderHotkeys();
      notifyYouTubeTabs();
      showToast(currentSettings.language === "en" ? "Restored shortcut to default" : "Đã khôi phục phím tắt mặc định");
    });
  });

  // Hotkey customizer: Reset all hotkeys
  const btnResetAllHotkeys = document.getElementById("btn-reset-all-hotkeys");
  if (btnResetAllHotkeys) {
    btnResetAllHotkeys.addEventListener("click", async () => {
      currentSettings.customHotkeys = {};
      await saveSettings();
      renderHotkeys();
      notifyYouTubeTabs();
      showToast(currentSettings.language === "en" ? "All shortcuts restored to default!" : "Đã khôi phục tất cả phím tắt về mặc định!");
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
          showToast(currentSettings.language === "en" ? "Reloading YouTube tab..." : "Đang làm mới trang...");
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
  const isEn = currentSettings.language === "en";
  try {
    const data = await chrome.storage.local.get([BOOKMARKS_STORAGE_KEY]);
    const allBm = data?.[BOOKMARKS_STORAGE_KEY] || {};
    const videoKeys = Object.keys(allBm);
    let totalItems = 0;
    videoKeys.forEach((key) => {
      totalItems += Array.isArray(allBm[key]?.items) ? allBm[key].items.length : 0;
    });

    if (totalItems === 0) {
      summaryEl.textContent = isEn ? "0 bookmarks saved" : "0 mốc đã lưu";
    } else {
      summaryEl.textContent = isEn
        ? `${totalItems} ${totalItems === 1 ? "bookmark" : "bookmarks"} (${videoKeys.length} ${videoKeys.length === 1 ? "video" : "videos"})`
        : `${totalItems} mốc (${videoKeys.length} video)`;
    }
  } catch (err) {
    summaryEl.textContent = isEn ? "0 bookmarks saved" : "0 mốc đã lưu";
  }
}

async function renderBookmarksModalList() {
  const bodyEl = document.getElementById("bm-modal-body");
  if (!bodyEl) return;

  try {
    const data = await chrome.storage.local.get([BOOKMARKS_STORAGE_KEY]);
    const allBm = data?.[BOOKMARKS_STORAGE_KEY] || {};
    const videoKeys = Object.keys(allBm);

    const isEn = currentSettings.language === "en";
    if (videoKeys.length === 0) {
      bodyEl.innerHTML = `
        <div class="bm-empty-modal">
          <p>${isEn ? "No bookmarks saved yet." : "Chưa có mốc thời gian nào được lưu."}</p>
          <p style="margin-top: 6px; font-size: 11px; opacity: 0.8;">${isEn ? "Open any YouTube video and press <b>B</b> to pin timestamps & notes!" : "Mở bất kỳ video nào và bấm phím <b>B</b> trên bàn phím để ghim mốc!"}</p>
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
            <button class="btn-del-video-bm" data-video-id="${vId}" title="${isEn ? "Delete all bookmarks for this video" : "Xóa toàn bộ mốc của video này"}">${isEn ? "Delete all" : "Xóa tất cả"}</button>
          </div>
          <div class="bm-item-list">
      `;

      items.forEach((bm) => {
        const timeStr = formatTimestamp(bm.time);
        const url = `https://www.youtube.com/watch?v=${vId}&t=${Math.floor(bm.time)}s`;
        html += `
          <div class="bm-item-row">
            <div class="bm-item-left">
              <a href="${url}" target="_blank" class="bm-pill-time" title="${isEn ? "Open video at " + timeStr : "Mở video tại " + timeStr}">${timeStr}</a>
              <span class="bm-item-note-text" title="${bm.note}">${bm.note}</span>
            </div>
            <button class="btn-del-single-bm" data-video-id="${vId}" data-bm-id="${bm.id}" title="${isEn ? "Delete bookmark" : "Xóa mốc"}">×</button>
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
          showToast(currentSettings.language === "en" ? "Bookmark deleted!" : "Đã xóa mốc thời gian!");
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
          showToast(currentSettings.language === "en" ? "All video bookmarks deleted!" : "Đã xóa toàn bộ mốc của video!");
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
      const isEn = currentSettings.language === "en";
      const data = await chrome.storage.local.get([BOOKMARKS_STORAGE_KEY]);
      const allBm = data?.[BOOKMARKS_STORAGE_KEY] || {};
      const videoKeys = Object.keys(allBm);
      if (videoKeys.length === 0) {
        showToast(isEn ? "No bookmarks to copy!" : "Không có mốc nào để sao chép!");
        return;
      }

      let md = isEn ? "# YouTube Video Bookmarks (TADa for YouTube)\n\n" : "# Danh sách Video Bookmarks (TADa for YouTube)\n\n";
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
        showToast(isEn ? "All bookmarks copied as Markdown!" : "Đã sao chép tất cả mốc ra Markdown!");
      }).catch(() => {
        showToast(isEn ? "Unable to copy to clipboard!" : "Không thể chép vào clipboard!");
      });
    });
  }

  if (clearAllBtn) {
    clearAllBtn.addEventListener("click", async () => {
      const isEn = currentSettings.language === "en";
      if (confirm(isEn ? "Are you sure you want to delete ALL saved bookmarks across all videos?" : "Bạn có chắc chắn muốn xóa TẤT CẢ bookmark đã lưu của mọi video không?")) {
        await chrome.storage.local.set({ [BOOKMARKS_STORAGE_KEY]: {} });
        renderBookmarksModalList();
        loadBookmarksSummary();
        showToast(isEn ? "Bookmarks library cleared!" : "Đã xóa sạch thư viện bookmark!");
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

  // --- Share & Copy CWS Link ---
  const copyCwsBtn = document.getElementById("btn-copy-cws-link");
  const shareCwsBtn = document.getElementById("btn-share-cws");
  const CWS_URL = "https://chromewebstore.google.com/detail/ddhelhlhdbagdcmlopiplhkbddgfjnmk?utm_source=item-share-cb";

  if (copyCwsBtn) {
    copyCwsBtn.addEventListener("click", async () => {
      const isEn = currentSettings.language === "en";
      try {
        await navigator.clipboard.writeText(CWS_URL);
        showToast(isEn ? "Extension link copied to clipboard! 📋🎉" : "Đã sao chép link tiện ích vào clipboard! 📋🎉");
        copyCwsBtn.classList.add("copied");
        const span = copyCwsBtn.querySelector("span");
        if (span) span.textContent = isEn ? "Copied! ✓" : "Đã chép! ✓";
        setTimeout(() => {
          copyCwsBtn.classList.remove("copied");
          if (span) span.textContent = isEn ? "Copy link" : "Sao chép link";
        }, 2000);
      } catch (err) {
        showToast(isEn ? "Unable to copy to clipboard!" : "Không thể chép vào clipboard!");
      }
    });
  }

  if (shareCwsBtn) {
    shareCwsBtn.addEventListener("click", async () => {
      const isEn = currentSettings.language === "en";
      const shareTitle = "TADa for YouTube";
      const shareText = isEn
        ? "TADa — Smart YouTube customizer, ad blocker, 500% volume booster, cinema mode & handy video tools!"
        : "TADa — Tiện ích chặn quảng cáo YouTube, ẩn Shorts, tăng âm lượng 500% và nhiều công cụ hữu ích!";

      if (navigator.share) {
        try {
          await navigator.share({
            title: shareTitle,
            text: shareText,
            url: CWS_URL
          });
        } catch (err) {
          if (err.name !== "AbortError") {
            navigator.clipboard.writeText(CWS_URL).then(() => {
              showToast(isEn ? "Extension link copied to clipboard! 📋🎉" : "Đã sao chép link tiện ích vào clipboard! 📋🎉");
            });
          }
        }
      } else {
        navigator.clipboard.writeText(CWS_URL).then(() => {
          showToast(isEn ? "Extension link copied to clipboard! 📋🎉" : "Đã sao chép link tiện ích vào clipboard! 📋🎉");
        });
      }
    });
  }

  // --- Donate & Copy MB Bank STK ---
  const STK_NUMBER = "9704 2292 0047 9524 109";
  const copyStkBtn = document.getElementById("btn-copy-stk");
  const pgDonateTrigger = document.getElementById("pg-donate-trigger");

  async function copyStkAction() {
    const isEn = currentSettings.language === "en";
    try {
      await navigator.clipboard.writeText(STK_NUMBER);
      showToast(isEn ? "Copied MB Bank account: 9704 2292 0047 9524 109! Thank you so much! ❤️" : "Đã sao chép STK MB Bank: 9704 2292 0047 9524 109! Cảm ơn bạn rất nhiều! ❤️");
      if (copyStkBtn) {
        copyStkBtn.classList.add("copied");
        const span = copyStkBtn.querySelector("span");
        if (span) span.textContent = isEn ? "Copied! ✓" : "Đã chép! ✓";
        setTimeout(() => {
          copyStkBtn.classList.remove("copied");
          if (span) span.textContent = isEn ? "Copy" : "Sao chép";
        }, 2200);
      }
    } catch (err) {
      showToast(isEn ? "Unable to copy account number to clipboard!" : "Không thể chép STK vào clipboard!");
    }
  }

  if (copyStkBtn) copyStkBtn.addEventListener("click", copyStkAction);
  if (pgDonateTrigger) pgDonateTrigger.addEventListener("click", copyStkAction);

  // --- Toggle VietQR MB Bank ---
  const toggleQrBtn = document.getElementById("btn-toggle-donate-qr");
  const qrBox = document.getElementById("donate-qr-box");
  if (toggleQrBtn && qrBox) {
    toggleQrBtn.addEventListener("click", () => {
      const isShowing = qrBox.classList.toggle("show");
      const isEn = currentSettings.language === "en";
      toggleQrBtn.textContent = isShowing
        ? (isEn ? "Hide QR Code ▲" : "Ẩn mã QR ▲")
        : (isEn ? "Show MB Bank VietQR ▼" : "Hiện mã QR MB Bank ▼");
    });
  }

  // --- Toolbar Arrangement Controls ---
  const selectAbLooperPos = document.getElementById("select-abLooperPosition");
  if (selectAbLooperPos) {
    selectAbLooperPos.addEventListener("change", async (e) => {
      currentSettings.abLooperPosition = e.target.value;
      await saveSettings();
      renderToolbarManager();
      const isEn = currentSettings.language === "en";
      showToast(isEn
        ? (e.target.value === "left" ? "A-B Looper button moved next to timestamps (left)" : "A-B Looper button moved to player toolbar (right)")
        : (e.target.value === "left" ? "Nút A-B chuyển về cạnh mốc thời gian (bên trái)" : "Nút A-B chuyển vào thanh công cụ (bên phải)"));
    });
  }

  const selectToolbarAnchor = document.getElementById("select-toolbarAnchor");
  if (selectToolbarAnchor) {
    selectToolbarAnchor.addEventListener("change", async (e) => {
      currentSettings.toolbarAnchor = e.target.value;
      await saveSettings();
      renderToolbarManager();
      const isEn = currentSettings.language === "en";
      showToast(isEn
        ? (e.target.value === "afterSettings" ? "TADa buttons placed after Settings gear icon" : "TADa buttons placed before Settings gear icon")
        : (e.target.value === "afterSettings" ? "Cụm TADa hiển thị sau nút Cài đặt" : "Cụm TADa hiển thị trước nút Cài đặt"));
    });
  }

  const btnResetToolbarOrder = document.getElementById("btn-reset-toolbar-order");
  if (btnResetToolbarOrder) {
    btnResetToolbarOrder.addEventListener("click", async () => {
      currentSettings.toolbarOrder = [...DEFAULT_TOOLBAR_ORDER];
      currentSettings.toolbarHidden = {};
      currentSettings.abLooperPosition = "left";
      currentSettings.toolbarAnchor = "beforeSettings";
      await saveSettings();
      renderToolbarManager();
      showToast(currentSettings.language === "en" ? "Toolbar layout and order reset to default!" : "Đã khôi phục thứ tự và hiển thị mặc định của thanh công cụ!");
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadSettings();
  initEventListeners();
  initAboutModal();
});
