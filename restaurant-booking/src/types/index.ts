export type ReservationStatus = 'pending_deposit' | 'confirmed' | 'modification_requested' | 'cancelled';

export interface Room {
  id: string;
  slug: string;
  name: string;
  description: string;
  long_description: string | null;
  capacity_min: number;
  capacity_max: number;
  base_price_cents: number;
  price_per_guest_cents: number;
  deposit_cents: number;
  room_type: string;
  facilities: string[];
  accessibility: string[];
  food_beverage_options: string[];
  image_urls: string[];
  preparation_minutes: number;
  cleaning_minutes: number;
  is_active: boolean;
}

export interface Reservation {
  id: string;
  reference: string;
  room_id: string;
  reservation_date: string;
  start_time: string;
  end_time: string;
  guests: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  special_requests: string | null;
  total_price_cents: number;
  deposit_paid_cents: number;
  status: ReservationStatus;
  created_at: string;
  rooms?: Pick<Room, 'name' | 'slug'>;
}
