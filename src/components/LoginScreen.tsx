import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { playSound } from '../utils/sound';

interface LoginScreenProps {
    onLoginSuccess: (user: any) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
    const [loading, setLoading] = useState<string | null>(null);

    const handleLogin = (provider: 'google' | 'facebook') => {
        playSound('click');
        setLoading(provider);

        // Mock Login Process
        setTimeout(() => {
            const mockUser = {
                id: provider === 'google' ? 'google_user_001' : 'fb_user_001',
                name: provider === 'google' ? 'Google Player' : 'Facebook Player',
                avatar: provider === 'google'
                    ? 'https://lh3.googleusercontent.com/a/default-user=s96-c'
                    : 'https://platform-lookaside.fbsbx.com/platform/profilepic/',
                coins: 1000,
                inventory: [],
                mails: []
            };
            onLoginSuccess(mockUser);
        }, 1500);
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

            {/* Content */}
            <div className="relative z-10 w-full max-w-md p-8 flex flex-col items-center gap-8">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-black text-white tracking-widest drop-shadow-lg">
                        <span className="text-amber-500">STICK MAN</span> <span className="text-red-500">ESCAPE</span>
                    </h1>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.3em]">火柴人大逃亡</p>
                </div>

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
                                Continue with Google
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
                                Continue with Facebook
                            </>
                        )}
                    </motion.button>
                </div>

                <div className="text-xs text-slate-500 text-center px-8">
                    By continuing, you agree to our <span className="text-slate-400 underline">Terms of Service</span> and <span className="text-slate-400 underline">Privacy Policy</span>.
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
