import React, { useState, useEffect, useCallback } from 'react';
import SplashScreen from './components/SplashScreen';
import MainMenu from './components/MainMenu';
import Game2048 from './games/2048/Game2048';
import PingPong from './games/PingPong/PingPong';
import ProfileScreen from './components/ProfileScreen';
import ShopScreen from './components/ShopScreen';
import Mailbox from './components/Mailbox';
import AdminPortal from './components/AdminPortal';

import { api } from './api';
import { checkAndUpdate, type VersionInfo } from './utils/updateManager';
import { CONFIG } from './config';
import { Capacitor } from '@capacitor/core';

// OTA Live Update (only works on native platforms)
let LiveUpdate: any = null;
const loadLiveUpdate = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      const module = await import('@capawesome/capacitor-live-update');
      LiveUpdate = module.LiveUpdate;
      console.log('[OTA] LiveUpdate initialized');
    } catch (e) { console.log('[OTA] LiveUpdate not available'); }
  }
};
loadLiveUpdate();

type Screen = 'menu' | '2048' | 'pingpong' | 'profile' | 'shop' | 'mail' | 'admin';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [readyToStart, setReadyToStart] = useState(false);
  const [activeScreen, setActiveScreen] = useState<Screen>('menu');
  const [user, setUser] = useState<any>(CONFIG.DEFAULT_USER); // Initialize with default immediately
  const [shopItems, setShopItems] = useState([]);
  const [news, setNews] = useState([]);
  const [updateInfo, setUpdateInfo] = useState<VersionInfo | null>(null);
  const [currentPopup, setCurrentPopup] = useState<any>(null);

  const init = useCallback(async () => {
    console.log(">>> [APP] INIT START");

    const globalTimeout = setTimeout(() => {
      console.log(">>> [APP] TIMEOUT REACHED");
      setLoading(false);
    }, 4000);

    try {
      checkAndUpdate().then(up => { if (up) setUpdateInfo(up); }).catch(() => { });

      const [userData, shop, newsData, popups] = await Promise.all([
        api.getUser("123").catch(() => CONFIG.DEFAULT_USER),
        api.getShop().catch(() => []),
        api.getNews().catch(() => []),
        api.getPopups().catch(() => [])
      ]);

      setUser(userData || CONFIG.DEFAULT_USER);
      setShopItems(shop || []);
      setNews(newsData || []);

      // Show first popup if exists and not dismissed
      if (popups && popups.length > 0) {
        const dismissedPopups = JSON.parse(localStorage.getItem('dismissed-popups') || '[]');
        const unshownPopup = popups.find((p: any) => !dismissedPopups.includes(p.id));
        if (unshownPopup && readyToStart) {
          setCurrentPopup(unshownPopup);
        }
      }
    } catch (e) {
      console.error("Init error", e);
    } finally {
      clearTimeout(globalTimeout);
      setLoading(false);
      console.log(">>> [APP] INIT FINISHED");
    }
  }, []);

  // OTA Update Check (Native Platform Only)
  const checkOTAUpdate = useCallback(async () => {
    if (!LiveUpdate || !Capacitor.isNativePlatform()) return;

    try {
      console.log('[OTA] Checking for updates...');
      const result = await LiveUpdate.sync();

      if (result.nextBundleId) {
        console.log('[OTA] New bundle available:', result.nextBundleId);
        // Download and install the new bundle
        await LiveUpdate.reload();
      } else {
        console.log('[OTA] App is up to date');
      }
    } catch (error) {
      console.error('[OTA] Update check failed:', error);
    }
  }, []);

  useEffect(() => {
    init();
    checkOTAUpdate(); // Check for OTA updates on startup

    // Periodic refresh every 30 seconds to sync news/mails
    const refreshInterval = setInterval(() => {
      console.log(">>> [APP] PERIODIC REFRESH");
      init();
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, [init, checkOTAUpdate]);

  const handleStart = () => {
    console.log(">>> [APP] START CLICKED");
    setReadyToStart(true);
  };

  const handleUpdateProfile = async (newData: any) => {
    try {
      const updated = await api.updateUser(user.id, newData.name, newData.avatar);
      setUser(updated);
      setActiveScreen('menu');
    } catch (e) { alert("更新失敗"); }
  };

  const handleBuy = async (userId: string, itemId: string) => {
    try {
      const result = await api.buyItem(userId, itemId);
      if (result.success) setUser(result.user);
      else alert(result.error || "購買失敗");
    } catch (e) { alert("網路連線錯誤"); }
  };

  const handlePerformUpdate = async () => {
    if (!updateInfo) return;

    const isNative = Capacitor.isNativePlatform();
    console.log('[OTA] Attempting update. Native:', isNative, 'LiveUpdate Plugged:', !!LiveUpdate);

    if (isNative) {
      if (!LiveUpdate) {
        alert("⚠️ 偵測到您在行動裝置，但「熱更新插件」未啟動。\n\n這代表您目前的 APK 過舊。請重新下載最新 APK 才能享有此功能。");
        return;
      }

      try {
        const bid = updateInfo.ota_version || `v${updateInfo.version}_${Date.now()}`;
        console.log('[OTA] Downloading bundle ID:', bid, 'from', updateInfo.downloadUrl);

        await LiveUpdate.downloadBundle({
          url: updateInfo.downloadUrl,
          bundleId: bid
        });

        await LiveUpdate.setBundle({ bundleId: bid });

        alert("✅ 下載成功！即將重啟遊戲套用修正。");
        await LiveUpdate.reload();
        return;
      } catch (e: any) {
        console.error('[OTA] Error during process:', e);
        alert(`❌ 更新失敗：${e.message || '連線逾時或空間不足'}`);
        return;
      }
    }

    const confirmWeb = confirm("您正在使用瀏覽器，是否要手動下載更新包？");
    if (confirmWeb && updateInfo.downloadUrl) {
      window.open(updateInfo.downloadUrl, '_blank');
    }
  };

  // Simple conditional rendering - NO AnimatePresence at top level
  if (loading || !readyToStart) {
    return (
      <SplashScreen
        isLoading={loading}
        onStart={handleStart}
        showButton={!loading && !readyToStart}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-[#020617] text-white overflow-hidden flex flex-col font-sans">
      <main className="flex-1 w-full max-w-lg mx-auto relative flex flex-col pt-safe-top pb-safe-bottom px-4">
        {activeScreen === 'menu' && (
          <MainMenu
            userData={user}
            news={news}
            onSelectGame={(id) => setActiveScreen(id as any)}
          />
        )}
        {activeScreen === '2048' && <Game2048 onBack={() => setActiveScreen('menu')} />}
        {activeScreen === 'pingpong' && <PingPong onBack={() => setActiveScreen('menu')} />}
        {activeScreen === 'profile' && <ProfileScreen userData={user} onUpdate={handleUpdateProfile} onBack={() => setActiveScreen('menu')} />}
        {activeScreen === 'shop' && <ShopScreen coins={user.coins} items={shopItems} onBuy={(id) => handleBuy(user.id, id)} onBack={() => setActiveScreen('menu')} />}
        {activeScreen === 'mail' && <Mailbox mails={user.mails} onBack={() => setActiveScreen('menu')} />}
        {activeScreen === 'admin' && <AdminPortal onBack={() => setActiveScreen('menu')} />}

        {/* Secret Admin Entry */}
        {!['2048', 'admin', 'pingpong'].includes(activeScreen) && (
          <div className="fixed bottom-0 right-0 w-16 h-16 opacity-0" onDoubleClick={() => setActiveScreen('admin')} />
        )}

        {/* Update Popup */}
        {updateInfo && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl border border-white/10 w-full max-w-sm shadow-2xl">
              <h3 className="text-2xl font-black mb-4 text-primary text-center">發現新更新</h3>
              <p className="text-lg text-center mb-6 font-bold text-white">{updateInfo.version}</p>
              <button
                onClick={handlePerformUpdate}
                className="w-full py-4 bg-primary text-black font-black rounded-xl hover:scale-105 transition-transform shadow-lg mb-3"
              >
                立即更新
              </button>
              <button
                onClick={() => setUpdateInfo(null)}
                className="w-full py-3 text-slate-400 text-center hover:text-white transition-colors"
              >
                稍後
              </button>
            </div>
          </div>
        )}

        {/* Announcement Popup */}
        {currentPopup && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl border border-primary/20 w-full max-w-md relative shadow-2xl animate-fade-in">
              <button
                onClick={() => {
                  const dismissed = JSON.parse(localStorage.getItem('dismissed-popups') || '[]');
                  dismissed.push(currentPopup.id);
                  localStorage.setItem('dismissed-popups', JSON.stringify(dismissed));
                  setCurrentPopup(null);
                }}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors active:scale-90"
              >
                ✕
              </button>
              <h3 className="text-2xl font-black italic mb-4 text-primary">{currentPopup.title}</h3>
              <p className="text-base text-slate-300 leading-relaxed whitespace-pre-wrap">{currentPopup.message}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
