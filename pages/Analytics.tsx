
import React, { useEffect, useState } from 'react';
import { getAllVisitLogs, getEcosystemStats, getTopUsers, getTopBusinesses } from '../supabaseClient';
import { VisitLog, UserTracking } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Tabs, TabsList, TabsTrigger, TabsContent, Skeleton } from '../components/ui/Primitives';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const Analytics: React.FC = () => {
  const [logs, setLogs] = useState<VisitLog[]>([]);
  const [stats, setStats] = useState<{ category: any[], payment: any[], delivery: any[] } | null>(null);
  const [topUsers, setTopUsers] = useState<UserTracking[]>([]);
  const [topBusinesses, setTopBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ecosystem');

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

  const COLORS = ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1'];
  const DELIVERY_COLORS = ['#22c55e', '#ef4444'];

  if (loading) return <div className="p-8 space-y-4">
    <Skeleton className="h-12 w-full" />
    <div className="grid grid-cols-2 gap-4"><Skeleton className="h-64" /><Skeleton className="h-64" /></div>
  </div>;

  return (
    <div className="space-y-6 animate-fadeInUp max-w-7xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics Deep Dive</h2>
        <p className="text-muted-foreground">Comprehensive data analysis across 4 vectors.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="ecosystem" active={activeTab === 'ecosystem'} onClick={() => setActiveTab('ecosystem')}>
            <i className="fas fa-shop mr-2"></i> Business Ecosystem
          </TabsTrigger>
          <TabsTrigger value="users" active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
            <i className="fas fa-users mr-2"></i> User Insights
          </TabsTrigger>
          <TabsTrigger value="performance" active={activeTab === 'performance'} onClick={() => setActiveTab('performance')}>
            <i className="fas fa-trophy mr-2"></i> Performance
          </TabsTrigger>
          <TabsTrigger value="logs" active={activeTab === 'logs'} onClick={() => setActiveTab('logs')}>
            <i className="fas fa-table-list mr-2"></i> Raw Logs
          </TabsTrigger>
        </TabsList>

        {/* 1. BUSINESS ECOSYSTEM */}
        <TabsContent value="ecosystem" active={activeTab === 'ecosystem'}>
           <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
                  <CardDescription>Market saturation by business type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats?.category}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({name, percent}) => percent > 0.1 ? `${name}` : ''}
                        >
                          {stats?.category.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Adoption of digital payments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[140px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats?.payment} layout="vertical" margin={{ left: 40 }}>
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" width={60} className="text-sm font-medium" />
                          <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                          <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Service</CardTitle>
                    <CardDescription>Businesses offering home delivery</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[140px] flex items-center justify-center gap-8">
                       <div className="text-center">
                          <div className="text-4xl font-bold text-green-600">{stats?.delivery[0].value}</div>
                          <div className="text-sm text-muted-foreground">Available</div>
                       </div>
                       <div className="text-center">
                          <div className="text-4xl font-bold text-red-600">{stats?.delivery[1].value}</div>
                          <div className="text-sm text-muted-foreground">Unavailable</div>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
           </div>
        </TabsContent>

        {/* 2. USER INSIGHTS */}
        <TabsContent value="users" active={activeTab === 'users'}>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Top Active Users</CardTitle>
                <CardDescription>Most frequent visitors to the directory</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User Name</TableHead>
                      <TableHead>Total Visits</TableHead>
                      <TableHead>Last Seen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topUsers.map(user => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.user_name}</TableCell>
                        <TableCell>{user.total_visits}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {new Date(user.last_visit_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Retention</CardTitle>
                <CardDescription>New vs Returning</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center h-[300px]">
                 <div className="relative h-40 w-40 rounded-full border-8 border-blue-100 flex items-center justify-center">
                    <div className="text-center">
                       <div className="text-2xl font-bold text-blue-600">78%</div>
                       <div className="text-xs text-muted-foreground">Returning</div>
                    </div>
                 </div>
                 <p className="mt-6 text-sm text-center text-muted-foreground px-4">
                   High retention rate indicates strong local utility and repeat usage.
                 </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 3. BUSINESS PERFORMANCE */}
        <TabsContent value="performance" active={activeTab === 'performance'}>
           <Card>
             <CardHeader>
               <CardTitle>Most Engaged Businesses</CardTitle>
               <CardDescription>Ranked by views, calls, and shares</CardDescription>
             </CardHeader>
             <CardContent>
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Business Name</TableHead>
                     <TableHead className="text-center">Views 👁️</TableHead>
                     <TableHead className="text-center">Calls 📞</TableHead>
                     <TableHead className="text-center">Shares 🔗</TableHead>
                     <TableHead className="text-right">Total Score</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                    {topBusinesses.map((biz, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-semibold">
                          <div className="flex items-center gap-2">
                             <span className="text-muted-foreground text-xs">#{i+1}</span>
                             {biz.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{biz.views}</TableCell>
                        <TableCell className="text-center">{biz.calls}</TableCell>
                        <TableCell className="text-center">{biz.share}</TableCell>
                        <TableCell className="text-right font-bold text-blue-600">{biz.total}</TableCell>
                      </TableRow>
                    ))}
                    {topBusinesses.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No interaction data recorded yet.
                        </TableCell>
                      </TableRow>
                    )}
                 </TableBody>
               </Table>
             </CardContent>
           </Card>
        </TabsContent>

        {/* 4. RAW LOGS */}
        <TabsContent value="logs" active={activeTab === 'logs'}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                   <CardTitle>System Logs</CardTitle>
                   <CardDescription>Raw stream of all system events</CardDescription>
                </div>
                <Badge variant="outline">{logs.length} Records</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Path</TableHead>
                      <TableHead className="hidden md:table-cell">Device ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id || Math.random()}>
                        <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(log.visited_at || '').toLocaleString()}
                        </TableCell>
                        <TableCell className="font-medium text-sm">
                          {log.user_name || 'Guest'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-normal font-mono text-xs">
                            {log.page_path}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs text-muted-foreground font-mono truncate max-w-[150px]">
                          {log.device_id}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
