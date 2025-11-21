import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User } from '@supabase/supabase-js';

// Helper to get env vars safely
const getEnv = (key: string): string => {
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
  console.error('❌ CRITICAL: Missing Supabase keys. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
}

export const supabase: SupabaseClient = createClient(supabaseUrl || '', supabaseAnonKey || '');

// ============================================
// ANALYTICS QUERIES
// ============================================

// 1. Dashboard Stats
export const getDashboardStats = async () => {
  try {
    // Try to get summary view first
    const { data: summary } = await supabase
      .from('analytics_summary')
      .select('*')
      .eq('id', 1)
      .single();

    if (summary) {
      return {
        totalVisits: summary.total_visits || 0,
        totalUsers: summary.total_unique_users || 0,
        totalInteractions: summary.total_interactions || 0,
        todayVisits: summary.today_visits || 0,
        businessCount: summary.business_count || 0,
      };
    }

    // Fallback to exact counts
    const today = new Date().toISOString().split('T')[0];
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
      todayVisits: todayVisits.count || 0,
      businessCount: 0,
    };
  } catch (error) {
    return { totalVisits: 0, totalUsers: 0, totalInteractions: 0, todayVisits: 0, businessCount: 0 };
  }
};

// 2. Interaction Stats (Reads directly from table)
export const getInteractionStats = async () => {
  try {
    const { data, error } = await supabase
      .from('business_interactions')
      .select('event_type');
    
    if (error) throw error;
    if (!data || data.length === 0) return [];

    const stats = { call: 0, whatsapp: 0, share: 0, view: 0 };
    
    data.forEach((row: any) => {
      const type = row.event_type;
      if (type === 'call') stats.call++;
      else if (type === 'whatsapp') stats.whatsapp++;
      else if (type === 'share') stats.share++;
      else if (type === 'view') stats.view++;
    });
    
    const result = [
      { name: 'Phone Calls', value: stats.call, fill: '#2196F3' },
      { name: 'WhatsApp', value: stats.whatsapp, fill: '#22c55e' },
      { name: 'Shares', value: stats.share, fill: '#a855f7' },
      { name: 'Profile Views', value: stats.view, fill: '#64748b' },
    ];
    
    return result.filter(i => i.value > 0);
  } catch (error) {
    console.error('Error fetching interaction stats:', error);
    return [];
  }
};

// 3. Conversion Funnel Data
export const getConversionFunnel = async () => {
  try {
    const { count: visits } = await supabase.from('visit_logs').select('*', { count: 'exact', head: true });
    const { count: views } = await supabase.from('business_interactions').select('*', { count: 'exact', head: true }).eq('event_type', 'view');
    const { count: leads } = await supabase.from('business_interactions').select('*', { count: 'exact', head: true }).in('event_type', ['call', 'whatsapp', 'share']);

    return [
      { name: 'App Visits', value: visits || 0, fill: '#64748b' },
      { name: 'Profiles Viewed', value: views || 0, fill: '#2196F3' },
      { name: 'Leads (Calls/WA)', value: leads || 0, fill: '#22c55e' }
    ];
  } catch (error) { return []; }
};

// 3b. Daily Engagement Trend
export const getDailyEngagementTrend = async () => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 14);

    const { data, error } = await supabase
      .from('business_interactions')
      .select('created_at, event_type')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    const daysMap = new Map<string, number>();
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); 
      daysMap.set(key, 0);
    }

    data?.forEach((item: any) => {
      const dateKey = new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (daysMap.has(dateKey)) {
        daysMap.set(dateKey, (daysMap.get(dateKey) || 0) + 1);
      }
    });

    return Array.from(daysMap).map(([date, count]) => ({ date, count }));
  } catch (error) { return []; }
};

// 4. Top Business IDs
export const getTopBusinessIds = async () => {
  try {
    const { data, error } = await supabase
      .from('business_interactions')
      .select('business_id, business_name, event_type');
    
    if (error) throw error;

    const counts: Record<string, any> = {};
    data?.forEach((row: any) => {
      const id = row.business_id;
      if (!counts[id]) {
        counts[id] = { id, name: row.business_name || `Business ${id.substring(0, 8)}`, calls: 0, whatsapp: 0, shares: 0, views: 0, total: 0 };
      }
      if (row.business_name && counts[id].name.startsWith('Business ')) counts[id].name = row.business_name;
      
      if (row.event_type === 'call') counts[id].calls++;
      else if (row.event_type === 'whatsapp') counts[id].whatsapp++;
      else if (row.event_type === 'share') counts[id].shares++;
      else counts[id].views++;
      counts[id].total++;
    });

    return Object.values(counts).sort((a: any, b: any) => b.total - a.total).slice(0, 15);
  } catch (error) { return []; }
};

