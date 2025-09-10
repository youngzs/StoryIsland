
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';

interface HeaderProps {
    onLogoClick: () => void;
    onSettingsClick: () => void;
    onMyStorybooksClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick, onSettingsClick, onMyStorybooksClick }) => {
  return (
    <header 
        className="w-full max-w-4xl p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-between"
    >
        <button onClick={onSettingsClick} className="p-2 rounded-full hover:bg-sky-100 transition-colors" aria-label="Settings">
            <SettingsIcon className="w-8 h-8 text-sky-600" />
        </button>
        <div 
            className="flex items-center justify-center cursor-pointer"
            onClick={onLogoClick}
            role="button"
            aria-label="Go to story creator"
        >
            <SparklesIcon className="w-10 h-10 text-yellow-500" />
            <h1 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-sky-500 ml-4">
                Wonderful Story Island
            </h1>
        </div>
         <button onClick={onMyStorybooksClick} className="p-2 rounded-full hover:bg-sky-100 transition-colors" aria-label="My Storybooks">
            <BookOpenIcon className="w-8 h-8 text-sky-600" />
        </button>
    </header>
  );
};

export default Header;
