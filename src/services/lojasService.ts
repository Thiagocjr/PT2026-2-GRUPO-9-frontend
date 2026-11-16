import { api } from './api';
import type { LojaPublica, ProdutoLoja } from '../types/loja';

export async function obterLoja(storeId: number): Promise<LojaPublica> {
  const response = await api.get<LojaPublica>(`/stores/${storeId}`);
  return response.data;
}

export async function listarProdutosDaLoja(storeId: number): Promise<ProdutoLoja[]> {
  const response = await api.get<ProdutoLoja[]>(`/stores/${storeId}/products`);
  return response.data;
}
