import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, User, Trophy, ShoppingCart, Mail, Settings, Coins } from 'lucide-react';
import { playSound } from '../utils/sound';

interface GameCard {
    id: string;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
}

const games: GameCard[] = [
    {
        id: '2048',
        title: '2048',
        subtitle: '益智合體',
        icon: <Gamepad2 className="w-8 h-8" />,
        color: 'from-sky-500 to-blue-700'
    },
    {
        id: 'pingpong',
        title: '打桌球',
        subtitle: '反應挑戰',
        icon: <Trophy className="w-8 h-8" />,
        color: 'from-emerald-500 to-green-700'
    },
];

const MainMenu: React.FC<{ userData: any; news: any[]; onSelectGame: (id: string) => void }> = ({ userData, news, onSelectGame }) => {
    const handleAction = (id: string) => {
        playSound('click');
        onSelectGame(id);
    };

    // Get avatar from userData (could be base64 or URL)
    const avatarSrc = userData?.avatar || '';
    const hasAvatar = avatarSrc && avatarSrc.length > 10;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-screen w-screen flex flex-col overflow-hidden"
        >
            {/* Chinese New Year Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-red-800 to-amber-900" />
                {/* Lantern decorations */}
                <div className="absolute top-0 left-[10%] w-16 h-24 bg-gradient-to-b from-red-500 to-red-700 rounded-full opacity-60 blur-sm animate-pulse" />
                <div className="absolute top-0 left-[30%] w-12 h-20 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full opacity-50 blur-sm animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="absolute top-0 right-[20%] w-14 h-22 bg-gradient-to-b from-red-600 to-red-800 rounded-full opacity-55 blur-sm animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-0 right-[5%] w-10 h-18 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full opacity-45 blur-sm animate-pulse" style={{ animationDelay: '1.5s' }} />
                {/* Gold particles */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fcd34d 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
            </div>

            {/* Top Bar - Avatar (Left) | Title (Center) | Coins & Settings (Right) */}
            <header className="relative z-10 px-6 py-3 flex items-center justify-between">
                {/* Left: Avatar + Name */}
                <button onClick={() => handleAction('profile')} className="flex items-center gap-3 group cursor-pointer">
                    <div className="relative">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 via-red-500 to-amber-400 p-[3px] shadow-2xl shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-shadow">
                            <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center overflow-hidden">
                                {hasAvatar ? (
                                    <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={28} className="text-amber-400 opacity-60" />
                                )}
                            </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-amber-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded-md border-2 border-black shadow-lg">
                            Lv.42
                        </div>
                    </div>
                    <div className="text-left">
                        <h2 className="text-xl font-black italic tracking-tight uppercase leading-none text-amber-100 drop-shadow-md group-hover:text-amber-300 transition-colors">{userData.name}</h2>
                        <div className="flex items-center gap-1 mt-1">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[9px] font-bold uppercase tracking-wider text-green-400/80">在線</span>
                        </div>
                    </div>
                </button>

                {/* Center: Title */}
                <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                    <h1 className="text-2xl font-black italic text-amber-400 drop-shadow-[0_2px_10px_rgba(251,191,36,0.5)]">🧧 新年快樂 🧧</h1>
                    <p className="text-[10px] font-bold text-amber-200/60 uppercase tracking-widest">HAPPY NEW YEAR</p>
                </div>

                {/* Right: Coins + Settings */}
                <div className="flex items-center gap-3">
                    {/* Coins */}
                    <div className="glass-panel-heavy px-4 py-2 rounded-xl flex items-center gap-2 border border-amber-500/30 shadow-xl bg-black/30">
                        <Coins size={20} className="text-amber-400" />
                        <span className="text-lg font-black italic text-amber-400">{userData.coins || 0}</span>
                    </div>
                    {/* Settings */}
                    <button onClick={() => handleAction('admin')} className="p-3 rounded-xl bg-black/30 border border-white/10 hover:bg-white/10 transition-colors">
                        <Settings size={22} className="text-white/70" />
                    </button>
                </div>
            </header>

            {/* Main Content - Horizontal Layout */}
            <main className="relative z-10 flex-1 px-6 py-4 flex items-center gap-6">
                {/* Left Column: Shop & Mail (Vertical) */}
                <div className="flex flex-col gap-3 w-32 shrink-0">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAction('shop')}
                        className="relative h-28 rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-700" />
                        <div className="relative h-full flex flex-col items-center justify-center gap-2">
                            <ShoppingCart size={28} className="text-white drop-shadow-md" />
                            <span className="text-xs font-black text-white uppercase">商店</span>
                        </div>
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAction('mail')}
                        className="relative h-28 rounded-2xl overflow-hidden border-2 border-purple-500/30 shadow-xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-700" />
                        <div className="relative h-full flex flex-col items-center justify-center gap-2">
                            <Mail size={28} className="text-white drop-shadow-md" />
                            <span className="text-xs font-black text-white uppercase">情報</span>
                        </div>
                    </motion.button>
                </div>

                {/* Right Area: Game Mode Buttons (Horizontal) */}
                <div className="flex-1 flex items-center justify-center gap-6">
                    {games.map((game, index) => (
                        <motion.button
                            key={game.id}
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            whileTap={{ scale: 0.97 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => handleAction(game.id)}
                            className="relative w-56 h-40 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 flex flex-col items-center justify-center"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-95`} />
                            <div className="relative z-10 flex flex-col items-center gap-2">
                                <div className="p-4 bg-black/20 rounded-2xl border border-white/20">
                                    {game.icon}
                                </div>
                                <h3 className="text-2xl font-black italic text-white leading-none uppercase tracking-tight">{game.title}</h3>
                                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{game.subtitle}</p>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </main>

            {/* News Ticker at Bottom */}
            <footer className="relative z-10 px-6 py-2">
                <div className="glass-panel-heavy h-10 rounded-xl border-amber-500/20 flex items-center px-4 overflow-hidden relative bg-black/30">
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/80 to-transparent z-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/80 to-transparent z-10" />
                    <div className="flex items-center gap-8 animate-[ticker_20s_linear_infinite] whitespace-nowrap">
                        {[...news, ...news].map((n: any, i: number) => (
                            <div key={i} className="flex items-center gap-2">
                                <span className="text-amber-400 text-xs font-bold">🎊</span>
                                <span className="text-xs font-bold text-amber-200/80">{n.title}: {n.content}</span>
                            </div>
                        ))}
                    </div>
                    <style>{`
                        @keyframes ticker {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(-50%); }
                        }
                    `}</style>
                </div>
            </footer>
        </motion.div>
    );
};

export default MainMenu;
