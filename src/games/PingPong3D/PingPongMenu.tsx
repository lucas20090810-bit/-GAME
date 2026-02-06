import React from 'react';
import { motion } from 'framer-motion';
import { playSound } from '../../utils/sound';

interface PingPongMenuProps {
    onSelectMode: (mode: 'ai' | 'online') => void;
    onBack: () => void;
}

const PingPongMenu: React.FC<PingPongMenuProps> = ({ onSelectMode, onBack }) => {
    return (
        <div className="fixed inset-0 bg-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                    <h1 className="text-4xl font-black text-white mb-2">🏓 桌球 1v1</h1>
                    <p className="text-slate-400">選擇遊戲模式</p>
                </div>

                <div className="space-y-4">
                    {/* AI 對戰 */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            playSound('click');
                            onSelectMode('ai');
                        }}
                        className="w-full p-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg text-white"
                    >
                        <div className="text-center">
                            <div className="text-3xl mb-2">🤖</div>
                            <div className="text-2xl font-bold mb-2">跟 AI 對戰</div>
                            <div className="text-sm opacity-90">挑戰電腦對手</div>
                        </div>
                    </motion.button>

                    {/* 線上對戰 */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            playSound('click');
                            onSelectMode('online');
                        }}
                        className="w-full p-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg text-white relative overflow-hidden"
                    >
                        <div className="text-center">
                            <div className="text-3xl mb-2">🌐</div>
                            <div className="text-2xl font-bold mb-2">線上真人對戰</div>
                            <div className="text-sm opacity-90">與其他玩家對戰</div>
                        </div>
                        <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-bold">
                            即將推出
                        </div>
                    </motion.button>
                </div>

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        playSound('click');
                        onBack();
                    }}
                    className="w-full py-3 bg-slate-700 text-white rounded-xl font-bold"
                >
                    返回主選單
                </motion.button>
            </div>
        </div>
    );
};

export default PingPongMenu;
