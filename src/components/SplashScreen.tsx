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
        <div className="fixed inset-0 z-[100] flex bg-black overflow-hidden">
            {/* Chinese New Year Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-red-800 to-amber-900" />
                {/* Lanterns */}
                <div className="absolute top-0 left-[5%] w-20 h-28 bg-gradient-to-b from-red-500 to-red-700 rounded-full opacity-50 blur-md animate-pulse" />
                <div className="absolute top-0 left-[25%] w-16 h-24 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full opacity-40 blur-md animate-pulse" style={{ animationDelay: '0.3s' }} />
                <div className="absolute top-0 right-[25%] w-18 h-26 bg-gradient-to-b from-red-600 to-red-800 rounded-full opacity-45 blur-md animate-pulse" style={{ animationDelay: '0.6s' }} />
                <div className="absolute top-0 right-[5%] w-14 h-20 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full opacity-35 blur-md animate-pulse" style={{ animationDelay: '0.9s' }} />
                {/* Gold particles */}
                <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle, #fcd34d 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
            </div>

            {/* Left Side - Logo & Title */}
            <div className="relative flex-1 flex items-center justify-center z-10 px-8">
                <div className="flex flex-col items-center">
                    {/* New Year Decoration */}
                    <div className="text-6xl mb-4">🧧</div>

                    <div className="relative mb-6">
                        <h2 className="text-5xl font-black italic tracking-tight leading-none text-amber-400 drop-shadow-[0_4px_20px_rgba(251,191,36,0.5)]">
                            新年快樂
                        </h2>
                        <div className="absolute -bottom-2 right-0 px-3 py-1 bg-red-600 text-white font-black text-sm italic skew-x-[-10deg] border-2 border-amber-400 shadow-xl">
                            2025
                        </div>
                    </div>

                    <div className="flex flex-col items-center mt-4">
                        <span className="text-3xl font-black text-white tracking-[0.3em] uppercase drop-shadow-lg">丞丞GAME</span>
                        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mt-3 rounded-full" />
                    </div>
                </div>
            </div>

            {/* Right Side - Progress & Start Button */}
            <div className="relative flex-1 flex items-center justify-center z-10 px-8">
                <div className="w-full max-w-md space-y-6">
                    {isButtonShown ? (
                        <button
                            onClick={onStart}
                            className="w-full py-5 bg-gradient-to-r from-red-600 to-amber-500 text-white font-black text-2xl italic tracking-wider rounded-2xl shadow-[0_0_40px_rgba(239,68,68,0.5)] border-2 border-amber-400/50 select-none active:scale-95 transition-transform hover:shadow-[0_0_60px_rgba(239,68,68,0.7)]"
                        >
                            🎮 點擊開始 🎮
                        </button>
                    ) : (
                        <div className="w-full">
                            <div className="w-full flex justify-between items-end mb-3 px-1">
                                <div className="flex flex-col items-start">
                                    <span className="text-[10px] font-black text-amber-400 tracking-widest uppercase mb-1">系統: 初始化中</span>
                                    <span className="text-sm font-black italic text-white/90 drop-shadow-md tracking-tight">{statusText}</span>
                                </div>
                                <span className="text-xl font-black text-amber-400 italic drop-shadow-lg">{Math.floor(progress)}%</span>
                            </div>

                            <div className="w-full h-4 bg-black/60 rounded-full border border-amber-500/30 overflow-hidden relative p-[2px] shadow-2xl">
                                <div
                                    className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600 relative rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                >
                                    <div className="absolute top-0 right-0 w-6 h-full bg-white blur-lg opacity-50 animate-pulse" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Version Info */}
                    <div className="flex justify-center gap-4 opacity-50 uppercase font-bold text-[9px] tracking-widest text-amber-200/80">
                        <p>版本 {CONFIG.APP_VERSION}</p>
                        <div className="w-[1px] h-3 bg-amber-500/30" />
                        <p>資源 {CONFIG.RESOURCE_VERSION}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
