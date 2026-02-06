import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, User, Trophy, ShoppingCart, Mail, Settings, Coins } from 'lucide-react';
import { playSound } from '../utils/sound';

interface GameCard {
    id: string;
    title: string;
    icon: React.ReactNode;
    color: string;
}

const games: GameCard[] = [
    { id: '2048', title: '2048', icon: <Gamepad2 className="w-10 h-10" />, color: 'from-sky-500 to-blue-700' },
    { id: 'pingpong', title: '桌球', icon: <Trophy className="w-10 h-10" />, color: 'from-emerald-500 to-green-700' },
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
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 via-red-800/60 to-amber-900/80" />
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fcd34d 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/50" />
            </div>

            {/* Top Bar */}
            <header className="relative z-10 px-4 py-3 flex items-center justify-between">
                {/* Left: Avatar */}
                <button onClick={() => handleAction('profile')} className="flex items-center gap-3 group">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-red-500 p-[2px] shadow-lg group-hover:shadow-amber-500/50">
                            <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center overflow-hidden">
                                {hasAvatar ? (
                                    <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={24} className="text-amber-400 opacity-60" />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="text-left">
                        <h2 className="text-lg font-black text-amber-100 group-hover:text-amber-300 transition-colors">{userData.name}</h2>
                        <p className="text-[9px] text-green-400 uppercase tracking-wider">● 在線</p>
                    </div>
                </button>

                {/* Center: Title */}
                <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
                    <h1 className="text-2xl font-black text-amber-400 drop-shadow-lg">🧧 新年快樂</h1>
                </div>

                {/* Right: Coins + Settings */}
                <div className="flex items-center gap-2">
                    <div className="bg-black/40 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-amber-500/30">
                        <Coins size={16} className="text-amber-400" />
                        <span className="text-sm font-black text-amber-400">{userData.coins || 0}</span>
                    </div>
                    <button onClick={() => handleAction('admin')} className="p-2 rounded-lg bg-black/40 border border-white/10 hover:bg-white/10">
                        <Settings size={18} className="text-white/70" />
                    </button>
                </div>
            </header>

            {/* Main Content - Fill remaining space */}
            <main className="relative z-10 flex-1 flex items-stretch px-4 py-2 gap-4">
                {/* Left Column: Shop & Mail (Stacked) */}
                <div className="flex flex-col gap-2 w-28 shrink-0">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAction('shop')}
                        className="flex-1 rounded-xl overflow-hidden border border-amber-500/30 shadow-lg relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-700" />
                        <div className="relative h-full flex flex-col items-center justify-center gap-2">
                            <ShoppingCart size={28} className="text-white" />
                            <span className="text-sm font-black text-white">商店</span>
                        </div>
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAction('mail')}
                        className="flex-1 rounded-xl overflow-hidden border border-purple-500/30 shadow-lg relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-700" />
                        <div className="relative h-full flex flex-col items-center justify-center gap-2">
                            <Mail size={28} className="text-white" />
                            <span className="text-sm font-black text-white">情報</span>
                        </div>
                    </motion.button>
                </div>

                {/* Right Area: Game Buttons (Horizontal Row) */}
                <div className="flex-1 flex items-center justify-center gap-4">
                    {games.map((game, index) => (
                        <motion.button
                            key={game.id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 + index * 0.1 }}
                            whileTap={{ scale: 0.97 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => handleAction(game.id)}
                            className="relative w-44 h-full max-h-40 rounded-2xl overflow-hidden shadow-2xl border border-white/20"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${game.color}`} />
                            <div className="relative z-10 h-full flex flex-col items-center justify-center gap-3">
                                <div className="p-3 bg-black/20 rounded-xl border border-white/20">
                                    {game.icon}
                                </div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight">{game.title}</h3>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </main>

            {/* Bottom: News Ticker */}
            <footer className="relative z-10 px-4 py-2">
                <div className="bg-black/40 h-8 rounded-lg flex items-center px-4 overflow-hidden border border-amber-500/20">
                    <div className="flex items-center gap-6 animate-[ticker_20s_linear_infinite] whitespace-nowrap">
                        {[...news, ...news].map((n: any, i: number) => (
                            <span key={i} className="text-xs font-bold text-amber-200/80">🎊 {n.title}: {n.content}</span>
                        ))}
                    </div>
                    <style>{`@keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
                </div>
            </footer>
        </div>
    );
};

export default MainMenu;
