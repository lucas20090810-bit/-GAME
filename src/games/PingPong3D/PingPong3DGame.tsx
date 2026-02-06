import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, RotateCcw } from 'lucide-react';
import { PingPongGame } from './game/GameEngine';
import type { Difficulty } from './types';

interface PingPong3DGameProps {
    difficulty: Difficulty;
    onBack: () => void;
}

const PingPong3DGame: React.FC<PingPong3DGameProps> = ({ difficulty, onBack }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameRef = useRef<PingPongGame | null>(null);
    const [playerScore, setPlayerScore] = useState(0);
    const [aiScore, setAiScore] = useState(0);
    const [gameEnded, setGameEnded] = useState(false);
    const [winner, setWinner] = useState<'player' | 'ai' | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // 創建遊戲實例
        const game = new PingPongGame(canvasRef.current, difficulty);
        gameRef.current = game;

        // 設定回調
        game.onScoreUpdate = (player, ai) => {
            setPlayerScore(player);
            setAiScore(ai);
        };

        game.onGameEnd = (w) => {
            setWinner(w);
            setGameEnded(true);
        };

        // 開始遊戲
        game.start();

        // 清理
        return () => {
            game.dispose();
        };
    }, [difficulty]);

    const handleRestart = () => {
        setGameEnded(false);
        setWinner(null);
        if (gameRef.current) {
            gameRef.current.reset();
            gameRef.current.start();
        }
    };

    return (
        <div className="fixed inset-0 bg-black">
            {/* 3D Canvas - 全屏，無任何遮擋 */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ touchAction: 'none' }}
            />

            {/* 記分板 - 僅顯示數字 */}
            <div className="absolute top-4 left-0 right-0 flex justify-between items-start px-6 pointer-events-none z-10">
                {/* AI 分數（藍色） */}
                <div className="bg-blue-500/90 text-white px-6 py-3 rounded-full backdrop-blur-sm shadow-lg">
                    <div className="text-3xl font-black tabular-nums">{aiScore}</div>
                </div>

                {/* 玩家分數（紅色） */}
                <div className="bg-red-500/90 text-white px-6 py-3 rounded-full backdrop-blur-sm shadow-lg">
                    <div className="text-3xl font-black tabular-nums">{playerScore}</div>
                </div>
            </div>

            {/* 返回按鈕 - 僅圖標 */}
            <button
                onClick={onBack}
                className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full z-10 transition-colors"
                aria-label="返回"
            >
                <ChevronLeft size={24} />
            </button>

            {/* 遊戲結束畫面 */}
            <AnimatePresence>
                {gameEnded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-20"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-slate-800/95 p-8 rounded-3xl shadow-2xl max-w-sm w-full mx-4"
                        >
                            <div className="text-center">
                                {/* 勝負圖示 */}
                                <div className="text-7xl mb-6">
                                    {winner === 'player' ? '🏆' : '😢'}
                                </div>

                                {/* 分數 */}
                                <div className="flex gap-3 justify-center text-3xl font-black text-white mb-8">
                                    <div className="bg-red-500 px-8 py-4 rounded-2xl">
                                        {playerScore}
                                    </div>
                                    <div className="flex items-center text-2xl">:</div>
                                    <div className="bg-blue-500 px-8 py-4 rounded-2xl">
                                        {aiScore}
                                    </div>
                                </div>

                                {/* 按鈕 - 僅圖標 */}
                                <div className="flex gap-4">
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleRestart}
                                        className="flex-1 py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
                                    >
                                        <RotateCcw size={24} />
                                    </motion.button>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={onBack}
                                        className="flex-1 py-4 bg-slate-600 hover:bg-slate-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
                                    >
                                        <ChevronLeft size={24} />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PingPong3DGame;
