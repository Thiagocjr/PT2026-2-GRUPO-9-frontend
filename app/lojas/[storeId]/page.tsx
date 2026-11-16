import { Suspense } from 'react';
import PaginaLoja from '../../componentes/lojas/PaginaLoja';

async function PageContent({ params }: { params: Promise<{ storeId: string }> }) {
  const { storeId } = await params;
  const parsedStoreId = Number(storeId);
  if (!Number.isInteger(parsedStoreId) || parsedStoreId < 1) {
    return <main className="grid min-h-screen place-items-center bg-black text-white">Loja não encontrada.</main>;
  }
  return <PaginaLoja storeId={parsedStoreId} />;
}

export default function Page({ params }: { params: Promise<{ storeId: string }> }) {
  return <Suspense fallback={<main className="grid min-h-screen place-items-center bg-black text-white">Carregando loja...</main>}><PageContent params={params} /></Suspense>;
}
