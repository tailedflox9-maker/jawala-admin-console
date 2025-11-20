import React, { useEffect, useState } from 'react';
import { getTopBusinessIds } from '../supabaseClient';
import { Card, CardContent, CardHeader, Skeleton } from '../components/ui/Primitives';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Box, Typography, Chip, Avatar, Paper } from '@mui/material';
import { TrendingUp, Phone, WhatsApp, Share, Visibility, EmojiEvents, Storefront } from '@mui/icons-material';

const BusinessPerformance: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopBusinessIds().then(d => {
      setData(d);
      setLoading(false);
    });
  }, []);

  // Top 3 Winners Component - MOBILE OPTIMIZED
  const TopWinners = () => {
    const topThree = data.slice(0, 3);
    
    const medals = ['🥇', '🥈', '🥉'];
    const gradients = [
      'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      'linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 100%)',
      'linear-gradient(135deg, #CD7F32 0%, #B87333 100%)',
    ];

    return (
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 2, sm: 2.5, md: 3 },
        mb: { xs: 3, sm: 4 }
      }}>
        {topThree.map((business, index) => (
          <Paper
            key={business.id}
            elevation={index === 0 ? 8 : 3}
            sx={{
              p: { xs: 2, sm: 2.5, md: 3 },
              background: index === 0 ? gradients[0] : 'background.paper',
              border: index === 0 ? 'none' : 1,
              borderColor: 'divider',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Medal Badge */}
            <Box
              sx={{
                position: 'absolute',
                top: { xs: -5, sm: -10 },
                right: { xs: -5, sm: -10 },
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                opacity: 0.25,
                transform: 'rotate(15deg)',
              }}
            >
              {medals[index]}
            </Box>

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'flex-start',
                gap: { xs: 1.5, sm: 2 },
                mb: { xs: 2, sm: 2.5 },
                flexWrap: 'wrap'
              }}>
                <Avatar
                  sx={{
                    bgcolor: index === 0 ? 'rgba(255,255,255,0.3)' : 'primary.main',
                    width: { xs: 36, sm: 44, md: 48 },
                    height: { xs: 36, sm: 44, md: 48 },
                    fontWeight: 900,
                    fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                    flexShrink: 0
                  }}
                >
                  #{index + 1}
                </Avatar>
                
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: index === 0 ? 'rgba(0,0,0,0.7)' : 'text.secondary',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: 0.8,
                      fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                      display: 'block',
                      mb: 0.5
                    }}
                  >
                    {index === 0 ? 'Top Performer' : `Rank ${index + 1}`}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    fontWeight={700}
                    sx={{ 
                      color: index === 0 ? 'rgba(0,0,0,0.9)' : 'text.primary',
                      fontSize: { xs: '0.9rem', sm: '1.05rem', md: '1.15rem' },
                      wordBreak: 'break-word',
                      mb: 0.5
                    }}
                  >
                    {business.name}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    fontFamily="monospace"
                    sx={{ 
                      color: index === 0 ? 'rgba(0,0,0,0.6)' : 'text.secondary',
                      display: 'block',
                      fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' }
                    }}
                  >
                    ID: {business.id.substring(0, 8)}...
                  </Typography>
                </Box>

                <Typography 
                  variant="h3" 
                  fontWeight={900} 
                  sx={{ 
                    color: index === 0 ? 'rgba(0,0,0,0.9)' : 'text.primary',
                    fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                    width: { xs: '100%', sm: 'auto' },
                    textAlign: { xs: 'center', sm: 'right' },
                    mt: { xs: 1, sm: 0 }
                  }}
                >
                  {business.total.toLocaleString()}
                </Typography>
              </Box>

              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
                gap: { xs: 1, sm: 1.25, md: 1.5 }
              }}>
                <MetricChip 
                  label="Views" 
                  value={business.views} 
                  color="#64748b"
                  goldMode={index === 0}
                />
                <MetricChip 
                  label="Calls" 
                  value={business.calls} 
                  color="#2196F3"
                  goldMode={index === 0}
                />
                <MetricChip 
                  label="WhatsApp" 
                  value={business.whatsapp} 
                  color="#22c55e"
                  goldMode={index === 0}
                />
                <MetricChip 
                  label="Shares" 
                  value={business.shares} 
                  color="#a855f7"
                  goldMode={index === 0}
                />
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
    );
  };

  const MetricChip = ({ label, value, color, goldMode }: any) => (
    <Box
      sx={{
        bgcolor: goldMode ? 'rgba(255,255,255,0.3)' : `${color}15`,
        px: { xs: 1, sm: 1.25, md: 1.5 },
        py: { xs: 0.75, sm: 0.875, md: 1 },
        borderRadius: 2,
        border: goldMode ? '1px solid rgba(255,255,255,0.4)' : 'none',
        textAlign: 'center'
      }}
    >
      <Typography 
        variant="caption" 
        sx={{ 
          color: goldMode ? 'rgba(0,0,0,0.7)' : 'text.secondary',
          fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
          fontWeight: 700,
          display: 'block',
          mb: 0.25
        }}
      >
        {label}
      </Typography>
      <Typography 
        variant="h6" 
        fontWeight={900}
        sx={{ 
          color: goldMode ? 'rgba(0,0,0,0.9)' : color,
          fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' }
        }}
      >
        {value}
      </Typography>
    </Box>
  );

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
          <EmojiEvents sx={{ 
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
            Business Performance
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
          Top 15 businesses by user engagement metrics
        </Typography>
      </Box>

      {/* Top 3 Winners Podium */}
      {!loading && <TopWinners />}

      {/* Performance Chart */}
      <Card
        elevation={0}
        sx={{
          border: 1,
          borderColor: 'divider',
          mb: { xs: 3, sm: 4 },
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
              Engagement Distribution
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontSize: { xs: '0.813rem', sm: '0.875rem' } }}
            >
              Stacked view of all interaction types across top businesses
            </Typography>
          </Box>

          <Box sx={{ height: { xs: 300, sm: 380, md: 450 }, width: '100%', overflowX: 'auto' }}>
            {loading ? (
              <Skeleton variant="rectangular" width="100%" height="100%" />
            ) : (
              <ResponsiveContainer width="100%" height="100%" minWidth={300}>
                <BarChart data={data} margin={{ top: 20, right: 10, left: -10, bottom: 80 }}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="hsl(var(--border))" 
                    vertical={false}
                    opacity={0.5}
                  />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                    tick={{
                      fill: 'hsl(var(--muted-foreground))',
                      fontSize: 10,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{
                      fill: 'hsl(var(--muted-foreground))',
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--muted)/0.15)' }}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))', 
                      borderRadius: 12,
                      boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
                      border: '1px solid hsl(var(--border))',
                      fontSize: 13
                    }}
                    itemStyle={{
                      color: 'hsl(var(--foreground))',
                      fontWeight: 600,
                      fontSize: 12,
                    }}
                    labelStyle={{
                      color: 'hsl(var(--muted-foreground))',
                      marginBottom: 8,
                      fontWeight: 500,
                      fontSize: 11
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: 20, fontSize: 12 }} 
                    iconType="circle"
                  />
                  <Bar 
                    dataKey="views" 
                    stackId="a" 
                    fill="#64748b" 
                    name="Views" 
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar 
                    dataKey="calls" 
                    stackId="a" 
                    fill="#2196F3" 
                    name="Calls" 
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar 
                    dataKey="whatsapp" 
                    stackId="a" 
                    fill="#22c55e" 
                    name="WhatsApp" 
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar 
                    dataKey="shares" 
                    stackId="a" 
                    fill="#a855f7" 
                    name="Shares" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Detailed Table - MOBILE OPTIMIZED */}
      <Card
        elevation={0}
        sx={{
          border: 1,
          borderColor: 'divider',
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
                Detailed Interaction Report
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.813rem', sm: '0.875rem' } }}
              >
                Complete breakdown per business
              </Typography>
            </Box>
            <Chip 
              icon={<Storefront />}
              label={`${data.length} Businesses`}
              color="primary" 
              size="small"
              sx={{ fontWeight: 700 }}
            />
          </Box>

          {/* MOBILE-FIRST: Card View for small screens, Table for larger */}
          
          {/* Mobile Card View (xs, sm) */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            {data.map((row, index) => (
              <Paper
                key={row.id}
                elevation={0}
                sx={{
                  p: 2,
                  mb: 2,
                  border: 1,
                  borderColor: index < 3 ? 'primary.main' : 'divider',
                  borderRadius: 2,
                  bgcolor: index < 3 ? 'primary.main' : 'background.paper',
                  color: index < 3 ? 'primary.contrastText' : 'text.primary',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Chip
                    label={`#${index + 1}`}
                    size="small"
                    sx={{
                      bgcolor: index < 3 ? 'rgba(255,255,255,0.2)' : 'primary.main',
                      color: index < 3 ? 'white' : 'primary.contrastText',
                      fontWeight: 900,
                    }}
                  />
                  <Typography variant="h5" fontWeight={900} sx={{ color: 'inherit' }}>
                    {row.total}
                  </Typography>
                </Box>
                
                <Typography variant="body1" fontWeight={700} sx={{ color: 'inherit', mb: 0.5 }}>
                  {row.name}
                </Typography>
                <Typography 
                  variant="caption" 
                  fontFamily="monospace"
                  sx={{ color: 'inherit', opacity: 0.7, display: 'block', mb: 2 }}
                >
                  {row.id.substring(0, 16)}...
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
                  <Box sx={{ 
                    bgcolor: index < 3 ? 'rgba(255,255,255,0.15)' : '#64748b15',
                    p: 1.5,
                    borderRadius: 1.5,
                    textAlign: 'center'
                  }}>
                    <Typography variant="caption" sx={{ color: 'inherit', opacity: 0.8, fontSize: '0.65rem', display: 'block' }}>
                      Views
                    </Typography>
                    <Typography variant="h6" fontWeight={800} sx={{ color: 'inherit' }}>
                      {row.views}
                    </Typography>
                  </Box>

                  <Box sx={{ 
                    bgcolor: index < 3 ? 'rgba(255,255,255,0.15)' : '#2196F315',
                    p: 1.5,
                    borderRadius: 1.5,
                    textAlign: 'center'
                  }}>
                    <Typography variant="caption" sx={{ color: 'inherit', opacity: 0.8, fontSize: '0.65rem', display: 'block' }}>
                      Calls
                    </Typography>
                    <Typography variant="h6" fontWeight={800} sx={{ color: 'inherit' }}>
                      {row.calls}
                    </Typography>
                  </Box>

                  <Box sx={{ 
                    bgcolor: index < 3 ? 'rgba(255,255,255,0.15)' : '#22c55e15',
                    p: 1.5,
                    borderRadius: 1.5,
                    textAlign: 'center'
                  }}>
                    <Typography variant="caption" sx={{ color: 'inherit', opacity: 0.8, fontSize: '0.65rem', display: 'block' }}>
                      WhatsApp
                    </Typography>
                    <Typography variant="h6" fontWeight={800} sx={{ color: 'inherit' }}>
                      {row.whatsapp}
                    </Typography>
                  </Box>

                  <Box sx={{ 
                    bgcolor: index < 3 ? 'rgba(255,255,255,0.15)' : '#a855f715',
                    p: 1.5,
                    borderRadius: 1.5,
                    textAlign: 'center'
                  }}>
                    <Typography variant="caption" sx={{ color: 'inherit', opacity: 0.8, fontSize: '0.65rem', display: 'block' }}>
                      Shares
                    </Typography>
                    <Typography variant="h6" fontWeight={800} sx={{ color: 'inherit' }}>
                      {row.shares}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>

          {/* Desktop Table View (md+) */}
          <Box sx={{ display: { xs: 'none', md: 'block' }, overflowX: 'auto' }}>
            <Box component="table" sx={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', minWidth: 650 }}>
              <Box component="thead">
                <Box component="tr">
                  <Box component="th" sx={{ textAlign: 'left', pb: 2, pl: 2 }}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" letterSpacing={1}>
                      RANK
                    </Typography>
                  </Box>
                  <Box component="th" sx={{ textAlign: 'left', pb: 2 }}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" letterSpacing={1}>
                      BUSINESS NAME
                    </Typography>
                  </Box>
                  <Box component="th" sx={{ textAlign: 'center', pb: 2 }}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" letterSpacing={1}>
                      VIEWS
                    </Typography>
                  </Box>
                  <Box component="th" sx={{ textAlign: 'center', pb: 2 }}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" letterSpacing={1}>
                      CALLS
                    </Typography>
                  </Box>
                  <Box component="th" sx={{ textAlign: 'center', pb: 2 }}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" letterSpacing={1}>
                      WHATSAPP
                    </Typography>
                  </Box>
                  <Box component="th" sx={{ textAlign: 'center', pb: 2 }}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" letterSpacing={1}>
                      SHARES
                    </Typography>
                  </Box>
                  <Box component="th" sx={{ textAlign: 'right', pb: 2, pr: 2 }}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" letterSpacing={1}>
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
                      bgcolor: index < 3 ? 'primary.main' : 'background.paper',
                      color: index < 3 ? 'primary.contrastText' : 'text.primary',
                      '&:hover': {
                        bgcolor: index < 3 ? 'primary.dark' : 'action.hover',
                      },
                    }}
                  >
                    <Box component="td" sx={{ p: 2, borderRadius: '12px 0 0 12px' }}>
                      <Chip
                        label={`#${index + 1}`}
                        size="small"
                        sx={{
                          bgcolor: index < 3 ? 'rgba(255,255,255,0.2)' : 'primary.main',
                          color: index < 3 ? 'white' : 'primary.contrastText',
                          fontWeight: 900,
                          minWidth: 36,
                        }}
                      />
                    </Box>
                    <Box component="td" sx={{ p: 2 }}>
                      <Box>
                        <Typography variant="body2" fontWeight={700} sx={{ color: 'inherit', mb: 0.5 }}>
                          {row.name}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          fontFamily="monospace"
                          sx={{ color: 'inherit', opacity: 0.7 }}
                        >
                          {row.id.substring(0, 12)}...
                        </Typography>
                      </Box>
                    </Box>
                    <Box component="td" sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: 'inherit', opacity: 0.8 }}>
                        {row.views}
                      </Typography>
                    </Box>
                    <Box component="td" sx={{ p: 2, textAlign: 'center' }}>
                      {row.calls > 0 ? (
                        <Chip
                          label={row.calls}
                          size="small"
                          sx={{ 
                            bgcolor: index < 3 ? 'rgba(255,255,255,0.2)' : '#2196F315',
                            color: index < 3 ? 'white' : '#2196F3',
                            fontWeight: 700,
                          }}
                        />
                      ) : (
                        <Typography variant="body2" sx={{ color: 'inherit', opacity: 0.4 }}>-</Typography>
                      )}
                    </Box>
                    <Box component="td" sx={{ p: 2, textAlign: 'center' }}>
                      {row.whatsapp > 0 ? (
                        <Chip
                          label={row.whatsapp}
                          size="small"
                          sx={{ 
                            bgcolor: index < 3 ? 'rgba(255,255,255,0.2)' : '#22c55e15',
                            color: index < 3 ? 'white' : '#22c55e',
                            fontWeight: 700,
                          }}
                        />
                      ) : (
                        <Typography variant="body2" sx={{ color: 'inherit', opacity: 0.4 }}>-</Typography>
                      )}
                    </Box>
                    <Box component="td" sx={{ p: 2, textAlign: 'center' }}>
                      {row.shares > 0 ? (
                        <Chip
                          label={row.shares}
                          size="small"
                          sx={{ 
                            bgcolor: index < 3 ? 'rgba(255,255,255,0.2)' : '#a855f715',
                            color: index < 3 ? 'white' : '#a855f7',
                            fontWeight: 700,
                          }}
                        />
                      ) : (
                        <Typography variant="body2" sx={{ color: 'inherit', opacity: 0.4 }}>-</Typography>
                      )}
                    </Box>
                    <Box component="td" sx={{ p: 2, textAlign: 'right', borderRadius: '0 12px 12px 0' }}>
                      <Typography variant="h6" fontWeight={900} sx={{ color: 'inherit' }}>
                        {row.total}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BusinessPerformance;
