import { Platform } from 'react-native';
import ApiService from '../api/api.service';

class TeamService {

  async getTeams() {
    return ApiService.get('/teams');
  }

  async getTeamById(id: number) {
    return ApiService.get(`/teams/${id}`);
  }

  async createTeam(data: any) {
    const formData = new FormData();
    
    // 1. Map camelCase properties to backend's snake_case schema expectation
    const teamPayload = {
      team_name: data.teamName,
      short_name: data.shortName,
      gender: data.gender,
      state: data.state,
      city: data.city,
      section: data.section,
      head_coach: data.headCoach,
      coach: data.coach,
      manager: data.manager
    };

    // 2. Append stringified team payload dictionary into form text field
    formData.append('team_data_str', JSON.stringify(teamPayload));
    
    // 3. Append the real binary file stream wrapper object
    if (data.playerFile) {
      const file = data.playerFile;
      
      if (Platform.OS === 'web') {
        // Web environments use native file/blob handles directly
        const webFile = file.output?.[0] || file.file || file;
        formData.append('file', webFile, file.name || 'players_list.xlsx');
      } else {
        // Mobile platform asset payload normalization
        const fileUri = Platform.OS === 'android' ? file.uri : file.uri.replace('file://', '');
        
        // ✅ FIX: Safely extract mimeType fallback property layout matching expo-document-picker schema
        const fileType = file.type || file.mimeType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

        formData.append('file', {
          uri: fileUri,
          name: file.name || 'players_list.xlsx',
          type: fileType,
        } as any);
      }
    }

    // 4. Fire standard multi-part payload request
    // Axios naturally configures multipart multi-boundaries when it receives a FormData payload object
    return ApiService.post('/teams', formData);
  }

  async updateTeam(id: number, data: any) {
    const payload = {
      team_name: data.teamName,
      short_name: data.shortName,
      gender: data.gender,
      state: data.state,
      city: data.city,
      section: data.section,
      head_coach: data.headCoach,
      coach: data.coach,
      manager: data.manager
    };
    return ApiService.put(`/teams/${id}`, payload);
  }

  async deleteTeam(id: number) {
    return ApiService.delete(`/teams/${id}`);
  }
}

export default new TeamService();