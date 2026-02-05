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
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-8 pb-10">
            <header className="flex items-center gap-4 mb-4">
                <button onClick={onBack} className="p-2 glass-card hover:bg-white/10 transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <h2 className="text-2xl font-bold">個人檔案</h2>
            </header>

            <div className="flex flex-col items-center gap-6 py-8 glass-card">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/30 group-hover:border-primary transition-colors">
                        <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <label className="absolute bottom-0 right-0 p-2 bg-primary rounded-full cursor-pointer hover:scale-110 transition-transform">
                        <Camera size={20} className="text-white" />
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                </div>

                <div className="w-full px-8 space-y-4">
                    <div>
                        <label className="text-xs text-slate-400 uppercase mb-1 block">玩家名稱</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                    <div className="pt-4">
                        <button
                            onClick={handleSave}
                            className="w-full py-4 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                        >
                            <Save size={20} />
                            儲存更新
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="glass-card p-4 text-center">
                    <p className="text-xs text-slate-400">錢包餘額</p>
                    <p className="text-xl font-bold text-yellow-500">{userData.coins} 💰</p>
                </div>
                <div className="glass-card p-4 text-center">
                    <p className="text-xs text-slate-400">擁有道具</p>
                    <p className="text-xl font-bold">{userData.inventory.length}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default ProfileScreen;
