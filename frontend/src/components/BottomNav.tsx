import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Calendar, BarChart3, User, MessageSquare } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'home' | 'journal' | 'insights' | 'profile' | 'aichat';
  onChangeTab?: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const navigate = useNavigate();

  const handleTabClick = (tab: string) => {
    if (onChangeTab) {
      onChangeTab(tab);
    } else {
      if (tab === 'journal') {
        navigate('/journal');
      } else {
        alert(`${tab.charAt(0).toUpperCase() + tab.slice(1)} tab is for demo visualization.`);
      }
    }
  };

  return (
    <div className="w-full bg-white border-t border-slate-100 px-6 py-4 flex items-center justify-between shadow-[0_-5px_15px_-5px_rgba(17,11,48,0.03)] rounded-b-[32px]">
      {/* Home Tab */}
      {activeTab === 'home' ? (
        <button
          onClick={() => handleTabClick('home')}
          className="bg-brand text-white rounded-full flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all duration-200"
        >
          <Home size={16} strokeWidth={2.5} />
          <span>Home</span>
        </button>
      ) : (
        <button
          onClick={() => handleTabClick('home')}
          className="text-slate-400 hover:text-slate-600 p-2 transition-colors duration-150"
          aria-label="Home"
        >
          <Home size={20} strokeWidth={2} />
        </button>
      )}

      {/* AI Chat / Insights Tab */}
      {activeTab === 'aichat' ? (
        <button
          onClick={() => handleTabClick('aichat')}
          className="bg-brand text-white rounded-full flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all duration-200"
        >
          <MessageSquare size={16} strokeWidth={2.5} />
          <span>AI Chat</span>
        </button>
      ) : activeTab === 'insights' ? (
        <button
          onClick={() => handleTabClick('insights')}
          className="bg-brand text-white rounded-full flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all duration-200"
        >
          <BarChart3 size={16} strokeWidth={2.5} />
          <span>Insights</span>
        </button>
      ) : (
        <button
          onClick={() => handleTabClick(activeTab === 'home' ? 'aichat' : 'insights')}
          className="text-slate-400 hover:text-slate-600 p-2 transition-colors duration-150"
          aria-label={activeTab === 'home' ? 'AI Chat' : 'Insights'}
        >
          {activeTab === 'home' ? (
            <MessageSquare size={20} strokeWidth={2} />
          ) : (
            <BarChart3 size={20} strokeWidth={2} />
          )}
        </button>
      )}

      {/* Journal Tab */}
      {activeTab === 'journal' ? (
        <button
          onClick={() => handleTabClick('journal')}
          className="bg-brand text-white rounded-full flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all duration-200"
        >
          <Calendar size={16} strokeWidth={2.5} />
          <span>Journal</span>
        </button>
      ) : (
        <button
          onClick={() => handleTabClick('journal')}
          className="text-slate-400 hover:text-slate-600 p-2 transition-colors duration-150"
          aria-label="Journal"
        >
          <Calendar size={20} strokeWidth={2} />
        </button>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' ? (
        <button
          onClick={() => handleTabClick('profile')}
          className="bg-brand text-white rounded-full flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all duration-200"
        >
          <User size={16} strokeWidth={2.5} />
          <span>Profile</span>
        </button>
      ) : (
        <button
          onClick={() => handleTabClick('profile')}
          className="text-slate-400 hover:text-slate-600 p-2 transition-colors duration-150"
          aria-label="Profile"
        >
          <User size={20} strokeWidth={2} />
        </button>
      )}
    </div>
  );
};

export default BottomNav;
