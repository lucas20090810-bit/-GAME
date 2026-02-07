import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Trophy } from 'lucide-react';

interface JumpJumpProps {
    onBack: () => void;
}

interface Platform {
    id: number;
    x: number;
    y: number;
    width: number;
}

interface Player {
    x: number;
    y: number;
    velocityY: number;
    isJumping: boolean;
}

const GRAVITY = 0.8;
const JUMP_POWER = -15;
const PLAYER_SIZE = 40;
const PLATFORM_HEIGHT = 20;
const INITIAL_PLATFORM_WIDTH = 120;
const MIN_PLATFORM_WIDTH = 80;

const JumpJump: React.FC<JumpJumpProps> = ({ onBack }) => {
    const [gameState, setGameState] = useState<'ready' | 'playing' | 'ended'>('ready');
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [player, setPlayer] = useState<Player>({ x: 100, y: 300, velocityY: 0, isJumping: false });
    const [platforms, setPlatforms] = useState<Platform[]>([]);
    const [currentPlatform, setCurrentPlatform] = useState(0);
    const gameAreaRef = useRef<HTMLDivElement>(null);
    const animationFrameRef = useRef<number>();

    // Initialize platforms
    const initPlatforms = (): Platform[] => {
        const initialPlatforms: Platform[] = [];
        let lastX = 100;
        let lastY = 400;

        for (let i = 0; i < 10; i++) {
            const gap = 100 + i * 10; // 距離逐漸增加
            const nextX = lastX + gap;
            const nextY = lastY + (Math.random() - 0.5) * 50;
            const width = Math.max(MIN_PLATFORM_WIDTH, INITIAL_PLATFORM_WIDTH - i * 5);

            initialPlatforms.push({
                id: i,
                x: nextX,
                y: Math.max(200, Math.min(500, nextY)),
                width: width
            });

            lastX = nextX;
            lastY = nextY;
        }

        return initialPlatforms;
    };

    // Start game
    const startGame = () => {
        const newPlatforms = initPlatforms();
        setPlatforms(newPlatforms);
        setPlayer({ x: 100, y: newPlatforms[0].y - PLAYER_SIZE - PLATFORM_HEIGHT, velocityY: 0, isJumping: false });
        setCurrentPlatform(0);
        setScore(0);
        setGameState('playing');
    };

    // Jump
    const jump = () => {
        if (gameState !== 'playing' || player.isJumping) return;

        setPlayer(prev => ({
            ...prev,
            velocityY: JUMP_POWER,
            isJumping: true
        }));
    };

    // Game loop
    useEffect(() => {
        if (gameState !== 'playing') return;

        const gameLoop = () => {
            setPlayer(prev => {
                const newVelocityY = prev.velocityY + GRAVITY;
                const newY = prev.y + newVelocityY;

                // Check platform collision
                const currentPlat = platforms[currentPlatform];
                const nextPlat = platforms[currentPlatform + 1];

                let landed = false;
                let newPlatformIndex = currentPlatform;

                // Check if landing on next platform
                if (nextPlat &&
                    newY + PLAYER_SIZE >= nextPlat.y - PLATFORM_HEIGHT &&
                    prev.y + PLAYER_SIZE < nextPlat.y - PLATFORM_HEIGHT &&
                    prev.x + PLAYER_SIZE > nextPlat.x &&
                    prev.x < nextPlat.x + nextPlat.width &&
                    newVelocityY > 0) {

                    landed = true;
                    newPlatformIndex = currentPlatform + 1;
                    setCurrentPlatform(newPlatformIndex);
                    setScore(s => s + 1);

                    // Generate new platform
                    if (newPlatformIndex >= platforms.length - 5) {
                        setPlatforms(plats => {
                            const lastPlat = plats[plats.length - 1];
                            const gap = 100 + plats.length * 2;
                            const width = Math.max(MIN_PLATFORM_WIDTH, INITIAL_PLATFORM_WIDTH - plats.length);

                            return [...plats, {
                                id: plats.length,
                                x: lastPlat.x + gap,
                                y: Math.max(200, Math.min(500, lastPlat.y + (Math.random() - 0.5) * 60)),
                                width: width
                            }];
                        });
                    }
                }

                // Check if still on current platform
                if (!landed && currentPlat &&
                    prev.y + PLAYER_SIZE >= currentPlat.y - PLATFORM_HEIGHT &&
                    prev.x + PLAYER_SIZE > currentPlat.x &&
                    prev.x < currentPlat.x + currentPlat.width) {
                    landed = true;
                }

                // Game over if fell below screen or missed platform
                if (newY > 600 || (newVelocityY > 0 && !landed && prev.y > 300)) {
                    setGameState('ended');
                    if (score > bestScore) {
                        setBestScore(score);
                    }
                    return prev;
                }

                return {
                    ...prev,
                    y: landed ? (newPlatformIndex === currentPlatform ? currentPlat : nextPlat).y - PLAYER_SIZE - PLATFORM_HEIGHT : newY,
                    velocityY: landed ? 0 : newVelocityY,
                    isJumping: !landed
                };
            });

            animationFrameRef.current = requestAnimationFrame(gameLoop);
        };

        animationFrameRef.current = requestAnimationFrame(gameLoop);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [gameState, platforms, currentPlatform, score, bestScore]);

    // Camera offset to follow player
    const cameraOffset = Math.max(0, player.x - 200);

    return (
        <div className="fixed inset-0 bg-gradient-to-b from-sky-400 to-blue-600 overflow-hidden">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
                <button
                    onClick={onBack}
                    className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                >
                    <X size={24} className="text-white" />
                </button>

                {gameState === 'playing' && (
                    <div className="flex gap-6 text-white">
                        <div className="text-center">
                            <div className="text-sm opacity-75">分數</div>
                            <div className="text-3xl font-black">{score}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm opacity-75">最高</div>
                            <div className="text-2xl font-bold">{bestScore}</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Game Area */}
            <div
                ref={gameAreaRef}
                onClick={jump}
                className="absolute inset-0 cursor-pointer"
                style={{ padding: '80px 0 0 0' }}
            >
                <div
                    className="relative w-full h-full"
                    style={{ transform: `translateX(-${cameraOffset}px)` }}
                >
                    {/* Platforms */}
                    {platforms.map((plat, idx) => (
                        <div
                            key={plat.id}
                            className={`absolute rounded-t-xl transition-colors ${idx === currentPlatform ? 'bg-green-500' : 'bg-amber-600'
                                }`}
                            style={{
                                left: plat.x,
                                top: plat.y,
                                width: plat.width,
                                height: PLATFORM_HEIGHT,
                                boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                            }}
                        />
                    ))}

                    {/* Player */}
                    {gameState === 'playing' && (
                        <motion.div
                            className="absolute bg-red-500 rounded-lg shadow-lg flex items-center justify-center"
                            style={{
                                left: player.x,
                                top: player.y,
                                width: PLAYER_SIZE,
                                height: PLAYER_SIZE,
                            }}
                            animate={{
                                rotate: player.isJumping ? 360 : 0,
                                scale: player.isJumping ? 1.1 : 1
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="text-2xl">🏃</div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Ready Screen */}
            {gameState === 'ready' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white/95 backdrop-blur-lg p-8 rounded-3xl text-center max-w-md mx-4"
                    >
                        <div className="text-6xl mb-4">🏃‍♂️</div>
                        <h2 className="text-4xl font-black text-slate-800 mb-4">跳一跳</h2>
                        <p className="text-slate-600 mb-6">
                            點擊螢幕跳躍<br />
                            跳到平台上得分<br />
                            距離會越來越遠！
                        </p>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={startGame}
                            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-bold text-xl hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
                        >
                            開始遊戲
                        </motion.button>
                    </motion.div>
                </div>
            )}

            {/* End Screen */}
            {gameState === 'ended' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white/95 backdrop-blur-lg p-8 rounded-3xl text-center max-w-md mx-4"
                    >
                        <div className="text-6xl mb-4">
                            {score > bestScore ? '🏆' : score >= 10 ? '⭐' : '💪'}
                        </div>
                        <h2 className="text-4xl font-black text-slate-800 mb-6">遊戲結束</h2>

                        <div className="space-y-4 mb-8">
                            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-4 rounded-xl">
                                <div className="text-sm text-slate-600">本次分數</div>
                                <div className="text-5xl font-black text-slate-800">{score}</div>
                            </div>

                            <div className="bg-amber-100 p-4 rounded-xl flex items-center justify-between">
                                <div className="text-sm text-amber-800">最高分數</div>
                                <div className="flex items-center gap-2">
                                    <Trophy size={20} className="text-amber-600" />
                                    <div className="text-2xl font-black text-amber-800">{bestScore}</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={startGame}
                                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-purple-600"
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

export default JumpJump;
