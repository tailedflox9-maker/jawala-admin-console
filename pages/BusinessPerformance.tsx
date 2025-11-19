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

  // Top 3 Winners Component
  const TopWinners = () => {
    const topThree = data.slice(0, 3);
    
    const medals = ['🥇', '🥈', '🥉'];
    const gradients = [
      'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      'linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 100%)',
      'linear-gradient(135deg, #CD7F32 0%, #B87333 100%)',
    ];

    return (
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, mb: 4 }}>
        {topThree.map((business, index) => (
          <Paper
            key={business.id}
            elevation={index === 0 ? 8 : 3}
            sx={{
              p: 3,
              background: index === 0 ? gradients[0] : 'background.paper',
              border: index === 0 ? 'none' : 1,
              borderColor: 'divider',
              position: 'relative',
              overflow: 'hidden',
              transform: index === 0 ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            {/* Medal Badge */}
            <Box
              sx={{
                position: 'absolute',
                top: -10,
                right: -10,
                fontSize: '4rem',
                opacity: 0.3,
                transform: 'rotate(15deg)',
              }}
            >
              {medals[index]}
            </Box>

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: index === 0 ? 'rgba(255,255,255,0.3)' : 'primary.main',
                    width: 48,
                    height: 48,
                    fontWeight: 900,
                    fontSize: '1.5rem',
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
                      letterSpacing: 1,
                    }}
                  >
                    {index === 0 ? 'Top Performer' : `Rank ${index + 1}`}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    fontWeight={700}
                    noWrap
                    sx={{ color: index === 0 ? 'rgba(0,0,0,0.9)' : 'text.primary' }}
                  >
                    {business.name}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    fontFamily="monospace"
                    sx={{ 
                      color: index === 0 ? 'rgba(0,0,0,0.6)' : 'text.secondary',
                      display: 'block',
                    }}
                  >
                    ID: {business.id.substring(0, 8)}...
                  </Typography>
                </Box>
              </Box>

              <Typography 
                variant="h3" 
                fontWeight={900} 
                sx={{ 
                  mb: 2,
                  color: index === 0 ? 'rgba(0,0,0,0.9)' : 'text.primary',
                }}
              >
                {business.total.toLocaleString()}
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
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
        px: 1.5,
        py: 1,
        borderRadius: 2,
        border: goldMode ? '1px solid rgba(255,255,255,0.4)' : 'none',
      }}
    >
      <Typography 
        variant="caption" 
        sx={{ 
          color: goldMode ? 'rgba(0,0,0,0.7)' : 'text.secondary',
          fontSize: '0.7rem',
          fontWeight: 700,
        }}
      >
        {label}
      </Typography>
      <Typography 
        variant="h6" 
        fontWeight={900}
        sx={{ color: goldMode ? 'rgba(0,0,0,0.9)' : color }}
      >
        {value}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <EmojiEvents sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              color: 'text.primary',
              letterSpacing: '-0.02em',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            }}
          >
            Business Performance
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
          mb: 4,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Engagement Distribution
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Stacked view of all interaction types across top businesses
            </Typography>
          </Box>

          <Box sx={{ height: 450 }}>
            {loading ? (
              <Skeleton variant="rectangular" width="100%" height="100%" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
                    tick={{
                      fill: 'hsl(var(--muted-foreground))',
                      fontSize: 11,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{
                      fill: 'hsl(var(--muted-foreground))',
                      fontSize: 12,
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
                    }}
                    itemStyle={{
                      color: 'hsl(var(--foreground))',
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                    labelStyle={{
                      color: 'hsl(var(--muted-foreground))',
                      marginBottom: 8,
                      fontWeight: 500,
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: 20 }} 
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

      {/* Detailed Table */}
      <Card
        elevation={0}
        sx={{
          border: 1,
          borderColor: 'divider',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Detailed Interaction Report
              </Typography>
              <Typography variant="body2" color="text.secondary">
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

          <Box sx={{ overflowX: 'auto' }}>
            <Box component="table" sx={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
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
