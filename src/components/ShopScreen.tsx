import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

const ShopScreen: React.FC<{ coins: number; items: any[]; onBuy: (id: string) => void; onBack: () => void }> = ({ coins, items, onBuy, onBack }) => {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-8 pb-10">
            <header className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 glass-card hover:bg-white/10 transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <h2 className="text-2xl font-bold">道具商城</h2>
                </div>
                <div className="glass-card px-4 py-2 text-yellow-500 font-bold bg-yellow-500/10 border-yellow-500/20">
                    {coins} 💰
                </div>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {items.map((item, idx) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card p-6 flex justify-between items-center group relative overflow-hidden"
                    >
                        <div className="flex flex-col">
                            <span className="text-lg font-bold mb-1">{item.name}</span>
                            <span className="text-sm text-slate-400">{item.description}</span>
                        </div>
                        <button
                            onClick={() => onBuy(item.id)}
                            disabled={coins < item.price}
                            className={`px-4 py-3 rounded-xl font-bold flex flex-col items-center min-w-[80px] transition-all
                ${coins >= item.price ? 'bg-primary hover:scale-105 active:scale-95' : 'bg-slate-700 opacity-50'}`}
                        >
                            <span className="text-xs uppercase opacity-80">購買</span>
                            <span>{item.price} 💰</span>
                        </button>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default ShopScreen;
