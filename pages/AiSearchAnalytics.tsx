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
  LinearProgress,
  Grow,
  Avatar,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  Search,
  EmojiEvents,
  AccessTime,
  TrendingUp,
  Warning,
  ExpandMore,
  Person,
  CalendarToday,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';

const AiSearchAnalytics: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [searches, setSearches] = useState<any[]>([]);
  const [popularSearches, setPopularSearches] = useState<any[]>([]);
  const [failedSearches, setFailedSearches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

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

  const handleExpandClick = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index);
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

      {/* Stats Cards - MOBILE OPTIMIZED */}
      <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} sx={{ mb: { xs: 3, sm: 4 } }}>
        <Grid item xs={6} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', height: '100%' }}>
            <CardContent sx={{ 
              p: { xs: 1.5, sm: 2, md: 2.5 },
              '&:last-child': { pb: { xs: 1.5, sm: 2, md: 2.5 } }
            }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                <Search 
                  color="primary" 
                  sx={{ 
                    fontSize: { xs: 24, sm: 28, md: 32 },
                    mb: 1
                  }} 
                />
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  fontWeight={700} 
                  letterSpacing={0.8}
                  sx={{ 
                    fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                    mb: 1
                  }}
                >
                  TOTAL
                </Typography>
                <Typography 
                  variant="h3" 
                  fontWeight={900}
                  sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}
                >
                  {stats?.total || 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', height: '100%' }}>
            <CardContent sx={{ 
              p: { xs: 1.5, sm: 2, md: 2.5 },
              '&:last-child': { pb: { xs: 1.5, sm: 2, md: 2.5 } }
            }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                <EmojiEvents 
                  sx={{ 
                    color: '#22c55e',
                    fontSize: { xs: 24, sm: 28, md: 32 },
                    mb: 1
                  }} 
                />
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  fontWeight={700} 
                  letterSpacing={0.8}
                  sx={{ 
                    fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                    mb: 1
                  }}
                >
                  SUCCESS
                </Typography>
                <Typography 
                  variant="h3" 
                  fontWeight={900} 
                  sx={{ 
                    color: '#22c55e',
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
                  }}
                >
                  {stats?.successRate}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', height: '100%' }}>
            <CardContent sx={{ 
              p: { xs: 1.5, sm: 2, md: 2.5 },
              '&:last-child': { pb: { xs: 1.5, sm: 2, md: 2.5 } }
            }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                <AccessTime 
                  sx={{ 
                    color: '#2196F3',
                    fontSize: { xs: 24, sm: 28, md: 32 },
                    mb: 1
                  }} 
                />
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  fontWeight={700} 
                  letterSpacing={0.8}
                  sx={{ 
                    fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                    mb: 1
                  }}
                >
                  AVG TIME
                </Typography>
                <Typography 
                  variant="h3" 
                  fontWeight={900} 
                  sx={{ 
                    color: '#2196F3',
                    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
                  }}
                >
                  {stats?.avgResponseTime}ms
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card elevation={0} sx={{ border: 1, borderColor: 'divider', height: '100%' }}>
            <CardContent sx={{ 
              p: { xs: 1.5, sm: 2, md: 2.5 },
              '&:last-child': { pb: { xs: 1.5, sm: 2, md: 2.5 } }
            }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                <TrendingUp 
                  sx={{ 
                    color: '#22c55e',
                    fontSize: { xs: 24, sm: 28, md: 32 },
                    mb: 1
                  }} 
                />
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  fontWeight={700} 
                  letterSpacing={0.8}
                  sx={{ 
                    fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                    mb: 1
                  }}
                >
                  PASSED
                </Typography>
                <Typography 
                  variant="h3" 
                  fontWeight={900}
                  sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}
                >
                  {stats?.successful || 0}
                </Typography>
              </Box>
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
                🔥 Popular Searches
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
                      gap: 1.5
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 1.5,
                      alignItems: 'center', 
                      flex: 1, 
                      minWidth: 0
                    }}>
                      <Chip
                        label={`#${idx + 1}`}
                        size="small"
                        color={idx < 3 ? 'primary' : 'default'}
                        sx={{ 
                          fontWeight: 900,
                          flexShrink: 0,
                          minWidth: 36
                        }}
                      />
                      <Typography 
                        variant="body2" 
                        fontWeight={600}
                        sx={{ 
                          fontSize: { xs: '0.875rem', sm: '0.938rem' },
                          wordBreak: 'break-word'
                        }}
                      >
                        {search.search_query}
                      </Typography>
                    </Box>
                    <Chip
                      label={search.search_count}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ 
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        fontWeight: 700,
                        flexShrink: 0
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
                      gap: 1.5
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant="body2" 
                        fontWeight={600}
                        sx={{ 
                          fontSize: { xs: '0.875rem', sm: '0.938rem' },
                          wordBreak: 'break-word'
                        }}
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

      {/* Recent Searches - MOBILE OPTIMIZED WITH USER INFO */}
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
            Latest 50 AI searches with full details including who searched
          </Typography>

          {/* Mobile Card View */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {searches.map((search, idx) => (
              <Paper
                key={idx}
                elevation={0}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: 2,
                    borderColor: 'primary.main'
                  }
                }}
              >
                <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    mb: 1.5,
                    gap: 1
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
                      <Avatar
                        sx={{
                          width: { xs: 36, sm: 40 },
                          height: { xs: 36, sm: 40 },
                          bgcolor: 'primary.main',
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          fontWeight: 800,
                          flexShrink: 0
                        }}
                      >
                        {(search.user_name || 'A').charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography 
                          variant="body2" 
                          fontWeight={700}
                          sx={{ fontSize: { xs: '0.875rem', sm: '0.938rem' } }}
                        >
                          {search.user_name || 'Anonymous'}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                        >
                          {new Date(search.searched_at).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <IconButton
                      size="small"
                      onClick={() => handleExpandClick(idx)}
                      sx={{
                        transform: expandedCard === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s',
                        flexShrink: 0
                      }}
                    >
                      <ExpandMore fontSize="small" />
                    </IconButton>
                  </Box>

                  <Box 
                    sx={{ 
                      bgcolor: 'action.hover',
                      p: 1.5,
                      borderRadius: 1.5,
                      mb: 1.5
                    }}
                  >
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        display: 'block',
                        fontSize: { xs: '0.65rem', sm: '0.7rem' },
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        mb: 0.5,
                        letterSpacing: 0.5
                      }}
                    >
                      Search Query
                    </Typography>
                    <Typography 
                      variant="body2" 
                      fontWeight={600}
                      sx={{ fontSize: { xs: '0.875rem', sm: '0.938rem' } }}
                    >
                      {search.search_query}
                    </Typography>
                  </Box>

                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1,
                    flexWrap: 'wrap'
                  }}>
                    <Chip
                      icon={search.search_success ? <CheckCircle /> : <Cancel />}
                      label={search.search_success ? 'Success' : 'Failed'}
                      size="small"
                      color={search.search_success ? 'success' : 'error'}
                      sx={{ 
                        fontWeight: 700,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' }
                      }}
                    />
                    <Chip
                      label={`${search.businesses_count} results`}
                      size="small"
                      color={search.businesses_count > 0 ? 'success' : 'default'}
                      sx={{ 
                        fontWeight: 700,
                        fontSize: { xs: '0.7rem', sm: '0.75rem' }
                      }}
                    />
                    {search.response_time_ms && (
                      <Chip
                        icon={<AccessTime />}
                        label={`${search.response_time_ms}ms`}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          fontSize: { xs: '0.7rem', sm: '0.75rem' }
                        }}
                      />
                    )}
                  </Box>
                </Box>

                {/* Expandable Details */}
                <Collapse in={expandedCard === idx} timeout="auto">
                  <Box 
                    sx={{ 
                      bgcolor: 'action.hover',
                      p: { xs: 1.5, sm: 2 },
                      borderTop: 1,
                      borderColor: 'divider'
                    }}
                  >
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        display: 'block',
                        fontSize: { xs: '0.65rem', sm: '0.7rem' },
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        mb: 1,
                        letterSpacing: 0.5
                      }}
                    >
                      Additional Details
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography 
                          variant="caption"
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.813rem' } }}
                        >
                          <strong>User:</strong> {search.user_name || 'Anonymous User'}
                        </Typography>
                      </Box>
                      
                      {search.device_id && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography 
                            variant="caption"
                            sx={{ fontSize: { xs: '0.75rem', sm: '0.813rem' } }}
                          >
                            <strong>Device:</strong> {search.device_id.substring(0, 20)}...
                          </Typography>
                        </Box>
                      )}
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography 
                          variant="caption"
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.813rem' } }}
                        >
                          <strong>Time:</strong> {new Date(search.searched_at).toLocaleString()}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Search sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography 
                          variant="caption"
                          sx={{ fontSize: { xs: '0.75rem', sm: '0.813rem' } }}
                        >
                          <strong>Results Found:</strong> {search.businesses_count} businesses
                        </Typography>
                      </Box>

                      {search.response_time_ms && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography 
                            variant="caption"
                            sx={{ fontSize: { xs: '0.75rem', sm: '0.813rem' } }}
                          >
                            <strong>Response Time:</strong> {search.response_time_ms}ms
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Collapse>
              </Paper>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AiSearchAnalytics;
