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
  Paper
} from '@mui/material';
import {
  Visibility,
  Phone,
  WhatsApp,
  Share,
  Bolt,
  FiberManualRecord
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
    return <Bolt fontSize="small" />;
  };

  const getColor = (type: string, event?: string) => {
    if (type === 'visit') return '#64748b';
    if (event === 'call') return '#3b82f6';
    if (event === 'whatsapp') return '#22c55e';
    return '#a855f7';
  };

  return (
    <Box>
      {/* Header */}
      <Paper 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: 4,
          mb: 3,
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <FiberManualRecord 
              sx={{ 
                color: '#22c55e',
                fontSize: 16,
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }} 
            />
            <Typography variant="h4" fontWeight="bold">
              Live Monitor
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Real-time stream of user activity across the platform.
          </Typography>
        </Box>
        
        <Box 
          sx={{ 
            position: 'absolute',
            top: 16,
            right: 16,
            bgcolor: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            p: 2,
            textAlign: 'center',
            minWidth: 140
          }}
        >
          <Typography variant="h3" fontWeight="black">
            {onlineCount}
          </Typography>
          <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1 }}>
            Users Online
          </Typography>
        </Box>

        {/* Decorative circle */}
        <Box 
          sx={{
            position: 'absolute',
            bottom: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.1)',
            filter: 'blur(40px)'
          }}
        />
      </Paper>

      <Grid container spacing={3}>
        {/* Activity Feed */}
        <Grid item xs={12} lg={8}>
          <Card elevation={0}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Activity Feed
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Latest 50 interactions sorted by time
              </Typography>

              <Box sx={{ maxHeight: 600, overflowY: 'auto' }}>
                {feed.length === 0 && !loading && (
                  <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                    <Typography>No recent activity detected.</Typography>
                  </Box>
                )}
                
                {feed.map((item, i) => (
                  <Paper
                    key={i}
                    elevation={0}
                    sx={{
                      p: 2,
                      mb: 1.5,
                      display: 'flex',
                      gap: 2,
                      alignItems: 'center',
                      border: 1,
                      borderColor: 'divider',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: 'action.hover',
                        borderColor: 'primary.main'
                      }
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        bgcolor: getColor(item.type, item.event_type) + '20',
                        color: getColor(item.type, item.event_type),
                        width: 40,
                        height: 40
                      }}
                    >
                      {getIcon(item.type, item.event_type)}
                    </Avatar>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight="600">
                        {item.user_name || 'Guest User'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.type === 'visit' ? (
                          <>Viewed page <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>{item.page_path}</code></>
                        ) : (
                          <><strong>{item.event_type}</strong> on Business #{item.business_id?.substring(0, 6)}</>
                        )}
                      </Typography>
                    </Box>

                    <Chip 
                      label={new Date(item.time).toLocaleTimeString()}
                      size="small"
                      sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}
                    />
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Card elevation={0} sx={{ bgcolor: '#dbeafe', borderColor: '#3b82f6' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar sx={{ width: 48, height: 48, bgcolor: '#3b82f6', mx: 'auto', mb: 2 }}>
                  <Bolt />
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  Traffic Status
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  System is operating normally. User engagement is consistent with daily averages.
                </Typography>
              </CardContent>
            </Card>

            <Card elevation={0}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Recent Devices
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                  {Array.from(new Set(feed.map(i => i.device_id))).slice(0, 6).map((id: any, idx) => (
                    <Paper
                      key={idx}
                      elevation={0}
                      sx={{
                        p: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        border: 1,
                        borderColor: 'divider'
                      }}
                    >
                      <Box sx={{ fontSize: 20 }}>📱</Box>
                      <Typography variant="caption" fontFamily="monospace" sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {id?.substring(0, 18)}...
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>

      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default LiveMonitor;
