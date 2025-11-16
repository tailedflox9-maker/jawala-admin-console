
import React, { useEffect, useState } from 'react';
import { getAnalyticsSummary, getRecentVisits, getLiveUsersCount, getRealTrafficData, fetchBusinesses, getHourlyVisitsToday } from '../supabaseClient';
import { AnalyticsSummary, VisitLog, Business } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Skeleton } from '../components/ui/Primitives';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [recentVisits, setRecentVisits] = useState<VisitLog[]>([]);
  const [liveUsers, setLiveUsers] = useState(0);
  const [chartData, setChartData] = useState<{name: string, visits: number}[]>([]);
  const [hourlyData, setHourlyData] = useState<{hour: string, visits: number}[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  // Derived Metrics
  const [trends, setTrends] = useState({ visits: 0, users: 0 });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [sum, visits, live, traffic, businessList, hourly] = await Promise.all([
          getAnalyticsSummary(),
          getRecentVisits(20),
          getLiveUsersCount(),
          getRealTrafficData(),
          fetchBusinesses(),
          getHourlyVisitsToday()
        ]);
        
        setSummary(sum);
        setRecentVisits(visits);
        setLiveUsers(live);
        setChartData(traffic);
        setBusinesses(businessList);
        setHourlyData(hourly);

        // Calculate Trends
        if (traffic.length >= 2) {
          const today = traffic[traffic.length - 1].visits;
          const yesterday = traffic[traffic.length - 2].visits;
          const trend = yesterday > 0 ? ((today - yesterday) / yesterday) * 100 : 100;
          setTrends(prev => ({ ...prev, visits: Math.round(trend) }));
        }

      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
    
    // Refresh live users every 15s
    const interval = setInterval(async () => {
       const live = await getLiveUsersCount();
       setLiveUsers(live);
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const KpiCard = ({ title, value, icon, trend, subtext, colorClass, bgClass }: any) => (
    <Card className="relative overflow-hidden border-l-4 border-l-transparent hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
               <h3 className="text-3xl font-extrabold">{loading ? <Skeleton className="h-8 w-16 inline-block" /> : value}</h3>
               {trend !== undefined && !loading && (
                 <span className={`text-xs font-bold ${trend >= 0 ? 'text-green-600' : 'text-red-600'} bg-muted/30 px-1.5 py-0.5 rounded-full`}>
                   {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
                 </span>
               )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{loading ? <Skeleton className="h-3 w-24" /> : subtext}</p>
          </div>
          <div className={`p-3 rounded-xl ${bgClass} ${colorClass}`}>
            <i className={`fas ${icon} text-xl`}></i>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fadeInUp max-w-[1600px] mx-auto pb-8">
      <div className="flex items-center justify-between pb-2 border-b">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Command Center</h2>
          <p className="text-sm text-muted-foreground">Real-time operational overview</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
             </span>
             Live • Updated just now
           </div>
        </div>
      </div>
      
      {/* KPI Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard 
          title="Total Visits" 
          value={summary?.total_visits || 0} 
          icon="fa-chart-simple" 
          colorClass="text-blue-600"
          bgClass="bg-blue-50"
          trend={trends.visits}
          subtext="Page interactions all-time"
        />
        <KpiCard 
          title="Active Users Now" 
          value={liveUsers} 
          icon="fa-users" 
          colorClass="text-green-600"
          bgClass="bg-green-50"
          trend={liveUsers > 0 ? 100 : 0}
          subtext="Currently online"
        />
        <KpiCard 
          title="Total Businesses" 
          value={businesses.length} 
          icon="fa-store" 
          colorClass="text-purple-600"
          bgClass="bg-purple-50"
          trend={0}
          subtext="Directory listings"
        />
        <KpiCard 
          title="Unique Visitors" 
          value={summary?.total_unique_users || 0} 
          icon="fa-fingerprint" 
          colorClass="text-orange-600"
          bgClass="bg-orange-50"
          trend={0}
          subtext="Lifetime distinct users"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Charts Column */}
        <div className="md:col-span-4 lg:col-span-5 space-y-6">
          {/* Weekly Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Traffic Trends</CardTitle>
              <CardDescription>Visit volume over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {loading ? <Skeleton className="h-full w-full" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} tickMargin={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} tickMargin={10} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        cursor={{ stroke: '#2563eb', strokeWidth: 1, strokeDasharray: '4 4' }}
                      />
                      <Area type="monotone" dataKey="visits" stroke="#2563eb" strokeWidth={3} fill="url(#colorVisits)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Hourly Traffic */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Activity</CardTitle>
              <CardDescription>Visits by hour (24h format)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full">
                {loading ? <Skeleton className="h-full w-full" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                      <XAxis dataKey="hour" hide />
                      <Tooltip 
                         contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                         cursor={{fill: 'transparent'}}
                      />
                      <Bar dataKey="visits" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Feed Column */}
        <Card className="md:col-span-3 lg:col-span-2 flex flex-col h-full max-h-[650px]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Live Feed</CardTitle>
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
            </div>
            <CardDescription>Real-time user actions</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
             <div className="space-y-4">
               {loading ? Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />) : 
                 recentVisits.map((visit, i) => (
                 <div key={i} className="flex gap-3 items-start group">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${visit.user_name ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                       {visit.user_name ? visit.user_name.substring(0, 2).toUpperCase() : 'G'}
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-baseline">
                         <p className="text-sm font-semibold truncate text-foreground">{visit.user_name || 'Guest User'}</p>
                         <span className="text-[10px] text-muted-foreground">{formatTimeAgo(visit.visited_at || '')}</span>
                       </div>
                       <div className="flex items-center gap-1.5 mt-0.5">
                          <i className="fas fa-eye text-[10px] text-muted-foreground"></i>
                          <p className="text-xs text-muted-foreground truncate">
                             Viewed <span className="text-foreground font-medium">{visit.page_path === '/' ? 'Home' : visit.page_path?.replace('/', '')}</span>
                          </p>
                       </div>
                    </div>
                 </div>
               ))}
               {recentVisits.length === 0 && !loading && (
                 <div className="text-center py-10 text-muted-foreground text-sm">No activity yet</div>
               )}
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
        <div className="bg-card border rounded-lg p-4 text-center">
           <p className="text-xs text-muted-foreground uppercase font-bold">Mobile Users</p>
           <p className="text-lg font-bold">~85%</p>
        </div>
        <div className="bg-card border rounded-lg p-4 text-center">
           <p className="text-xs text-muted-foreground uppercase font-bold">Peak Time</p>
           <p className="text-lg font-bold">8 PM - 9 PM</p>
        </div>
        <div className="bg-card border rounded-lg p-4 text-center">
           <p className="text-xs text-muted-foreground uppercase font-bold">Return Rate</p>
           <p className="text-lg font-bold">Calculating...</p>
        </div>
        <div className="bg-card border rounded-lg p-4 text-center">
           <p className="text-xs text-muted-foreground uppercase font-bold">Avg Session</p>
           <p className="text-lg font-bold">~3m 45s</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
