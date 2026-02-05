import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';

const Mailbox: React.FC<{ mails: any[]; onBack: () => void }> = ({ mails, onBack }) => {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6 pb-10">
            <header className="flex items-center gap-4 mb-2">
                <button onClick={onBack} className="p-2 glass-card hover:bg-white/10 transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <h2 className="text-2xl font-bold">郵件系統</h2>
            </header>

            {mails.length === 0 ? (
                <div className="glass-card p-12 text-center text-slate-500">
                    目前沒有任何郵件
                </div>
            ) : (
                <div className="space-y-4">
                    {mails.map((mail, idx) => (
                        <motion.div
                            key={mail.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`glass-card p-5 border-l-4 ${mail.read ? 'border-slate-600 opacity-70' : 'border-primary'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold flex items-center gap-2">
                                    {!mail.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                                    {mail.title}
                                </span>
                                <span className="text-xs text-slate-500">{mail.date}</span>
                            </div>
                            <p className="text-sm text-slate-400 mb-4">{mail.content}</p>
                            {!mail.read && (
                                <button className="text-xs text-primary font-bold flex items-center gap-1 hover:underline">
                                    <CheckCircle2 size={14} /> 標記為已讀
                                </button>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default Mailbox;
