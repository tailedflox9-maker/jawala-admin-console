import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { Business, Category, AnalyticsSummary, VisitLog, UserTracking } from './types';

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
  console.error('❌ CRITICAL: Missing Supabase keys in Admin Console.');
}

export const supabase: SupabaseClient = createClient(supabaseUrl || '', supabaseAnonKey || '');

// --- HELPER: Mock Data for missing tables ---
// Since this is an Analytics DB, it might not have the full 'businesses' or 'categories' tables.
// We return empty arrays to prevent the app from crashing.

export const fetchBusinesses = async (): Promise<Business[]> => {
  console.warn("Analytics DB: 'businesses' table likely missing. Returning empty list.");
  return [];
};

export const fetchCategories = async (): Promise<Category[]> => {
  return [];
};

export const saveBusiness = async (business: any) => { return {} as Business; };
export const deleteBusiness = async (id: string) => { };


// --- REAL ANALYTICS (Based on your Screenshots) ---

export const getAnalyticsSummary = async (): Promise<AnalyticsSummary | null> => {
  try {
    // 1. Total Visits (Count visit_logs)
    const { count: totalVisits } = await supabase
      .from('visit_logs')
      .select('*', { count: 'exact', head: true });

    // 2. Active Users (Count user_tracking)
    const { count: uniqueUsers } = await supabase
      .from('user_tracking')
      .select('*', { count: 'exact', head: true });

    // 3. Total Businesses (Count unique business_ids in interactions)
    // Since we don't have a 'businesses' table, we count how many unique businesses have been interacted with.
    const { data: interactions } = await supabase
      .from('business_interactions')
      .select('business_id');
    
    // Count unique IDs using a Set
    const uniqueBizCount = interactions ? new Set(interactions.map(i => i.business_id)).size : 0;

    return {
      total_visits: totalVisits || 0,
      total_unique_users: uniqueUsers || 0,
      business_count: uniqueBizCount || 0, // Showing active businesses instead of total DB rows
      last_updated: new Date().toISOString()
    };
  } catch (e) {
    console.error("Error fetching summary:", e);
    return null;
  }
};

// Get Live Users (Active in last 5 minutes)
export const getLiveUsersCount = async (): Promise<number> => {
  try {
    // Check 'live_users' table if you have it (shown in screenshot)
    const { count, error } = await supabase
      .from('live_users')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);
    
    if (!error) return count || 0;

    // Fallback: Check visit_logs in last 5 mins
    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { count: logCount } = await supabase
      .from('visit_logs')
      .select('*', { count: 'exact', head: true })
      .gte('visited_at', fiveMinsAgo);
      
    return logCount || 0;
  } catch (error) {
    return 0;
  }
};

export const getRecentVisits = async (limit = 50): Promise<VisitLog[]> => {
  const { data, error } = await supabase
    .from('visit_logs')
    .select('*')
    .order('visited_at', { ascending: false })
    .limit(limit);
    
  if (error) return [];
  return data;
};

export const getAllVisitLogs = async (limit = 200) => {
  return getRecentVisits(limit);
};

export const getRealTrafficData = async () => {
  // Get last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  
  const { data } = await supabase
    .from('visit_logs')
    .select('visited_at')
    .gte('visited_at', sevenDaysAgo.toISOString());

  if (!data) return [];

  const daysMap = new Map<string, number>();
  // Init days
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    daysMap.set(dayName, 0);
  }

  // Fill data
  data.forEach(log => {
    const dayName = new Date(log.visited_at).toLocaleDateString('en-US', { weekday: 'short' });
    if (daysMap.has(dayName)) {
      daysMap.set(dayName, (daysMap.get(dayName) || 0) + 1);
    }
  });

  return Array.from(daysMap).map(([name, visits]) => ({ name, visits }));
};

// Get Top Businesses from Interactions Table
export const getTopBusinesses = async () => {
  const { data, error } = await supabase
    .from('business_interactions')
    .select('business_id, event_type');
    
  if (error || !data) return [];
  
  const stats: Record<string, any> = {};
  
  data.forEach((row: any) => {
    const id = row.business_id;
    if (!stats[id]) {
      stats[id] = { 
        id, 
        name: 'Business ID: ' + id.substring(0, 6), // We don't have names in Analytics DB
        views: 0, calls: 0, whatsapp: 0, share: 0, total: 0 
      };
    }
    if (row.event_type === 'view') stats[id].views++;
    if (row.event_type === 'call') stats[id].calls++;
    if (row.event_type === 'whatsapp') stats[id].whatsapp++;
    if (row.event_type === 'share') stats[id].share++;
    stats[id].total++;
  });
  
  return Object.values(stats)
    .sort((a: any, b: any) => b.total - a.total)
    .slice(0, 10);
};

export const getEcosystemStats = async () => {
  // We can't calculate category/payment stats without the businesses table.
  // Return empty structure to keep Analytics page happy.
  return { 
    category: [], 
    payment: [], 
    delivery: [{ name: 'Data Unavailable', value: 0 }] 
  };
};

export const getTopUsers = async (): Promise<UserTracking[]> => {
  const { data, error } = await supabase
    .from('user_tracking')
    .select('*')
    .order('total_visits', { ascending: false })
    .limit(10);
  
  if (error) return [];
  return data;
};

export const getHourlyVisitsToday = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { data } = await supabase
    .from('visit_logs')
    .select('visited_at')
    .gte('visited_at', today.toISOString());
    
  const hourlyData = Array(24).fill(0);
  
  data?.forEach(log => {
    const hour = new Date(log.visited_at).getHours();
    hourlyData[hour]++;
  });
  
  return hourlyData.map((visits, hour) => ({
    hour: `${hour}:00`,
    visits
  }));
};

// --- AUTH ---
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
};

export const signOut = async () => {
  await supabase.auth.signOut();
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};
