import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { playSound } from '../../utils/sound';

interface PingPongProps {
    onBack: () => void;
}

// Landscape-friendly canvas size
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 220;
const PADDLE_WIDTH = 70;
const PADDLE_HEIGHT = 10;
const BALL_SIZE = 8;

const PingPong: React.FC<PingPongProps> = ({ onBack }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);


    const gameStateRef = useRef({
        paddleX: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
        ballX: CANVAS_WIDTH / 2,
        ballY: CANVAS_HEIGHT / 2,
        ballSpeedX: 2,
        ballSpeedY: -2.5,
        animationId: 0,
    });

    const resetBall = () => {
        const state = gameStateRef.current;
        state.ballX = CANVAS_WIDTH / 2;
        state.ballY = CANVAS_HEIGHT / 2;
        state.ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * (1.5 + Math.random() * 1.5);
        state.ballSpeedY = -2.5;
    };

    const resetGame = () => {
        setGameOver(false);
        setScore(0);
        resetBall();
        gameStateRef.current.paddleX = CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2;
        playSound('click');
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const relativeX = touch.clientX - rect.left;
        const normalizedX = (relativeX / rect.width) * CANVAS_WIDTH;
        gameStateRef.current.paddleX = Math.max(0, Math.min(CANVAS_WIDTH - PADDLE_WIDTH, normalizedX - PADDLE_WIDTH / 2));
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const gameLoop = () => {
            if (gameOver) return;
            const state = gameStateRef.current;

            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            // Center line
            ctx.strokeStyle = '#334155';
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(CANVAS_WIDTH / 2, 0);
            ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
            ctx.stroke();
            ctx.setLineDash([]);

            // Paddle
            ctx.fillStyle = '#38bdf8';
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 10;
            ctx.fillRect(state.paddleX, CANVAS_HEIGHT - PADDLE_HEIGHT - 15, PADDLE_WIDTH, PADDLE_HEIGHT);
            ctx.shadowBlur = 0;

            // Ball
            ctx.fillStyle = '#facc15';
            ctx.shadowColor = '#facc15';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(state.ballX, state.ballY, BALL_SIZE / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Update ball
            state.ballX += state.ballSpeedX;
            state.ballY += state.ballSpeedY;

            // Wall collision
            if (state.ballX <= BALL_SIZE / 2 || state.ballX >= CANVAS_WIDTH - BALL_SIZE / 2) {
                state.ballSpeedX *= -1;
            }
            if (state.ballY <= BALL_SIZE / 2) {
                state.ballSpeedY *= -1;
            }

            // Paddle collision
            const paddleTop = CANVAS_HEIGHT - PADDLE_HEIGHT - 15;
            if (state.ballY + BALL_SIZE / 2 >= paddleTop && state.ballY + BALL_SIZE / 2 <= paddleTop + PADDLE_HEIGHT &&
                state.ballX >= state.paddleX && state.ballX <= state.paddleX + PADDLE_WIDTH) {
                state.ballSpeedY *= -1;
                state.ballSpeedX = ((state.ballX - state.paddleX) / PADDLE_WIDTH - 0.5) * 8;
                setScore(prev => prev + 1);
            }

            // Game over
            if (state.ballY >= CANVAS_HEIGHT + BALL_SIZE) {
                setGameOver(true);
                if (score > highScore) setHighScore(score);
                return;
            }

            state.animationId = requestAnimationFrame(gameLoop);
        };

        gameLoop();
        return () => { if (gameStateRef.current.animationId) cancelAnimationFrame(gameStateRef.current.animationId); };
    }, [gameOver, score, highScore]);

    return (
        <div className="fixed inset-0 flex bg-slate-900 overflow-hidden">
            {/* Left: Controls */}
            <div className="flex flex-col items-center justify-center px-4 py-4 gap-3 shrink-0">
                <button onClick={onBack} className="p-2 glass-card hover:bg-white/10 active:scale-95 rounded-xl">
                    <ArrowLeft size={20} />
                </button>
                <div className="glass-card px-3 py-2 text-center">
                    <p className="text-[9px] text-slate-500 uppercase">分數</p>
                    <p className="text-xl font-black text-primary">{score}</p>
                </div>
                <div className="glass-card px-3 py-2 text-center">
                    <p className="text-[9px] text-slate-500 uppercase">最高</p>
                    <p className="text-lg font-bold">{highScore}</p>
                </div>
            </div>

            {/* Center: Game Canvas */}
            <div className="flex-1 flex items-center justify-center">
                <div className="relative">
                    <canvas
                        ref={canvasRef}
                        width={CANVAS_WIDTH}
                        height={CANVAS_HEIGHT}
                        onTouchMove={handleTouchMove}
                        className="border-2 border-primary/30 rounded-xl shadow-2xl touch-none"
                    />

                    {/* Game Over */}
                    <AnimatePresence>
                        {gameOver && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-xl"
                            >
                                <div className="text-center">
                                    <h3 className="text-2xl font-black text-primary mb-1">Game Over</h3>
                                    <p className="text-3xl font-black text-white mb-3">{score}</p>
                                    <button onClick={resetGame} className="px-6 py-2 bg-primary text-black font-bold rounded-xl flex items-center gap-2 active:scale-95">
                                        <RotateCcw size={16} /> 再來
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Right: Instructions */}
            <div className="flex items-center justify-center px-4">
                <p className="text-[10px] text-slate-500 text-center leading-relaxed" style={{ writingMode: 'vertical-rl' }}>滑動控制擋板</p>
            </div>
        </div>
    );
};

export default PingPong;
