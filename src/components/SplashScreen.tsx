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
        "正在同步新年活動...",
        "準備進入遊戲大廳...",
        "正在獲取紅包獎勵...",
        "正在建立加密連線..."
    ];

    useEffect(() => {
        if (Capacitor.isNativePlatform()) {
            StatusBar.hide().catch(() => { });
            try { (NavigationBar as any).hide().catch(() => { }); } catch (e) { }
        }

        const safetyTimer = setTimeout(() => {
            if (isLoading || !showButton) {
                setForceReveal(true);
            }
        }, 6000);

        if (!isLoading) {
            setProgress(100);
            clearTimeout(safetyTimer);
            return;
        }

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                const inc = Math.random() * 2.5;
                return Math.min(100, prev + inc);
            });
        }, 60);

        const textInterval = setInterval(() => {
            setStatusText(statusMessages[Math.floor(Math.random() * statusMessages.length)]);
        }, 1200);

        return () => {
            clearTimeout(safetyTimer);
            clearInterval(interval);
            clearInterval(textInterval);
        };
    }, [isLoading, showButton]);

    const isButtonShown = showButton || forceReveal;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black overflow-hidden">
            {/* Full Screen Background Image - COD Style */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=1920&q=80"
                    className="w-full h-full object-cover"
                    alt="bg"
                    style={{ filter: 'brightness(0.7) saturate(1.2)' }}
                />
                {/* Red overlay for CNY theme */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-900/60 via-transparent to-red-900/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
            </div>

            {/* Main Content - Flex to position elements */}
            <div className="relative z-10 flex-1 flex">
                {/* Left Side - Logo and Title */}
                <div className="flex-1 flex flex-col justify-center items-start px-12">
                    {/* CNY Icon */}
                    <div className="text-6xl mb-4">🧧</div>

                    {/* Main Title */}
                    <h1 className="text-5xl font-black italic text-amber-400 drop-shadow-[0_4px_20px_rgba(251,191,36,0.6)] mb-2">
                        新年快樂
                    </h1>

                    {/* Year Badge */}
                    <div className="px-4 py-1.5 bg-red-600 text-white font-black text-lg italic rounded border-2 border-amber-400 shadow-xl mb-6">
                        2025
                    </div>

                    {/* Brand Name */}
                    <div className="flex items-center gap-3">
                        <span className="text-3xl font-black text-white tracking-[0.4em] uppercase drop-shadow-lg">丞丞GAME</span>
                    </div>
                </div>

                {/* Right Side - Start Button (when ready) */}
                <div className="flex-1 flex flex-col justify-center items-center px-12">
                    {isButtonShown && (
                        <button
                            onClick={onStart}
                            className="w-80 py-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-2xl italic tracking-wider rounded-xl shadow-[0_0_40px_rgba(249,115,22,0.6)] border-2 border-white/30 select-none active:scale-95 transition-transform hover:shadow-[0_0_60px_rgba(249,115,22,0.8)] flex items-center justify-center gap-3"
                        >
                            🎮 點擊開始 🎮
                        </button>
                    )}
                </div>
            </div>

            {/* Bottom Bar - Progress (Left) & Version Info (Right) - COD Style */}
            <div className="relative z-10 px-8 pb-6 flex items-end justify-between">
                {/* Left: Progress Bar */}
                <div className="flex flex-col items-start w-64">
                    {!isButtonShown && (
                        <>
                            <span className="text-xs font-bold text-white/80 mb-2 tracking-wide">{statusText}</span>
                            <div className="w-full h-3 bg-black/60 rounded-sm overflow-hidden border border-white/20">
                                <div
                                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <span className="text-lg font-black text-amber-400 mt-1">{Math.floor(progress)}%</span>
                        </>
                    )}
                </div>

                {/* Right: Version Info */}
                <div className="flex flex-col items-end text-right">
                    <span className="text-xs font-bold text-white/60 tracking-wider">版本 {CONFIG.APP_VERSION}</span>
                    <span className="text-xs font-bold text-white/40 tracking-wider">資源 {CONFIG.RESOURCE_VERSION}</span>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
