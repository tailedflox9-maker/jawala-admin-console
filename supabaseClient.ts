import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { Business, Category, AnalyticsSummary, VisitLog, UserTracking } from './types';

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
  console.error('❌ CRITICAL: Missing Supabase credentials.');
}

export const supabase: SupabaseClient = createClient(supabaseUrl || '', supabaseAnonKey || '');

// --- Mappers (Keep existing mappers here) ---
// ... (Use your existing dbBusinessToBusiness functions here)
// ...

// Helper for types
interface DbBusiness {
  id: string;
  category: string;
  shop_name: string;
  owner_name: string;
  contact_number: string;
  address?: string;
  opening_hours?: string;
  services?: string[];
  home_delivery?: boolean;
  payment_options?: string[];
  created_at?: string;
}

const dbBusinessToBusiness = (db: DbBusiness): Business => ({
  id: db.id,
  category: db.category,
  shopName: db.shop_name,
  ownerName: db.owner_name,
  contactNumber: db.contact_number,
  address: db.address,
  openingHours: db.opening_hours,
  services: db.services || [],
  homeDelivery: db.home_delivery || false,
  paymentOptions: db.payment_options || [],
  createdAt: db.created_at
});

// --- API ---

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

export const fetchBusinesses = async (): Promise<Business[]> => {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return (data || []).map(dbBusinessToBusiness);
};

export const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) throw error;
  return data || [];
};

export const saveBusiness = async (business: Partial<Business>) => {
    // ... (Keep your existing save logic)
    // Placeholder to save space in response, reuse previous save logic
    return {} as Business; 
};

export const deleteBusiness = async (id: string) => {
  const { error } = await supabase.from('businesses').delete().eq('id', id);
  if (error) throw error;
};

// --- ANALYTICS ---

// 1. Get Total Visits (from summary or calculate)
export const getAnalyticsSummary = async (): Promise<AnalyticsSummary | null> => {
  // Try to fetch from summary table first
  const { data, error } = await supabase.from('analytics_summary').select('*').eq('id', 1).single();
  
  if (data) return data;

  // Fallback: Count manually if summary table is empty/missing
  const { count: visitCount } = await supabase.from('visit_logs').select('*', { count: 'exact', head: true });
  const { count: userCount } = await supabase.from('user_tracking').select('*', { count: 'exact', head: true });
  const { count: bizCount } = await supabase.from('businesses').select('*', { count: 'exact', head: true });

  return {
    total_visits: visitCount || 0,
    total_unique_users: userCount || 0,
    business_count: bizCount || 0,
    last_updated: new Date().toISOString()
  };
};

// 2. Get Live Users
export const getLiveUsersCount = async (): Promise<number> => {
  try {
    // Active in last 60 seconds
    const threshold = new Date(Date.now() - 60000).toISOString(); 
    const { count, error } = await supabase
      .from('live_users')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .gte('last_ping', threshold);
    
    if (error) throw error;
    return count || 0;
  } catch (error) {
    return 0;
  }
};

// 3. Get Recent Activity Stream
export const getRecentVisits = async (limit = 50): Promise<VisitLog[]> => {
  const { data, error } = await supabase
    .from('visit_logs')
    .select('*')
    .order('visited_at', { ascending: false })
    .limit(limit);
  if (error) return [];
  return data;
};

// 4. Real Traffic Data (Last 7 Days)
export const getRealTrafficData = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('visit_logs')
    .select('visited_at')
    .gte('visited_at', sevenDaysAgo.toISOString());

  if (error || !data) return [];

  const daysMap = new Map<string, number>();
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    daysMap.set(dayName, 0);
  }

  data.forEach(log => {
    const d = new Date(log.visited_at);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    if (daysMap.has(dayName)) {
      daysMap.set(dayName, (daysMap.get(dayName) || 0) + 1);
    }
  });

  return Array.from(daysMap).map(([name, visits]) => ({ name, visits }));
};

// 5. Top Businesses (AGGREGATED from Interactions)
export const getTopBusinesses = async () => {
  // Fetch all interactions
  const { data: interactions, error } = await supabase
    .from('business_interactions')
    .select('business_id, event_type');
    
  if (error || !interactions) return [];

  // Fetch business names to map IDs to Names
  const { data: businesses } = await supabase
    .from('businesses')
    .select('id, shop_name');
    
  const nameMap = new Map(businesses?.map(b => [b.id, b.shop_name]));

  // Aggregation Logic
  const stats: Record<string, { id: string, name: string, views: number, calls: number, whatsapp: number, share: number, total: number }> = {};

  interactions.forEach((row) => {
    const bId = row.business_id;
    if (!stats[bId]) {
      stats[bId] = {
        id: bId,
        name: nameMap.get(bId) || 'Unknown Business',
        views: 0,
        calls: 0,
        whatsapp: 0,
        share: 0,
        total: 0
      };
    }

    if (row.event_type === 'view') stats[bId].views++;
    if (row.event_type === 'call') stats[bId].calls++;
    if (row.event_type === 'whatsapp') stats[bId].whatsapp++;
    if (row.event_type === 'share') stats[bId].share++;
    stats[bId].total++;
  });

  return Object.values(stats)
    .sort((a, b) => b.total - a.total)
    .slice(0, 10); // Top 10
};

// 6. Ecosystem Stats
export const getEcosystemStats = async () => {
  const { data, error } = await supabase.from('businesses').select('category, payment_options, home_delivery');
  if (error || !data) return { category: [], payment: [], delivery: [] };

  const { data: categories } = await supabase.from('categories').select('id, name');
  const catMap = new Map(categories?.map(c => [c.id, c.name]));

  const catCounts: Record<string, number> = {};
  const payCounts: Record<string, number> = { UPI: 0, Cash: 0, Card: 0 };
  const deliveryCounts = { yes: 0, no: 0 };

  data.forEach(b => {
    const catName = catMap.get(b.category) || 'Other';
    catCounts[catName] = (catCounts[catName] || 0) + 1;

    b.payment_options?.forEach((p: string) => {
      if (payCounts[p] !== undefined) payCounts[p]++;
    });

    if (b.home_delivery) deliveryCounts.yes++;
    else deliveryCounts.no++;
  });

  return {
    category: Object.entries(catCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
    payment: Object.entries(payCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
    delivery: [
      { name: 'Available', value: deliveryCounts.yes }, 
      { name: 'Not Available', value: deliveryCounts.no }
    ]
  };
};

export const getTopUsers = async (): Promise<UserTracking[]> => {
  const { data, error } = await supabase
    .from('user_tracking')
    .select('*')
    .order('total_visits', { ascending: false })
    .limit(10);
  if (error) return [];
  return data || [];
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
  
  return hourlyData.map((visits, hour) => ({ hour: `${hour}:00`, visits }));
};

export const getAllVisitLogs = async (limit = 200) => {
    return getRecentVisits(limit);
};
