export interface Tournament {
  id?: number;
  tournament_name: string;
  start_date: string;
  end_date: string;
  state: string;
  city: string;
  venue: string;
  section: string;
  gender: string;
  is_active?: boolean;
  tournament_code?: string;
}