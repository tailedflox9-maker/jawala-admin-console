import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User } from '@supabase/supabase-js';

// --- SAFE ENVIRONMENT ACCESS ---
const getEnv = (key: string) => {
  try {
    // @ts-ignore
    return import.meta.env?.[key] || '';
  } catch (e) {
    return '';
  }
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ CRITICAL: Missing Supabase keys.');
}

export const supabase: SupabaseClient = createClient(supabaseUrl || '', supabaseAnonKey || '');

// --- ANALYTICS QUERIES ---

// 1. Overview KPI Data
export const getDashboardStats = async () => {
  const today = new Date().toISOString().split('T')[0];
  
  // Parallel requests for speed
  const [visits, users, interactions, todayVisits] = await Promise.all([
    supabase.from('visit_logs').select('*', { count: 'exact', head: true }),
    supabase.from('user_tracking').select('*', { count: 'exact', head: true }),
    supabase.from('business_interactions').select('*', { count: 'exact', head: true }),
    supabase.from('visit_logs').select('*', { count: 'exact', head: true }).gte('visited_at', `${today}T00:00:00`)
  ]);

  return {
    totalVisits: visits.count || 0,
    totalUsers: users.count || 0,
    totalInteractions: interactions.count || 0,
    todayVisits: todayVisits.count || 0
  };
};

// 2. Interaction Breakdown (Calls vs WhatsApp vs Share)
export const getInteractionStats = async () => {
  const { data } = await supabase.from('business_interactions').select('event_type');
  
  const stats = { call: 0, whatsapp: 0, share: 0, view: 0 };
  data?.forEach((row: any) => {
    if (stats[row.event_type as keyof typeof stats] !== undefined) {
      stats[row.event_type as keyof typeof stats]++;
    }
  });
  
  return [
    { name: 'Phone Calls', value: stats.call, fill: '#3b82f6' },
    { name: 'WhatsApp', value: stats.whatsapp, fill: '#22c55e' },
    { name: 'Shares', value: stats.share, fill: '#a855f7' },
    { name: 'Profile Views', value: stats.view, fill: '#64748b' },
  ].filter(i => i.value > 0);
};

// 3. Traffic Trend (Last 14 Days)
export const getTrafficHistory = async () => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 14);
  
  const { data } = await supabase
    .from('visit_logs')
    .select('visited_at')
    .gte('visited_at', startDate.toISOString());

  const daysMap = new Map<string, number>();
  // Initialize last 14 days with 0
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    daysMap.set(d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }), 0);
  }

  data?.forEach((log: any) => {
    const dateKey = new Date(log.visited_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    if (daysMap.has(dateKey)) {
      daysMap.set(dateKey, (daysMap.get(dateKey) || 0) + 1);
    }
  });

  return Array.from(daysMap).map(([date, count]) => ({ date, visits: count }));
};

// 4. Top Performing Businesses (By ID)
export const getTopBusinessIds = async () => {
  const { data } = await supabase.from('business_interactions').select('business_id, event_type');
  
  const counts: Record<string, any> = {};
  
  data?.forEach((row: any) => {
    const id = row.business_id;
    if (!counts[id]) counts[id] = { id, calls: 0, whatsapp: 0, shares: 0, views: 0, total: 0 };
    
    if (row.event_type === 'call') counts[id].calls++;
    else if (row.event_type === 'whatsapp') counts[id].whatsapp++;
    else if (row.event_type === 'share') counts[id].shares++;
    else counts[id].views++;
    
    counts[id].total++;
  });

  return Object.values(counts).sort((a: any, b: any) => b.total - a.total).slice(0, 15);
};

// 5. Active Users
export const getTopUsers = async () => {
  const { data } = await supabase
    .from('user_tracking')
    .select('*')
    .order('last_visit_at', { ascending: false }) // Recently active
    .limit(50);
  return data || [];
};

// 6. Live Feed Data
export const getLiveFeed = async () => {
  const [logs, interactions] = await Promise.all([
    supabase.from('visit_logs').select('*').order('visited_at', { ascending: false }).limit(20),
    supabase.from('business_interactions').select('*').order('created_at', { ascending: false }).limit(20)
  ]);

  // Merge and sort
  const feed = [
    ...(logs.data || []).map((l: any) => ({ ...l, type: 'visit', time: l.visited_at })),
    ...(interactions.data || []).map((i: any) => ({ ...i, type: 'interaction', time: i.created_at }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  return feed.slice(0, 50);
};

export const getLiveUserCount = async () => {
  const threshold = new Date(Date.now() - 60000).toISOString(); // 1 min
  const { count } = await supabase
    .from('live_users')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
    .gte('last_ping', threshold);
  return count || 0;
};

// Auth
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
};

export const signOut = async () => {
  await supabase.auth.signOut();
};

// FIX: Added this function back so App.tsx can use it
export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};
