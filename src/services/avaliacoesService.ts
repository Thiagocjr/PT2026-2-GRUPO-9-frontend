import { api } from './api';
import type { RespostaAvaliacoesLoja } from '../types/avaliacoes';

export async function listarAvaliacoesLoja(storeId: number): Promise<RespostaAvaliacoesLoja> {
  const response = await api.get<RespostaAvaliacoesLoja>(`/stores/${storeId}/ratings`);
  return response.data;
}