// 5. Top Users
export const getTopUsers = async () => {
  const { data } = await supabase.from('user_tracking').select('*').order('total_visits', { ascending: false }).limit(50);
  return data || [];
};

// 6. Live Feed
export const getLiveFeed = async () => {
  try {
    const [logs, interactions] = await Promise.all([
      supabase.from('visit_logs').select('*').order('visited_at', { ascending: false }).limit(25),
      supabase.from('business_interactions').select('*').order('created_at', { ascending: false }).limit(25)
    ]);
    const feed = [
      ...(logs.data || []).map((l: any) => ({ ...l, type: 'visit', time: l.visited_at })),
      ...(interactions.data || []).map((i: any) => ({ ...i, type: 'interaction', time: i.created_at }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    return feed.slice(0, 50);
  } catch (error) { return []; }
};

// 7. Live User Count
export const getLiveUserCount = async () => {
  const threshold = new Date(Date.now() - 60000).toISOString();
  const { count } = await supabase.from('live_users').select('*', { count: 'exact', head: true }).eq('is_active', true).gte('last_ping', threshold);
  return count || 0;
};

// 8. AI Stats
export const getAiSearchStats = async () => {
  try {
    const { count: total } = await supabase.from('ai_search_logs').select('*', { count: 'exact', head: true });
    const { count: successful } = await supabase.from('ai_search_logs').select('*', { count: 'exact', head: true }).eq('search_success', true);
    return { total: total || 0, successful: successful || 0, successRate: total ? ((successful||0)/total*100).toFixed(1) : '0', avgResponseTime: '0' };
  } catch { return { total: 0, successful: 0, successRate: '0', avgResponseTime: '0' }; }
};
export const getRecentAiSearches = async (limit: number = 50) => {
  const { data } = await supabase.from('ai_search_logs').select('*').order('searched_at', { ascending: false }).limit(limit);
  return data || [];
};
export const getPopularSearches = async (limit: number = 15) => {
  const { data } = await supabase.from('popular_searches').select('*').limit(limit);
  return data || [];
};
export const getFailedSearches = async (limit: number = 15) => {
  const { data } = await supabase.from('failed_searches').select('*').limit(limit);
  return data || [];
};

// ============================================
// DATA MANAGEMENT & CLEANUP (NEW)
// ============================================

// 10. Get Row Counts
export const getDatabaseUsage = async () => {
  try {
    const [visits, interactions, aiLogs, users] = await Promise.all([
      supabase.from('visit_logs').select('*', { count: 'exact', head: true }),
      supabase.from('business_interactions').select('*', { count: 'exact', head: true }),
      supabase.from('ai_search_logs').select('*', { count: 'exact', head: true }),
      supabase.from('user_tracking').select('*', { count: 'exact', head: true }),
    ]);

    return {
      visit_logs: visits.count || 0,
      business_interactions: interactions.count || 0,
      ai_search_logs: aiLogs.count || 0,
      unique_users: users.count || 0,
    };
  } catch (error) {
    console.error('Error fetching usage:', error);
    return null;
  }
};

// 11. Download Table Data
export const downloadTableData = async (tableName: string) => {
  try {
    const { data, error } = await supabase.from(tableName).select('*').csv();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error downloading ${tableName}:`, error);
    return null;
  }
};

// 12. Cleanup Old Data
export const cleanupOldData = async (monthsToKeep: number) => {
  const dateThreshold = new Date();
  dateThreshold.setMonth(dateThreshold.getMonth() - monthsToKeep);
  const isoDate = dateThreshold.toISOString();

  const results = { visitsDeleted: 0, interactionsDeleted: 0, aiLogsDeleted: 0 };

  try {
    const { count: vCount } = await supabase.from('visit_logs').delete({ count: 'exact' }).lt('visited_at', isoDate);
    results.visitsDeleted = vCount || 0;

    const { count: iCount } = await supabase.from('business_interactions').delete({ count: 'exact' }).lt('created_at', isoDate);
    results.interactionsDeleted = iCount || 0;

    const { count: aCount } = await supabase.from('ai_search_logs').delete({ count: 'exact' }).lt('searched_at', isoDate);
    results.aiLogsDeleted = aCount || 0;
    
    return results;
  } catch (error) {
    console.error('Error cleaning up data:', error);
    throw error;
  }
};

// Auth
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
};
export const signOut = async () => await supabase.auth.signOut();
export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};
