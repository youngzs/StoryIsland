
import React from 'react';
import { AgeGroup } from '../types';
import { AGE_GROUPS } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAgeGroup: AgeGroup | null;
  onAgeGroupChange: (ageGroup: AgeGroup) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentAgeGroup, onAgeGroupChange }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="settings-title" className="text-3xl font-bold text-slate-700 mb-6 text-center">Settings</h2>
        <h3 className="text-xl text-slate-600 mb-4 text-center">Change Age Group</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(Object.keys(AGE_GROUPS) as AgeGroup[]).map((ageGroup) => (
            <button
              key={ageGroup}
              onClick={() => onAgeGroupChange(ageGroup)}
              className={`p-6 rounded-xl text-white text-2xl font-bold shadow-lg transform hover:scale-105 transition-all duration-300 ${AGE_GROUPS[ageGroup].color} ${currentAgeGroup === ageGroup ? 'ring-4 ring-offset-2 ring-sky-500' : ''}`}
            >
              {AGE_GROUPS[ageGroup].label}
            </button>
          ))}
        </div>
        <div className="text-center mt-8">
            <button onClick={onClose} className="px-8 py-3 bg-sky-500 text-white font-bold rounded-full shadow-lg hover:bg-sky-600 transition-colors">
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
