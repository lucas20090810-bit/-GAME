import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Save, ChevronLeft } from 'lucide-react';

const ProfileScreen: React.FC<{ userData: any; onUpdate: (data: any) => void; onBack: () => void }> = ({ userData, onUpdate, onBack }) => {
    const [name, setName] = useState(userData.name);
    const [avatar, setAvatar] = useState(userData.avatar);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setAvatar(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        onUpdate({ name, avatar });
    };

    return (
        <div className="fixed inset-0 flex bg-slate-900 overflow-hidden">
            {/* Left: Back Button */}
            <div className="flex flex-col justify-between py-4 px-4 h-full">
                <button onClick={onBack} className="p-3 glass-card hover:bg-white/10 transition-colors rounded-xl">
                    <ChevronLeft size={24} />
                </button>

                {/* Hidden Admin Entry */}
                <button
                    onClick={() => onUpdate({ ...userData, openAdmin: true })}
                    className="p-2 opacity-30 hover:opacity-100 transition-opacity"
                >
                    <span className="text-[10px] uppercase text-slate-500">v1.2.9</span>
                </button>
            </div>

            {/* Center: Profile Card */}
            <div className="flex-1 flex items-center justify-center py-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 rounded-2xl max-w-md w-full mx-4 flex flex-col gap-4"
                >
                    <h2 className="text-xl font-bold text-center">遊戲設定</h2>

                    {/* Avatar Row */}
                    <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary/30">
                                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                            <label className="absolute bottom-0 right-0 p-1.5 bg-primary rounded-full cursor-pointer hover:scale-110 transition-transform">
                                <Camera size={14} className="text-white" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        </div>

                        {/* Name Input */}
                        <div className="flex-1">
                            <label className="text-xs text-slate-400 uppercase mb-1 block">玩家名稱</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex gap-4">
                        <div className="flex-1 glass-card p-3 text-center rounded-lg">
                            <p className="text-[10px] text-slate-400">錢包餘額</p>
                            <p className="text-lg font-bold text-yellow-500">{userData.coins} 💰</p>
                        </div>
                        <div className="flex-1 glass-card p-3 text-center rounded-lg">
                            <p className="text-[10px] text-slate-400">擁有道具</p>
                            <p className="text-lg font-bold">{userData.inventory?.length || 0}</p>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        className="w-full py-3 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    >
                        <Save size={18} />
                        儲存更新
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfileScreen;
