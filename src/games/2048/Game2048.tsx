import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { use2048 } from './use2048';
import { ChevronLeft, RotateCcw } from 'lucide-react';

const Game2048: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const { grid, score, bestScore, move, initGame, gameOver } = use2048();
    const touchStart = useRef<{ x: number, y: number } | null>(null);

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

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (e.cancelable) e.preventDefault();
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!touchStart.current) return;
        const deltaX = e.changedTouches[0].clientX - touchStart.current.x;
        const deltaY = e.changedTouches[0].clientY - touchStart.current.y;
        const minDelta = 30;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (Math.abs(deltaX) > minDelta) move(deltaX > 0 ? 'right' : 'left');
        } else {
            if (Math.abs(deltaY) > minDelta) move(deltaY > 0 ? 'down' : 'up');
        }
        touchStart.current = null;
    };

    const getTileColor = (value: number) => {
        switch (value) {
            case 2: return 'bg-slate-200 text-slate-800';
            case 4: return 'bg-slate-100 text-slate-800';
            case 8: return 'bg-orange-200 text-orange-900';
            case 16: return 'bg-orange-300 text-white';
            case 32: return 'bg-orange-400 text-white';
            case 64: return 'bg-orange-600 text-white';
            case 128: return 'bg-yellow-300 text-white shadow-lg';
            case 256: return 'bg-yellow-400 text-white shadow-lg';
            case 512: return 'bg-yellow-500 text-white shadow-lg';
            case 1024: return 'bg-yellow-600 text-white shadow-lg';
            case 2048: return 'bg-primary text-white shadow-xl';
            default: return 'bg-slate-900 text-white';
        }
    };

    return (
        <div className="fixed inset-0 flex bg-slate-900 overflow-hidden">
            {/* Left Side - Controls */}
            <div className="flex flex-col items-center justify-center px-6 py-4 gap-4 shrink-0">
                <button onClick={onBack} className="p-3 glass-card hover:bg-white/10 transition-colors active:scale-90 rounded-xl">
                    <ChevronLeft size={24} />
                </button>
                <div className="glass-card px-4 py-2 text-center min-w-[80px]">
                    <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Score</p>
                    <p className="text-xl font-bold gradient-text">{score}</p>
                </div>
                <div className="glass-card px-4 py-2 text-center min-w-[80px]">
                    <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Best</p>
                    <p className="text-xl font-bold">{bestScore}</p>
                </div>
                <button onClick={initGame} className="p-3 glass-card hover:bg-white/10 transition-colors active:scale-90 rounded-xl text-primary">
                    <RotateCcw size={20} />
                </button>
            </div>

            {/* Right Side - Game Grid */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div
                    className="relative grid grid-cols-4 gap-1 bg-slate-800/80 p-2 rounded-xl shadow-2xl border border-white/5 touch-none"
                    style={{ width: 'min(55vh, 70vw)', height: 'min(55vh, 70vw)' }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Background Slots */}
                    {Array(16).fill(null).map((_, i) => (
                        <div key={i} className="bg-slate-700/20 rounded-lg aspect-square border border-white/5" />
                    ))}

                    {/* Tiles */}
                    <AnimatePresence>
                        {grid.flat().map((tile) => tile && (
                            <motion.div
                                key={tile.id}
                                layout
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className={`absolute flex items-center justify-center rounded-lg font-black text-xl ${getTileColor(tile.value)}`}
                                style={{
                                    width: 'calc(25% - 6px)',
                                    height: 'calc(25% - 6px)',
                                    top: `calc(${tile.position[0] * 25}% + 4px)`,
                                    left: `calc(${tile.position[1] * 25}% + 4px)`,
                                }}
                            >
                                {tile.value}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Game Over Overlay */}
                    {gameOver && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-20">
                            <div className="text-center p-6">
                                <h2 className="text-3xl font-black italic mb-2 text-primary">Game Over!</h2>
                                <p className="text-4xl font-black gradient-text mb-4">{score}</p>
                                <button onClick={initGame} className="px-6 py-3 bg-primary text-black font-black rounded-xl active:scale-95">
                                    再來一局
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Game2048;
