
import React, { useEffect, useState } from 'react';
import { getAnalyticsSummary, getRecentVisits, getLiveUsersCount, getRealTrafficData, fetchBusinesses } from '../supabaseClient';
import { AnalyticsSummary, VisitLog } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Primitives';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [recentVisits, setRecentVisits] = useState<VisitLog[]>([]);
  const [liveUsers, setLiveUsers] = useState(0);
  const [chartData, setChartData] = useState<{name: string, visits: number}[]>([]);
  const [businessCount, setBusinessCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [sum, visits, live, traffic, businesses] = await Promise.all([
          getAnalyticsSummary(),
          getRecentVisits(10),
          getLiveUsersCount(),
          getRealTrafficData(),
          fetchBusinesses()
        ]);
        
        setSummary(sum);
        setRecentVisits(visits);
        setLiveUsers(live);
        setChartData(traffic);
        setBusinessCount(businesses.length);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
    
    // Refresh live users every 30s
    const interval = setInterval(async () => {
       const live = await getLiveUsersCount();
       setLiveUsers(live);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ title, value, icon, subtext, colorClass, animate }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <i className={`fas ${icon} ${colorClass} text-lg ${animate ? 'animate-pulse' : ''}`}></i>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
      </CardContent>
    </Card>
  );

  if (loading) return <div className="p-8 flex items-center justify-center h-full text-muted-foreground">Loading real-time data...</div>;

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
          value={businessCount} 
          icon="fa-store" 
          colorClass="text-blue-500"
          subtext="Active directory listings" 
        />
        <StatCard 
          title="Live Users Now" 
          value={liveUsers} 
          icon="fa-circle" 
          colorClass="text-red-500"
          animate={true}
          subtext="Active on site right now" 
        />
        <StatCard 
          title="Total Visits" 
          value={summary?.total_visits || 0} 
          icon="fa-chart-simple" 
          colorClass="text-green-500"
          subtext="Total page interactions" 
        />
        <StatCard 
          title="Total Users" 
          value={summary?.total_unique_users || 0} 
          icon="fa-users" 
          colorClass="text-purple-500"
          subtext="Lifetime unique visitors" 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        {/* Main Chart */}
        <Card className="md:col-span-4 lg:col-span-5">
          <CardHeader>
            <CardTitle>Traffic Trends</CardTitle>
            <CardDescription>Real-time visit volume over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
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
               {recentVisits.length === 0 && (
                 <div className="text-center text-muted-foreground text-sm py-8">
                   No activity yet
                 </div>
               )}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
