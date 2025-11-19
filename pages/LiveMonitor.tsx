import React, { useEffect, useState } from 'react';
import { getLiveFeed, getLiveUserCount } from '../supabaseClient';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Avatar,
  Chip,
  Paper,
  Fade,
  Grow,
  LinearProgress,
} from '@mui/material';
import {
  Visibility,
  Phone,
  WhatsApp,
  Share,
  FiberManualRecord,
  Devices,
  TrendingUp,
  AccessTime,
} from '@mui/icons-material';

const LiveMonitor: React.FC = () => {
  const [feed, setFeed] = useState<any[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const [f, c] = await Promise.all([getLiveFeed(), getLiveUserCount()]);
    setFeed(f);
    setOnlineCount(c);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: string, event?: string) => {
    if (type === 'visit') return <Visibility fontSize="small" />;
    if (event === 'call') return <Phone fontSize="small" />;
    if (event === 'whatsapp') return <WhatsApp fontSize="small" />;
    if (event === 'share') return <Share fontSize="small" />;
    return <Visibility fontSize="small" />;
  };

  const getColor = (type: string, event?: string) => {
    if (type === 'visit') return '#64748b';
    if (event === 'call') return '#2196F3';
    if (event === 'whatsapp') return '#22c55e';
    return '#a855f7';
  };

  const getActionLabel = (type: string, event?: string) => {
    if (type === 'visit') return 'Page Visit';
    if (event === 'call') return 'Phone Call';
    if (event === 'whatsapp') return 'WhatsApp';
    if (event === 'share') return 'Share';
    return 'Activity';
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Hero Header */}
      <Fade in timeout={600}>
        <Paper 
          elevation={0}
          sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: { xs: 3, sm: 3.5, md: 4 },
            mb: { xs: 3, sm: 4 },
            borderRadius: { xs: 3, sm: 4 },
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 1, sm: 1.5 }, 
              mb: 1,
              flexWrap: 'wrap'
            }}>
              <FiberManualRecord 
                sx={{ 
                  color: '#22c55e',
                  fontSize: { xs: 16, sm: 20 },
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.8))',
                  flexShrink: 0
                }} 
              />
              <Typography 
                variant="h3" 
                fontWeight={900} 
                letterSpacing="-0.02em"
                sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '3rem' } }}
              >
                Live Monitor
              </Typography>
            </Box>
            <Typography 
              variant="body1" 
              sx={{ 
                opacity: 0.95, 
                fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1.05rem' },
                ml: { xs: 0, sm: 3.5 }
              }}
            >
              Real-time stream of user activity across the platform
            </Typography>
          </Box>
          
          {/* Online Users Card */}
          <Box 
            sx={{ 
              position: { xs: 'relative', sm: 'absolute' },
              top: { sm: 24, md: 24 },
              right: { sm: 16, md: 32 },
              mt: { xs: 3, sm: 0 },
              bgcolor: 'rgba(255,255,255,0.25)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              p: { xs: 2.5, sm: 3 },
              textAlign: 'center',
              minWidth: { xs: '100%', sm: 160 },
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}
          >
            <Typography 
              variant="h2" 
              fontWeight={900} 
              sx={{ 
                mb: 0.5,
                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' }
              }}
            >
              {onlineCount}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                textTransform: 'uppercase', 
                fontWeight: 800, 
                letterSpacing: 1.5,
                fontSize: { xs: '0.65rem', sm: '0.7rem' },
              }}
            >
              Users Online
            </Typography>
          </Box>

          {/* Decorative Elements */}
          <Box 
            sx={{
              position: 'absolute',
              bottom: -60,
              right: -60,
              width: 200,
              height: 200,
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.1)',
              filter: 'blur(50px)',
            }}
          />
          <Box 
            sx={{
              position: 'absolute',
              top: -40,
              left: -40,
              width: 150,
              height: 150,
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.08)',
              filter: 'blur(40px)',
            }}
          />

          <style>
            {`
              @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
              }
            `}
          </style>
        </Paper>
      </Fade>

      <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
        {/* Activity Feed */}
        <Grid item xs={12} lg={8}>
          <Grow in timeout={700}>
            <Card 
              elevation={0}
              sx={{
                border: 1,
                borderColor: 'divider',
                transition: 'all 0.3s',
                '&:hover': {
                  boxShadow: 4,
                  borderColor: 'primary.main',
                },
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  mb: { xs: 2, sm: 2.5, md: 3 },
                  flexWrap: 'wrap',
                  gap: 2
                }}>
                  <Box>
                    <Typography 
                      variant="h6" 
                      fontWeight={700} 
                      gutterBottom
                      sx={{ fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' } }}
                    >
                      Activity Feed
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.813rem', sm: '0.875rem' } }}
                    >
                      Latest 50 interactions sorted by time
                    </Typography>
                  </Box>
                  <Chip 
                    icon={<FiberManualRecord sx={{ fontSize: 10, animation: 'pulse 2s infinite' }} />}
                    label="Live" 
                    color="success" 
                    size="small"
                    sx={{ fontWeight: 700 }}
                  />
                </Box>

                {loading && (
                  <Box sx={{ width: '100%', mb: 2 }}>
                    <LinearProgress />
                  </Box>
                )}

                <Box sx={{ 
                  maxHeight: { xs: 500, sm: 600, md: 650 }, 
                  overflowY: 'auto', 
                  pr: 1 
                }}>
                  {feed.length === 0 && !loading && (
                    <Box 
                      sx={{ 
                        textAlign: 'center', 
                        py: { xs: 6, sm: 8, md: 10 },
                        color: 'text.secondary',
                      }}
                    >
                      <Visibility sx={{ fontSize: { xs: 48, sm: 56, md: 64 }, opacity: 0.3, mb: 2 }} />
                      <Typography 
                        variant="h6" 
                        fontWeight={600}
                        sx={{ fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' } }}
                      >
                        No recent activity detected
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mt: 1,
                          fontSize: { xs: '0.813rem', sm: '0.875rem' }
                        }}
                      >
                        Waiting for user interactions...
                      </Typography>
                    </Box>
                  )}
                  
                  {feed.map((item, i) => {
                    const color = getColor(item.type, item.event_type);
                    const Icon = () => getIcon(item.type, item.event_type);
                    
                    return (
                      <Fade key={i} in timeout={300 + i * 50}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: { xs: 2, sm: 2.5 },
                            mb: 1.5,
                            display: 'flex',
                            gap: { xs: 1.5, sm: 2 },
                            alignItems: 'center',
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: 2,
                            transition: 'all 0.2s',
                            '&:hover': {
                              bgcolor: 'action.hover',
                              borderColor: color,
                              transform: 'translateX(4px)',
                            },
                            flexWrap: { xs: 'wrap', sm: 'nowrap' }
                          }}
                        >
                          <Avatar 
                            sx={{ 
                              bgcolor: `${color}20`,
                              color: color,
                              width: { xs: 40, sm: 44, md: 48 },
                              height: { xs: 40, sm: 44, md: 48 },
                              flexShrink: 0
                            }}
                          >
                            <Icon />
                          </Avatar>

                          <Box sx={{ 
                            flex: 1, 
                            minWidth: { xs: '100%', sm: 0 },
                            order: { xs: 3, sm: 2 }
                          }}>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 1, 
                              mb: 0.5,
                              flexWrap: 'wrap'
                            }}>
                              <Typography 
                                variant="body2" 
                                fontWeight={700}
                                sx={{ fontSize: { xs: '0.875rem', sm: '0.938rem' } }}
                              >
                                {item.user_name || 'Guest User'}
                              </Typography>
                              <Chip
                                label={getActionLabel(item.type, item.event_type)}
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: { xs: '0.65rem', sm: '0.7rem' },
                                  fontWeight: 700,
                                  bgcolor: `${color}15`,
                                  color: color,
                                }}
                              />
                            </Box>
                            <Typography 
                              variant="caption" 
                              color="text.secondary"
                              sx={{ 
                                display: 'block',
                                fontSize: { xs: '0.75rem', sm: '0.813rem' }
                              }}
                            >
                              {item.type === 'visit' ? (
                                <>
                                  Viewed <Box component="code" sx={{ bgcolor: 'action.hover', px: 1, py: 0.5, borderRadius: 1, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                                    {item.page_path}
                                  </Box>
                                </>
                              ) : (
                                <>
                                  <strong>{item.event_type}</strong> on Business{' '}
                                  <Box component="code" sx={{ bgcolor: 'action.hover', px: 1, py: 0.5, borderRadius: 1, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                                    {item.business_name || `#${item.business_id?.substring(0, 8)}`}
                                  </Box>
                                </>
                              )}
                            </Typography>
                          </Box>

                          <Chip 
                            icon={<AccessTime sx={{ fontSize: 14 }} />}
                            label={new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            size="small"
                            variant="outlined"
                            sx={{ 
                              fontFamily: 'monospace', 
                              fontSize: { xs: '0.65rem', sm: '0.7rem' },
                              fontWeight: 700,
                              order: { xs: 2, sm: 3 },
                              ml: { xs: 'auto', sm: 0 }
                            }}
                          />
                        </Paper>
                      </Fade>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </Grow>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 2.5, md: 3 } }}>
            {/* System Status */}
            <Grow in timeout={800}>
              <Card 
                elevation={0}
                sx={{ 
                  background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
                  border: '1px solid #3b82f6',
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: { xs: 2.5, sm: 3 } }}>
                  <Avatar 
                    sx={{ 
                      width: { xs: 48, sm: 52, md: 56 }, 
                      height: { xs: 48, sm: 52, md: 56 }, 
                      bgcolor: '#3b82f6', 
                      mx: 'auto', 
                      mb: 2,
                      boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)',
                    }}
                  >
                    <TrendingUp sx={{ fontSize: { xs: 26, sm: 28, md: 32 } }} />
                  </Avatar>
                  <Typography 
                    variant="h6" 
                    fontWeight={800} 
                    color="#1e40af" 
                    gutterBottom
                    sx={{ fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' } }}
                  >
                    System Status
                  </Typography>
                  <Chip 
                    label="All Systems Operational"
                    color="success"
                    size="small"
                    sx={{ fontWeight: 700, mb: 2 }}
                  />
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mt: 2,
                      fontSize: { xs: '0.813rem', sm: '0.875rem' }
                    }}
                  >
                    Platform is running smoothly. User engagement is consistent with daily averages.
                  </Typography>
                </CardContent>
              </Card>
            </Grow>

            {/* Recent Devices */}
            <Grow in timeout={900}>
              <Card
                elevation={0}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  transition: 'all 0.3s',
                  '&:hover': {
                    boxShadow: 4,
                    borderColor: 'primary.main',
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: { xs: 2, sm: 2.5, md: 3 } }}>
                    <Devices color="primary" />
                    <Typography 
                      variant="h6" 
                      fontWeight={700}
                      sx={{ fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' } }}
                    >
                      Recent Devices
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {Array.from(new Set(feed.map(i => i.device_id))).slice(0, 8).map((id: any, idx) => (
                      <Fade key={idx} in timeout={1000 + idx * 100}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: { xs: 1.5, sm: 2 },
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: 2,
                            transition: 'all 0.2s',
                            '&:hover': {
                              bgcolor: 'action.hover',
                              borderColor: 'primary.main',
                            },
                          }}
                        >
                          <Avatar 
                            sx={{ 
                              bgcolor: 'primary.main',
                              width: { xs: 28, sm: 30, md: 32 },
                              height: { xs: 28, sm: 30, md: 32 },
                              fontSize: { xs: '0.813rem', sm: '0.875rem' },
                              fontWeight: 700,
                            }}
                          >
                            {idx + 1}
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography 
                              variant="caption" 
                              fontFamily="monospace"
                              sx={{ 
                                display: 'block',
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis',
                                fontWeight: 600,
                                fontSize: { xs: '0.75rem', sm: '0.813rem' }
                              }}
                            >
                              {id?.substring(0, 20)}...
                            </Typography>
                          </Box>
                        </Paper>
                      </Fade>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grow>

            {/* Stats Summary */}
            <Grow in timeout={1000}>
              <Card
                elevation={0}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  transition: 'all 0.3s',
                  '&:hover': {
                    boxShadow: 4,
                    borderColor: 'primary.main',
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
                  <Typography 
                    variant="h6" 
                    fontWeight={700} 
                    gutterBottom
                    sx={{ fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' } }}
                  >
                    Last Hour
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    {[
                      { label: 'Page Views', value: feed.filter(f => f.type === 'visit').length, color: '#64748b' },
                      { label: 'Phone Calls', value: feed.filter(f => f.event_type === 'call').length, color: '#2196F3' },
                      { label: 'WhatsApp', value: feed.filter(f => f.event_type === 'whatsapp').length, color: '#22c55e' },
                      { label: 'Shares', value: feed.filter(f => f.event_type === 'share').length, color: '#a855f7' },
                    ].map((stat, idx) => (
                      <Box key={idx}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography 
                            variant="body2" 
                            fontWeight={600}
                            sx={{ fontSize: { xs: '0.813rem', sm: '0.875rem' } }}
                          >
                            {stat.label}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            fontWeight={800} 
                            sx={{ 
                              color: stat.color,
                              fontSize: { xs: '0.813rem', sm: '0.875rem' }
                            }}
                          >
                            {stat.value}
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={(stat.value / feed.length) * 100}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: `${stat.color}15`,
                            '& .MuiLinearProgress-bar': {
                              bgcolor: stat.color,
                              borderRadius: 3,
                            },
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LiveMonitor;
