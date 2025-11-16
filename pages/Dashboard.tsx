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
        getRecentVisits(10)
      ]);
      setSummary(sum);
      setRecentVisits(visits);
    };
    loadData();
  }, []);

  // Mock data for chart since we don't have historical daily data readily available in this view
  const data = [
    { name: 'Mon', visits: 40 },
    { name: 'Tue', visits: 30 },
    { name: 'Wed', visits: 20 },
    { name: 'Thu', visits: 27 },
    { name: 'Fri', visits: 18 },
    { name: 'Sat', visits: 23 },
    { name: 'Sun', visits: 34 },
  ];

  return (
    <div className="space-y-8 animate-fadeInUp">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <i className="fas fa-users text-muted-foreground"></i>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.total_unique_users || 0}</div>
            <p className="text-xs text-muted-foreground">
              Unique visitors tracked
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
            <i className="fas fa-eye text-muted-foreground"></i>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.total_visits || 0}</div>
            <p className="text-xs text-muted-foreground">
              Across all pages
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <i className="fas fa-chart-line text-muted-foreground"></i>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary && summary.total_unique_users > 0 
                ? (summary.total_visits / summary.total_unique_users).toFixed(1)
                : '0.0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Avg. views per user
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <i className="fas fa-signal text-green-500"></i>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Real-time users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Chart Section */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Weekly Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs text-muted-foreground" />
                  <YAxis className="text-xs text-muted-foreground" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                  />
                  <Line type="monotone" dataKey="visits" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
               </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Feed */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentVisits.length === 0 ? (
                 <p className="text-sm text-muted-foreground">No recent activity.</p>
              ) : (
                recentVisits.map((visit, i) => (
                  <div key={visit.id || i} className="flex items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
                      <i className="fas fa-user text-xs"></i>
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{visit.user_name || 'Guest'}</p>
                      <p className="text-xs text-muted-foreground">
                         visited {visit.page_path}
                      </p>
                    </div>
                    <div className="ml-auto font-medium text-xs text-muted-foreground">
                      {visit.visited_at ? new Date(visit.visited_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;