import React, { useEffect, useState } from 'react';
import { getAnalyticsSummary, getRecentVisits, fetchBusinesses } from '../supabaseClient';
import { AnalyticsSummary, VisitLog, Business } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Primitives';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [recentVisits, setRecentVisits] = useState<VisitLog[]>([]);
  const [deliveryCount, setDeliveryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [sum, visits, businesses] = await Promise.all([
          getAnalyticsSummary(),
          getRecentVisits(10),
          fetchBusinesses()
        ]);
        setSummary(sum);
        setRecentVisits(visits);
        setDeliveryCount(businesses.filter(b => b.homeDelivery).length);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Mock trend data - ideally calculate from logs if timestamp available
  const data = [
    { name: 'Mon', visits: 40 },
    { name: 'Tue', visits: 55 },
    { name: 'Wed', visits: 45 },
    { name: 'Thu', visits: 70 },
    { name: 'Fri', visits: 95 },
    { name: 'Sat', visits: 120 },
    { name: 'Sun', visits: 105 },
  ];

  const StatCard = ({ title, value, icon, subtext, colorClass }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <i className={`fas ${icon} ${colorClass} text-lg`}></i>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
      </CardContent>
    </Card>
  );

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="space-y-8 animate-fadeInUp max-w-7xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">System health and key performance indicators.</p>
      </div>
      
      {/* KPI Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard 
          title="Total Businesses" 
          value={summary?.business_count || 0} 
          icon="fa-store" 
          colorClass="text-blue-500"
          subtext="Active directory listings" 
        />
        <StatCard 
          title="Total Users" 
          value={summary?.total_unique_users || 0} 
          icon="fa-users" 
          colorClass="text-purple-500"
          subtext="Lifetime unique visitors" 
        />
        <StatCard 
          title="Total Visits" 
          value={summary?.total_visits || 0} 
          icon="fa-chart-simple" 
          colorClass="text-green-500"
          subtext="Total page interactions" 
        />
        <StatCard 
          title="Delivery Enabled" 
          value={deliveryCount} 
          icon="fa-truck-fast" 
          colorClass="text-orange-500"
          subtext={`${summary?.business_count ? Math.round((deliveryCount / summary.business_count) * 100) : 0}% of all businesses`} 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        {/* Main Chart */}
        <Card className="md:col-span-4 lg:col-span-5">
          <CardHeader>
            <CardTitle>Traffic Trends</CardTitle>
            <CardDescription>Visit volume over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tickMargin={10} className="text-xs text-muted-foreground" />
                  <YAxis axisLine={false} tickLine={false} className="text-xs text-muted-foreground" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area type="monotone" dataKey="visits" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorVisits)" strokeWidth={2} />
                </AreaChart>
                </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Live Feed */}
        <Card className="md:col-span-3 lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Real-time user actions</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto max-h-[380px] pr-2">
             <div className="space-y-4">
               {recentVisits.map((visit, i) => (
                 <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                       <i className="fas fa-user text-xs text-muted-foreground"></i>
                    </div>
                    <div className="space-y-1">
                       <p className="text-sm font-medium leading-none">{visit.user_name || 'Guest User'}</p>
                       <p className="text-xs text-muted-foreground">
                         Viewed <span className="font-semibold text-foreground">{visit.page_path}</span>
                       </p>
                       <p className="text-[10px] text-muted-foreground/70">
                         {new Date(visit.visited_at || '').toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                       </p>
                    </div>
                 </div>
               ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
