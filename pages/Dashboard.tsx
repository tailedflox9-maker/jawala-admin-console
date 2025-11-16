
import React, { useEffect, useState } from 'react';
import { getAnalyticsSummary, getRecentVisits } from '../supabaseClient';
import { AnalyticsSummary, VisitLog } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Primitives';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [recentVisits, setRecentVisits] = useState<VisitLog[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [sum, visits] = await Promise.all([
        getAnalyticsSummary(),
        getRecentVisits(5) // Only show top 5 on dashboard
      ]);
      setSummary(sum);
      setRecentVisits(visits);
    };
    loadData();
  }, []);

  // Mock data for weekly trend
  const data = [
    { name: 'Mon', visits: 40 },
    { name: 'Tue', visits: 30 },
    { name: 'Wed', visits: 45 },
    { name: 'Thu', visits: 27 },
    { name: 'Fri', visits: 55 },
    { name: 'Sat', visits: 80 },
    { name: 'Sun', visits: 65 },
  ];

  return (
    <div className="space-y-8 animate-fadeInUp">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground">Welcome back to your admin console.</p>
      </div>
      
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Unique Users</CardTitle>
            <i className="fas fa-users text-muted-foreground"></i>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary?.total_unique_users || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Lifetime unique visitors
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
            <i className="fas fa-eye text-muted-foreground"></i>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{summary?.total_visits || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Cumulative views
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Activity</CardTitle>
            <i className="fas fa-clock text-muted-foreground"></i>
          </CardHeader>
          <CardContent>
             <div className="text-sm font-medium mt-2">
               {recentVisits[0]?.user_name || 'Guest'}
             </div>
             <div className="text-xs text-muted-foreground">
               Visited {recentVisits[0]?.page_path} just now
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Traffic Trend</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tickMargin={10} className="text-xs text-muted-foreground" />
                <YAxis axisLine={false} tickLine={false} className="text-xs text-muted-foreground" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Line type="monotone" dataKey="visits" stroke="hsl(var(--primary))" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{ r: 6 }} />
              </LineChart>
              </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
