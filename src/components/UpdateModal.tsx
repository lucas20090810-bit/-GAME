import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Sparkles, RefreshCw } from 'lucide-react';

interface UpdateInfo {
    version: string;
    message: string;
    changelog?: string[];
}

interface UpdateModalProps {
    info: UpdateInfo | null;
    onUpdate: () => void;
    onCancel: () => void;
}

const UpdateModal: React.FC<UpdateModalProps> = ({ info, onUpdate, onCancel }) => {
    return (
        <AnimatePresence>
            {info && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={onCancel}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        className="relative w-full max-w-sm bg-slate-900 rounded-3xl p-6 border border-white/10 shadow-2xl overflow-hidden"
                    >
                        {/* Decorative Background Effects */}
                        <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700" />

                        {/* Content */}
                        <div className="relative z-10 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                                <Sparkles className="text-white w-8 h-8" />
                            </div>

                            <h2 className="text-2xl font-black text-white mb-1">發現新版本</h2>
                            <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
                                v{info.version}
                            </p>

                            <div className="bg-white/5 rounded-xl p-4 mb-6 text-left border border-white/5">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">更新內容</div>
                                <ul className="space-y-2">
                                    {info.changelog && info.changelog.length > 0 ? (
                                        info.changelog.map((item, i) => (
                                            <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                                <span className="mt-1.5 w-1 h-1 rounded-full bg-blue-400 shrink-0" />
                                                {item}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-sm text-slate-300">{info.message || '修復已知問題與優化體驗'}</li>
                                    )}
                                </ul>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={onCancel}
                                    className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-400 hover:bg-white/5 transition-colors"
                                >
                                    稍後
                                </button>
                                <button
                                    onClick={onUpdate}
                                    className="flex-[2] py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group"
                                >
                                    <Download size={18} className="group-hover:animate-bounce" />
                                    立即更新
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default UpdateModal;
