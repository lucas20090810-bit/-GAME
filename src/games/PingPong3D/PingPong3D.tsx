import React, { useState } from 'react';
import PingPongMenu from './PingPongMenu';
import DifficultySelect from './DifficultySelect';
import PingPong3DGame from './PingPong3DGame';
import type { Difficulty } from './types';

type Screen = 'menu' | 'difficulty' | 'game';

interface PingPong3DProps {
    onBack: () => void;
}

const PingPong3D: React.FC<PingPong3DProps> = ({ onBack }) => {
    const [screen, setScreen] = useState<Screen>('menu');
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');

    const handleSelectMode = (mode: 'ai' | 'online') => {
        if (mode === 'ai') {
            setScreen('difficulty');
        } else {
            // 線上模式暫時不可用
            alert('線上對戰功能即將推出，敬請期待！');
        }
    };

    const handleSelectDifficulty = (d: Difficulty) => {
        setDifficulty(d);
        setScreen('game');
    };

    const handleBackToMenu = () => {
        setScreen('menu');
    };

    const handleBackToDifficulty = () => {
        setScreen('difficulty');
    };

    return (
        <>
            {screen === 'menu' && (
                <PingPongMenu onSelectMode={handleSelectMode} onBack={onBack} />
            )}
            {screen === 'difficulty' && (
                <DifficultySelect onSelectDifficulty={handleSelectDifficulty} onBack={handleBackToMenu} />
            )}
            {screen === 'game' && (
                <PingPong3DGame difficulty={difficulty} onBack={handleBackToDifficulty} />
            )}
        </>
    );
};

export default PingPong3D;
