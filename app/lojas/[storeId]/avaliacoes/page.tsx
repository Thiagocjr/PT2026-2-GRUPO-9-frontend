import { Suspense } from 'react';
import AvaliacoesLoja from '../../../componentes/avaliacoes/AvaliacoesLoja';

async function PageContent({ params }: { params: Promise<{ storeId: string }> }) {
  const { storeId } = await params;
  const parsedStoreId = Number(storeId);
  if (!Number.isInteger(parsedStoreId) || parsedStoreId < 1) {
    return <main className="grid min-h-screen place-items-center bg-black text-white">Loja não encontrada.</main>;
  }
  return <AvaliacoesLoja storeId={parsedStoreId} />;
}

export default function Page({ params }: { params: Promise<{ storeId: string }> }) {
  return <Suspense fallback={<main className="grid min-h-screen place-items-center bg-black text-white">Carregando avaliações...</main>}><PageContent params={params} /></Suspense>;
}
