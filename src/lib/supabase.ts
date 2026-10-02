import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://akqfhcektpckmfpypqsz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrcWZoY2VrdHBja21mcHlwcXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzOTQ5NjgsImV4cCI6MjA5Nzk3MDk2OH0.RC_NyLCm0JBlDTpWt2uYH2Gp16dzUuPuYcLVSxr9S1A";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Location types
export interface State {
  id: number;
  name: string;
  code: string;
  type: 'state' | 'union_territory';
}

export interface District {
  id: number;
  state_id: number;
  name: string;
  code: string | null;
}

export interface Mandal {
  id: number;
  district_id: number;
  name: string;
  type: string;
}

export interface Village {
  id: number;
  mandal_id: number;
  name: string;
  population: number | null;
}

// Database types
export interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  village: string | null;
  zone_id: string;
  user_type: 'farmer' | 'laborer' | 'dealer' | 'owner';
  state_id: number | null;
  district_id: number | null;
  mandal_id: number | null;
  village_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface EquipmentListing {
  id: string;
  user_id: string;
  zone_id: string;
  name: string;
  specs: string | null;
  price_per_hour: number;
  available: boolean;
  contact_phone: string | null;
  state_id: number | null;
  district_id: number | null;
  mandal_id: number | null;
  village_id: number | null;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  states?: State;
  districts?: District;
  mandals?: Mandal;
  villages?: Village;
}

export interface LaborListing {
  id: string;
  user_id: string;
  zone_id: string;
  skills: string[];
  rate_per_day: number;
  age: number | null;
  available: boolean;
  state_id: number | null;
  district_id: number | null;
  mandal_id: number | null;
  village_id: number | null;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  states?: State;
  districts?: District;
  mandals?: Mandal;
  villages?: Village;
}

export interface InfrastructureListing {
  id: string;
  user_id: string;
  zone_id: string;
  infra_type: 'drying_yard' | 'tubewell';
  name: string;
  village: string;
  capacity: number;
  current_usage: number;
  unit: string;
  pipe_size: string | null;
  price_info: string | null;
  available: boolean;
  state_id: number | null;
  district_id: number | null;
  mandal_id: number | null;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  states?: State;
  districts?: District;
  mandals?: Mandal;
}

export interface CropListing {
  id: string;
  user_id: string;
  zone_id: string;
  crop_name: string;
  quantity: number;
  price_per_quintal: number;
  village: string;
  verified: boolean;
  status: 'available' | 'sold' | 'withdrawn';
  state_id: number | null;
  district_id: number | null;
  mandal_id: number | null;
  village_id: number | null;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  states?: State;
  districts?: District;
  mandals?: Mandal;
  villages?: Village;
}

export interface AgroProduct {
  id: string;
  user_id: string;
  zone_id: string;
  product_name: string;
  product_type: string;
  price: number;
  stock: number;
  max_stock: number;
  state_id: number | null;
  district_id: number | null;
  mandal_id: number | null;
  village_id: number | null;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  states?: State;
  districts?: District;
  mandals?: Mandal;
  villages?: Village;
}

export interface Grievance {
  id: string;
  user_id: string;
  zone_id: string;
  title: string;
  description: string;
  category: string;
  village: string;
  votes: number;
  status: 'open' | 'in_progress' | 'resolved';
  state_id: number | null;
  district_id: number | null;
  mandal_id: number | null;
  village_id: number | null;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  states?: State;
  districts?: District;
  mandals?: Mandal;
  villages?: Village;
}
