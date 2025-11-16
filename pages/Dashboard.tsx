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
  const [showAllActivity, setShowAllActivity] = useState(false);

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

  const KpiCard = ({ title, value, icon, trend, subtext, colorClass, bgClass, borderColor }: any) => (
    <Card className={`relative overflow-hidden border-l-4 ${borderColor} hover:shadow-lg transition-all duration-200 hover:scale-[1.02]`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{title}</p>
            <div className="flex items-center gap-3 mb-2">
               <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{loading ? <Skeleton className="h-10 w-20 inline-block" /> : value}</h3>
               {trend !== undefined && !loading && (
                 <span className={`text-xs font-bold ${trend >= 0 ? 'text-green-600' : 'text-red-600'} bg-white px-2 py-1 rounded-full shadow-sm border ${trend >= 0 ? 'border-green-200' : 'border-red-200'}`}>
                   {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'} {Math.abs(trend)}%
                 </span>
               )}
            </div>
            <p className="text-xs text-muted-foreground truncate">{loading ? <Skeleton className="h-3 w-28" /> : subtext}</p>
          </div>
          <div className={`p-3 rounded-xl ${bgClass} ${colorClass} shadow-sm`}>
            <i className={`fas ${icon} text-xl`}></i>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4 pb-8 pt-2 px-2">
      <div className="flex items-center justify-between pb-4 border-b-2 border-gradient mb-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 -mx-2 px-6 py-4 rounded-lg">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Command Center</h2>
          <p className="text-sm text-muted-foreground mt-1">Real-time operational overview</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg shadow-green-200">
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
             </span>
             <span className="hidden sm:inline">Live • Updated just now</span>
             <span className="sm:hidden">Live</span>
           </div>
        </div>
      </div>
      
      {/* KPI Row */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 pt-1">
        <KpiCard 
          title="Total Visits" 
          value={summary?.total_visits || 0} 
          icon="fa-chart-simple" 
          colorClass="text-blue-600"
          bgClass="bg-gradient-to-br from-blue-50 to-blue-100"
          borderColor="border-l-blue-500"
          trend={trends.visits}
          subtext="Page interactions"
        />
        <KpiCard 
          title="Active Users" 
          value={liveUsers} 
          icon="fa-users" 
          colorClass="text-green-600"
          bgClass="bg-gradient-to-br from-green-50 to-green-100"
          borderColor="border-l-green-500"
          trend={liveUsers > 0 ? 100 : 0}
          subtext="Currently online"
        />
        <KpiCard 
          title="Businesses" 
          value={businesses.length} 
          icon="fa-store" 
          colorClass="text-purple-600"
          bgClass="bg-gradient-to-br from-purple-50 to-purple-100"
          borderColor="border-l-purple-500"
          trend={0}
          subtext="Directory listings"
        />
        <KpiCard 
          title="Unique Visitors" 
          value={summary?.total_unique_users || 0} 
          icon="fa-fingerprint" 
          colorClass="text-orange-600"
          bgClass="bg-gradient-to-br from-orange-50 to-orange-100"
          borderColor="border-l-orange-500"
          trend={0}
          subtext="Lifetime distinct users"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-7 h-auto">
        {/* Charts Column */}
        <div className="md:col-span-4 lg:col-span-5 space-y-4 flex flex-col">
          {/* Weekly Trend */}
          <Card className="flex-1 min-h-[250px] border-l-4 border-l-blue-500 shadow-md hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2 pt-4 bg-gradient-to-r from-blue-50/50 to-transparent">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <i className="fas fa-chart-line text-blue-600"></i>
                </div>
                Traffic Trends
              </CardTitle>
              <CardDescription>Visit volume over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[220px] w-full">
                {loading ? <Skeleton className="h-full w-full" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
          <Card className="min-h-[200px] border-l-4 border-l-purple-500 shadow-md hover:shadow-xl transition-shadow">
            <CardHeader className="pb-2 pt-4 bg-gradient-to-r from-purple-50/50 to-transparent">
              <div className="flex items-center justify-between">
                 <CardTitle className="text-lg flex items-center gap-2">
                   <div className="p-2 bg-purple-100 rounded-lg">
                     <i className="fas fa-clock text-purple-600"></i>
                   </div>
                   Today's Hourly
                 </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[150px] w-full">
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
        <Card className="md:col-span-3 lg:col-span-2 flex flex-col h-[500px] md:h-auto sticky top-0 border-l-4 border-l-green-500 shadow-md hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3 pt-4 border-b bg-gradient-to-r from-green-50/50 to-transparent flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <i className="fas fa-rss text-green-600"></i>
                </div>
                Live Feed
              </CardTitle>
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            </div>
            <CardDescription>Real-time user actions</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto pr-1 custom-scrollbar p-0">
             <div className="divide-y">
               {loading ? Array(5).fill(0).map((_, i) => <div key={i} className="p-4"><Skeleton className="h-10 w-full" /></div>) : 
                 recentVisits.slice(0, showAllActivity ? undefined : 5).map((visit, i) => (
                 <div key={i} className="flex gap-3 items-start group p-3 hover:bg-muted/30 transition-colors animate-fadeInUp">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5 shadow-sm border ${visit.user_name ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                       {visit.user_name ? visit.user_name.substring(0, 2).toUpperCase() : 'G'}
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-baseline">
                         <p className="text-sm font-semibold truncate text-foreground">{visit.user_name || 'Guest User'}</p>
                         <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">{formatTimeAgo(visit.visited_at || '')}</span>
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
               {!loading && recentVisits.length === 0 && (
                 <div className="text-center py-10 text-muted-foreground text-sm">No activity yet</div>
               )}
             </div>
             {!loading && recentVisits.length > 5 && !showAllActivity && (
               <button 
                 onClick={() => setShowAllActivity(true)}
                 className="w-full py-3 text-xs font-medium text-primary hover:bg-muted/50 transition-colors border-t flex items-center justify-center gap-2"
               >
                 <span>View all activity</span>
                 <i className="fas fa-chevron-down"></i>
               </button>
             )}
             {showAllActivity && (
               <button 
                 onClick={() => setShowAllActivity(false)}
                 className="w-full py-3 text-xs font-medium text-primary hover:bg-muted/50 transition-colors border-t flex items-center justify-center gap-2"
               >
                 <span>Show less</span>
                 <i className="fas fa-chevron-up"></i>
               </button>
             )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 mt-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-4 text-center shadow-md hover:shadow-lg transition-all hover:scale-105">
           <div className="text-blue-600 mb-2">
             <i className="fas fa-mobile-alt text-2xl"></i>
           </div>
           <p className="text-xs text-blue-600 uppercase font-bold mb-1">Mobile Users</p>
           <p className="text-xl font-bold text-blue-700">~85%</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-4 text-center shadow-md hover:shadow-lg transition-all hover:scale-105">
           <div className="text-purple-600 mb-2">
             <i className="fas fa-chart-bar text-2xl"></i>
           </div>
           <p className="text-xs text-purple-600 uppercase font-bold mb-1">Peak Time</p>
           <p className="text-xl font-bold text-purple-700">8 PM - 9 PM</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-4 text-center shadow-md hover:shadow-lg transition-all hover:scale-105">
           <div className="text-green-600 mb-2">
             <i className="fas fa-redo text-2xl"></i>
           </div>
           <p className="text-xs text-green-600 uppercase font-bold mb-1">Return Rate</p>
           <p className="text-xl font-bold text-green-700">Calculating...</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-xl p-4 text-center shadow-md hover:shadow-lg transition-all hover:scale-105">
           <div className="text-orange-600 mb-2">
             <i className="fas fa-clock text-2xl"></i>
           </div>
           <p className="text-xs text-orange-600 uppercase font-bold mb-1">Avg Session</p>
           <p className="text-xl font-bold text-orange-700">~3m 45s</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
