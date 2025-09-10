
import React from 'react';
import { Story } from '../types';

interface MyStorybooksProps {
  storybooks: Story[];
  onSelectStory: (story: Story) => void;
}

const MyStorybooks: React.FC<MyStorybooksProps> = ({ storybooks, onSelectStory }) => {
  return (
    <div className="p-8 bg-white/70 rounded-2xl shadow-xl animate-fade-in">
      <h2 className="text-3xl font-bold text-slate-700 mb-6 text-center">My Storybooks</h2>
      {storybooks.length === 0 ? (
        <p className="text-center text-slate-500 text-lg">You haven't saved any stories yet. Create a new story and save it to see it here!</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {storybooks.map((story) => (
            <div
              key={story.id}
              onClick={() => onSelectStory(story)}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300 group"
            >
              <img src={story.imageUrl} alt={story.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-slate-800 truncate group-hover:text-orange-500 transition-colors">{story.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyStorybooks;
