
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { Business, Category, AnalyticsSummary, VisitLog, UserTracking, BusinessInteraction } from './types';

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
  console.error('❌ CRITICAL: Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Please check your .env file.');
}

// Create the client
export const supabase: SupabaseClient = createClient(supabaseUrl || '', supabaseAnonKey || '');

// --- Types from DB ---
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

// --- Mappers ---
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

const businessToDbBusiness = (business: Partial<Business>): Partial<DbBusiness> => {
  const db: Partial<DbBusiness> = {
    category: business.category,
    shop_name: business.shopName,
    owner_name: business.ownerName,
    contact_number: business.contactNumber,
    address: business.address,
    opening_hours: business.openingHours,
    services: business.services,
    home_delivery: business.homeDelivery,
    payment_options: business.paymentOptions,
  };
  if (business.id) db.id = business.id;
  return db;
};

// --- API ---

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
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
  const payload = businessToDbBusiness(business);
  
  if (business.id) {
    // Update
    const { data, error } = await supabase
      .from('businesses')
      .update(payload)
      .eq('id', business.id)
      .select()
      .single();
    if (error) throw error;
    return dbBusinessToBusiness(data);
  } else {
    // Insert
    delete payload.id;
    const { data, error } = await supabase
      .from('businesses')
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return dbBusinessToBusiness(data);
  }
};

export const deleteBusiness = async (id: string) => {
  const { error } = await supabase.from('businesses').delete().eq('id', id);
  if (error) throw error;
};

export const getAnalyticsSummary = async (): Promise<AnalyticsSummary | null> => {
  const { data, error } = await supabase.from('analytics_summary').select('*').eq('id', 1).single();
  if (error) return null;
  return data;
};

// Get LIVE USERS (Active in last 60 seconds)
export const getLiveUsersCount = async (): Promise<number> => {
  try {
    const threshold = new Date(Date.now() - 60000).toISOString(); // Last 60s
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

export const getRecentVisits = async (limit = 50): Promise<VisitLog[]> => {
  const { data, error } = await supabase.from('visit_logs').select('*').order('visited_at', { ascending: false }).limit(limit);
  if (error) return [];
  return data;
};

export const getAllVisitLogs = async (limit = 500): Promise<VisitLog[]> => {
  const { data, error } = await supabase
    .from('visit_logs')
    .select('*')
    .order('visited_at', { ascending: false })
    .limit(limit);
  if (error) return [];
  return data;
};

// Calculate REAL chart data from logs
export const getRealTrafficData = async () => {
  // Get logs for last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // 7 days including today
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('visit_logs')
    .select('visited_at')
    .gte('visited_at', sevenDaysAgo.toISOString());

  if (error || !data) return [];

  // Group by date
  const daysMap = new Map<string, number>();
  
  // Initialize map with 0 for all 7 days
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }); // Mon, Tue
    daysMap.set(dayName, 0);
  }

  // Fill data
  data.forEach(log => {
    const d = new Date(log.visited_at);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    if (daysMap.has(dayName)) {
      daysMap.set(dayName, (daysMap.get(dayName) || 0) + 1);
    }
  });

  // Convert to array
  return Array.from(daysMap).map(([name, visits]) => ({ name, visits }));
};

// Get Business Ecosystem Stats
export const getEcosystemStats = async () => {
  const { data, error } = await supabase.from('businesses').select('category, payment_options, home_delivery');
  if (error || !data) return { category: [], payment: [], delivery: [] };

  // 1. Category Distribution
  const { data: categories } = await supabase.from('categories').select('id, name');
  const catMap = new Map(categories?.map(c => [c.id, c.name]));
  const catCounts: Record<string, number> = {};
  
  // 2. Payment Options
  const payCounts: Record<string, number> = { UPI: 0, Cash: 0, Card: 0 };
  
  // 3. Home Delivery
  const deliveryCounts = { yes: 0, no: 0 };

  data.forEach(b => {
    // Category
    const name = catMap.get(b.category) || 'Other';
    catCounts[name] = (catCounts[name] || 0) + 1;

    // Payment
    if (b.payment_options) {
      b.payment_options.forEach((p: string) => {
        if (payCounts[p] !== undefined) payCounts[p]++;
        else payCounts[p] = 1;
      });
    }

    // Delivery
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

// NEW: Get Hourly Visits for TODAY
export const getHourlyVisitsToday = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { data, error } = await supabase
    .from('visit_logs')
    .select('visited_at')
    .gte('visited_at', today.toISOString());
    
  if (error || !data) return [];
  
  // Initialize 0-23 hours
  const hourlyData = Array(24).fill(0);
  
  data.forEach(log => {
    const hour = new Date(log.visited_at).getHours();
    hourlyData[hour]++;
  });
  
  return hourlyData.map((visits, hour) => ({
    hour: `${hour}:00`,
    visits
  }));
};

// NEW: Get Top Active Users
export const getTopUsers = async (): Promise<UserTracking[]> => {
  const { data, error } = await supabase
    .from('user_tracking')
    .select('*')
    .order('total_visits', { ascending: false })
    .limit(10);
    
  if (error || !data) return [];
  return data;
};

// NEW: Get Top Businesses from Interactions
export const getTopBusinesses = async () => {
  const { data, error } = await supabase
    .from('business_interactions')
    .select('business_id, event_type');
    
  if (error || !data) return [];
  
  const businessCounts: Record<string, { id: string, views: number, calls: number, whatsapp: number, share: number }> = {};
  
  data.forEach((i: any) => {
    if (!businessCounts[i.business_id]) {
      businessCounts[i.business_id] = { id: i.business_id, views: 0, calls: 0, whatsapp: 0, share: 0 };
    }
    if (i.event_type === 'view') businessCounts[i.business_id].views++;
    if (i.event_type === 'call') businessCounts[i.business_id].calls++;
    if (i.event_type === 'whatsapp') businessCounts[i.business_id].whatsapp++;
    if (i.event_type === 'share') businessCounts[i.business_id].share++;
  });
  
  // We need business names
  const { data: businesses } = await supabase.from('businesses').select('id, shop_name');
  const nameMap = new Map(businesses?.map(b => [b.id, b.shop_name]));
  
  return Object.values(businessCounts)
    .map(b => ({
      ...b,
      name: nameMap.get(b.id) || 'Unknown Shop',
      total: b.views + b.calls + b.whatsapp + b.share
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);
};
