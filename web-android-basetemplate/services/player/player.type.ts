export interface Player {
  id?: number;
  player_code?: string;
  player_name?: string;

  age?: number | null;
  gender?: string;

  weight?: number | null;
  category?: string | null;

  state?: string;
  city?: string;

  mobile?: string | null;
  ranking?: number | null;

  is_active?: boolean;

  created_at?: string;
  updated_at?: string;
}

export interface PlayerCreatePayload {
  player_name: string;
  age?: number | null;
  gender: string;
  weight?: number | null;
  category?: string | null;
  state: string;
  city: string;
  mobile?: string | null;
  ranking?: number | null;
}

export interface PlayerUpdatePayload {
  player_name?: string;
  age?: number | null;
  gender?: string;
  weight?: number | null;
  category?: string | null;
  state?: string;
  city?: string;
  mobile?: string | null;
  ranking?: number | null;
  is_active?: boolean;
}