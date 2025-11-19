import React, { useEffect, useState } from 'react';
import { getTopBusinessIds } from '../supabaseClient';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';

const BusinessPerformance: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopBusinessIds().then(d => {
      setData(d);
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
        Business Performance
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Top performing business listings
      </Typography>

      <Paper elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight={600}>
            Top Businesses
          </Typography>
        </Box>
        <Box sx={{ overflowX: 'auto' }}>
          <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
            <Box component="thead" sx={{ bgcolor: 'action.hover' }}>
              <Box component="tr">
                <Box component="th" sx={{ p: 2, textAlign: 'left' }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary">
                    BUSINESS ID
                  </Typography>
                </Box>
                <Box component="th" sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary">
                    CALLS
                  </Typography>
                </Box>
                <Box component="th" sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary">
                    WHATSAPP
                  </Typography>
                </Box>
                <Box component="th" sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary">
                    SHARES
                  </Typography>
                </Box>
                <Box component="th" sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary">
                    VIEWS
                  </Typography>
                </Box>
                <Box component="th" sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary">
                    TOTAL
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box component="tbody">
              {data.map((row, index) => (
                <Box
                  component="tr"
                  key={row.id}
                  sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <Box component="td" sx={{ p: 2 }}>
                    <Typography variant="body2" fontFamily="monospace" fontWeight={600}>
                      {row.id.substring(0, 12)}...
                    </Typography>
                  </Box>
                  <Box component="td" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2">{row.calls}</Typography>
                  </Box>
                  <Box component="td" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2">{row.whatsapp}</Typography>
                  </Box>
                  <Box component="td" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2">{row.shares}</Typography>
                  </Box>
                  <Box component="td" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2">{row.views}</Typography>
                  </Box>
                  <Box component="td" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight={700}>
                      {row.total}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default BusinessPerformance;
