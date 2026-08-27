import { useCallback, useEffect, useState } from 'react';

import tournamentService from '../services/tournament/tournamment.service';
import teamService from '../services/team/team.service';
import officialService from '../services/official/official.service';
import matchService from '../services/match/match.service';

// Types
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
  player: ModuleStats;
}

// DEFAULT STATS

const emptyStats = (): ModuleStats => ({
  active: 0,
  inactive: 0,
  total: 0,
});


// RESPONSE TOTAL HELPER

const getTotal = (response: any): number => {
  return Number(
    response?.data?.total ??
    response?.total ??
    response?.data?.data?.total ??
    response?.data?.items?.total ??
    0
  );
};


// DASHBOARD HOOK

export const useDashboard = () => {

  const [stats, setStats] = useState<DashboardData>({
    tournament: emptyStats(),
    team: emptyStats(),
    official: emptyStats(),
    match: emptyStats(),
    player: emptyStats(),
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');


  // LOAD DASHBOARD

  const loadDashboardStats = useCallback(async () => {

    try {

      setLoading(true);
      setError('');


  // FETCH ALL REQUIRED COUNTS

      const [

        activeTournaments,
        inactiveTournaments,

        activeTeams,
        inactiveTeams,

        activeOfficials,
        inactiveOfficials,

        activeMatches,
        completedMatches,

      ] = await Promise.all([

        tournamentService.getTournaments({
          skip: 0,
          limit: 1,
          is_active: true,
        }),

        tournamentService.getTournaments({
          skip: 0,
          limit: 1,
          is_active: false,
        }),

        teamService.getTeams({
          skip: 0,
          limit: 1,
          is_active: true,
        }),

        teamService.getTeams({
          skip: 0,
          limit: 1,
          is_active: false,
        }),

        officialService.getOfficials({
          page: 1,
          page_size: 1,
          is_active: true,
        }),

        officialService.getOfficials({
          page: 1,
          page_size: 1,
          is_active: false,
        }),

        matchService.getMatches({
          skip: 0,
          limit: 1,
          is_complete: false,
        }),

        matchService.getMatches({
          skip: 0,
          limit: 1,
          is_complete: true,
        }),

      ]);
      
      const tournamentActive =
        getTotal(activeTournaments);

      const tournamentInactive =
        getTotal(inactiveTournaments);


      const teamActive =
        getTotal(activeTeams);

      const teamInactive =
        getTotal(inactiveTeams);


      const officialActive =
        getTotal(activeOfficials);

      const officialInactive =
        getTotal(inactiveOfficials);


      const matchActive =
        getTotal(activeMatches);

      const matchCompleted =
        getTotal(completedMatches);


      // SET DASHBOARD DATA
      setStats({

        tournament: {
          active: tournamentActive,
          inactive: tournamentInactive,
          total:
            tournamentActive +
            tournamentInactive,
        },

        team: {
          active: teamActive,
          inactive: teamInactive,
          total:
            teamActive +
            teamInactive,
        },

        official: {
          active: officialActive,
          inactive: officialInactive,
          total:
            officialActive +
            officialInactive,
        },

        match: {
          active: matchActive,
          inactive: matchCompleted,
          total:
            matchActive +
            matchCompleted,
        },

        player: emptyStats(),

      });

    } catch (err: any) {

      console.error(
        'Dashboard loading error:',
        err
      );

      setError(
        err?.response?.data?.detail ||
        err?.message ||
        'Something went wrong while fetching dashboard data'
      );

    } finally {

      setLoading(false);

    }

  }, []);
  useEffect(() => {
    loadDashboardStats();
  }, [loadDashboardStats]);

  return {
    stats,
    loading,
    error,
    reload: loadDashboardStats,
  };
};