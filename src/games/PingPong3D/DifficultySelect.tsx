import React from 'react';
import { motion } from 'framer-motion';
import type { Difficulty } from './types';
import { playSound } from '../../utils/sound';

interface DifficultySelectProps {
    onSelectDifficulty: (difficulty: Difficulty) => void;
    onBack: () => void;
}

const DifficultySelect: React.FC<DifficultySelectProps> = ({ onSelectDifficulty, onBack }) => {
    const difficulties: { level: Difficulty; label: string; description: string; color: string }[] = [
        {
            level: 'easy',
            label: '簡單',
            description: 'AI 反應慢，容易失誤',
            color: 'from-green-500 to-green-600',
        },
        {
            level: 'medium',
            label: '中等',
            description: 'AI 反應正常，偶爾失誤',
            color: 'from-yellow-500 to-yellow-600',
        },
        {
            level: 'hard',
            label: '困難',
            description: 'AI 反應極快，幾乎不失誤',
            color: 'from-red-500 to-red-600',
        },
    ];

    const handleSelect = (difficulty: Difficulty) => {
        playSound('click');
        onSelectDifficulty(difficulty);
    };

    return (
        <div className="fixed inset-0 bg-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-black text-white mb-2">選擇難度</h2>
                    <p className="text-slate-400 text-sm">挑戰不同等級的 AI 對手</p>
                </div>

                <div className="space-y-4">
                    {difficulties.map(({ level, label, description, color }) => (
                        <motion.button
                            key={level}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSelect(level)}
                            className={`w-full p-6 rounded-xl bg-gradient-to-r ${color} shadow-lg text-white`}
                        >
                            <div className="text-left">
                                <div className="text-2xl font-bold mb-2">{label}</div>
                                <div className="text-sm opacity-90">{description}</div>
                            </div>
                        </motion.button>
                    ))}
                </div>

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        playSound('click');
                        onBack();
                    }}
                    className="w-full py-3 bg-slate-700 text-white rounded-xl font-bold"
                >
                    返回
                </motion.button>
            </div>
        </div>
    );
};

export default DifficultySelect;
