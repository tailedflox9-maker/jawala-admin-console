import React, { useState, useEffect } from 'react';
import { Button } from './ui/Primitives';
import { signOut } from '../supabaseClient';
import { User } from '@supabase/supabase-js';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  currentView: string;
  onNavigate: (view: string) => void;import React, { useState, useEffect } from 'react';
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
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
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
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col h-full flex-shrink-0 shadow-xl z-10">
        <div className="p-6 border-b border-border flex items-center gap-3 flex-shrink-0">
           <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20 text-xl">
             J
           </div>
           <div>
             <span className="font-bold text-lg tracking-tight block leading-none">Jawala</span>
             <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Analytics</span>
           </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                currentView === item.id 
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <div className={`w-6 flex justify-center transition-transform duration-300 ${currentView === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                <i className={`fas ${item.icon}`}></i>
              </div>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border flex-shrink-0 bg-card/50">
          <div className="flex items-center justify-between mb-4 bg-muted/50 p-2 rounded-lg">
             <span className="text-xs font-medium text-muted-foreground pl-2">Dark Mode</span>
             <button 
               onClick={toggleTheme}
               className={`w-10 h-6 rounded-full relative transition-colors focus:outline-none border ${isDark ? 'bg-primary border-primary' : 'bg-muted border-input'}`}
             >
                <div className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full shadow-sm transform transition-transform duration-300 flex items-center justify-center text-[10px] bg-white ${isDark ? 'translate-x-4 text-primary' : 'text-orange-500'}`}>
                  <i className={`fas ${isDark ? 'fa-moon' : 'fa-sun'}`}></i>
                </div>
             </button>
          </div>

          <Button variant="outline" className="w-full border-border hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt mr-2"></i> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-background/50">
        {/* Mobile Header */}
        <header className="h-14 border-b border-border flex items-center justify-between px-4 md:hidden bg-card flex-shrink-0 z-20">
           <span className="font-bold">Jawala Analytics</span>
           <div className="flex items-center gap-3">
             <button onClick={toggleTheme} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
               <i className={`fas ${isDark ? 'fa-moon' : 'fa-sun'} text-xs`}></i>
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
               className={`flex-none px-4 py-3 text-sm font-medium text-center whitespace-nowrap ${
                 currentView === item.id ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'
               }`}
             >
               <i className={`fas ${item.icon} mr-2`}></i>
               {item.label}
             </button>
           ))}
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth custom-scrollbar">
           <div className="max-w-7xl mx-auto space-y-8">
             {children}
           </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
}

const Layout: React.FC<LayoutProps> = ({ children, user, currentView, onNavigate }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check system preference or saved preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
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

  return (
    <div className="h-screen w-screen bg-background text-foreground flex overflow-hidden transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col h-full flex-shrink-0 shadow-xl z-10">
        <div className="p-6 border-b border-border flex items-center gap-2 flex-shrink-0">
           <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20">
             J
           </div>
           <span className="font-bold text-lg tracking-tight">Jawala Admin</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
            { id: 'businesses', label: 'Businesses', icon: 'fa-store' },
            { id: 'analytics', label: 'Analytics', icon: 'fa-chart-pie' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                currentView === item.id 
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <i className={`fas ${item.icon} w-5 text-center`}></i>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border flex-shrink-0 bg-card/50">
          <div className="flex items-center justify-between mb-4">
             <span className="text-xs font-medium text-muted-foreground">Theme</span>
             <button 
               onClick={toggleTheme}
               className="w-10 h-6 bg-muted rounded-full relative transition-colors focus:outline-none border border-border"
             >
                <div className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full shadow-sm transform transition-transform duration-300 flex items-center justify-center text-[10px] ${isDark ? 'translate-x-4 bg-slate-800 text-yellow-400' : 'bg-white text-orange-500'}`}>
                  <i className={`fas ${isDark ? 'fa-moon' : 'fa-sun'}`}></i>
                </div>
             </button>
          </div>

          <div className="flex items-center gap-3 px-2 mb-4">
             <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground">
                <i className="fas fa-user-shield text-xs"></i>
             </div>
             <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate">Admin</span>
                <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
             </div>
          </div>
          <Button variant="outline" className="w-full border-border hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt mr-2"></i> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-background">
        {/* Mobile Header */}
        <header className="h-14 border-b border-border flex items-center justify-between px-4 md:hidden bg-card flex-shrink-0 z-20">
           <span className="font-bold">Jawala Admin</span>
           <div className="flex items-center gap-3">
             <button onClick={toggleTheme} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
               <i className={`fas ${isDark ? 'fa-moon' : 'fa-sun'} text-xs`}></i>
             </button>
             <Button variant="ghost" size="icon" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>
             </Button>
           </div>
        </header>

        {/* Navigation (Mobile) */}
        <div className="md:hidden flex border-b border-border overflow-x-auto bg-card flex-shrink-0 z-20">
           {['dashboard', 'businesses', 'analytics'].map(id => (
             <button
               key={id}
               onClick={() => onNavigate(id)}
               className={`flex-1 py-3 text-sm font-medium text-center capitalize ${
                 currentView === id ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'
               }`}
             >
               {id}
             </button>
           ))}
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
           <div className="max-w-[1600px] mx-auto">
             {children}
           </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
