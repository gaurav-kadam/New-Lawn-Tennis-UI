

export interface Team {
  id?: number;
  team_code?: string;
  team_name: string;
  short_name: string;
  gender: string;
  state: string;
  city: string;
  section: string;
  head_coach: string;
  coach: string;
  manager: string;
  player_file?: string | null;
  is_active?: boolean;
}