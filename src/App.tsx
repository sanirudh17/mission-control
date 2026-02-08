import React, { useEffect, useState } from 'react';
import { useStore } from './store/useStore';
import { TaskBoard } from './components/TaskBoard';
import { LayoutGrid, CheckSquare, Calendar as CalendarIcon, MessageSquare, Bell, FileBox, Search } from 'lucide-react';
import clsx from 'clsx';

function App() {
  const [activeTab, setActiveTab] = useState<'Board' | 'Review' | 'Calendar' | 'Files'>('Board');
  const { activities, messages, addMessage, addTask } = useStore();
  const [input, setInput] = useState('');

  // Initial Seed
  useEffect(() => {
    if (useStore.getState().tasks.length === 0) {
      addTask({
        title: "Build Mission Control",
        description: "Initialize React app and build core features.",
        priority: 'P1',
        status: 'In Progress',
        progress: 10,
        source: 'Internal'
      });
    }
  }, []);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    addMessage(input, 'User');
    // Mock response for now
    setTimeout(() => addMessage(`Acknowledged: ${input}`, 'OpenClaw'), 500);
    setInput('');
  };

  return (
    <div className="flex h-screen w-full bg-background text-primary overflow-hidden">
      {/* Navigation Rail */}
      <nav className="w-20 border-r border-white/20 bg-white/30 backdrop-blur-xl flex flex-col items-center py-8 gap-8 z-50">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-blue to-accent-purple shadow-lg flex items-center justify-center text-white font-bold">
          MC
        </div>
        
        <div className="flex flex-col gap-6 w-full items-center">
          <NavIcon icon={LayoutGrid} active={activeTab === 'Board'} onClick={() => setActiveTab('Board')} />
          <NavIcon icon={CheckSquare} active={activeTab === 'Review'} onClick={() => setActiveTab('Review')} />
          <NavIcon icon={CalendarIcon} active={activeTab === 'Calendar'} onClick={() => setActiveTab('Calendar')} />
          <NavIcon icon={FileBox} active={activeTab === 'Files'} onClick={() => setActiveTab('Files')} />
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white/10 relative">
        {/* Header */}
        <header className="h-16 px-8 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-4 bg-white/40 px-4 py-2 rounded-full border border-white/20 w-96 focus-within:ring-2 ring-accent-blue/50 transition-all">
            <Search size={18} className="text-secondary" />
            <input 
              type="text" 
              placeholder="Search tasks, emails, files..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-gray-400"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <h1 className="text-sm font-medium">Anirudh & Jarvis</h1>
              <p className="text-xs text-secondary">Collaborative Workspace</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center">
              <Bell size={18} className="text-accent-blue" />
            </div>
          </div>
        </header>

        {/* Viewport */}
        <div className="flex-1 p-8 overflow-hidden">
          {activeTab === 'Board' && <TaskBoard />}
          {activeTab === 'Review' && <div className="text-center mt-20 text-secondary">Task Review Module - Coming Soon</div>}
          {activeTab === 'Calendar' && <div className="text-center mt-20 text-secondary">Calendar Module - Coming Soon</div>}
          {activeTab === 'Files' && <div className="text-center mt-20 text-secondary">Deliverables Gallery - Coming Soon</div>}
        </div>
      </main>

      {/* Right Sidebar: Command Center & Activity */}
      <aside className="w-96 border-l border-white/20 bg-white/20 backdrop-blur-2xl flex flex-col relative shadow-2xl">
        
        {/* Activity Feed Top Half */}
        <div className="flex-1 flex flex-col overflow-hidden border-b border-white/10">
          <div className="p-4 border-b border-white/10 bg-white/10 font-medium text-sm flex justify-between items-center">
            <span>Activity Stream</span>
            <span className="text-xs bg-accent-green/10 text-accent-green px-2 py-0.5 rounded-full">Live</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activities.map(activity => (
              <div key={activity.id} className="text-sm flex gap-3 opacity-80 hover:opacity-100 transition-opacity">
                <div className="mt-1 w-2 h-2 rounded-full bg-accent-blue flex-shrink-0" />
                <div>
                  <p className="text-primary">{activity.text}</p>
                  <span className="text-xs text-secondary">{new Date(activity.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Command Center Bottom Half */}
        <div className="h-1/2 flex flex-col bg-white/30 backdrop-blur-3xl">
          <div className="p-4 border-b border-white/10 font-medium text-sm flex items-center gap-2">
            <MessageSquare size={16} /> Command Center
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={clsx("p-3 rounded-xl text-sm max-w-[85%]", {
                'bg-accent-blue text-white self-end ml-auto': msg.sender === 'User',
                'bg-white/50 text-primary self-start': msg.sender === 'OpenClaw'
              })}>
                {msg.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleCommand} className="p-4 border-t border-white/10">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              className="w-full bg-white/50 border border-white/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue/50 placeholder:text-gray-500"
              placeholder="Type a command for Jarvis..."
            />
          </form>
        </div>
      </aside>
    </div>
  );
}

const NavIcon = ({ icon: Icon, active, onClick }: { icon: any, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={clsx("p-3 rounded-xl transition-all duration-300 group relative", {
      'bg-white shadow-md text-accent-blue': active,
      'hover:bg-white/50 text-secondary': !active
    })}
  >
    <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    {active && <div className="absolute inset-0 bg-accent-blue/10 rounded-xl animate-pulse" />}
  </button>
);

export default App;
