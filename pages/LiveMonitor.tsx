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
    if (type === 'visit') return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    if (event === 'call') return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400';
    if (event === 'whatsapp') return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400';
    return 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400';
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-2xl text-white shadow-xl">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
              </span>
              Live Monitor
            </h2>
            <p className="text-gray-400 mt-1">Real-time stream of user activity</p>
          </div>
          <div className="text-center bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
             <div className="text-4xl font-black tracking-tighter">{onlineCount}</div>
             <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Users Online</div>
          </div>
       </div>

       <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card className="h-full">
               <CardHeader>
                 <CardTitle>Activity Feed</CardTitle>
                 <CardDescription>Latest interactions happening on the platform</CardDescription>
               </CardHeader>
               <CardContent className="p-0">
                 <div className="max-h-[600px] overflow-y-auto p-4 space-y-4">
                    {feed.map((item, i) => (
                      <div key={i} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getColor(item.type, item.event_type)}`}>
                            <i className={`fas ${getIcon(item.type, item.event_type)}`}></i>
                         </div>
                         <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                               <p className="text-sm font-semibold text-foreground">
                                 {item.user_name || 'Guest User'}
                               </p>
                               <span className="text-xs text-muted-foreground font-mono">
                                 {new Date(item.time).toLocaleTimeString()}
                               </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5">
                               {item.type === 'visit' ? (
                                 <span>Viewed page <code className="bg-muted px-1 rounded text-xs">{item.page_path}</code></span>
                               ) : (
                                 <span>
                                   Performed <strong>{item.event_type}</strong> on Business 
                                   <code className="bg-muted px-1 rounded text-xs ml-1">#{item.business_id.substring(0, 6)}</code>
                                 </span>
                               )}
                            </p>
                         </div>
                      </div>
                    ))}
                 </div>
               </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1 space-y-4">
             <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                <CardContent className="p-6 text-center">
                   <i className="fas fa-bolt text-3xl text-blue-500 mb-3"></i>
                   <h3 className="font-bold text-lg">High Traffic</h3>
                   <p className="text-sm text-muted-foreground">Current traffic is 12% higher than yesterday at this time.</p>
                </CardContent>
             </Card>
             
             <Card>
               <CardHeader className="pb-2">
                 <CardTitle className="text-base">Recent Devices</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="space-y-2">
                   {Array.from(new Set(feed.map(i => i.device_id))).slice(0, 5).map((id: any, idx) => (
                     <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground p-2 bg-muted/30 rounded">
                       <i className="fas fa-mobile-alt"></i>
                       <span className="font-mono">{id.substring(0, 15)}...</span>
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
