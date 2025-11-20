import React, { useEffect, useState } from 'react';
import { getDashboardStats, getTrafficHistory, getInteractionStats } from '../supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Skeleton } from '../components/ui/Primitives';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Box, Typography, Avatar, LinearProgress, Chip } from '@mui/material';
import { TrendingUp, People, TouchApp, Visibility, ArrowUpward, ArrowDownward } from '@mui/icons-material';

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
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Enhanced Stat Card with Material Design
  const StatCard = ({ title, value, icon: Icon, colorClass, trend = 12.5 }: any) => {
    const isPositive = trend >= 0;
    
    return (
      <Card 
        elevation={0}
        sx={{ 
          height: '100%',
          background: `linear-gradient(135deg, ${colorClass}15 0%, ${colorClass}08 100%)`,
          border: `1px solid ${colorClass}30`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ 
          p: { xs: 2, sm: 2.5, md: 3 },
          '&:last-child': { pb: { xs: 2, sm: 2.5, md: 3 } }
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1.5, sm: 0 },
            mb: { xs: 1.5, sm: 2 }
          }}>
            <Box sx={{ flex: 1, order: { xs: 2, sm: 1 } }}>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 1.2,
                  fontSize: { xs: '0.65rem', sm: '0.7rem' },
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  color: 'text.primary',
                  mt: 1,
                  mb: 1.5,
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem', lg: '3rem' }
                }}
              >
                {loading ? <Skeleton width={100} height={40} /> : value.toLocaleString()}
              </Typography>
            </Box>
            
            <Avatar
              sx={{
                bgcolor: `${colorClass}20`,
                color: colorClass,
                width: { xs: 44, sm: 48, md: 56 },
                height: { xs: 44, sm: 48, md: 56 },
                boxShadow: `0 4px 12px ${colorClass}25`,
                order: { xs: 1, sm: 2 }
              }}
            >
              <Icon sx={{ fontSize: { xs: 22, sm: 24, md: 28 } }} />
            </Avatar>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {isPositive ? (
              <ArrowUpward sx={{ fontSize: { xs: 14, sm: 16 }, color: '#4CAF50' }} />
            ) : (
              <ArrowDownward sx={{ fontSize: { xs: 14, sm: 16 }, color: '#f44336' }} />
            )}
            <Typography
              variant="body2"
              sx={{
                color: isPositive ? '#4CAF50' : '#f44336',
                fontWeight: 700,
                fontSize: { xs: '0.813rem', sm: '0.875rem' },
              }}
            >
              {Math.abs(trend)}%
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                ml: 0.5,
                fontSize: { xs: '0.75rem', sm: '0.813rem' },
              }}
            >
              vs last week
            </Typography>
          </Box>
        </CardContent>

        {/* Decorative blob */}
        <Box
          sx={{
            position: 'absolute',
            bottom: -40,
            right: -40,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colorClass}15 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
      </Card>
    );
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Enhanced Header */}
      <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1.5, sm: 2 },
          mb: 1,
          flexWrap: 'wrap'
        }}>
          <TrendingUp sx={{ 
            fontSize: { xs: 32, sm: 36, md: 40 },
            color: 'primary.main',
            flexShrink: 0
          }} />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              color: 'text.primary',
              letterSpacing: '-0.02em',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
              wordBreak: 'break-word'
            }}
          >
            Analytics Overview
          </Typography>
        </Box>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary',
            fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1.05rem' },
            ml: { xs: 0, sm: 6, md: 7 }
          }}
        >
          Real-time operational metrics for Jawala Business Directory
        </Typography>
      </Box>

      {/* Stats Grid with enhanced cards */}
      <Box sx={{ 
        display: 'grid', 
        gap: { xs: 2, sm: 2.5, md: 3 }, 
        gridTemplateColumns: { 
          xs: 'repeat(2, 1fr)', 
          sm: 'repeat(2, 1fr)', 
          lg: 'repeat(4, 1fr)' 
        }, 
        mb: { xs: 3, sm: 4, md: 5 }
      }}>
        <StatCard 
          title="Total Visits" 
          value={stats?.totalVisits || 0} 
          icon={Visibility}
          colorClass="#2196F3"
          trend={12.5}
        />
        <StatCard 
          title="Active Users" 
          value={stats?.totalUsers || 0} 
          icon={People}
          colorClass="#FF9800"
          trend={8.3}
        />
        <StatCard 
          title="Interactions" 
          value={stats?.totalInteractions || 0} 
          icon={TouchApp}
          colorClass="#9C27B0"
          trend={-2.1}
        />
        <StatCard 
          title="Today's Visits" 
          value={stats?.todayVisits || 0} 
          icon={TrendingUp}
          colorClass="#4CAF50"
          trend={15.7}
        />
      </Box>

      {/* Charts Row */}
      <Box sx={{ 
        display: 'grid', 
        gap: { xs: 2, sm: 2.5, md: 3 }, 
        gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, 
        mb: { xs: 3, sm: 4 }
      }}>
        {/* Traffic Chart - Enhanced */}
        <Card
          elevation={0}
          sx={{
            border: 1,
            borderColor: 'divider',
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
            <Box sx={{ mb: { xs: 2, sm: 2.5, md: 3 } }}>
              <Typography 
                variant="h6" 
                fontWeight={700} 
                gutterBottom
                sx={{ fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' } }}
              >
                Traffic Trends
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.813rem', sm: '0.875rem' } }}
              >
                Daily visitor volume over the last 14 days
              </Typography>
            </Box>

            <Box sx={{ height: { xs: 280, sm: 320, md: 340 }, width: '100%' }}>
              {loading ? (
                <Skeleton variant="rectangular" width="100%" height="100%" />
              ) : traffic.length === 0 ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary' }}>
                  <Typography variant="body2">No traffic data available</Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={traffic} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2196F3" stopOpacity={0.35}/>
                        <stop offset="95%" stopColor="#2196F3" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="hsl(var(--border))" 
                      vertical={false}
                      opacity={0.5}
                    />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        borderColor: 'hsl(var(--border))', 
                        borderRadius: 12,
                        boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
                        border: '1px solid hsl(var(--border))',
                      }}
                      itemStyle={{ 
                        color: 'hsl(var(--foreground))', 
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                      labelStyle={{ 
                        color: 'hsl(var(--muted-foreground))', 
                        marginBottom: 8,
                        fontWeight: 500,
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="visits" 
                      stroke="#2196F3" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorVisits)" 
                      activeDot={{ 
                        r: 6, 
                        strokeWidth: 3, 
                        stroke: '#fff',
                        fill: '#2196F3',
                        style: { filter: 'drop-shadow(0 2px 4px rgba(33, 150, 243, 0.4))' }
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Interaction Distribution - Enhanced */}
        <Card
          elevation={0}
          sx={{
            border: 1,
            borderColor: 'divider',
            height: '100%',
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
            <Box sx={{ mb: 2 }}>
              <Typography 
                variant="h6" 
                fontWeight={700} 
                gutterBottom
                sx={{ fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' } }}
              >
                User Actions
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.813rem', sm: '0.875rem' } }}
              >
                Engagement breakdown by type
              </Typography>
            </Box>

            <Box sx={{ height: { xs: 200, sm: 220, md: 240 }, position: 'relative' }}>
              {loading ? (
                <Skeleton variant="circular" width="100%" height="100%" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={interactions}
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {interactions.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        borderColor: 'hsl(var(--border))', 
                        borderRadius: 12,
                        boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
                      }}
                      itemStyle={{ 
                        color: 'hsl(var(--foreground))', 
                        fontWeight: 600,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
              
              {!loading && (
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <Typography 
                    variant="h3" 
                    fontWeight={900}
                    sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' } }}
                  >
                    {stats?.totalInteractions || 0}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      textTransform: 'uppercase', 
                      fontWeight: 700,
                      letterSpacing: 1,
                      color: 'text.secondary',
                      fontSize: { xs: '0.65rem', sm: '0.7rem' }
                    }}
                  >
                    Total
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Legend with progress bars */}
            <Box sx={{ mt: { xs: 2, sm: 2.5, md: 3 } }}>
              {!loading && interactions.map((item: any, index: number) => {
                const total = interactions.reduce((sum, i) => sum + i.value, 0);
                const percentage = ((item.value / total) * 100).toFixed(0);
                
                return (
                  <Box key={index} sx={{ mb: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography 
                        variant="body2" 
                        fontWeight={600} 
                        fontSize={{ xs: '0.75rem', sm: '0.813rem' }}
                      >
                        {item.name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        fontWeight={700} 
                        fontSize={{ xs: '0.75rem', sm: '0.813rem' }}
                      >
                        {percentage}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={parseInt(percentage)}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: `${item.fill}15`,
                        '& .MuiLinearProgress-bar': {
                          bgcolor: item.fill,
                          borderRadius: 3,
                        },
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Overview;
