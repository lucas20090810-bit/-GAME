import React, { useState, useEffect, useCallback } from 'react';
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import MainMenu from './components/MainMenu';
import Game2048 from './games/2048/Game2048';
import PingPong from './games/PingPong/PingPong';
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

// OTA Live Update (only works on native platforms)
let LiveUpdate: any = null;

const initLiveUpdate = async () => {
  if (!Capacitor.isNativePlatform()) return;

  try {
    const module = await import('@capawesome/capacitor-live-update');
    LiveUpdate = module.LiveUpdate;
    console.log('[OTA] LiveUpdate plugin loaded');
    const result = await LiveUpdate.ready();

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

    console.log('[OTA] ready() called successfully:', result);
  } catch (e) {
    console.error('[OTA] LiveUpdate init failed:', e);
  }
};

// Start loading immediately
initLiveUpdate();

type Screen = 'login' | 'menu' | '2048' | 'pingpong' | 'profile' | 'shop' | 'mail' | 'admin';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activeScreen, setActiveScreen] = useState<Screen>('login');
  const [user, setUser] = useState<any>(null);
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
      checkAndUpdate().catch(() => { });

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