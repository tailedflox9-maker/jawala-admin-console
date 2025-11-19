import React, { useState, useEffect } from 'react';
import { Button } from './ui/Primitives';
import { signOut } from '../supabaseClient';
import { User } from '@supabase/supabase-js';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  currentView: string;
  onNavigate: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, currentView, onNavigate }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Initialize theme based on localStorage or system preference
    const isDarkTheme = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(isDarkTheme);
    if (isDarkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  const handleLogout = async () => {
    await signOut();
    window.location.reload();
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'fa-chart-line' },
    { id: 'live', label: 'Live Monitor', icon: 'fa-tower-broadcast' },
    { id: 'performance', label: 'Performance', icon: 'fa-trophy' },
    { id: 'audience', label: 'User Insights', icon: 'fa-users' },
  ];

  return (
    <div className="h-screen w-screen bg-background text-foreground flex overflow-hidden transition-colors duration-300">
      {/* Sidebar (Desktop) */}
      <aside className="w-64 border-r border-border bg-card/95 hidden md:flex flex-col h-full flex-shrink-0 shadow-xl z-10 transition-colors duration-300">
        <div className="p-6 border-b border-border flex items-center gap-3 flex-shrink-0">
           <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20 text-xl">
             J
           </div>
           <div className="flex flex-col">
             <span className="font-bold text-lg tracking-tight leading-none">Jawala</span>
             <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-1">Admin Console</span>
           </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative overflow-hidden ${
                currentView === item.id 
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <div className={`w-6 flex justify-center transition-transform duration-300 ${currentView === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                <i className={`fas ${item.icon}`}></i>
              </div>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border flex-shrink-0 bg-muted/10 space-y-4">
          {/* Refined Theme Switch */}
          <div className="flex items-center justify-between bg-background border border-border p-3 rounded-xl shadow-sm">
             <span className="text-xs font-semibold text-muted-foreground pl-1">Appearance</span>
             <button 
               onClick={toggleTheme}
               className={`w-12 h-7 rounded-full relative transition-colors duration-300 focus:outline-none border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-sky-100 border-sky-200'}`}
               title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
             >
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full shadow-sm transform transition-all duration-300 flex items-center justify-center text-[10px] ${isDark ? 'translate-x-5 bg-slate-900 text-yellow-400' : 'translate-x-0 bg-white text-orange-500'}`}>
                  <i className={`fas ${isDark ? 'fa-moon' : 'fa-sun'}`}></i>
                </div>
             </button>
          </div>

          <div className="flex items-center justify-between gap-2">
             <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-white text-xs shadow-inner">
                   <i className="fas fa-user-shield"></i>
                </div>
                <div className="flex flex-col overflow-hidden">
                   <span className="text-xs font-bold truncate">Admin</span>
                   <span className="text-[10px] text-muted-foreground truncate opacity-80">Online</span>
                </div>
             </div>
             <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout} 
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
             >
               <i className="fas fa-sign-out-alt"></i>
             </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-background transition-colors duration-300">
        {/* Mobile Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 md:hidden bg-card/80 backdrop-blur-md flex-shrink-0 z-20 sticky top-0">
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">J</div>
             <span className="font-bold text-lg">Analytics</span>
           </div>
           <div className="flex items-center gap-2">
             <button 
               onClick={toggleTheme} 
               className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition-colors"
             >
               <i className={`fas ${isDark ? 'fa-moon' : 'fa-sun'} text-sm`}></i>
             </button>
             <Button variant="ghost" size="icon" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>
             </Button>
           </div>
        </header>

        {/* Mobile Nav */}
        <div className="md:hidden flex border-b border-border overflow-x-auto bg-card flex-shrink-0 z-20 no-scrollbar">
           {navItems.map(item => (
             <button
               key={item.id}
               onClick={() => onNavigate(item.id)}
               className={`flex-1 min-w-[100px] py-3 text-xs font-bold text-center uppercase tracking-wide transition-colors border-b-2 ${
                 currentView === item.id 
                   ? 'border-primary text-primary bg-primary/5' 
                   : 'border-transparent text-muted-foreground hover:text-foreground'
               }`}
             >
               <div className="mb-1 text-sm"><i className={`fas ${item.icon}`}></i></div>
               {item.label}
             </button>
           ))}
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth custom-scrollbar">
           <div className="max-w-7xl mx-auto space-y-8 pb-10">
             {children}
           </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
