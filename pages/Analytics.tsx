
import React, { useEffect, useState } from 'react';
import { getAllVisitLogs, getCategoryStats } from '../supabaseClient';
import { VisitLog } from '../types';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge } from '../components/ui/Primitives';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const Analytics: React.FC = () => {
  const [logs, setLogs] = useState<VisitLog[]>([]);
  const [categoryStats, setCategoryStats] = useState<{name: string, value: number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [logData, catData] = await Promise.all([
          getAllVisitLogs(100), // Fetch last 100 logs
          getCategoryStats()
        ]);
        setLogs(logData);
        setCategoryStats(catData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="space-y-8 animate-fadeInUp">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Detailed Analytics</h2>
        <p className="text-muted-foreground">Deep dive into your data points and business distribution.</p>
      </div>

      {/* Charts Row */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Pie Chart: Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Business Categories Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart: Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Category Count (Top 5)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryStats.slice(0, 5)} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-muted/30" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} className="text-xs" />
                  <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full Data Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Full Visit Logs</CardTitle>
            <Badge variant="outline">{logs.length} Records</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>User Name</TableHead>
                  <TableHead>Page Visited</TableHead>
                  <TableHead className="hidden md:table-cell">Device ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                   <TableRow>
                     <TableCell colSpan={4} className="text-center h-24">Loading data points...</TableCell>
                   </TableRow>
                ) : logs.map((log) => (
                  <TableRow key={log.id || Math.random()}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {new Date(log.visited_at || '').toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px]">
                            {log.user_name ? log.user_name.charAt(0).toUpperCase() : '?'}
                         </div>
                         {log.user_name || 'Guest'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        {log.page_path}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground font-mono">
                      {log.device_id}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
