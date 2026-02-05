import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { playSound } from '../../utils/sound';

interface PingPongProps {
    onBack: () => void;
}

const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 480;
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 12;
const BALL_SIZE = 10;

const PingPong: React.FC<PingPongProps> = ({ onBack }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const touchStartRef = useRef<{ x: number; y: number } | null>(null);

    const gameStateRef = useRef({
        paddleX: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
        ballX: CANVAS_WIDTH / 2,
        ballY: CANVAS_HEIGHT / 2,
        ballSpeedX: 3,
        ballSpeedY: -4,
        animationId: 0,
    });

    const resetBall = () => {
        const state = gameStateRef.current;
        state.ballX = CANVAS_WIDTH / 2;
        state.ballY = CANVAS_HEIGHT / 2;
        state.ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * (2 + Math.random() * 2);
        state.ballSpeedY = -4;
    };

    const resetGame = () => {
        setGameOver(false);
        setScore(0);
        resetBall();
        const state = gameStateRef.current;
        state.paddleX = CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2;
        setIsPaused(false);
        playSound('click');
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!touchStartRef.current) return;
        e.preventDefault();

        const touch = e.touches[0];
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        // Calculate paddle position based on touch
        const relativeX = touch.clientX - rect.left;
        const normalizedX = (relativeX / rect.width) * CANVAS_WIDTH;

        gameStateRef.current.paddleX = Math.max(
            0,
            Math.min(CANVAS_WIDTH - PADDLE_WIDTH, normalizedX - PADDLE_WIDTH / 2)
        );
    };

    const handleTouchEnd = () => {
        touchStartRef.current = null;
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const gameLoop = () => {
            if (isPaused || gameOver) return;

            const state = gameStateRef.current;

            // Clear canvas
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            // Draw center line
            ctx.strokeStyle = '#334155';
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(CANVAS_WIDTH / 2, 0);
            ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
            ctx.stroke();
            ctx.setLineDash([]);

            // Draw paddle
            ctx.fillStyle = '#38bdf8';
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 10;
            ctx.fillRect(
                state.paddleX,
                CANVAS_HEIGHT - PADDLE_HEIGHT - 20,
                PADDLE_WIDTH,
                PADDLE_HEIGHT
            );
            ctx.shadowBlur = 0;

            // Draw ball
            ctx.fillStyle = '#facc15';
            ctx.shadowColor = '#facc15';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(state.ballX, state.ballY, BALL_SIZE / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Update ball position
            state.ballX += state.ballSpeedX;
            state.ballY += state.ballSpeedY;

            // Ball collision with walls
            if (state.ballX <= BALL_SIZE / 2 || state.ballX >= CANVAS_WIDTH - BALL_SIZE / 2) {
                state.ballSpeedX *= -1;
                try { playSound('click'); } catch (e) { }
            }

            // Ball collision with top
            if (state.ballY <= BALL_SIZE / 2) {
                state.ballSpeedY *= -1;
                try { playSound('click'); } catch (e) { }
            }

            // Ball collision with paddle
            const paddleTop = CANVAS_HEIGHT - PADDLE_HEIGHT - 20;
            if (
                state.ballY + BALL_SIZE / 2 >= paddleTop &&
                state.ballY + BALL_SIZE / 2 <= paddleTop + PADDLE_HEIGHT &&
                state.ballX >= state.paddleX &&
                state.ballX <= state.paddleX + PADDLE_WIDTH
            ) {
                state.ballSpeedY *= -1;
                // Add some variation based on where it hit the paddle
                const hitPos = (state.ballX - state.paddleX) / PADDLE_WIDTH;
                state.ballSpeedX = (hitPos - 0.5) * 8;
                setScore(prev => prev + 1);
                try { playSound('success'); } catch (e) { }
            }

            // Ball falls off screen
            if (state.ballY >= CANVAS_HEIGHT + BALL_SIZE) {
                setGameOver(true);
                if (score > highScore) {
                    setHighScore(score);
                }
                try { playSound('fail'); } catch (e) { }
                return;
            }

            state.animationId = requestAnimationFrame(gameLoop);
        };

        gameLoop();

        return () => {
            if (gameStateRef.current.animationId) {
                cancelAnimationFrame(gameStateRef.current.animationId);
            }
        };
    }, [isPaused, gameOver, score, highScore]);

    return (
        <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="flex-1 flex flex-col overflow-hidden pb-4"
        >
            {/* Header */}
            <header className="px-2 py-4 flex items-center justify-between mb-4">
                <button
                    onClick={onBack}
                    className="p-3 glass-card hover:bg-white/10 active:scale-95 transition-all rounded-2xl"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="flex flex-col items-center">
                    <h2 className="text-2xl font-black italic tracking-tighter uppercase text-primary">打桌球</h2>
                    <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Ping Pong</p>
                </div>
                <div className="w-12" />
            </header>

            {/* Game Canvas Container */}
            <div className="flex-1 flex items-center justify-center relative px-4">
                <div className="relative">
                    <canvas
                        ref={canvasRef}
                        width={CANVAS_WIDTH}
                        height={CANVAS_HEIGHT}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        className="border-4 border-primary/20 rounded-xl shadow-2xl touch-none"
                        style={{ maxWidth: '100%', height: 'auto' }}
                    />

                    {/* Score Overlay */}
                    <div className="absolute top-8 left-0 right-0 flex justify-center pointer-events-none">
                        <div className="glass-card px-6 py-3 rounded-2xl border-primary/30">
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black italic text-primary">{score}</span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">分</span>
                            </div>
                            <p className="text-[8px] font-bold text-slate-600 text-center mt-1 uppercase">High: {highScore}</p>
                        </div>
                    </div>

                    {/* Game Over Overlay */}
                    <AnimatePresence>
                        {gameOver && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md rounded-xl"
                            >
                                <div className="glass-card p-8 rounded-3xl border-primary/30 text-center max-w-xs">
                                    <h3 className="text-3xl font-black italic mb-2 uppercase text-primary">Game Over</h3>
                                    <p className="text-sm text-slate-400 mb-6 font-medium">最終得分</p>
                                    <div className="text-5xl font-black italic text-white mb-2">{score}</div>
                                    {score > highScore && (
                                        <p className="text-xs text-amber-400 font-bold uppercase mb-6 animate-pulse">🏆 新紀錄！</p>
                                    )}
                                    <button
                                        onClick={resetGame}
                                        className="w-full py-4 bg-primary text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
                                    >
                                        <RotateCcw size={20} />
                                        再來一局
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Instructions */}
            <div className="px-6 py-4 text-center">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">滑動屏幕控制擋板 ‧ 別讓球掉下去！</p>
            </div>
        </motion.div>
    );
};

export default PingPong;
