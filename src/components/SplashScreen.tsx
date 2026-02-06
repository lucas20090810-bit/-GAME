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
        "正在同步基地數據...",
        "準備進入戰場...",
        "正在獲取玩家進度...",
        "正在建立加密連線..."
    ];

    useEffect(() => {
        if (Capacitor.isNativePlatform()) {
            StatusBar.hide().catch(() => { });
            try { (NavigationBar as any).hide().catch(() => { }); } catch (e) { }
        }

        // Safety: force-reveal after 6s if still loading
        const safetyTimer = setTimeout(() => {
            if (isLoading || !showButton) {
                console.log(">>> Safety force-reveal triggered");
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

    // NO motion.div wrapper - direct render to prevent exit animation hang
    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black overflow-hidden">
            {/* Background Art */}
            <div className="absolute inset-0 z-0 scale-105">
                <img
                    src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000"
                    className="w-full h-full object-cover opacity-60 blur-[1px]"
                    alt="game-bg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-90" />
            </div>

            {/* Top Version Info */}
            <div className="absolute pt-safe-top px-6 w-full flex justify-end items-start z-10 mt-6 pointer-events-none">
                <div className="text-right opacity-80">
                    <p className="text-[10px] font-black text-white tracking-tighter">版本: {CONFIG.APP_VERSION}</p>
                    <p className="text-[10px] font-black text-slate-400 tracking-tighter mt-1 leading-none uppercase">資源: {CONFIG.RESOURCE_VERSION}</p>
                </div>
            </div>

            {/* Center Area (Logo + Centered Status) */}
            <div className="relative flex-1 flex flex-col items-center justify-center z-10 px-8 text-center mt-[-5vh]">
                <div className="flex flex-col items-center w-full max-w-sm">
                    <div className="relative mb-12 scale-110">
                        <h2 className="title-3d text-6xl italic tracking-tighter leading-[0.8] mb-2 scale-x-110 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">火柴人</h2>
                        <h2 className="title-3d text-7xl italic tracking-tighter leading-[0.8] text-amber-500 scale-x-110 drop-shadow-[0_10px_30px_rgba(245,158,11,0.3)]">大逃亡</h2>

                        <div className="absolute -bottom-4 right-0 px-5 py-2 bg-amber-600 text-white font-black text-xl italic skew-x-[-15deg] border-2 border-white shadow-xl">
                            ESCAPE
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col items-center mb-20">
                        <span className="text-2xl font-black text-white tracking-[0.4em] uppercase opacity-90 drop-shadow-lg">丞丞GAME</span>
                        <div className="w-24 h-1 bg-primary mt-2 rounded-full shadow-[0_0_10px_var(--primary)]" />
                    </div>

                    {/* Status/Progress */}
                    <div className="w-full space-y-8">
                        {isButtonShown ? (
                            <button
                                onClick={onStart}
                                className="w-full py-6 bg-primary text-black font-black text-3xl italic tracking-tighter rounded-2xl shadow-[0_0_50px_rgba(56,189,248,0.5)] border-2 border-white/20 select-none active:scale-95 transition-transform"
                            >
                                點擊開始
                            </button>
                        ) : (
                            <div className="w-full">
                                <div className="w-full flex justify-between items-end mb-4 px-1">
                                    <div className="flex flex-col items-start">
                                        <span className="text-[10px] font-black text-sky-400 tracking-widest uppercase mb-1 drop-shadow-sm">System: Initializing</span>
                                        <span className="text-base font-black italic text-white/90 drop-shadow-md tracking-tight">{statusText}</span>
                                    </div>
                                    <span className="text-xl font-black text-sky-400 italic shadow-sky-900 drop-shadow-lg">{Math.floor(progress)}%</span>
                                </div>

                                <div className="w-full h-5 bg-black/60 rounded-full border border-white/20 overflow-hidden relative p-[1px] shadow-2xl">
                                    <div
                                        className="h-full bg-gradient-to-r from-sky-600 via-sky-300 to-sky-600 shimmer-bg relative rounded-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    >
                                        <div className="absolute top-0 right-0 w-8 h-full bg-white blur-xl opacity-40 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Info */}
            <div className="relative z-10 w-full px-10 pb-safe-bottom mb-10 flex flex-col items-center">
                <div className="flex gap-6 opacity-40 uppercase font-black text-[9px] tracking-[0.2em] text-white italic">
                    <p>Engine {CONFIG.ENGINE_VERSION}</p>
                    <div className="w-[1px] h-3 bg-white/30" />
                    <p>Verified Secure Line</p>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
