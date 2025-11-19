import React, { useEffect, useState } from 'react';
import {
  getAiSearchStats,
  getRecentAiSearches,
  getPopularSearches,
  getFailedSearches,
} from '../supabaseClient';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Grow,
} from '@mui/material';
import {
  Search,
  EmojiEvents,
  AccessTime,
  TrendingUp,
  Warning,
} from '@mui/icons-material';

const AiSearchAnalytics: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [searches, setSearches] = useState<any[]>([]);
  const [popularSearches, setPopularSearches] = useState<any[]>([]);
  const [failedSearches, setFailedSearches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsData, searchesData, popularData, failedData] = await Promise.all([
        getAiSearchStats(),
        getRecentAiSearches(50),
        getPopularSearches(15),
        getFailedSearches(15),
      ]);

      setStats(statsData);
      setSearches(searchesData);
      setPopularSearches(popularData);
      setFailedSearches(failedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching AI search data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Search sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              color: 'text.primary',
              letterSpacing: '-0.02em',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            }}
          >
            AI Search Analytics
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.05rem', ml: 7 }}>
          Performance metrics and insights from AI-powered searches
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700} letterSpacing={1}>
                  TOTAL SEARCHES
                </Typography>
                <Search color="primary" />
              </Box>
              <Typography variant="h3" fontWeight={900}>
                {stats?.total || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700} letterSpacing={1}>
                  SUCCESS RATE
                </Typography>
                <EmojiEvents sx={{ color: '#22c55e' }} />
              </Box>
              <Typography variant="h3" fontWeight={900} sx={{ color: '#22c55e' }}>
                {stats?.successRate}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700} letterSpacing={1}>
                  AVG RESPONSE TIME
                </Typography>
                <AccessTime sx={{ color: '#2196F3' }} />
              </Box>
              <Typography variant="h3" fontWeight={900} sx={{ color: '#2196F3' }}>
                {stats?.avgResponseTime}ms
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700} letterSpacing={1}>
                  SUCCESSFUL
                </Typography>
                <TrendingUp sx={{ color: '#22c55e' }} />
              </Box>
              <Typography variant="h3" fontWeight={900}>
                {stats?.successful || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Popular & Failed Searches */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                🔥 Popular Search Queries
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Most frequently searched terms
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {popularSearches.map((search, idx) => (
                  <Paper
                    key={idx}
                    elevation={0}
                    sx={{
                      p: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      border: 1,
                      borderColor: 'divider',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flex: 1, minWidth: 0 }}>
                      <Chip
                        label={`#${idx + 1}`}
                        size="small"
                        color={idx < 3 ? 'primary' : 'default'}
                        sx={{ fontWeight: 900 }}
                      />
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {search.search_query}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${search.search_count} searches`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                ⚠️ Failed Searches
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Queries that didn't return results
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {failedSearches.map((search, idx) => (
                  <Paper
                    key={idx}
                    elevation={0}
                    sx={{
                      p: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      border: 1,
                      borderColor: '#f4433620',
                      bgcolor: '#f4433610',
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {search.search_query}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {search.failure_count} failed attempts
                      </Typography>
                    </Box>
                    <Warning sx={{ color: '#f44336', fontSize: 20 }} />
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Searches Table */}
      <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Recent Search History
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Latest 50 AI searches with full details
          </Typography>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Time</strong></TableCell>
                  <TableCell><strong>User</strong></TableCell>
                  <TableCell><strong>Query</strong></TableCell>
                  <TableCell align="center"><strong>Results</strong></TableCell>
                  <TableCell align="center"><strong>Status</strong></TableCell>
                  <TableCell align="center"><strong>Response Time</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searches.map((search, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell>
                      <Typography variant="caption" fontFamily="monospace">
                        {new Date(search.searched_at).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap>
                        {search.user_name || 'Anonymous'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} sx={{ maxWidth: 300 }}>
                        {search.search_query}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${search.businesses_count} found`}
                        size="small"
                        color={search.businesses_count > 0 ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={search.search_success ? 'Success' : 'Failed'}
                        size="small"
                        color={search.search_success ? 'success' : 'error'}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="caption" fontFamily="monospace">
                        {search.response_time_ms || '-'}ms
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AiSearchAnalytics;
