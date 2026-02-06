import React, { useState, useEffect } from 'react';
import { StatusBar } from '@capacitor/status-bar';
import { NavigationBar } from '@capgo/capacitor-navigation-bar';
import { Capacitor } from '@capacitor/core';
import { CONFIG } from '../config';

interface SplashScreenProps {
    isLoading: boolean;
    showButton: boolean;
    onStart: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ isLoading, showButton, onStart }) => {
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState("正在載入遊戲資源...");
    const [forceReveal, setForceReveal] = useState(false);

    const statusMessages = [
        "正在載入遊戲資源...",
        "正在建立連線...",
        "準備進入遊戲...",
        "正在同步資料...",
    ];

    useEffect(() => {
        if (Capacitor.isNativePlatform()) {
            StatusBar.hide().catch(() => { });
            try { (NavigationBar as any).hide().catch(() => { }); } catch (e) { }
        }

        const safetyTimer = setTimeout(() => {
            if (isLoading || !showButton) setForceReveal(true);
        }, 6000);

        if (!isLoading) {
            setProgress(100);
            clearTimeout(safetyTimer);
            return;
        }

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) { clearInterval(interval); return 100; }
                return Math.min(100, prev + Math.random() * 2.5);
            });
        }, 60);

        const textInterval = setInterval(() => {
            setStatusText(statusMessages[Math.floor(Math.random() * statusMessages.length)]);
        }, 1200);

        return () => { clearTimeout(safetyTimer); clearInterval(interval); clearInterval(textInterval); };
    }, [isLoading, showButton]);

    const isButtonShown = showButton || forceReveal;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black overflow-hidden">
            {/* Full Screen Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80"
                    className="w-full h-full object-cover"
                    alt="bg"
                    style={{ filter: 'brightness(0.5) saturate(1.3)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />
            </div>

            {/* Top Left: Game Title */}
            <div className="absolute top-4 left-4 z-20">
                <h1 className="text-lg font-black text-white/90 tracking-wide">🏃 火柴人大逃亡</h1>
            </div>

            {/* Center: Start Button (when ready) */}
            <div className="flex-1 flex flex-col items-center justify-center z-10">
                {isButtonShown ? (
                    <button
                        onClick={onStart}
                        className="px-16 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-xl tracking-wider rounded-xl shadow-[0_0_40px_rgba(249,115,22,0.6)] border-2 border-white/30 select-none active:scale-95 transition-transform hover:shadow-[0_0_60px_rgba(249,115,22,0.8)]"
                    >
                        🎮 點擊開始
                    </button>
                ) : (
                    <div className="w-64 flex flex-col items-center">
                        <span className="text-xs font-bold text-white/70 mb-2">{statusText}</span>
                        <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/20">
                            <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                        </div>
                        <span className="text-sm font-black text-amber-400 mt-1">{Math.floor(progress)}%</span>
                    </div>
                )}
            </div>

            {/* Bottom Left: Brand */}
            <div className="absolute bottom-4 left-4 z-20">
                <span className="text-sm font-bold text-white/50">丞丞GAME</span>
            </div>

            {/* Bottom Right: Version */}
            <div className="absolute bottom-4 right-4 z-20 text-right">
                <span className="text-[10px] font-bold text-white/40">v{CONFIG.APP_VERSION}</span>
            </div>
        </div>
    );
};

export default SplashScreen;
