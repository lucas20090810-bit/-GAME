/**
 * 遊戲中央設定檔
 * 您可以在這裡快速修改版本號與基礎設定
 */
export const CONFIG = {
    // 顯示在載入畫面與選單的版本號
    APP_VERSION: "測試1.0.5",
    RESOURCE_VERSION: "2251.0205.A",
    ENGINE_VERSION: "v1.5.0",

    // 是否強制開啟訪客模式 (開發/沒網路時建議開啟)
    FORCE_GUEST_MODE: true,

    // 預設訪客資料
    DEFAULT_USER: {
        id: "guest_123",
        name: "戰地指揮官",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky",
        coins: 1000,
        inventory: [],
        mails: [
            { id: 1, title: "歡迎來到最後的戰場", content: "指揮官，我們準備好了！", date: "2024-02-05" }
        ]
    }
};
