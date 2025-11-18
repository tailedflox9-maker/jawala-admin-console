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
  Chip,
  Tabs,
  Tab,
  Skeleton,
  Avatar,
  LinearProgress,
  Divider,
  Alert,
} from '@mui/material';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Store as StoreIcon, People as PeopleIcon, TrendingUp as TrendingUpIcon,
  ViewList as ViewListIcon, Payment as PaymentIcon, LocalShipping as DeliveryIcon,
  Visibility as ViewIcon, Phone as PhoneIcon, Share as ShareIcon, WhatsApp as WhatsAppIcon,
} from '@mui/icons-material';
import { 
  Store, Users, TrendingUp, List, CreditCard, Truck, 
  Eye, Phone, Share2, MessageCircle 
} from 'lucide-react'; // Optional: using Lucide for consistent icons if preferred, but stick to MUI for now

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

  const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#1d4ed8'];
  
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Custom Tooltip for Dark Mode
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border p-3 rounded-lg shadow-xl">
          <p className="font-bold text-popover-foreground">{label}</p>
          <p className="text-primary">{`${payload[0].name} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <div className="p-8"><Skeleton variant="rectangular" height={400} className="rounded-xl" /></div>;
  }

  const totalBusinesses = stats ? stats.category.reduce((sum, cat) => sum + cat.value, 0) : 0;

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1600, mx: 'auto' }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics Deep Dive</h1>
        <p className="text-muted-foreground">Comprehensive insights across ecosystem, users, and performance.</p>
      </div>

      {/* Summary Cards */}
      <Grid container spacing={3}>
        {[
          { title: 'Total Businesses', value: totalBusinesses, icon: <StoreIcon />, color: 'bg-blue-500/10 text-blue-600' },
          { title: 'Home Delivery', value: stats?.delivery[0]?.value || 0, icon: <DeliveryIcon />, color: 'bg-green-500/10 text-green-600' },
          { title: 'UPI Enabled', value: stats?.payment.find(p => p.name === 'UPI')?.value || 0, icon: <PaymentIcon />, color: 'bg-purple-500/10 text-purple-600' },
          { title: 'Active Users', value: topUsers.length, icon: <PeopleIcon />, color: 'bg-orange-500/10 text-orange-600' },
        ].map((item, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${item.color}`}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{item.value}</p>
                  <p className="text-sm text-muted-foreground">{item.title}</p>
                </div>
              </div>
            </div>
          </Grid>
        ))}
      </Grid>

      {/* Main Tabs */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            className="border-b border-border"
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
        >
          <Tab icon={<StoreIcon className="mb-0 mr-2" />} label="Ecosystem" className="text-foreground" />
          <Tab icon={<PeopleIcon className="mb-0 mr-2" />} label="Users" className="text-foreground" />
          <Tab icon={<TrendingUpIcon className="mb-0 mr-2" />} label="Performance" className="text-foreground" />
          <Tab icon={<ViewListIcon className="mb-0 mr-2" />} label="Logs" className="text-foreground" />
        </Tabs>

        <div className="p-6 bg-card">
          {/* Tab 1: Business Ecosystem */}
          {activeTab === 0 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Category Distribution</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats?.category}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {stats?.category.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="var(--card)" strokeWidth={2} />
                        ))}
                      </Pie>
                      <RechartsTooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                   {stats?.category.slice(0, 6).map((cat, idx) => (
                     <div key={idx} className="flex items-center gap-2 text-sm">
                       <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[idx % COLORS.length]}}></div>
                       <span className="text-muted-foreground truncate flex-1">{cat.name}</span>
                       <span className="font-bold text-foreground">{cat.value}</span>
                     </div>
                   ))}
                </div>
              </Grid>

              <Grid item xs={12} md={6}>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Payment Methods</h3>
                <div className="h-[250px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats?.payment} layout="vertical" margin={{left: 20}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                        <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
                        <YAxis type="category" dataKey="name" stroke="var(--foreground)" fontSize={12} width={60} />
                        <RechartsTooltip cursor={{fill: 'var(--muted)'}} content={<CustomTooltip />} />
                        <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={30} />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
              </Grid>
            </Grid>
          )}

          {/* Tab 2: Users */}
          {activeTab === 1 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">User</th>
                    <th className="px-4 py-3">Device ID</th>
                    <th className="px-4 py-3">Visits</th>
                    <th className="px-4 py-3">First Seen</th>
                    <th className="px-4 py-3 rounded-r-lg">Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {topUsers.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                            {user.user_name.charAt(0).toUpperCase()}
                          </div>
                          {user.user_name}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{user.device_id.substring(0, 12)}...</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded-full bg-secondary text-secondary-foreground font-bold text-xs">
                          {user.total_visits}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(user.first_visit_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-foreground">{new Date(user.last_visit_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 3: Performance (Interactions) */}
          {activeTab === 2 && (
            <div className="space-y-6">
               {topBusinesses.length === 0 ? (
                 <Alert severity="info" className="bg-blue-500/10 text-blue-600 border-blue-500/20">No interactions recorded yet.</Alert>
               ) : (
                 <div className="overflow-x-auto">
                   <table className="w-full text-sm text-left">
                     <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                       <tr>
                         <th className="px-4 py-3">Rank</th>
                         <th className="px-4 py-3">Business</th>
                         <th className="px-4 py-3 text-center"><ViewIcon fontSize="small" className="mr-1"/> Views</th>
                         <th className="px-4 py-3 text-center"><PhoneIcon fontSize="small" className="mr-1"/> Calls</th>
                         <th className="px-4 py-3 text-center"><WhatsAppIcon fontSize="small" className="mr-1"/> WhatsApp</th>
                         <th className="px-4 py-3 text-center"><ShareIcon fontSize="small" className="mr-1"/> Shares</th>
                         <th className="px-4 py-3 text-right">Total Score</th>
                       </tr>
                     </thead>
                     <tbody>
                       {topBusinesses.map((biz, idx) => (
                         <tr key={idx} className="border-b border-border hover:bg-muted/30 transition-colors">
                           <td className="px-4 py-3 font-bold text-muted-foreground">#{idx + 1}</td>
                           <td className="px-4 py-3 font-medium text-foreground text-base">{biz.name}</td>
                           <td className="px-4 py-3 text-center text-muted-foreground">{biz.views}</td>
                           <td className="px-4 py-3 text-center">
                             {biz.calls > 0 && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-md font-bold text-xs">{biz.calls}</span>}
                           </td>
                           <td className="px-4 py-3 text-center">
                             {biz.whatsapp > 0 && <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-md font-bold text-xs">{biz.whatsapp}</span>}
                           </td>
                           <td className="px-4 py-3 text-center">
                              {biz.share > 0 && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 rounded-md font-bold text-xs">{biz.share}</span>}
                           </td>
                           <td className="px-4 py-3 text-right font-bold text-primary text-lg">{biz.total}</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               )}
            </div>
          )}

          {/* Tab 4: Logs */}
          {activeTab === 3 && (
             <div className="max-h-[600px] overflow-y-auto">
                <table className="w-full text-sm text-left">
                   <thead className="text-xs text-muted-foreground uppercase bg-muted/50 sticky top-0 backdrop-blur-sm">
                     <tr>
                       <th className="px-4 py-3">Time</th>
                       <th className="px-4 py-3">User</th>
                       <th className="px-4 py-3">Action/Page</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-border">
                     {logs.map((log, idx) => (
                       <tr key={log.id || idx} className="hover:bg-muted/30">
                         <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                           {new Date(log.visited_at || '').toLocaleTimeString()} <br/>
                           {new Date(log.visited_at || '').toLocaleDateString()}
                         </td>
                         <td className="px-4 py-3">
                            <div className="font-medium text-foreground">{log.user_name || 'Guest'}</div>
                            <div className="text-xs text-muted-foreground font-mono">{log.device_id.substring(0,8)}</div>
                         </td>
                         <td className="px-4 py-3">
                            <span className="px-2 py-1 border border-border rounded text-xs font-mono bg-background">
                               {log.page_path}
                            </span>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                </table>
             </div>
          )}
        </div>
      </div>
    </Box>
  );
};

export default Analytics;
