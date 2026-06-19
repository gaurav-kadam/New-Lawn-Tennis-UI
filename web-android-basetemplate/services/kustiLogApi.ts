const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

export type KustiLogPayload = {
  session: number;
  time: string;
  wrestler: string;
  move: string;
  points: number;
  point_type?: string;
  remarks?: string;
  red_score: number;
  blue_score: number;
};

export const createKustiLog = async (
  payload: KustiLogPayload,
  token?: string
) => {
  const response = await fetch(`${API_BASE_URL}/kusti-log`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.detail || 'Failed to save kusti log');
  }

  return data;
};