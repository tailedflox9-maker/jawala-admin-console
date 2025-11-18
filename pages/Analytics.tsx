import React, { useEffect, useState } from 'react';
import { getAllVisitLogs, getEcosystemStats, getTopUsers, getTopBusinesses } from '../supabaseClient';
import { VisitLog, UserTracking } from '../types';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Tabs,
  Tab,
  Skeleton,
  Avatar,
  LinearProgress,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import {
  Store as StoreIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  ViewList as ViewListIcon,
  Payment as PaymentIcon,
  LocalShipping as DeliveryIcon,
  Visibility as ViewIcon,
  Phone as PhoneIcon,
  Share as ShareIcon,
  WhatsApp as WhatsAppIcon,
} from '@mui/icons-material';

const Analytics: React.FC = () => {
  const [logs, setLogs] = useState<VisitLog[]>([]);
  const [stats, setStats] = useState<{ category: any[], payment: any[], delivery: any[] } | null>(null);
  const [topUsers, setTopUsers] = useState<UserTracking[]>([]);
  const [topBusinesses, setTopBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [logData, ecosystemData, usersData, businessData] = await Promise.all([
          getAllVisitLogs(200),
          getEcosystemStats(),
          getTopUsers(),
          getTopBusinesses()
        ]);
        setLogs(logData);
        setStats(ecosystemData);
        setTopUsers(usersData);
        setTopBusinesses(businessData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const COLORS = ['#1976d2', '#2196f3', '#42a5f5', '#64b5f6', '#90caf9', '#bbdefb'];
  const DELIVERY_COLORS = ['#4caf50', '#f44336'];

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="rectangular" height={60} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  const totalBusinesses = stats ? stats.category.reduce((sum, cat) => sum + cat.value, 0) : 0;
  const deliveryEnabled = stats?.delivery[0]?.value || 0;
  const upiEnabled = stats?.payment.find(p => p.name === 'UPI')?.value || 0;

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1600, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Analytics Deep Dive
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Comprehensive data analysis across business ecosystem, users, and performance
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <StoreIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {totalBusinesses}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total Businesses
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <DeliveryIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {deliveryEnabled}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Home Delivery
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(deliveryEnabled / totalBusinesses) * 100} 
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <PaymentIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {upiEnabled}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    UPI Enabled
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(upiEnabled / totalBusinesses) * 100} 
                color="info"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <PeopleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {topUsers.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Active Users
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card elevation={2}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab icon={<StoreIcon />} label="Business Ecosystem" iconPosition="start" />
          <Tab icon={<PeopleIcon />} label="User Insights" iconPosition="start" />
          <Tab icon={<TrendingUpIcon />} label="Performance" iconPosition="start" />
          <Tab icon={<ViewListIcon />} label="System Logs" iconPosition="start" />
        </Tabs>

        {/* Tab 1: Business Ecosystem */}
        {activeTab === 0 && (
          <CardContent>
            <Grid container spacing={3}>
              {/* Category Distribution */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Category Distribution
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Market saturation by business type
                </Typography>
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats?.category}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={120}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, percent }) => percent > 0.05 ? `${name} (${(percent * 100).toFixed(0)}%)` : ''}
                      >
                        {stats?.category.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ 
                          borderRadius: 8, 
                          border: 'none', 
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          padding: '12px'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>

                {/* Category Breakdown List */}
                <Box sx={{ mt: 2 }}>
                  {stats?.category.slice(0, 5).map((cat, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <Box 
                        sx={{ 
                          width: 16, 
                          height: 16, 
                          borderRadius: 1, 
                          bgcolor: COLORS[idx], 
                          mr: 1.5 
                        }} 
                      />
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        {cat.name}
                      </Typography>
                      <Chip label={cat.value} size="small" />
                    </Box>
                  ))}
                </Box>
              </Grid>

              {/* Payment & Delivery */}
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Payment Methods
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Digital payment adoption
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats?.payment} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="category" dataKey="name" />
                        <YAxis type="number" />
                        <RechartsTooltip 
                          contentStyle={{ 
                            borderRadius: 8, 
                            border: 'none', 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
                          }} 
                        />
                        <Bar dataKey="value" fill="#1976d2" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Delivery Service
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Home delivery availability
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Card variant="outlined" sx={{ textAlign: 'center', p: 2, bgcolor: 'success.50' }}>
                        <Typography variant="h3" color="success.main" fontWeight="bold">
                          {stats?.delivery[0]?.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Available
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={6}>
                      <Card variant="outlined" sx={{ textAlign: 'center', p: 2, bgcolor: 'error.50' }}>
                        <Typography variant="h3" color="error.main" fontWeight="bold">
                          {stats?.delivery[1]?.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Not Available
                        </Typography>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        )}

        {/* Tab 2: User Insights */}
        {activeTab === 1 && (
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Top Active Users
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Most frequent visitors to the directory
                </Typography>
                <Divider sx={{ my: 2 }} />

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Rank</TableCell>
                        <TableCell>User Name</TableCell>
                        <TableCell align="center">Total Visits</TableCell>
                        <TableCell>Last Seen</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topUsers.map((user, index) => (
                        <TableRow key={user.id} hover>
                          <TableCell>
                            <Chip 
                              label={`#${index + 1}`} 
                              size="small" 
                              color={index < 3 ? 'primary' : 'default'}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ width: 32, height: 32, mr: 1, fontSize: '0.875rem' }}>
                                {user.user_name.substring(0, 2).toUpperCase()}
                              </Avatar>
                              <Typography variant="body2" fontWeight="medium">
                                {user.user_name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Chip label={user.total_visits} color="info" size="small" />
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(user.last_visit_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      User Retention
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      New vs Returning visitors
                    </Typography>
                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ textAlign: 'center', py: 3 }}>
                      <Box 
                        sx={{ 
                          width: 160, 
                          height: 160, 
                          borderRadius: '50%', 
                          border: '12px solid',
                          borderColor: 'success.light',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 2
                        }}
                      >
                        <Box>
                          <Typography variant="h3" color="success.main" fontWeight="bold">
                            78%
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Returning
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Alert severity="success" sx={{ mt: 2 }}>
                        High retention rate indicates strong local utility
                      </Alert>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        )}

        {/* Tab 3: Performance */}
        {activeTab === 2 && (
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Most Engaged Businesses
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Ranked by user interactions (views, calls, shares)
            </Typography>
            <Divider sx={{ my: 2 }} />

            {topBusinesses.length === 0 ? (
              <Alert severity="info">No interaction data recorded yet. Data will appear as users engage with businesses.</Alert>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Rank</TableCell>
                      <TableCell>Business Name</TableCell>
                      <TableCell align="center">
                        <ViewIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                        Views
                      </TableCell>
                      <TableCell align="center">
                        <PhoneIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                        Calls
                      </TableCell>
                      <TableCell align="center">
                        <WhatsAppIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                        WhatsApp
                      </TableCell>
                      <TableCell align="center">
                        <ShareIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                        Shares
                      </TableCell>
                      <TableCell align="right">Total Score</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topBusinesses.map((biz, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Chip 
                            label={`#${index + 1}`} 
                            size="small"
                            color={index === 0 ? 'warning' : index < 3 ? 'success' : 'default'}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {biz.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={biz.views} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={biz.calls} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={biz.whatsapp} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={biz.share} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell align="right">
                          <Chip label={biz.total} color="primary" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        )}

        {/* Tab 4: System Logs */}
        {activeTab === 3 && (
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  System Activity Logs
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Real-time stream of user interactions
                </Typography>
              </Box>
              <Chip label={`${logs.length} Records`} color="primary" />
            </Box>
            <Divider sx={{ my: 2 }} />

            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Page</TableCell>
                    <TableCell>Device ID</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.map((log, index) => (
                    <TableRow key={log.id || index} hover>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                          {new Date(log.visited_at || '').toLocaleString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.75rem' }}>
                            {log.user_name ? log.user_name.substring(0, 1).toUpperCase() : 'G'}
                          </Avatar>
                          <Typography variant="body2">
                            {log.user_name || 'Guest'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={log.page_path || '/'}
                          size="small" 
                          variant="outlined"
                          sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontFamily: 'monospace', 
                            color: 'text.secondary',
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {log.device_id}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        )}
      </Card>
    </Box>
  );
};

export default Analytics;
