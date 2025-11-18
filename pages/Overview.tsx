import React, { useEffect, useState } from 'react';
import { getDashboardStats, getTrafficHistory, getInteractionStats } from '../supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Skeleton } from '../components/ui/Primitives';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const Overview: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [traffic, setTraffic] = useState<any[]>([]);
  const [interactions, setInteractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [s, t, i] = await Promise.all([
        getDashboardStats(),
        getTrafficHistory(),
        getInteractionStats()
      ]);
      setStats(s);
      setTraffic(t);
      setInteractions(i);
      setLoading(false);
    };
    fetchData();
  }, []);

  const StatCard = ({ title, value, icon, colorClass }: any) => (
    <Card className="hover:shadow-md transition-shadow border-l-4" style={{ borderLeftColor: colorClass }}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
            <h3 className="text-3xl font-extrabold mt-2 tracking-tight">
              {loading ? <Skeleton width={60} height={30} /> : value.toLocaleString()}
            </h3>
          </div>
          <div className={`p-3 rounded-xl bg-muted/50 text-xl`} style={{ color: colorClass }}>
            <i className={`fas ${icon}`}></i>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fadeInUp">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-foreground">Analytics Overview</h1>
        <p className="text-muted-foreground">High-level operational metrics for Jawala Business Directory.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Visits" value={stats?.totalVisits || 0} icon="fa-eye" colorClass="#3b82f6" />
        <StatCard title="Active Users" value={stats?.totalUsers || 0} icon="fa-users" colorClass="#f97316" />
        <StatCard title="Interactions" value={stats?.totalInteractions || 0} icon="fa-fingerprint" colorClass="#8b5cf6" />
        <StatCard title="Visits Today" value={stats?.todayVisits || 0} icon="fa-calendar-day" colorClass="#10b981" />
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Traffic Chart */}
        <Card className="md:col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Traffic Trends</CardTitle>
            <CardDescription>Daily visitor volume over the last 14 days</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px] w-full">
              {loading ? <Skeleton className="h-full w-full" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={traffic} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Area type="monotone" dataKey="visits" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Interaction Distribution */}
        <Card className="md:col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle>User Actions</CardTitle>
            <CardDescription>How users are engaging with businesses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {loading ? <Skeleton className="h-full w-full" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={interactions}
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="hsl(var(--card))"
                      strokeWidth={2}
                    >
                      {interactions.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                       contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                       itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
