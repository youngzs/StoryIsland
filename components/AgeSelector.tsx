
import React from 'react';
import { AgeGroup } from '../types';
import { AGE_GROUPS } from '../constants';

interface AgeSelectorProps {
  onSelect: (ageGroup: AgeGroup) => void;
}

const AgeSelector: React.FC<AgeSelectorProps> = ({ onSelect }) => {
  return (
    <div className="text-center p-8 bg-white/70 rounded-2xl shadow-xl animate-fade-in">
      <h2 className="text-3xl font-bold text-slate-700 mb-2">Welcome, little explorer!</h2>
      <p className="text-lg text-slate-500 mb-8">How old are you?</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {(Object.keys(AGE_GROUPS) as AgeGroup[]).map((ageGroup) => (
          <button
            key={ageGroup}
            onClick={() => onSelect(ageGroup)}
            className={`p-8 rounded-2xl text-white text-3xl font-bold shadow-lg transform hover:scale-105 transition-transform duration-300 ${AGE_GROUPS[ageGroup].color}`}
          >
            {AGE_GROUPS[ageGroup].label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AgeSelector;
