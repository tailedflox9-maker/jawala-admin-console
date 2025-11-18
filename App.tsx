import React, { useEffect, useState } from 'react';
import Layout from './components/Layout';
import Login from './pages/Login';
import Overview from './pages/Overview';
import LiveMonitor from './pages/LiveMonitor';
import BusinessPerformance from './pages/BusinessPerformance';
import UserInsights from './pages/UserInsights';
// FIX: Use './' because App.tsx and supabaseClient.ts are in the same folder
import { getCurrentUser, supabase } from './supabaseClient';
import { User } from '@supabase/supabase-js';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('overview');

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };
    
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Login onSuccess={() => window.location.reload()} />;
  }

  const renderView = () => {
    switch (view) {
      case 'overview': return <Overview />;
      case 'live': return <LiveMonitor />;
      case 'performance': return <BusinessPerformance />;
      case 'audience': return <UserInsights />;
      default: return <Overview />;
    }
  };

  return (
    <Layout user={user} currentView={view} onNavigate={setView}>
      {renderView()}
    </Layout>
  );
};

export default App;
