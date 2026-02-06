import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Trophy, X } from 'lucide-react';

interface ReactionGameProps {
    onBack: () => void;
}

interface Block {
    id: number;
    x: number;
    y: number;
    color: string;
    createdAt: number;
}

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
const GAME_DURATION = 30000; // 30 seconds
const BLOCK_LIFETIME = 700; // 0.7s average

const ReactionGame: React.FC<ReactionGameProps> = ({ onBack }) => {
    const [gameState, setGameState] = useState<'ready' | 'playing' | 'ended'>('ready');
    const [score, setScore] = useState(0);
    const [clicks, setClicks] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [currentBlock, setCurrentBlock] = useState<Block | null>(null);
    const gameAreaRef = useRef<HTMLDivElement>(null);
    const blockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Generate random block
    const spawnBlock = () => {
        if (!gameAreaRef.current) return;

        const rect = gameAreaRef.current.getBoundingClientRect();
        const blockSize = 80;
        const maxX = rect.width - blockSize;
        const maxY = rect.height - blockSize;

        const newBlock: Block = {
            id: Date.now(),
            x: Math.random() * Math.max(0, maxX),
            y: Math.random() * Math.max(0, maxY),
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            createdAt: Date.now()
        };

        setCurrentBlock(newBlock);

        // Remove block after lifetime
        const lifetime = BLOCK_LIFETIME + Math.random() * 300; // 0.7-1s
        blockTimeoutRef.current = setTimeout(() => {
            setCurrentBlock(null);
            // Spawn next block after short delay
            setTimeout(spawnBlock, 200 + Math.random() * 300);
        }, lifetime);
    };

    // Start game
    const startGame = () => {
        setGameState('playing');
        setScore(0);
        setClicks(0);
        setTimeLeft(GAME_DURATION);
        setCurrentBlock(null);
        setTimeout(spawnBlock, 500);
    };

    // Handle block click
    const handleBlockClick = () => {
        if (gameState !== 'playing' || !currentBlock) return;

        setScore(prev => prev + 1);
        setClicks(prev => prev + 1);
        setCurrentBlock(null);

        if (blockTimeoutRef.current) {
            clearTimeout(blockTimeoutRef.current);
        }

        // Spawn next block immediately
        setTimeout(spawnBlock, 150);
    };

    // Handle miss click
    const handleMissClick = () => {
        if (gameState !== 'playing') return;
        setClicks(prev => prev + 1);
    };

    // Game timer
    useEffect(() => {
        if (gameState !== 'playing') return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 100) {
                    setGameState('ended');
                    if (blockTimeoutRef.current) {
                        clearTimeout(blockTimeoutRef.current);
                    }
                    setCurrentBlock(null);
                    return 0;
                }
                return prev - 100;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [gameState]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (blockTimeoutRef.current) {
                clearTimeout(blockTimeoutRef.current);
            }
        };
    }, []);

    const accuracy = clicks > 0 ? Math.round((score / clicks) * 100) : 0;

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
                <button
                    onClick={onBack}
                    className="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
                >
                    <X size={24} className="text-white" />
                </button>

                {gameState === 'playing' && (
                    <>
                        <div className="flex gap-6 text-white">
                            <div className="text-center">
                                <div className="text-sm opacity-75">分數</div>
                                <div className="text-3xl font-black">{score}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-sm opacity-75">時間</div>
                                <div className="text-3xl font-black">{Math.ceil(timeLeft / 1000)}</div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Game Area */}
            <div
                ref={gameAreaRef}
                onClick={handleMissClick}
                className="absolute inset-0 cursor-crosshair"
                style={{ padding: '80px 20px 20px' }}
            >
                {/* Blocks */}
                <AnimatePresence>
                    {currentBlock && gameState === 'playing' && (
                        <motion.div
                            key={currentBlock.id}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleBlockClick();
                            }}
                            className="absolute w-20 h-20 rounded-2xl shadow-2xl cursor-pointer hover:scale-110 transition-transform flex items-center justify-center"
                            style={{
                                left: currentBlock.x,
                                top: currentBlock.y,
                                backgroundColor: currentBlock.color,
                            }}
                        >
                            <Target size={36} className="text-white" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Ready Screen */}
            {gameState === 'ready' && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-slate-800/90 backdrop-blur-lg p-8 rounded-3xl text-center max-w-md mx-4"
                    >
                        <div className="text-6xl mb-4">⚡</div>
                        <h2 className="text-4xl font-black text-white mb-4">反應力測試</h2>
                        <p className="text-slate-300 mb-6">
                            點擊出現的方塊<br />
                            30秒內盡可能得高分！
                        </p>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={startGame}
                            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold text-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
                        >
                            開始遊戲
                        </motion.button>
                    </motion.div>
                </div>
            )}

            {/* End Screen */}
            {gameState === 'ended' && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-slate-800/90 backdrop-blur-lg p-8 rounded-3xl text-center max-w-md mx-4"
                    >
                        <div className="text-6xl mb-4">
                            {accuracy >= 80 ? '🏆' : accuracy >= 60 ? '⭐' : '💪'}
                        </div>
                        <h2 className="text-4xl font-black text-white mb-6">遊戲結束</h2>

                        <div className="space-y-4 mb-8">
                            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-xl">
                                <div className="text-sm text-slate-400">總分</div>
                                <div className="text-5xl font-black text-white">{score}</div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-700/50 p-4 rounded-xl">
                                    <div className="text-xs text-slate-400">命中率</div>
                                    <div className="text-2xl font-black text-white">{accuracy}%</div>
                                </div>
                                <div className="bg-slate-700/50 p-4 rounded-xl">
                                    <div className="text-xs text-slate-400">總點擊</div>
                                    <div className="text-2xl font-black text-white">{clicks}</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={startGame}
                                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-pink-600"
                            >
                                再玩一次
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={onBack}
                                className="flex-1 py-3 bg-slate-600 text-white rounded-xl font-bold hover:bg-slate-700"
                            >
                                返回
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ReactionGame;
