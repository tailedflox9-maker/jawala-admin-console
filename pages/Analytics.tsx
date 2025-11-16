
import React, { useEffect, useState } from 'react';
import { getAllVisitLogs, getEcosystemStats } from '../supabaseClient';
import { VisitLog } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Primitives';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const Analytics: React.FC = () => {
  const [logs, setLogs] = useState<VisitLog[]>([]);
  const [stats, setStats] = useState<{ category: any[], payment: any[], delivery: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ecosystem');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [logData, ecosystemData] = await Promise.all([
          getAllVisitLogs(200), 
          getEcosystemStats()
        ]);
        setLogs(logData);
        setStats(ecosystemData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const COLORS = ['#0f172a', '#334155', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0'];
  const DELIVERY_COLORS = ['#22c55e', '#ef4444'];

  if (loading) return <div className="p-8">Loading analytics...</div>;

  return (
    <div className="space-y-6 animate-fadeInUp max-w-7xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">Deep dive into your data points and business ecosystem.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="ecosystem" active={activeTab === 'ecosystem'} onClick={() => setActiveTab('ecosystem')}>
            <i className="fas fa-shop mr-2"></i> Business Ecosystem
          </TabsTrigger>
          <TabsTrigger value="users" active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
            <i className="fas fa-users-viewfinder mr-2"></i> User Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ecosystem" active={activeTab === 'ecosystem'}>
           <div className="grid gap-6 md:grid-cols-2">
              {/* Category Distribution */}
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

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Adoption</CardTitle>
                  <CardDescription>Accepted payment methods across directory</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats?.payment} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-muted/30" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={60} className="text-sm font-medium" />
                        <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Delivery Stats */}
               <Card>
                <CardHeader>
                  <CardTitle>Service Availability</CardTitle>
                  <CardDescription>Home delivery capabilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats?.delivery}
                          cx="50%"
                          cy="50%"
                          startAngle={180}
                          endAngle={0}
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                           <Cell key="yes" fill={DELIVERY_COLORS[0]} />
                           <Cell key="no" fill={DELIVERY_COLORS[1]} />
                        </Pie>
                        <Legend verticalAlign="bottom" height={36}/>
                        <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
           </div>
        </TabsContent>

        <TabsContent value="users" active={activeTab === 'users'}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                   <CardTitle>Raw User Logs</CardTitle>
                   <CardDescription>Latest 200 interactions from the main app</CardDescription>
                </div>
                <Badge variant="outline">{logs.length} Records</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User Identity</TableHead>
                      <TableHead>Interaction</TableHead>
                      <TableHead className="hidden md:table-cell">Device Fingerprint</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id || Math.random()}>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {new Date(log.visited_at || '').toLocaleString()}
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold">
                                {log.user_name ? log.user_name.charAt(0).toUpperCase() : '?'}
                             </div>
                             {log.user_name || 'Guest'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-normal">
                            Visited: {log.page_path}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs text-muted-foreground font-mono">
                          {log.device_id?.substring(0, 12)}...
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
