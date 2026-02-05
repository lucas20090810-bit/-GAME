import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { use2048 } from './use2048';
import { ChevronLeft, RotateCcw } from 'lucide-react';

const Game2048: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { grid, score, bestScore, move, initGame, gameOver } = use2048();
    const touchStart = useRef<{ x: number, y: number } | null>(null);

    // Keyboard Input
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowUp': move('up'); break;
                case 'ArrowDown': move('down'); break;
                case 'ArrowLeft': move('left'); break;
                case 'ArrowRight': move('right'); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [move]);

    // Touch Handling
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStart.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        // Prevent scrolling while swiping on the grid
        if (e.cancelable) e.preventDefault();
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!touchStart.current) return;
        const deltaX = e.changedTouches[0].clientX - touchStart.current.x;
        const deltaY = e.changedTouches[0].clientY - touchStart.current.y;

        const minDelta = 30; // Min pixels for a swipe

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (Math.abs(deltaX) > minDelta) {
                move(deltaX > 0 ? 'right' : 'left');
            }
        } else {
            if (Math.abs(deltaY) > minDelta) {
                move(deltaY > 0 ? 'down' : 'up');
            }
        }
        touchStart.current = null;
    };

    const getTileColor = (value: number) => {
        switch (value) {
            case 2: return 'bg-slate-200 text-slate-800';
            case 4: return 'bg-slate-100 text-slate-800 shadow-sm';
            case 8: return 'bg-orange-200 text-orange-900';
            case 16: return 'bg-orange-300 text-white';
            case 32: return 'bg-orange-400 text-white';
            case 64: return 'bg-orange-600 text-white';
            case 128: return 'bg-yellow-300 text-white text-xl shadow-[0_0_15px_rgba(253,224,71,0.5)]';
            case 256: return 'bg-yellow-400 text-white text-xl shadow-[0_0_20px_rgba(250,204,21,0.6)]';
            case 512: return 'bg-yellow-500 text-white text-xl shadow-[0_0_25px_rgba(234,179,8,0.7)]';
            case 1024: return 'bg-yellow-600 text-white text-lg shadow-[0_0_30px_rgba(202,138,4,0.8)]';
            case 2048: return 'bg-primary text-white text-lg shadow-[0_0_40px_rgba(56,189,248,0.9)]';
            default: return 'bg-slate-900 text-white';
        }
    };

    return (
        <div className="flex flex-col items-center w-full h-full px-4 py-safe-top pb-safe-bottom overflow-y-auto">
            {/* Header */}
            <div className="w-full max-w-md flex justify-between items-center mb-4">
                <button onClick={onBack} className="p-3 glass-card hover:bg-white/10 transition-colors active:scale-90">
                    <ChevronLeft size={24} />
                </button>
                <div className="flex gap-3">
                    <div className="glass-card px-4 py-2 text-center min-w-[70px]">
                        <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Score</p>
                        <p className="text-lg font-bold gradient-text">{score}</p>
                    </div>
                    <div className="glass-card px-4 py-2 text-center min-w-[70px]">
                        <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Best</p>
                        <p className="text-lg font-bold">{bestScore}</p>
                    </div>
                </div>
            </div>

            {/* Game Grid */}
            <div
                className="grid grid-cols-4 gap-2 bg-slate-800/80 p-3 rounded-2xl w-full max-w-md aspect-square relative shadow-2xl border border-white/5 touch-none"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Background Slots */}
                {Array(16).fill(null).map((_, i) => (
                    <div key={i} className="bg-slate-700/20 rounded-xl w-full h-full border border-white/5" />
                ))}

                {/* Tiles */}
                <AnimatePresence>
                    {grid.flat().map((tile) => tile && (
                        <motion.div
                            key={tile.id}
                            layout
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className={`absolute flex items-center justify-center rounded-xl font-black text-2xl z-10
                                ${getTileColor(tile.value)}`}
                            style={{
                                width: 'calc(25% - 12px)',
                                height: 'calc(25% - 12px)',
                                top: `calc(${tile.position[0] * 25}% + 8px)`,
                                left: `calc(${tile.position[1] * 25}% + 8px)`,
                            }}
                        >
                            <motion.span
                                key={`${tile.id}-${tile.value}`}
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500 }}
                            >
                                {tile.value}
                            </motion.span>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Game Over Overlay */}
                {gameOver && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-20">
                        <div className="text-center p-8">
                            <h2 className="text-4xl font-black italic mb-4 text-primary">Game Over!</h2>
                            <p className="text-2xl font-bold mb-2">最終得分</p>
                            <p className="text-5xl font-black gradient-text mb-8">{score}</p>
                            <button
                                onClick={initGame}
                                className="px-8 py-4 bg-primary text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl"
                            >
                                再來一局
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="mt-6 flex flex-col items-center gap-4 w-full max-w-md px-2">
                <button
                    onClick={initGame}
                    className="flex items-center gap-2 px-8 py-3 glass-card font-bold hover:bg-white/10 transition-all active:scale-95 text-primary rounded-xl"
                >
                    <RotateCcw size={18} />
                    重新開始
                </button>
                <p className="text-slate-500 text-xs font-medium text-center">
                    滑動或使用方向鍵移動方塊
                </p>
            </div>
        </div>
    );
};

export default Game2048;
