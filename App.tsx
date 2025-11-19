import React, { useEffect, useState } from 'react';
import Layout from './components/Layout';
import Login from './pages/Login';
import Overview from './pages/Overview';
import LiveMonitor from './pages/LiveMonitor';
import BusinessPerformance from './pages/BusinessPerformance';
import UserInsights from './pages/UserInsights';
import { getCurrentUser, supabase } from './supabaseClient';
import { User } from '@supabase/supabase-js';
import { Box, CircularProgress } from '@mui/material';

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

  // Determine background color based on localStorage for the loading screen
  // This ensures the spinner has the right background before React fully takes over
  const isDark = localStorage.getItem('darkMode') !== 'false'; // Defaults to true/dark

  if (loading) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: isDark ? '#0A1929' : '#f3f6f9', // Manual theme match
          color: '#3399FF'
        }}
      >
        <CircularProgress size={40} color="inherit" />
      </Box>
    );
  }

  if (!user) {
    // Pass a key to force re-render on logout
    return <Login key="login" onSuccess={() => window.location.reload()} />;
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
