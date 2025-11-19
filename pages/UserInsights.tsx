import React, { useEffect, useState } from 'react';
import { getTopUsers } from '../supabaseClient';
import { Box, Typography, Grid, Paper, Avatar, CircularProgress } from '@mui/material';

const UserInsights: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    getTopUsers().then(data => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        User Insights
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Most active users in the community
      </Typography>

      <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', p: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Top Active Users
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {users.map((user, index) => (
            <Grid item xs={12} sm={6} md={4} key={user.id}>
              <Paper elevation={0} sx={{ p: 2.5, border: 1, borderColor: 'divider', height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40, fontWeight: 700 }}>
                    {user.user_name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body1" fontWeight={600} noWrap>
                      {user.user_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.total_visits} visits
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    Device ID
                  </Typography>
                  <Typography variant="caption" fontFamily="monospace" sx={{ display: 'block', wordBreak: 'break-all' }}>
                    {user.device_id}
                  </Typography>
                </Box>
                <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Typography variant="caption" color="text.secondary">
                    Last seen: <strong>{new Date(user.last_visit_at).toLocaleDateString()}</strong>
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default UserInsights;
