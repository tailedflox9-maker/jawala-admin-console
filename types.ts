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
  last_updated: string;
}

export interface VisitLog {
  id?: string;
  device_id: string;
  user_name?: string;
  visited_at?: string;
  page_path?: string;
}