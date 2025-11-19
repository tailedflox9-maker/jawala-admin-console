import React, { useEffect, useState } from 'react';
import { getTopBusinessIds } from '../supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Skeleton } from '../components/ui/Primitives';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const BusinessPerformance: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopBusinessIds().then(d => {
      setData(d);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 animate-fadeInUp">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-foreground">Business Performance</h1>
        <p className="text-muted-foreground">Top 15 businesses by user engagement metrics.</p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="h-[400px] w-full">
             {loading ? <Skeleton className="h-full w-full" /> : (
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                   <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                   <XAxis 
                     dataKey="id" 
                     tickFormatter={(val) => `#${val.substring(0,4)}`} 
                     stroke="hsl(var(--muted-foreground))" 
                     tick={{fill: 'hsl(var(--muted-foreground))'}}
                     axisLine={false}
                     tickLine={false}
                   />
                   <YAxis 
                     stroke="hsl(var(--muted-foreground))" 
                     tick={{fill: 'hsl(var(--muted-foreground))'}}
                     axisLine={false}
                     tickLine={false}
                   />
                   <Tooltip 
                     cursor={{fill: 'hsl(var(--muted)/0.2)'}}
                     contentStyle={{ 
                       backgroundColor: 'hsl(var(--card))', 
                       borderColor: 'hsl(var(--border))', 
                       borderRadius: '8px',
                       color: 'hsl(var(--foreground))'
                     }}
                   />
                   <Legend wrapperStyle={{ paddingTop: '20px' }} />
                   <Bar dataKey="views" stackId="a" fill="#94a3b8" name="Views" radius={[0, 0, 0, 0]} />
                   <Bar dataKey="calls" stackId="a" fill="#3b82f6" name="Calls" radius={[0, 0, 0, 0]} />
                   <Bar dataKey="whatsapp" stackId="a" fill="#22c55e" name="WhatsApp" radius={[0, 0, 0, 0]} />
                   <Bar dataKey="shares" stackId="a" fill="#a855f7" name="Shares" radius={[4, 4, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
             )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
             <CardTitle>Detailed Interaction Report</CardTitle>
             <CardDescription>Raw data breakdown per business ID</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Business ID</th>
                  <th className="px-6 py-4 text-center font-medium">Views</th>
                  <th className="px-6 py-4 text-center font-medium">Calls</th>
                  <th className="px-6 py-4 text-center font-medium">WhatsApp</th>
                  <th className="px-6 py-4 text-center font-medium">Shares</th>
                  <th className="px-6 py-4 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {data.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded font-bold">{row.id.substring(0, 8)}...</span>
                    </td>
                    <td className="px-6 py-4 text-center text-muted-foreground">{row.views}</td>
                    <td className="px-6 py-4 text-center">
                      {row.calls > 0 ? <span className="text-blue-600 dark:text-blue-400 font-bold">{row.calls}</span> : '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.whatsapp > 0 ? <span className="text-green-600 dark:text-green-400 font-bold">{row.whatsapp}</span> : '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.shares > 0 ? <span className="text-purple-600 dark:text-purple-400 font-bold">{row.shares}</span> : '-'}
                    </td>
                    <td className="px-6 py-4 text-right font-black text-foreground">{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessPerformance;
