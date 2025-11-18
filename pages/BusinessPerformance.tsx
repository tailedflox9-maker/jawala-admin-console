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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Business Performance</h1>
        <p className="text-muted-foreground">Top 15 businesses by user engagement (Interactions).</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="h-[400px] w-full">
             {loading ? <Skeleton className="h-full w-full" /> : (
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                   <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                   <XAxis dataKey="id" tickFormatter={(val) => `#${val.substring(0,4)}`} stroke="hsl(var(--muted-foreground))" />
                   <YAxis stroke="hsl(var(--muted-foreground))" />
                   <Tooltip 
                     cursor={{fill: 'hsl(var(--muted)/0.3)'}}
                     contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                   />
                   <Legend />
                   <Bar dataKey="views" stackId="a" fill="#94a3b8" name="Views" />
                   <Bar dataKey="calls" stackId="a" fill="#3b82f6" name="Calls" />
                   <Bar dataKey="whatsapp" stackId="a" fill="#22c55e" name="WhatsApp" />
                   <Bar dataKey="shares" stackId="a" fill="#a855f7" name="Shares" />
                 </BarChart>
               </ResponsiveContainer>
             )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader>
             <CardTitle>Detailed Interaction Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-6 py-3">Business ID</th>
                    <th className="px-6 py-3 text-center">Views</th>
                    <th className="px-6 py-3 text-center">Calls</th>
                    <th className="px-6 py-3 text-center">WhatsApp</th>
                    <th className="px-6 py-3 text-center">Shares</th>
                    <th className="px-6 py-3 text-right">Total Engagement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.map((row) => (
                    <tr key={row.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">
                        <span className="bg-muted px-2 py-1 rounded text-foreground">{row.id}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-muted-foreground">{row.views}</td>
                      <td className="px-6 py-4 text-center font-bold text-blue-600">{row.calls}</td>
                      <td className="px-6 py-4 text-center font-bold text-green-600">{row.whatsapp}</td>
                      <td className="px-6 py-4 text-center font-bold text-purple-600">{row.shares}</td>
                      <td className="px-6 py-4 text-right font-black text-foreground">{row.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessPerformance;
