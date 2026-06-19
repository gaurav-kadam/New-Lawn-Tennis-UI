export interface Match {
  id: number;
  match_date: string;
  match_time: string;
  court_no: string;
  match_no: string;
  age_category: string;
  gender: string;
  tournament_code: string | null;
  white_team: string;
  blue_team: string;
  white_team_id: number | null; 
  blue_team_id: number | null;  
  digital_scorer_id: number | null;
  referee_1_id: number | null;
  referee_2_id: number | null;
  // 🌟 Added new structural types
  goaljudge_1_id: number | null;
  goaljudge_2_id: number | null;
  timekeeper_1_id: number | null;
  timekeeper_2_id: number | null;
  is_active: boolean;
}