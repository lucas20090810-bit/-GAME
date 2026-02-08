import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Trophy, Target, Layers, ShoppingCart, Mail, User, Settings, Coins } from 'lucide-react';
import { playSound } from '../utils/sound';

interface GameCard {
    id: string;
    title: string;
    icon: React.ReactNode;
    color: string;
    type: 'game' | 'system';
}

const allItems: GameCard[] = [
    { id: 'shop', title: '商店', icon: <ShoppingCart className="w-12 h-12" />, color: 'from-amber-500 to-orange-700', type: 'system' },
    { id: 'mail', title: '情報', icon: <Mail className="w-12 h-12" />, color: 'from-indigo-500 to-purple-700', type: 'system' },
    { id: '2048', title: '2048', icon: <Gamepad2 className="w-16 h-16" />, color: 'from-sky-500 to-blue-700', type: 'game' },
    { id: 'jumpjump', title: '跳一跳', icon: <Layers className="w-16 h-16" />, color: 'from-cyan-500 to-teal-700', type: 'game' },
    { id: 'reaction', title: '反應測試', icon: <Target className="w-16 h-16" />, color: 'from-pink-500 to-rose-700', type: 'game' },
    { id: 'pingpong', title: '桌球', icon: <Trophy className="w-16 h-16" />, color: 'from-emerald-500 to-green-700', type: 'game' },
    { id: 'pingpong3d', title: '1v1 桌球', icon: <Trophy className="w-16 h-16" />, color: 'from-purple-500 to-violet-700', type: 'game' },
];

const MainMenu: React.FC<{ userData: any; news: any[]; onSelectGame: (id: string) => void }> = ({ userData, news, onSelectGame }) => {
    const handleAction = (id: string) => {
        playSound('click');
        onSelectGame(id);
    };

    const avatarSrc = userData?.avatar || '';
    const hasAvatar = avatarSrc && avatarSrc.length > 10;

    return (
        <div className="fixed inset-0 flex flex-col bg-slate-900 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80"
                    className="w-full h-full object-cover opacity-40"
                    alt="bg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
            </div>

            {/* Header */}
            <header className="relative z-10 px-6 py-4 flex items-center justify-between">
                <button onClick={() => handleAction('profile')} className="flex items-center gap-3 group">
                    <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg group-active:scale-95 transition-transform">
                        <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                            {hasAvatar ? (
                                <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User className="text-white/50" />
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="text-white font-bold text-lg leading-tight">{userData.name}</div>
                        <div className="text-green-400 text-xs font-bold uppercase tracking-wider">● Online</div>
                    </div>
                </button>

                <div className="flex items-center gap-3">
                    <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/30 flex items-center gap-2">
                        <Coins size={16} className="text-amber-400" />
                        <span className="text-amber-400 font-bold">{userData.coins || 0}</span>
                    </div>
                    <button onClick={() => handleAction('profile')} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center active:scale-95 transition-transform">
                        <Settings size={20} className="text-white/80" />
                    </button>
                </div>
            </header>

            {/* Main Content - Horizontal Scroll */}
            <main className="relative z-10 flex-1 flex flex-col justify-center">
                <div className="w-full overflow-x-auto snap-x snap-mandatory flex items-center gap-6 px-8 py-8 no-scrollbar scroll-smooth">
                    {allItems.map((item, index) => (
                        <motion.button
                            key={item.id}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAction(item.id)}
                            className={`
                                relative shrink-0 snap-center rounded-3xl overflow-hidden shadow-2xl
                                ${item.type === 'system' ? 'w-64 h-80' : 'w-72 h-[420px]'}
                                group
                            `}
                        >
                            {/* Card Background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${item.color}`} />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />

                            {/* Card Content */}
                            <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 text-center">
                                <motion.div
                                    whileHover={{ rotate: [0, -10, 10, 0] }}
                                    transition={{ duration: 0.5 }}
                                    className="mb-6 p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 shadow-lg"
                                >
                                    {item.icon}
                                </motion.div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-wider drop-shadow-md">
                                    {item.title}
                                </h3>
                                {item.type === 'game' && (
                                    <span className="mt-2 text-xs font-bold text-white/60 bg-black/20 px-3 py-1 rounded-full border border-white/10">
                                        GAME MODE
                                    </span>
                                )}
                            </div>
                        </motion.button>
                    ))}

                    {/* Padding for end of scroll */}
                    <div className="w-2 shrink-0" />
                </div>

                {/* Scroll Hint */}
                <div className="text-center text-white/30 text-xs font-bold uppercase tracking-[0.2em] animate-pulse pointer-events-none">
                    ← Slide to Select →
                </div>
            </main>

            {/* Footer News */}
            <footer className="relative z-10 px-4 py-4">
                <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/5 p-2 overflow-hidden">
                    <div className="flex items-center gap-8 animate-[ticker_20s_linear_infinite] whitespace-nowrap">
                        {[...news, ...news].map((n: any, i: number) => (
                            <span key={i} className="text-xs font-bold text-slate-300 flex items-center gap-2">
                                <span className="text-amber-400">NEWS</span>
                                {n.title}: {n.content}
                            </span>
                        ))}
                    </div>
                </div>
                <style>{`
                    .no-scrollbar::-webkit-scrollbar { display: none; }
                    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                    @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                `}</style>
            </footer>
        </div>
    );
};

export default MainMenu;
