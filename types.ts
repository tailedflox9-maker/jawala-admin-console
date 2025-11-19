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
  business_name?: string; // Added this
  event_type: 'view' | 'call' | 'whatsapp' | 'share';
  created_at: string;
}
