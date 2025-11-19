import React, { useEffect, useState } from 'react';
import { getLiveFeed, getLiveUserCount } from '../supabaseClient';
import { Box, Typography, Paper, Chip, CircularProgress } from '@mui/material';
import { FiberManualRecord, Visibility, Phone, WhatsApp, Share } from '@mui/icons-material';

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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Live Monitor
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time user activity monitoring
          </Typography>
        </Box>
        <Paper elevation={0} sx={{ px: 3, py: 2, border: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FiberManualRecord sx={{ color: '#22c55e', fontSize: 12 }} />
            <Typography variant="h5" fontWeight={700}>
              {onlineCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              users online
            </Typography>
          </Box>
        </Paper>
      </Box>

      <Paper elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            Activity Feed
          </Typography>
          <Chip 
            icon={<FiberManualRecord sx={{ fontSize: 10 }} />}
            label="Live" 
            color="success" 
            size="small"
          />
        </Box>
        <Box sx={{ maxHeight: 600, overflowY: 'auto' }}>
          {feed.map((item, i) => (
            <Box
              key={i}
              sx={{
                p: 2.5,
                borderBottom: i < feed.length - 1 ? 1 : 0,
                borderColor: 'divider',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 1, borderRadius: 1 }}>
                  {getIcon(item.type, item.event_type)}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight={600}>
                    {item.user_name || 'Guest User'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.type === 'visit' ? `Viewed ${item.page_path}` : `${item.event_type} on Business`}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {new Date(item.time).toLocaleTimeString()}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default LiveMonitor;
