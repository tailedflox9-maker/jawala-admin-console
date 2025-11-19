import React, { useEffect, useState } from 'react';
import { getLiveFeed, getLiveUserCount } from '../supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Primitives';
import { Avatar, Chip } from '@mui/material';

const LiveMonitor: React.FC = () => {
  const [feed, setFeed] = useState<any[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const [f, c] = await Promise.all([getLiveFeed(), getLiveUserCount()]);
    setFeed(f);
    setOnlineCount(c);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: string, event?: string) => {
    if (type === 'visit') return 'fa-eye';
    if (event === 'call') return 'fa-phone';
    if (event === 'whatsapp') return 'fa-brands fa-whatsapp';
    if (event === 'share') return 'fa-share-nodes';
    return 'fa-bolt';
  };

  const getColor = (type: string, event?: string) => {
    if (type === 'visit') return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300';
    if (event === 'call') return 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300';
    if (event === 'whatsapp') return 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300';
    return 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300';
  };

  return (
    <div className="space-y-6 animate-fadeInUp">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-gray-900 to-slate-800 p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white"></span>
              </span>
              Live Monitor
            </h2>
            <p className="text-gray-300 mt-1">Real-time stream of user activity across the platform.</p>
          </div>
          <div className="text-center bg-white/10 p-4 px-8 rounded-xl backdrop-blur-md border border-white/10 relative z-10 min-w-[160px]">
             <div className="text-5xl font-black tracking-tighter">{onlineCount}</div>
             <div className="text-[10px] font-bold uppercase tracking-widest text-gray-300 mt-1">Users Online</div>
          </div>
          
          {/* Decorative background circle */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
       </div>

       <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card className="h-full border-border shadow-sm">
               <CardHeader>
                 <CardTitle>Activity Feed</CardTitle>
                 <CardDescription>Latest 50 interactions sorted by time</CardDescription>
               </CardHeader>
               <CardContent className="p-0">
                 <div className="max-h-[600px] overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {feed.length === 0 && !loading && (
                      <div className="text-center py-12 text-muted-foreground">No recent activity detected.</div>
                    )}
                    {feed.map((item, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-card hover:bg-muted/40 transition-colors border border-border group">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${getColor(item.type, item.event_type)}`}>
                            <i className={`fas ${getIcon(item.type, item.event_type)} text-sm`}></i>
                         </div>
                         <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                               <p className="text-sm font-bold text-foreground">
                                 {item.user_name || 'Guest User'}
                               </p>
                               <span className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-0.5 rounded">
                                 {new Date(item.time).toLocaleTimeString()}
                               </span>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                               {item.type === 'visit' ? (
                                 <span className="flex items-center gap-1.5">
                                   <i className="fas fa-arrow-right text-xs opacity-50"></i>
                                   Viewed page <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-xs font-mono">{item.page_path}</code>
                                 </span>
                               ) : (
                                 <span className="flex items-center gap-1.5">
                                   <i className="fas fa-bolt text-xs opacity-50"></i>
                                   <strong>{item.event_type}</strong> on Business 
                                   <code className="bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded text-xs ml-1 font-mono">#{item.business_id.substring(0, 6)}</code>
                                 </span>
                               )}
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
               </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1 space-y-4">
             <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-6 text-center">
                   <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center mx-auto mb-3">
                     <i className="fas fa-bolt text-xl"></i>
                   </div>
                   <h3 className="font-bold text-lg text-foreground">Traffic Status</h3>
                   <p className="text-sm text-muted-foreground mt-2">
                     System is operating normally. User engagement is consistent with daily averages.
                   </p>
                </CardContent>
             </Card>
             
             <Card>
               <CardHeader className="pb-2">
                 <CardTitle className="text-base">Recent Devices</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="space-y-2">
                   {Array.from(new Set(feed.map(i => i.device_id))).slice(0, 6).map((id: any, idx) => (
                     <div key={idx} className="flex items-center gap-3 text-xs text-muted-foreground p-3 bg-muted/30 rounded-lg border border-transparent hover:border-border transition-colors">
                       <i className="fas fa-mobile-alt text-foreground opacity-50"></i>
                       <span className="font-mono text-foreground">{id.substring(0, 18)}...</span>
                     </div>
                   ))}
                 </div>
               </CardContent>
             </Card>
          </div>
       </div>
    </div>
  );
};

export default LiveMonitor;
