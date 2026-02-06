import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/sound';

interface LoginScreenProps {
    onLoginSuccess: (user: any) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
    const [loading, setLoading] = useState<string | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState<{ provider: 'google' | 'facebook', email: string } | null>(null);

    const handleLogin = async (provider: 'google' | 'facebook') => {
        playSound('click');

        // Simulate OAuth confirmation dialog (like real apps)
        const mockEmail = provider === 'google'
            ? 'player@gmail.com'
            : 'player@facebook.com';

        setShowConfirmDialog({ provider, email: mockEmail });
    };

    const confirmLogin = () => {
        if (!showConfirmDialog) return;

        setLoading(showConfirmDialog.provider);
        setShowConfirmDialog(null);

        // Simulate OAuth processing delay (real apps show loading screen)
        setTimeout(() => {
            const mockUser = {
                id: showConfirmDialog.provider === 'google' ? 'google_user_001' : 'fb_user_001',
                name: showConfirmDialog.provider === 'google' ? 'Google Player' : 'Facebook Player',
                email: showConfirmDialog.email,
                avatar: showConfirmDialog.provider === 'google'
                    ? 'https://lh3.googleusercontent.com/a/default-user=s96-c'
                    : 'https://graph.facebook.com/me/picture?type=large',
                coins: 1000,
                inventory: [],
                mails: []
            };
            onLoginSuccess(mockUser);
        }, 1500);
    };

    const cancelLogin = () => {
        playSound('click');
        setShowConfirmDialog(null);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80"
                    className="w-full h-full object-cover opacity-40"
                    alt="bg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/50" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-md p-8 flex flex-col items-center gap-8">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-black text-white tracking-widest drop-shadow-lg">
                        <span className="text-amber-500">STICK MAN</span> <span className="text-red-500">ESCAPE</span>
                    </h1>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.3em]">火柴人大逃亡</p>
                </div>

                {!showConfirmDialog && (
                    <div className="w-full space-y-4">
                        {/* Google Login */}
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleLogin('google')}
                            disabled={!!loading}
                            className="w-full py-4 bg-white text-slate-800 font-bold rounded-xl shadow-lg flex items-center justify-center gap-3 relative overflow-hidden group"
                        >
                            {loading === 'google' ? (
                                <span className="animate-pulse">登入中...</span>
                            ) : (
                                <>
                                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 4.61c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    繼續使用 Google
                                </>
                            )}
                        </motion.button>

                        {/* Facebook Login */}
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleLogin('facebook')}
                            disabled={!!loading}
                            className="w-full py-4 bg-[#1877F2] text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-3 relative overflow-hidden"
                        >
                            {loading === 'facebook' ? (
                                <span className="animate-pulse">登入中...</span>
                            ) : (
                                <>
                                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    繼續使用 Facebook
                                </>
                            )}
                        </motion.button>
                    </div>
                )}

                <div className="text-xs text-slate-500 text-center px-8">
                    By continuing, you agree to our <span className="text-slate-400 underline">Terms of Service</span> and <span className="text-slate-400 underline">Privacy Policy</span>.
                </div>
            </div>

            {/* OAuth Confirmation Dialog (simulates real OAuth flow) */}
            <AnimatePresence>
                {showConfirmDialog && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="w-11/12 max-w-md bg-white rounded-2xl p-6 shadow-2xl"
                        >
                            <div className="flex flex-col gap-4">
                                {/* Provider Icon */}
                                <div className="flex justify-center">
                                    {showConfirmDialog.provider === 'google' ? (
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                                            <svg className="w-10 h-10" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                <path fill="#EA4335" d="M12 4.61c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                            </svg>
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 bg-[#1877F2] rounded-full flex items-center justify-center">
                                            <svg className="w-10 h-10 fill-white" viewBox="0 0 24 24">
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* Dialog Content */}
                                <div className="text-center space-y-2">
                                    <h3 className="text-xl font-bold text-slate-800">
                                        {showConfirmDialog.provider === 'google' ? 'Google' : 'Facebook'} 將會分享
                                    </h3>
                                    <p className="text-sm text-slate-600">
                                        火柴人大逃亡 wants to access your {showConfirmDialog.provider === 'google' ? 'Google' : 'Facebook'} account
                                    </p>
                                    <div className="bg-slate-100 rounded-lg p-3 mt-4">
                                        <p className="text-xs text-slate-500 mb-2">This will allow the app to:</p>
                                        <ul className="text-xs text-slate-700 space-y-1 text-left">
                                            <li>✓ View your profile information</li>
                                            <li>✓ View your email address</li>
                                        </ul>
                                    </div>
                                    <p className="text-xs text-slate-500 pt-2">
                                        {showConfirmDialog.email}
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={cancelLogin}
                                        className="flex-1 py-3 border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition"
                                    >
                                        取消
                                    </button>
                                    <button
                                        onClick={confirmLogin}
                                        className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg"
                                    >
                                        繼續
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LoginScreen;
