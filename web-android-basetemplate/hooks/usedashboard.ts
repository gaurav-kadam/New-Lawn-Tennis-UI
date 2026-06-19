import { useEffect, useState } from 'react';
import dashboardService from '../services/dashboard/dashboard.service';

// Interface matching the FastAPI payload structure
export interface ModuleStats {
  active: number;
  inactive: number;
  total: number;
}

export interface DashboardData {
  tournament: ModuleStats;
  team: ModuleStats;
  official: ModuleStats;
  match: ModuleStats;
  player: ModuleStats; // Added player stats
}

export const useDashboard = () => {
  
  const [stats, setStats] = useState<DashboardData>({
    tournament: { active: 0, inactive: 0, total: 0 },
    team: { active: 0, inactive: 0, total: 0 },
    official: { active: 0, inactive: 0, total: 0 },
    match: { active: 0, inactive: 0, total: 0 },
    player: { active: 0, inactive: 0, total: 0 },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await dashboardService.getDashboardSummary();
      
      // Handle base axios wrapper nesting structures cleanly
      const result = response.data || response;
      
     
      if (result && result.data) {
        setStats(result.data);
      } else if (result && result.tournament) {
        
        setStats(result as DashboardData);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong while fetching dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardStats();
  }, []);

  return {
    stats,
    loading,
    error,
    reload: loadDashboardStats,
  };
};