import ApiService from '../api/api.service';

export type TeamPayload = {
  teamName: string;
  shortName: string;
  gender: string;
  state: string;
  city: string;
  section: string;
  headCoach: string;
  coach: string;
  manager: string;
};

class TeamService {
  async getTeams(params?: Record<string, any>) {
    return ApiService.get('/teams', params);
  }

  async getTeamById(id: number) {
    return ApiService.get(`/team/${id}`);
  }

  async getPlayersByTeamCode(
    teamCode: string
  ) {
    return ApiService.get(
      `/team/code/${teamCode}/players`
    );
  }

  async createTeam(data: TeamPayload) {
    const payload = {
      team_name: data.teamName,
      short_name: data.shortName,
      gender: data.gender,
      state: data.state,
      city: data.city,
      section: data.section,
      head_coach: data.headCoach,
      coach: data.coach,
      manager: data.manager,
    };

    return ApiService.post(
      '/team',
      payload
    );
  }

  async updateTeam(
    id: number,
    data: TeamPayload
  ) {
    const payload = {
      team_name: data.teamName,
      short_name: data.shortName,
      gender: data.gender,
      state: data.state,
      city: data.city,
      section: data.section,
      head_coach: data.headCoach,
      coach: data.coach,
      manager: data.manager,
    };

    return ApiService.put(
      `/team/${id}`,
      payload
    );
  }

  async deleteTeam(id: number) {
    return ApiService.delete(
      `/team/${id}`
    );
  }
}

export default new TeamService();