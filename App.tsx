import React, { useEffect, useState } from 'react';
import { getTopUsers } from '../supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Primitives';
import { Avatar } from '@mui/material';

const UserInsights: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  
  useEffect(() => {
    getTopUsers().then(setUsers);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">User Insights</h1>
        <p className="text-muted-foreground">Most active users in the community.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {users.map((user) => (
           <Card key={user.id} className="hover:shadow-md transition-all group">
             <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                   {user.user_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                   <h4 className="font-bold text-foreground truncate">{user.user_name}</h4>
                   <p className="text-xs text-muted-foreground font-mono truncate mb-1">{user.device_id}</p>
                   <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded text-[10px] font-bold">
                        {user.total_visits} Visits
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Last: {new Date(user.last_visit_at).toLocaleDateString()}
                      </span>
                   </div>
                </div>
             </CardContent>
           </Card>
        ))}
      </div>
    </div>
  );
};

export default UserInsights;
