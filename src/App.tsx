import React, { useState, useEffect, useCallback } from 'react';
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import MainMenu from './components/MainMenu';
import Game2048 from './games/2048/Game2048';
import PingPong from './games/PingPong/PingPong';
import PingPong3D from './games/PingPong3D/PingPong3D';
import ReactionGame from './games/ReactionGame/ReactionGame';
import JumpJump from './games/JumpJump/JumpJump';
import ProfileScreen from './components/ProfileScreen';
import ShopScreen from './components/ShopScreen';
import Mailbox from './components/Mailbox';
import AdminPortal from './components/AdminPortal';

import { api } from './api';
import { checkAndUpdate } from './utils/updateManager';
import { CONFIG } from './config';
import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';
import { NavigationBar } from '@capgo/capacitor-navigation-bar';

// OTA Update (only works on native platforms)
let CapacitorUpdater: any = null;

const initUpdater = async () => {
  if (!Capacitor.isNativePlatform()) return;

  try {
    const module = await import('@capgo/capacitor-updater');
    CapacitorUpdater = module.CapacitorUpdater;
    console.log('[OTA] CapacitorUpdater plugin loaded');

    // Notify app is ready
    await CapacitorUpdater.notifyAppReady();

    // Force Immersive Mode
    try {
      await StatusBar.hide();
      // @ts-ignore
      if (typeof NavigationBar.setAutoHide === 'function') {
        // @ts-ignore
        await NavigationBar.setAutoHide({ autoHide: true });
      }
      // @ts-ignore
      if (typeof NavigationBar.hide === 'function') {
        // @ts-ignore
        await NavigationBar.hide();
      }
    } catch (err) {
      console.error("Immersive mode error:", err);
    }

    console.log('[OTA] CapacitorUpdater initialized');
  } catch (e) {
    console.error('[OTA] CapacitorUpdater init failed:', e);
  }
};

// Start loading immediately
initUpdater();

type Screen = 'login' | 'menu' | '2048' | 'pingpong' | 'pingpong3d' | 'reaction' | 'jumpjump' | 'profile' | 'shop' | 'mail' | 'admin';

import UpdateModal from './components/UpdateModal';
import { VersionInfo, checkAndUpdate, setAppliedOtaVersion } from './utils/updateManager';

