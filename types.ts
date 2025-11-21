export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Business {
  id: string;
  category: string;
  shopName: string;
  ownerName: string;
  contactNumber: string;
  address?: string;
  openingHours?: string;
  services?: string[];
  homeDelivery?: boolean;
  paymentOptions?: string[];
  createdAt?: string;
}

export interface AnalyticsSummary {
  total_unique_users: number;
  total_visits: number;
  business_count: number;
  last_updated: string;
}

export interface VisitLog {
  id?: string;
  device_id: string;
  user_name?: string;
  visited_at?: string;
  page_path?: string;
}

export interface UserTracking {
  id: string;
  user_name: string;
  device_id: string;
  total_visits: number;
  first_visit_at: string;
  last_visit_at: string;
}

export interface BusinessInteraction {
  id: string;
  business_id: string;
  business_name?: string;
  event_type: 'view' | 'call' | 'whatsapp' | 'share';
  created_at: string;
  device_id?: string;
  user_name?: string;
}

// NEW: AI Search Analytics Types
export interface AiSearchLog {
  id: string;
  search_query: string;
  search_success: boolean;
  businesses_count: number;
  response_time_ms?: number;
  searched_at: string;
  device_id?: string;
  user_name?: string;
}

export interface PopularSearch {
  search_query: string;
  search_count: number;
}

export interface FailedSearch {
  search_query: string;
  failure_count: number;
}

export interface AiSearchStats {
  total: number;
  successful: number;
  successRate: string;
  avgResponseTime: string;
}

// Dashboard Stats Type
export interface DashboardStats {
  totalVisits: number;
  totalUsers: number;
  totalInteractions: number;
  todayVisits: number;
  businessCount: number;
}

// Traffic History Type
export interface TrafficData {
  date: string;
  visits: number;
  users?: number;
}

// Interaction Stats Type
export interface InteractionStat {
  name: string;
  value: number;
  fill: string;
}

// Business Performance Type
export interface BusinessPerformance {
  id: string;
  name: string;
  calls: number;
  whatsapp: number;
  shares: number;
  views: number;
  total: number;
}

// Live Feed Item Type
export interface LiveFeedItem {
  id?: string;
  type: 'visit' | 'interaction';
  time: string;
  user_name?: string;
  device_id?: string;
  page_path?: string;
  event_type?: 'view' | 'call' | 'whatsapp' | 'share';
  business_id?: string;
  business_name?: string;
}
