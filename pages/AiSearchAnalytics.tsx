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
      <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1.5, sm: 2 }, 
          mb: 1,
          flexWrap: 'wrap'
        }}>
          <Search sx={{ 
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
            AI Search Analytics
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
          Performance metrics and insights from AI-powered searches
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
        <Grid item xs={6} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent sx={{ 
              p: { xs: 2, sm: 2.5 },
              '&:last-child': { pb: { xs: 2, sm: 2.5 } }
            }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: { xs: 1.5, sm: 2 },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 0 }
              }}>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  fontWeight={700} 
                  letterSpacing={1}
                  sx={{ 
                    fontSize: { xs: '0.65rem', sm: '0.7rem' },
                    order: { xs: 2, sm: 1 }
                  }}
                >
                  TOTAL SEARCHES
                </Typography>
                <Search 
                  color="primary" 
                  sx={{ 
                    fontSize: { xs: 20, sm: 24 },
                    order: { xs: 1, sm: 2 }
                  }} 
                />
              </Box>
              <Typography 
                variant="h3" 
                fontWeight={900}
                sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem', lg: '3rem' } }}
              >
                {stats?.total || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent sx={{ 
              p: { xs: 2, sm: 2.5 },
              '&:last-child': { pb: { xs: 2, sm: 2.5 } }
            }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: { xs: 1.5, sm: 2 },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 0 }
              }}>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  fontWeight={700} 
                  letterSpacing={1}
                  sx={{ 
                    fontSize: { xs: '0.65rem', sm: '0.7rem' },
                    order: { xs: 2, sm: 1 }
                  }}
                >
                  SUCCESS RATE
                </Typography>
                <EmojiEvents 
                  sx={{ 
                    color: '#22c55e',
                    fontSize: { xs: 20, sm: 24 },
                    order: { xs: 1, sm: 2 }
                  }} 
                />
              </Box>
              <Typography 
                variant="h3" 
                fontWeight={900} 
                sx={{ 
                  color: '#22c55e',
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem', lg: '3rem' }
                }}
              >
                {stats?.successRate}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent sx={{ 
              p: { xs: 2, sm: 2.5 },
              '&:last-child': { pb: { xs: 2, sm: 2.5 } }
            }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: { xs: 1.5, sm: 2 },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 0 }
              }}>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  fontWeight={700} 
                  letterSpacing={1}
                  sx={{ 
                    fontSize: { xs: '0.6rem', sm: '0.7rem' },
                    order: { xs: 2, sm: 1 },
                    textAlign: { xs: 'center', sm: 'left' }
                  }}
                >
                  AVG RESPONSE
                </Typography>
                <AccessTime 
                  sx={{ 
                    color: '#2196F3',
                    fontSize: { xs: 20, sm: 24 },
                    order: { xs: 1, sm: 2 }
                  }} 
                />
              </Box>
              <Typography 
                variant="h3" 
                fontWeight={900} 
                sx={{ 
                  color: '#2196F3',
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.5rem' }
                }}
              >
                {stats?.avgResponseTime}ms
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent sx={{ 
              p: { xs: 2, sm: 2.5 },
              '&:last-child': { pb: { xs: 2, sm: 2.5 } }
            }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: { xs: 1.5, sm: 2 },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 0 }
              }}>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  fontWeight={700} 
                  letterSpacing={1}
                  sx={{ 
                    fontSize: { xs: '0.65rem', sm: '0.7rem' },
                    order: { xs: 2, sm: 1 }
                  }}
                >
                  SUCCESSFUL
                </Typography>
                <TrendingUp 
                  sx={{ 
                    color: '#22c55e',
                    fontSize: { xs: 20, sm: 24 },
                    order: { xs: 1, sm: 2 }
                  }} 
                />
              </Box>
              <Typography 
                variant="h3" 
                fontWeight={900}
                sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem', lg: '3rem' } }}
              >
                {stats?.successful || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Popular & Failed Searches */}
      <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
              <Typography 
                variant="h6" 
                fontWeight={700} 
                gutterBottom
                sx={{ fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' } }}
              >
                🔥 Popular Search Queries
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: { xs: 2, sm: 2.5 },
                  fontSize: { xs: '0.813rem', sm: '0.875rem' }
                }}
              >
                Most frequently searched terms
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {popularSearches.map((search, idx) => (
                  <Paper
                    key={idx}
                    elevation={0}
                    sx={{
                      p: { xs: 1.5, sm: 2 },
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      border: 1,
                      borderColor: 'divider',
                      '&:hover': { bgcolor: 'action.hover' },
                      flexWrap: { xs: 'wrap', sm: 'nowrap' },
                      gap: { xs: 1, sm: 0 }
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      gap: { xs: 1.5, sm: 2 }, 
                      alignItems: 'center', 
                      flex: 1, 
                      minWidth: 0,
                      width: { xs: '100%', sm: 'auto' }
                    }}>
                      <Chip
                        label={`#${idx + 1}`}
                        size="small"
                        color={idx < 3 ? 'primary' : 'default'}
                        sx={{ 
                          fontWeight: 900,
                          flexShrink: 0
                        }}
                      />
                      <Typography 
                        variant="body2" 
                        fontWeight={600} 
                        noWrap
                        sx={{ fontSize: { xs: '0.875rem', sm: '0.938rem' } }}
                      >
                        {search.search_query}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${search.search_count} searches`}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ 
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        ml: { xs: 'auto', sm: 0 }
                      }}
                    />
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
              <Typography 
                variant="h6" 
                fontWeight={700} 
                gutterBottom
                sx={{ fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' } }}
              >
                ⚠️ Failed Searches
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: { xs: 2, sm: 2.5 },
                  fontSize: { xs: '0.813rem', sm: '0.875rem' }
                }}
              >
                Queries that didn't return results
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {failedSearches.map((search, idx) => (
                  <Paper
                    key={idx}
                    elevation={0}
                    sx={{
                      p: { xs: 1.5, sm: 2 },
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      border: 1,
                      borderColor: '#f4433620',
                      bgcolor: '#f4433610',
                      gap: { xs: 1, sm: 2 }
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant="body2" 
                        fontWeight={600} 
                        noWrap
                        sx={{ fontSize: { xs: '0.875rem', sm: '0.938rem' } }}
                      >
                        {search.search_query}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.813rem' } }}
                      >
                        {search.failure_count} failed attempts
                      </Typography>
                    </Box>
                    <Warning sx={{ color: '#f44336', fontSize: { xs: 18, sm: 20 }, flexShrink: 0 }} />
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Searches Table */}
      <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
        <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
          <Typography 
            variant="h6" 
            fontWeight={700} 
            gutterBottom
            sx={{ fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' } }}
          >
            Recent Search History
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: { xs: 2, sm: 2.5 },
              fontSize: { xs: '0.813rem', sm: '0.875rem' }
            }}
          >
            Latest 50 AI searches with full details
          </Typography>

          <Box sx={{ overflowX: 'auto', mx: { xs: -2, sm: -2.5, md: -3 }, px: { xs: 2, sm: 2.5, md: 3 } }}>
            <TableContainer>
              <Table size="small" sx={{ minWidth: 650 }}>
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
                        <Typography variant="caption" fontFamily="monospace" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                          {new Date(search.searched_at).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" noWrap sx={{ fontSize: { xs: '0.813rem', sm: '0.875rem' } }}>
                          {search.user_name || 'Anonymous'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          fontWeight={600} 
                          sx={{ 
                            maxWidth: { xs: 150, sm: 200, md: 300 },
                            fontSize: { xs: '0.813rem', sm: '0.875rem' }
                          }}
                        >
                          {search.search_query}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={`${search.businesses_count} found`}
                          size="small"
                          color={search.businesses_count > 0 ? 'success' : 'default'}
                          sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={search.search_success ? 'Success' : 'Failed'}
                          size="small"
                          color={search.search_success ? 'success' : 'error'}
                          sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Typography 
                          variant="caption" 
                          fontFamily="monospace"
                          sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                        >
                          {search.response_time_ms || '-'}ms
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AiSearchAnalytics;
