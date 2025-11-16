import React from 'react';
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
  const handleLogout = async () => {
    await signOut();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card hidden md:flex flex-col">
        <div className="p-6 border-b flex items-center gap-2">
           <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold">
             J
           </div>
           <span className="font-bold text-lg">Jawala Admin</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
            { id: 'businesses', label: 'Businesses', icon: 'fa-store' },
            { id: 'analytics', label: 'Analytics', icon: 'fa-chart-pie' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                currentView === item.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <i className={`fas ${item.icon} w-5 text-center`}></i>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 px-2 mb-4">
             <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <i className="fas fa-user text-xs"></i>
             </div>
             <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate">Admin</span>
                <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
             </div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt mr-2"></i> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="h-14 border-b flex items-center justify-between px-4 md:hidden bg-card">
           <span className="font-bold">Jawala Admin</span>
           <Button variant="ghost" size="icon" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
           </Button>
        </header>

        {/* Navigation (Mobile) */}
        <div className="md:hidden flex border-b overflow-x-auto bg-card">
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

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
           {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;