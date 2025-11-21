import React, { useEffect, useState } from 'react';
import { getDashboardStats, getTopSearchesForOverview, getInteractionStats } from '../supabaseClient';
import { Card, CardContent, Skeleton } from '../components/ui/Primitives';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Box, Typography, Avatar, LinearProgress, Grow } from '@mui/material';
import { TrendingUp, People, TouchApp, Visibility, ArrowUpward, ArrowDownward, Search, DonutLarge } from '@mui/icons-material';

const Overview: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [topSearches, setTopSearches] = useState<any[]>([]);
  const [interactions, setInteractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [s, t, i] = await Promise.all([
        getDashboardStats(),
        getTopSearchesForOverview(), // Changed from getTrafficHistory
        getInteractionStats()
      ]);
      setStats(s);
      setTopSearches(t);
      setInteractions(i);
      setLoading(false);
    };
    fetchData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, colorClass, trend = 12.5 }: any) => {
    const isPositive = trend >= 0;
    return (
      <Grow in timeout={500}>
        <Card 
          elevation={0}
          sx={{ 
            height: '100%',
            background: `linear-gradient(135deg, ${colorClass}15 0%, ${colorClass}08 100%)`,
            border: `1px solid ${colorClass}30`,
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 12px 24px ${colorClass}30`, borderColor: `${colorClass}50` },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, fontSize: '0.7rem' }}>
                  {title}
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 900, color: 'text.primary', mt: 1, mb: 1.5, lineHeight: 1, letterSpacing: '-0.02em' }}>
                  {loading ? <Skeleton width={100} height={40} /> : value.toLocaleString()}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: `${colorClass}20`, color: colorClass, width: 56, height: 56, boxShadow: `0 4px 12px ${colorClass}25` }}>
                <Icon sx={{ fontSize: 28 }} />
              </Avatar>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {isPositive ? <ArrowUpward sx={{ fontSize: 16, color: '#4CAF50' }} /> : <ArrowDownward sx={{ fontSize: 16, color: '#f44336' }} />}
              <Typography variant="body2" sx={{ color: isPositive ? '#4CAF50' : '#f44336', fontWeight: 700, fontSize: '0.875rem' }}>
                {Math.abs(trend)}%
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', ml: 0.5, fontSize: '0.813rem' }}>
                vs last week
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grow>
    );
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, color: 'text.primary', mb: 1, letterSpacing: '-0.02em', fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
          Analytics Overview
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.05rem' }}>
          Real-time operational metrics for Jawala Business Directory
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, mb: 5 }}>
        <StatCard title="Total Visits" value={stats?.totalVisits || 0} icon={Visibility} colorClass="#2196F3" trend={12.5} />
        <StatCard title="Active Users" value={stats?.totalUsers || 0} icon={People} colorClass="#FF9800" trend={8.3} />
        <StatCard title="Interactions" value={stats?.totalInteractions || 0} icon={TouchApp} colorClass="#9C27B0" trend={-2.1} />
        <StatCard title="Today's Visits" value={stats?.todayVisits || 0} icon={TrendingUp} colorClass="#4CAF50" trend={15.7} />
      </Box>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, mb: 4 }}>
        
        {/* REPLACED TRAFFIC CHART WITH TOP SEARCHES */}
        <Grow in timeout={700}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', transition: 'all 0.3s', '&:hover': { boxShadow: 4, borderColor: 'primary.main' } }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'primary.main', color: 'white' }}><Search fontSize="small" /></Box>
                <Box>
                  <Typography variant="h6" fontWeight={700}>Top 5 Search Queries</Typography>
                  <Typography variant="body2" color="text.secondary">What users are looking for most often</Typography>
                </Box>
              </Box>

              <Box sx={{ height: 340 }}>
                {loading ? (
                  <Skeleton variant="rectangular" width="100%" height="100%" />
                ) : topSearches.length === 0 ? (
                  <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'text.secondary', opacity: 0.7 }}>
                    <Search sx={{ fontSize: 48, mb: 1 }} />
                    <Typography>No search data available yet</Typography>
                  </Box>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topSearches} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={100} tick={{ fill: 'hsl(var(--foreground))', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: 'hsl(var(--muted)/0.1)' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: 8 }} />
                      <Bar dataKey="count" fill="#2196F3" radius={[0, 4, 4, 0]} barSize={32} name="Searches" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grow>

        {/* FIXED PIE CHART (Handles No Data) */}
        <Grow in timeout={800}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', height: '100%', transition: 'all 0.3s', '&:hover': { boxShadow: 4, borderColor: 'primary.main' } }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" fontWeight={700}>User Actions</Typography>
                <Typography variant="body2" color="text.secondary">Engagement breakdown by type</Typography>
              </Box>

              <Box sx={{ height: 240, position: 'relative' }}>
                {loading ? (
                  <Skeleton variant="circular" width="100%" height="100%" />
                ) : interactions.length === 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary', opacity: 0.6 }}>
                    <DonutLarge sx={{ fontSize: 48, mb: 1 }} />
                    <Typography variant="body2" fontWeight={600}>No Data Available</Typography>
                    <Typography variant="caption">Waiting for first interaction</Typography>
                  </Box>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={interactions} innerRadius={70} outerRadius={95} paddingAngle={4} dataKey="value" stroke="none">
                          {interactions.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                      <Typography variant="h3" fontWeight={900}>{interactions.reduce((sum, i) => sum + i.value, 0)}</Typography>
                      <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1, color: 'text.secondary' }}>Total</Typography>
                    </Box>
                  </>
                )}
              </Box>

              <Box sx={{ mt: 3 }}>
                {!loading && interactions.length > 0 && interactions.map((item: any, index: number) => {
                  const total = interactions.reduce((sum, i) => sum + i.value, 0);
                  const percentage = total > 0 ? ((item.value / total) * 100).toFixed(0) : '0';
                  return (
                    <Box key={index} sx={{ mb: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.fill, flexShrink: 0 }} />
                          <Typography variant="body2" fontWeight={600} fontSize="0.813rem">{item.name}</Typography>
                        </Box>
                        <Typography variant="body2" fontWeight={700} fontSize="0.813rem">{percentage}%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={parseInt(percentage)} sx={{ height: 6, borderRadius: 3, bgcolor: `${item.fill}15`, '& .MuiLinearProgress-bar': { bgcolor: item.fill, borderRadius: 3 } }} />
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grow>
      </Box>
    </Box>
  );
};

export default Overview;
