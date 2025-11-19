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

  const StatCard = ({ title, value, icon, colorClass, bgClass }: any) => (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 overflow-hidden group" style={{ borderLeftColor: colorClass }}>
      <CardContent className="p-6 relative">
        <div className="flex justify-between items-start relative z-10">
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-3xl font-black tracking-tight text-foreground">
              {loading ? <Skeleton width={80} height={36} /> : value.toLocaleString()}
            </h3>
          </div>
          <div className={`p-3 rounded-xl text-xl shadow-sm transition-transform group-hover:scale-110 duration-300 ${bgClass}`} style={{ color: colorClass }}>
            <i className={`fas ${icon}`}></i>
          </div>
        </div>
        {/* Decorative background blob */}
        <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-5" style={{ backgroundColor: colorClass }}></div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 animate-fadeInUp">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Analytics Overview</h1>
        <p className="text-muted-foreground">Real-time operational metrics for Jawala Business Directory.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Visits" 
          value={stats?.totalVisits || 0} 
          icon="fa-eye" 
          colorClass="#3b82f6" 
          bgClass="bg-blue-50 dark:bg-blue-900/20" 
        />
        <StatCard 
          title="Active Users" 
          value={stats?.totalUsers || 0} 
          icon="fa-users" 
          colorClass="#f97316" 
          bgClass="bg-orange-50 dark:bg-orange-900/20" 
        />
        <StatCard 
          title="Interactions" 
          value={stats?.totalInteractions || 0} 
          icon="fa-fingerprint" 
          colorClass="#8b5cf6" 
          bgClass="bg-purple-50 dark:bg-purple-900/20" 
        />
        <StatCard 
          title="Visits Today" 
          value={stats?.todayVisits || 0} 
          icon="fa-calendar-day" 
          colorClass="#10b981" 
          bgClass="bg-green-50 dark:bg-green-900/20" 
        />
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Traffic Chart */}
        <Card className="md:col-span-4 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Traffic Trends</CardTitle>
            <CardDescription>Daily visitor volume over the last 14 days</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[320px] w-full">
              {loading ? <Skeleton className="h-full w-full" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={traffic} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                      axisLine={false}
                      tickLine={false}
                      dx={-10}
                    />
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        borderColor: 'hsl(var(--border))', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                      }}
                      itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                      labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '0.25rem' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="visits" 
                      stroke="#3b82f6" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorVisits)" 
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Interaction Distribution */}
        <Card className="md:col-span-3 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>User Actions</CardTitle>
            <CardDescription>Engagement breakdown by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full relative">
              {loading ? <Skeleton className="h-full w-full" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={interactions}
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="hsl(var(--card))"
                      strokeWidth={3}
                      cornerRadius={6}
                    >
                      {interactions.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                       contentStyle={{ 
                         backgroundColor: 'hsl(var(--card))', 
                         borderColor: 'hsl(var(--border))', 
                         borderRadius: '8px',
                         boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                       }}
                       itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconType="circle"
                      formatter={(value) => <span className="text-sm text-foreground font-medium ml-1">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
              {/* Center Text for Donut */}
              {!loading && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-4 text-center pointer-events-none">
                  <div className="text-3xl font-bold text-foreground">
                    {stats?.totalInteractions}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold">Total</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