// ... existing imports ...

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeScreen, setActiveScreen] = useState<Screen>('menu');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<VersionInfo | null>(null);

  // Handle Update Action
  const handleUpdate = async () => {
    if (!updateInfo || !CapacitorUpdater) return;
    try {
      setShowUpdateModal(false); // Hide modal to show download progress or just background it? 
      // User wants "flashy", maybe keep modal and show progress?
      // For now, let's revert to alert for success, but use modal for trigger.
      // Or better: Download logic here.

      // Show a loading toast or keep modal? 
      // Let's just do standard background download with alert on completion for now to ensure stability.

      const bundle = await CapacitorUpdater.download({
        url: updateInfo.downloadUrl,
        version: updateInfo.version,
      });

      await CapacitorUpdater.set({ id: bundle.id });
      setAppliedOtaVersion(updateInfo.ota_version);

      alert('🎉 更新成功！\n\n新版本已準備就緒，下次啟動時生效。');
    } catch (err: any) {
      alert('更新失敗: ' + (err.message || 'Unknown error'));
    }
  };

  const [user, setUser] = useState<any>({
    const [activeScreen, setActiveScreen] = useState<Screen>('menu'); // 直接進主選單
    const [user, setUser] = useState<any>({
      id: 'test_user_123',
      name: '測試玩家',
      email: 'test@example.com',
      avatar: '',
      coins: 9999,
      inventory: [],
      mails: []
    }); // 預設測試用戶
    const [shopItems, setShopItems] = useState([]);
    const [news, setNews] = useState([]);
    const [allPopups, setAllPopups] = useState<any[]>([]);

    // Prevent unused var warning for now by logging
    useEffect(() => {
  if (CONFIG) console.log("Config loaded");
}, []);

const init = useCallback(async () => {
  console.log(">>> [APP] INIT START");

  // Check if user is already logged in (Persistent Login)
  const savedUser = localStorage.getItem('user_profile');
  if (savedUser) {
    try {
      setUser(JSON.parse(savedUser));
      // Don't auto-switch screen here, let the loading logic decide or do it after
    } catch (e) { }
  }

  const globalTimeout = setTimeout(() => {
    console.log(">>> [APP] TIMEOUT REACHED");
    setLoading(false);
  }, 4000);

  try {
    // Check for OTA updates
    const info = await checkAndUpdate();
    if (info && CapacitorUpdater) {
      setUpdateInfo(info);
      setShowUpdateModal(true);
    } else {
      // Only log if no update
      console.log('[OTA] No updates found');
    }

    const [shop, newsData, popups] = await Promise.all([
      api.getShop().catch(() => []),
      api.getNews().catch(() => []),
      api.getPopups().catch(() => [])
    ]);

    setShopItems(shop || []);
    setNews(newsData || []);
    if (popups) setAllPopups(popups);
  } catch (e) {
    console.error("Init error", e);
  } finally {
    clearTimeout(globalTimeout);
    setLoading(false);
    console.log(">>> [APP] INIT FINISHED");
  }
}, []);

useEffect(() => {
  init();

  // Enforce immersive mode periodically just in case
  const interval = setInterval(() => {
    if (Capacitor.isNativePlatform()) {
      StatusBar.hide().catch(() => { });
      // @ts-ignore
      if (NavigationBar && NavigationBar.hide) NavigationBar.hide().catch(() => { });
    }
  }, 5000);

  return () => clearInterval(interval);
}, [init]);

const handleLoginSuccess = (userData: any) => {
  setUser(userData);
  localStorage.setItem('user_profile', JSON.stringify(userData));
  setActiveScreen('menu');
};

if (loading) {
  return (
    <SplashScreen
      isLoading={loading}
      showButton={!loading}
      onStart={() => {
        // If logged in via persistence, go to menu
        // Otherwise go to login
        const savedUser = localStorage.getItem('user_profile');
        if (savedUser && user) {
          setActiveScreen('menu');
        } else {
          setActiveScreen('login');
        }
      }}
    />
  );
}

// Determine active view
let content;
switch (activeScreen) {
  case 'login':
    content = <LoginScreen onLoginSuccess={handleLoginSuccess} onError={(err) => console.error('[Login Error]:', err)} />;
    break;
  case '2048':
    content = <Game2048 onBack={() => setActiveScreen('menu')} />;
    break;
  case 'pingpong':
    content = <PingPong onBack={() => setActiveScreen('menu')} />;
    break;
  case 'pingpong3d':
    content = <PingPong3D onBack={() => setActiveScreen('menu')} />;
    break;
  case 'reaction':
    content = <ReactionGame onBack={() => setActiveScreen('menu')} />;
    break;
  case 'jumpjump':
    content = <JumpJump onBack={() => setActiveScreen('menu')} />;
    break;
  case 'profile':
    content = <ProfileScreen
      userData={user}
      onUpdate={(updated) => {
        if (updated.openAdmin) {
          setActiveScreen('admin');
        } else {
          const newUser = { ...user, ...updated };
          setUser(newUser);
          localStorage.setItem('user_profile', JSON.stringify(newUser));
        }
      }}
      onBack={() => setActiveScreen('menu')}
    />;
    break;
  case 'shop':
    content = <ShopScreen coins={user?.coins || 0} items={shopItems} onBuy={() => { }} onBack={() => setActiveScreen('menu')} />;
    break;
  case 'mail':
    content = <Mailbox mails={user?.mails || []} onBack={() => setActiveScreen('menu')} />;
    break;
  case 'admin':
    content = <AdminPortal onBack={() => setActiveScreen('menu')} />;
    break;
  case 'menu':
  default:
    content = (
      <MainMenu
        userData={user}
        news={news}
        onSelectGame={(id) => {
          if (id === '2048') setActiveScreen('2048');
          else if (id === 'pingpong') setActiveScreen('pingpong');
          else if (id === 'pingpong3d') setActiveScreen('pingpong3d');
          else if (id === 'reaction') setActiveScreen('reaction');
          else if (id === 'jumpjump') setActiveScreen('jumpjump');
          else if (id === 'shop') setActiveScreen('shop');
          else if (id === 'mail') setActiveScreen('mail');
          else if (id === 'profile') setActiveScreen('profile');
          else if (id === 'admin') setActiveScreen('admin');
        }}
      />
    );
    break;
}

return (
  <>
    {content}
    {/* Global Popups (Only show in menu) */}
    {activeScreen === 'menu' && allPopups.length > 0 && (
      // Simple logic to show first popup if unseen
      null
    )}
  </>
);
};

export default App;