import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, User, Trophy, ShoppingCart, Mail, Plus, Settings } from 'lucide-react';
import { playSound } from '../utils/sound';
import { CONFIG } from '../config';

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
        title: '2048 經典版',
        subtitle: '益智合體 ‧ 挑戰巔峰',
        icon: <Gamepad2 className="w-12 h-12" />,
        color: 'from-sky-500 to-blue-700'
    },
    {
        id: 'shop',
        title: '補給商城',
        subtitle: '裝備強化 ‧ 限時優惠',
        icon: <ShoppingCart className="w-12 h-12" />,
        color: 'from-amber-500 to-orange-700'
    },
    {
        id: 'mail',
        title: '情報中心',
        subtitle: '戰報讀取 ‧ 系統通知',
        icon: <Mail className="w-12 h-12" />,
        color: 'from-indigo-500 to-purple-700'
    },
    {
        id: 'pingpong',
        title: '打桌球',
        subtitle: '反應挑戰 ‧ 極限操作',
        icon: <Trophy className="w-12 h-12" />,
        color: 'from-emerald-500 to-green-700'
    },
];

const MainMenu: React.FC<{ userData: any; news: any[]; onSelectGame: (id: string) => void }> = ({ userData, news, onSelectGame }) => {
    React.useEffect(() => {
        console.log(">>> [MENU] MOUNTED. User:", userData?.name);
    }, [userData]);

    const handleAction = (id: string) => {
        playSound('click');
        onSelectGame(id);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col overflow-hidden pb-safe-bottom"
        >
            {/* Background Art Overlay */}
            <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
                <img
                    src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1000"
                    className="w-full h-full object-cover"
                    alt="bg"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
            </div>

            {/* Top Info Bar */}
            <header className="relative z-10 p-0 py-4 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-primary via-secondary to-primary p-[3px] shadow-2xl shadow-primary/30">
                                <div className="w-full h-full bg-slate-900 rounded-[17px] flex items-center justify-center overflow-hidden">
                                    <User size={36} className="text-primary opacity-40" />
                                </div>
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-black text-[12px] font-black px-2 py-0.5 rounded-lg border-2 border-black shadow-lg">
                                Lv.42
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-white drop-shadow-md">{userData.name}</h2>
                            <div className="flex items-center gap-1.5 mt-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500/80">Operational</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 scale-110">
                        {/* Coins */}
                        <div className="glass-panel-heavy px-4 py-2.5 rounded-2xl flex items-center gap-2 border-white/10 shadow-2xl whitespace-nowrap">
                            <div className="w-6 h-6 bg-gradient-to-t from-amber-600 to-amber-400 rounded-full flex items-center justify-center text-[11px] font-black text-black border border-white/20">₵</div>
                            <span className="text-base font-black italic text-amber-400">{userData.coins || 0}</span>
                            <div className="ml-1 p-0.5 bg-primary/20 rounded-md">
                                <Plus size={14} className="text-primary hover:scale-125 transition-transform" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* News Ticker (Classic Game Style) */}
                <div className="glass-panel-heavy h-12 rounded-xl border-white/10 flex items-center px-5 overflow-hidden relative shadow-inner">
                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0f172a] to-transparent z-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0f172a] to-transparent z-10" />

                    <div className="flex items-center gap-10 animate-[ticker_25s_linear_infinite] whitespace-nowrap">
                        {[...news, ...news].map((n: any, i: number) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="px-2.5 py-1 bg-sky-600/20 text-sky-400 border border-sky-400/30 text-[10px] font-black rounded italic uppercase tracking-widest">Broadcast</span>
                                <span className="text-xs font-black text-white/70 italic tracking-wide">{n.title}: {n.content}</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
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
            </header>

            {/* Game Tiles Vertical Stack */}
            <section className="relative z-10 flex-1 px-5 py-2 flex flex-col gap-5 overflow-y-auto mt-2 custom-scrollbar">
                {games.map((game, index) => (
                    <motion.button
                        key={game.id}
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 + index * 0.1, type: 'spring', damping: 20 }}
                        whileTap={{ scale: 0.96, y: 4 }}
                        onClick={() => handleAction(game.id)}
                        className={`relative w-full p-8 h-36 rounded-[2.5rem] overflow-hidden group shadow-[0_20px_40px_rgba(0,0,0,0.6)] border-t-2 border-white/15`}
                    >
                        {/* Background Color/Gradient with Texture */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-95 transition-all group-active:brightness-110`} />
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />

                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 shimmer-bg opacity-30" />

                        {/* Content */}
                        <div className="relative h-full flex items-center justify-between">
                            <div className="text-left">
                                <h3 className="text-4xl font-black italic tracking-tighter text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] scale-y-110 scale-x-105 mb-2 leading-none uppercase">{game.title}</h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-4 bg-white/40 rounded-full" />
                                    <p className="text-[11px] font-black text-white/70 uppercase tracking-[0.3em] italic">{game.subtitle}</p>
                                </div>
                            </div>

                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="p-5 bg-black/20 rounded-3xl border-2 border-white/20 backdrop-blur-md rotate-[-8deg] group-hover:rotate-0 transition-all duration-500 shadow-xl"
                            >
                                <div className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                                    {game.icon}
                                </div>
                            </motion.div>
                        </div>

                        {/* Decoration Icon */}
                        <div className="absolute bottom-3 right-6 flex items-center gap-2 opacity-30">
                            <div className="w-10 h-[2px] bg-white/40 rounded-full" />
                            <span className="text-[10px] font-black italic tracking-widest uppercase text-white">Engage</span>
                        </div>
                    </motion.button>
                ))}
            </section>

            {/* Version Numbers in Corners */}
            <div className="relative z-10 px-8 py-2 flex justify-between items-center opacity-30 pointer-events-none">
                <p className="text-[10px] font-black italic tracking-tighter uppercase whitespace-nowrap">App: {CONFIG.APP_VERSION}</p>
                <div className="flex items-center gap-4">
                    <p className="text-[10px] font-black italic tracking-tighter uppercase whitespace-nowrap text-amber-500">Secure Line</p>
                    <p className="text-[10px] font-black italic tracking-tighter uppercase whitespace-nowrap">Res: {CONFIG.RESOURCE_VERSION}</p>
                </div>
            </div>

            {/* Bottom Tab Bar (Custom High-End Mobile Menu) */}
            <nav className="relative z-20 mx-6 mt-2 mb-4 h-20 glass-panel-heavy rounded-[2rem] border-white/15 flex items-center justify-around shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
                {[
                    { icon: <User size={28} />, label: '基地', id: 'profile' },
                    { icon: <Mail size={28} />, label: '報告', id: 'mail' },
                    { icon: <Trophy size={28} />, label: '排行榜', id: 'more' },
                    { icon: <Settings size={28} />, label: '設置', id: 'admin' },
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleAction(item.id)}
                        className="flex flex-col items-center gap-1 active:scale-95 transition-all text-white/30 hover:text-sky-400 group relative py-2 px-4"
                    >
                        <motion.div whileHover={{ y: -4 }}>{item.icon}</motion.div>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] group-hover:text-sky-400 transition-colors">{item.label}</span>
                        <div className="absolute -bottom-1 w-1 h-1 bg-sky-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                ))}
            </nav>
        </motion.div>
    );
};

export default MainMenu;
