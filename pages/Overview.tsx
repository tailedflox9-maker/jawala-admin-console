import React, { useEffect, useState } from 'react';
import { getDashboardStats, getTrafficHistory, getInteractionStats } from '../supabaseClient';
import { Box, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import { Visibility, People, TouchApp, TrendingUp, Phone, WhatsApp, Share2 } from '@mui/icons-material';

const Overview: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [traffic, setTraffic] = useState<any[]>([]);
  const [interactions, setInteractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [s, t, i] = await Promise.all([
        getDashboardStats(),
        getTrafficHistory(),
        getInteractionStats()
      ]);
      setStats(s);
      setTraffic(t);
      setInteractions(i);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'divider', height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ bgcolor: `${color}15`, p: 1.5, borderRadius: 2 }}>
          <Icon sx={{ color, fontSize: 24 }} />
        </Box>
        <Typography variant="caption" color="success.main" fontWeight={600}>
          +12.5%
        </Typography>
      </Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        {value?.toLocaleString()}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Paper>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Overview
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Key metrics and performance overview
      </Typography>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard icon={Visibility} label="Total Visits" value={stats?.totalVisits} color="#2196F3" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard icon={People} label="Active Users" value={stats?.totalUsers} color="#9C27B0" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard icon={TouchApp} label="Interactions" value={stats?.totalInteractions} color="#4CAF50" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard icon={TrendingUp} label="Today's Visits" value={stats?.todayVisits} color="#FF9800" />
        </Grid>
      </Grid>

      {/* Interaction Stats */}
      <Grid container spacing={3}>
        {[
          { icon: Phone, label: 'Calls', value: interactions.find(i => i.name === 'Phone Calls')?.value || 0, color: '#2196F3' },
          { icon: WhatsApp, label: 'WhatsApp', value: interactions.find(i => i.name === 'WhatsApp')?.value || 0, color: '#22c55e' },
          { icon: Share2, label: 'Shares', value: interactions.find(i => i.name === 'Shares')?.value || 0, color: '#a855f7' },
          { icon: Visibility, label: 'Views', value: interactions.find(i => i.name === 'Profile Views')?.value || 0, color: '#64748b' }
        ].map((item, i) => (
          <Grid item xs={6} sm={3} key={i}>
            <Paper elevation={0} sx={{ p: 2.5, border: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <item.icon sx={{ color: item.color, fontSize: 28 }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {item.value.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Overview;
