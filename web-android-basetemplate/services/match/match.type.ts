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
  white_team_code: string | null; 
  blue_team_code: string | null;  
  digital_scorer_code: string | null;
  referee_1_code: string | null;
  referee_2_code: string | null;
  
  // 🌟 Clean string representations matching official codes
  goaljudge_1_code: string | null;
  goaljudge_2_code: string | null;
  timekeeper_1_code: string | null;
  timekeeper_2_code: string | null;
  
  is_active: boolean;
}