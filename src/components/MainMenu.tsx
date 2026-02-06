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
    { id: '2048', title: '2048', icon: <Gamepad2 className="w-8 h-8" />, color: 'from-sky-500 to-blue-700' },
    { id: 'pingpong', title: '桌球', icon: <Trophy className="w-8 h-8" />, color: 'from-emerald-500 to-green-700' },
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
                    className="w-full h-full object-cover"
                    alt="bg"
                    style={{ filter: 'brightness(0.4) saturate(1.2)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
            </div>

            {/* Top Bar */}
            <header className="relative z-10 px-4 py-2 flex items-center justify-between">
                {/* Left: Avatar */}
                <button onClick={() => handleAction('profile')} className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 p-[2px] shadow-lg">
                        <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center overflow-hidden">
                            {hasAvatar ? (
                                <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User size={18} className="text-amber-400 opacity-60" />
                            )}
                        </div>
                    </div>
                    <div className="text-left">
                        <h2 className="text-sm font-bold text-white">{userData.name}</h2>
                        <p className="text-[8px] text-green-400 uppercase">● 在線</p>
                    </div>
                </button>

                {/* Center: Title */}
                <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
                    <h1 className="text-xl font-black text-white drop-shadow-lg">🏃 火柴人大逃亡</h1>
                </div>

                {/* Right: Coins + Settings */}
                <div className="flex items-center gap-2">
                    <div className="bg-black/40 px-2 py-1 rounded-lg flex items-center gap-1 border border-amber-500/30">
                        <Coins size={14} className="text-amber-400" />
                        <span className="text-xs font-bold text-amber-400">{userData.coins || 0}</span>
                    </div>
                    {/* User Settings Button (Replaced Admin) */}
                    <button onClick={() => handleAction('profile')} className="p-1.5 rounded-lg bg-black/40 border border-white/10 hover:bg-white/10">
                        <Settings size={16} className="text-white/70" />
                        {/* Admin is now inside the Profile Settings page or hidden */}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex-1 flex items-center px-4 py-2 gap-3">
                {/* Left: Shop & Mail */}
                <div className="flex flex-col gap-2 w-24 shrink-0">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAction('shop')}
                        className="flex-1 rounded-xl overflow-hidden border border-amber-500/30 shadow-lg relative min-h-[60px]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-700" />
                        <div className="relative h-full flex flex-col items-center justify-center gap-1">
                            <ShoppingCart size={22} className="text-white" />
                            <span className="text-xs font-bold text-white">商店</span>
                        </div>
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAction('mail')}
                        className="flex-1 rounded-xl overflow-hidden border border-purple-500/30 shadow-lg relative min-h-[60px]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-700" />
                        <div className="relative h-full flex flex-col items-center justify-center gap-1">
                            <Mail size={22} className="text-white" />
                            <span className="text-xs font-bold text-white">情報</span>
                        </div>
                    </motion.button>
                </div>

                {/* Center: Game Buttons */}
                <div className="flex-1 flex items-center justify-center gap-4">
                    {games.map((game, index) => (
                        <motion.button
                            key={game.id}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleAction(game.id)}
                            className="relative w-36 h-28 rounded-xl overflow-hidden shadow-2xl border border-white/20"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${game.color}`} />
                            <div className="relative z-10 h-full flex flex-col items-center justify-center gap-2">
                                <div className="p-2 bg-black/20 rounded-lg border border-white/20">
                                    {game.icon}
                                </div>
                                <h3 className="text-lg font-black text-white uppercase">{game.title}</h3>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </main>

            {/* Bottom: News */}
            <footer className="relative z-10 px-4 py-1.5">
                <div className="bg-black/40 h-6 rounded-lg flex items-center px-3 overflow-hidden border border-white/10">
                    <div className="flex items-center gap-6 animate-[ticker_20s_linear_infinite] whitespace-nowrap">
                        {[...news, ...news].map((n: any, i: number) => (
                            <span key={i} className="text-[10px] font-bold text-white/70">📰 {n.title}: {n.content}</span>
                        ))}
                    </div>
                    <style>{`@keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
                </div>
            </footer>
        </div>
    );
};

export default MainMenu;
