import React, { useEffect, useState } from 'react';
import { getTopUsers } from '../supabaseClient';
import { Card, CardContent } from '../components/ui/Primitives';
import { 
  Box, 
  Typography, 
  Avatar, 
  Chip,
  LinearProgress,
  Paper,
  Grow,
  Grid,
} from '@mui/material';
import { 
  People, 
  EmojiEvents,
  Visibility,
  CalendarToday,
  TrendingUp,
} from '@mui/icons-material';

const UserInsights: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    getTopUsers().then(data => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  // Top 3 Most Active Users
  const TopUsers = () => {
    const topThree = users.slice(0, 3);
    const positions = ['🥇', '🥈', '🥉'];
    const colors = ['#FFD700', '#C0C0C0', '#CD7F32'];
    const gradients = [
      'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      'linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 100%)',
      'linear-gradient(135deg, #CD7F32 0%, #B87333 100%)',
    ];

    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {topThree.map((user, index) => (
          <Grid item xs={12} md={4} key={user.id}>
            <Grow in timeout={500 + index * 100}>
              <Paper
                elevation={index === 0 ? 8 : 3}
                sx={{
                  p: 3,
                  height: '100%',
                  background: index === 0 ? gradients[0] : 'background.paper',
                  border: index === 0 ? 'none' : 1,
                  borderColor: 'divider',
                  position: 'relative',
                  overflow: 'hidden',
                  transform: index === 0 ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: index === 0 ? 'scale(1.08)' : 'scale(1.03)',
                    boxShadow: 8,
                  },
                }}
              >
                {/* Position Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -15,
                    right: -15,
                    fontSize: '5rem',
                    opacity: 0.15,
                    transform: 'rotate(15deg)',
                  }}
                >
                  {positions[index]}
                </Box>

                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  {/* Avatar */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        fontSize: '2rem',
                        fontWeight: 900,
                        bgcolor: index === 0 ? 'rgba(255,255,255,0.3)' : colors[index],
                        color: index === 0 ? 'rgba(0,0,0,0.8)' : 'white',
                        boxShadow: `0 8px 16px ${colors[index]}40`,
                      }}
                    >
                      {user.user_name.charAt(0).toUpperCase()}
                    </Avatar>
                  </Box>

                  {/* User Name */}
                  <Typography 
                    variant="h6" 
                    fontWeight={800}
                    align="center"
                    sx={{ 
                      mb: 0.5,
                      color: index === 0 ? 'rgba(0,0,0,0.9)' : 'text.primary',
                    }}
                  >
                    {user.user_name}
                  </Typography>

                  {/* Device ID */}
                  <Typography 
                    variant="caption" 
                    fontFamily="monospace"
                    align="center"
                    sx={{ 
                      display: 'block',
                      mb: 2,
                      color: index === 0 ? 'rgba(0,0,0,0.6)' : 'text.secondary',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {user.device_id}
                  </Typography>

                  {/* Stats */}
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography 
                      variant="h3" 
                      fontWeight={900}
                      sx={{ color: index === 0 ? 'rgba(0,0,0,0.9)' : 'text.primary' }}
                    >
                      {user.total_visits}
                    </Typography>
                    <Typography 
                      variant="caption"
                      sx={{ 
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        letterSpacing: 1,
                        color: index === 0 ? 'rgba(0,0,0,0.7)' : 'text.secondary',
                      }}
                    >
                      Total Visits
                    </Typography>
                  </Box>

                  {/* Last Visit */}
                  <Chip
                    icon={<CalendarToday sx={{ fontSize: 14 }} />}
                    label={`Last seen: ${new Date(user.last_visit_at).toLocaleDateString()}`}
                    size="small"
                    sx={{
                      width: '100%',
                      bgcolor: index === 0 ? 'rgba(255,255,255,0.3)' : 'action.hover',
                      color: index === 0 ? 'rgba(0,0,0,0.8)' : 'text.primary',
                      fontWeight: 600,
                      border: index === 0 ? '1px solid rgba(255,255,255,0.4)' : 'none',
                    }}
                  />
                </Box>
              </Paper>
            </Grow>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <People sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              color: 'text.primary',
              letterSpacing: '-0.02em',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            }}
          >
            User Insights
          </Typography>
        </Box>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary',
            fontSize: '1.05rem',
            ml: 7,
          }}
        >
          Most active users in the community
        </Typography>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ width: '100%', mb: 3 }}>
          <LinearProgress />
        </Box>
      )}

      {/* Top 3 Users Podium */}
      {!loading && users.length > 0 && <TopUsers />}

      {/* All Users Grid */}
      <Grow in timeout={800}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <EmojiEvents sx={{ color: 'primary.main' }} />
            <Typography variant="h6" fontWeight={700}>
              Top Contributors
            </Typography>
            <Chip 
              label={`${users.length} Active Users`}
              size="small"
              color="primary"
              sx={{ ml: 'auto', fontWeight: 700 }}
            />
          </Box>

          <Grid container spacing={2}>
            {users.map((user, index) => (
              <Grid item xs={12} sm={6} md={4} key={user.id}>
                <Grow in timeout={600 + index * 50}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      border: 1,
                      borderColor: index < 3 ? 'primary.main' : 'divider',
                      transition: 'all 0.3s',
                      '&:hover': {
                        boxShadow: 4,
                        borderColor: 'primary.main',
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        {/* Rank Badge */}
                        <Avatar
                          sx={{
                            bgcolor: index < 3 ? 'primary.main' : 'action.hover',
                            color: index < 3 ? 'primary.contrastText' : 'text.secondary',
                            width: 40,
                            height: 40,
                            fontWeight: 900,
                            fontSize: '1rem',
                          }}
                        >
                          #{index + 1}
                        </Avatar>

                        {/* User Avatar */}
                        <Avatar
                          sx={{
                            width: 48,
                            height: 48,
                            fontSize: '1.25rem',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                          }}
                        >
                          {user.user_name.charAt(0).toUpperCase()}
                        </Avatar>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography 
                            variant="body1" 
                            fontWeight={700}
                            noWrap
                            sx={{ mb: 0.5 }}
                          >
                            {user.user_name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Visibility sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                              {user.total_visits} visits
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* Device ID */}
                      <Box
                        sx={{
                          bgcolor: 'action.hover',
                          p: 1.5,
                          borderRadius: 1.5,
                          mb: 2,
                        }}
                      >
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ 
                            display: 'block',
                            mb: 0.5,
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                            fontSize: '0.65rem',
                          }}
                        >
                          Device ID
                        </Typography>
                        <Typography 
                          variant="caption" 
                          fontFamily="monospace"
                          sx={{ 
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontWeight: 600,
                          }}
                        >
                          {user.device_id}
                        </Typography>
                      </Box>

                      {/* Activity Stats */}
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Box 
                          sx={{ 
                            flex: 1,
                            bgcolor: '#2196F315',
                            p: 1.5,
                            borderRadius: 1.5,
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" fontWeight={900} color="#2196F3">
                            {user.total_visits}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: 'text.secondary',
                              fontSize: '0.65rem',
                              fontWeight: 700,
                            }}
                          >
                            VISITS
                          </Typography>
                        </Box>

                        <Box 
                          sx={{ 
                            flex: 1,
                            bgcolor: '#22c55e15',
                            p: 1.5,
                            borderRadius: 1.5,
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" fontWeight={900} color="#22c55e">
                            {Math.floor(user.total_visits / 7)}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: 'text.secondary',
                              fontSize: '0.65rem',
                              fontWeight: 700,
                            }}
                          >
                            AVG/WEEK
                          </Typography>
                        </Box>
                      </Box>

                      {/* Last Visit Date */}
                      <Box 
                        sx={{ 
                          mt: 2,
                          pt: 2,
                          borderTop: 1,
                          borderColor: 'divider',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          Last seen: <strong>{new Date(user.last_visit_at).toLocaleDateString()}</strong>
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>

          {users.length === 0 && !loading && (
            <Box 
              sx={{ 
                textAlign: 'center',
                py: 10,
                color: 'text.secondary',
              }}
            >
              <People sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
              <Typography variant="h6" fontWeight={600}>
                No user data available
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                User insights will appear as people interact with the platform
              </Typography>
            </Box>
          )}
        </Box>
      </Grow>
    </Box>
  );
};

export default UserInsights;
