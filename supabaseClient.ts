import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { Business, Category, AnalyticsSummary, VisitLog } from './types';

// ============================================================================
// 👇 STEP 1: PASTE YOUR SUPABASE URL INSIDE THE QUOTES BELOW
// Example: const supabaseUrl = 'https://xyz.supabase.co';
// ============================================================================
const supabaseUrl = 'PASTE_YOUR_SUPABASE_URL_HERE';

// ============================================================================
// 👇 STEP 2: PASTE YOUR SUPABASE ANON KEY INSIDE THE QUOTES BELOW
// Example: const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsIn...';
// ============================================================================
const supabaseAnonKey = 'PASTE_YOUR_SUPABASE_ANON_KEY_HERE';

// Validation check to help you debug
if (supabaseUrl.includes('PASTE_YOUR') || supabaseAnonKey.includes('PASTE_YOUR')) {
  console.error('❌ CRITICAL: You need to paste your Supabase Keys in supabaseClient.ts for the app to work!');
}

// Create the client
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

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

export const getRecentVisits = async (limit = 20): Promise<VisitLog[]> => {
  const { data, error } = await supabase.from('visit_logs').select('*').order('visited_at', { ascending: false }).limit(limit);
  if (error) return [];
  return data;
};