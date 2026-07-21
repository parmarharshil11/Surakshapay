import React from 'react';
import { BookOpen, HelpCircle, History, Info, Award, ChevronRight } from 'lucide-react';

export default function Menu({ setTab, t }) {
  const menuItems = [
    { id: 'library', icon: BookOpen, label: t.navLibrary, desc: t.btnLearnScamsDesc || 'Learn about scams', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-500/10' },
    { id: 'quiz', icon: Award, label: t.navQuiz, desc: t.btnPlayQuizDesc || 'Test your knowledge', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
    { id: 'helpline', icon: HelpCircle, label: t.navHelpline, desc: t.helplineCardDesc || 'Emergency contacts', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10' },
    { id: 'history', icon: History, label: t.navHistory, desc: t.homeViewHistory || 'View past checks', color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-500/10' },
    { id: 'about', icon: Info, label: t.navAbout, desc: 'About SurakshaPay', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
  ];

  return (
    <div className="space-y-4 animate-fade-in text-left max-w-md mx-auto mt-2 mb-8">
      <h2 className="text-2xl font-bold px-2 mb-6 text-slate-800 dark:text-slate-100">Menu</h2>
      
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className="w-full flex items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
            >
              <div className={`p-3 rounded-xl ${item.bg} ${item.color} mr-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-grow text-left">
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.label}
                </h3>
                {item.desc && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.desc}
                  </p>
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
