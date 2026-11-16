'use client';

import { useEffect, useState } from 'react';
import Header from '../Header';
import { listarAvaliacoesLoja } from '@/src/services/avaliacoesService';
import type { RespostaAvaliacoesLoja } from '@/src/types/avaliacoes';
import { League_Spartan } from 'next/font/google';
import BotaoAdicionarReview from './BotaoAdicionarReview';
import BannerLoja from '../lojas/BannerLoja';
import CardAvaliacao from './CardAvaliacao';
import ResumoAvaliacoes from './ResumoAvaliacoes';
import { useSessaoLoja } from '@/src/hooks/useSessaoLoja';

const leagueSpartan = League_Spartan({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] });

export default function AvaliacoesLoja({ storeId }: { storeId: number }) {
  const [result, setResult] = useState<{ storeId: number; data: RespostaAvaliacoesLoja } | null>(null);
  const [failedStoreId, setFailedStoreId] = useState<number | null>(null);
  useEffect(() => {
    let active = true;
    listarAvaliacoesLoja(storeId).then((data) => { if (active) setResult({ storeId, data }); }).catch(() => { if (active) setFailedStoreId(storeId); });
    return () => { active = false; };
  }, [storeId]);
  const data = result?.storeId === storeId ? result.data : null;
  const error = failedStoreId === storeId;
  const store = data?.store;
  const reviews = data?.ratings;
  const { authenticated, isOwner } = useSessaoLoja(store?.ownerId);
  const average = reviews?.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  return <main className={`${leagueSpartan.className} min-h-screen bg-black text-white`}>
    <Header variant={authenticated ? 'authenticated' : 'guest'} />
    {store ? <BannerLoja store={store} isOwner={isOwner} /> : <section className="h-[539px] bg-[#171717]" />}
    <section className="mx-auto min-h-[1845px] max-w-[1440px] px-5 pb-20 pt-12 sm:px-8 lg:px-0">
      <h2 className="text-center text-4xl sm:text-[54px]">Reviews e Comentários</h2>
      {reviews && reviews.length > 0 && <ResumoAvaliacoes average={average} count={reviews.length} />}
      {authenticated && <BotaoAdicionarReview />}
      <div className="mx-auto mt-12 flex w-full max-w-[930px] flex-col gap-[45px]">
        {data === null && !error && <p className="py-12 text-center">Carregando avaliações...</p>}
        {error && <p role="alert" className="py-12 text-center">Não foi possível carregar as avaliações desta loja.</p>}
        {reviews?.length === 0 && <p className="py-12 text-center">Esta loja ainda não possui avaliações.</p>}
        {reviews?.map((review) => <CardAvaliacao key={review.id} review={review} />)}
      </div>
    </section>
  </main>;
}
