'use client';

import { useEffect, useState } from 'react';
import Header from '../Header';
import { listarAvaliacoesLoja } from '@/src/services/avaliacoesService';
import { getCurrentUser } from '@/src/services/authService';
import type { AvaliacaoLoja, RespostaAvaliacoesLoja } from '@/src/types/avaliacoes';
import { League_Spartan } from 'next/font/google';
import ControlesProprietario from './ControlesProprietario';
import BotaoAdicionarReview from './BotaoAdicionarReview';

const leagueSpartan = League_Spartan({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] });

function Stars({ value, size = 28 }: { value: number; size?: number }) {
  return <span className="inline-flex text-[#ffe500]" aria-label={`${value} de 5 estrelas`}>
    {[1, 2, 3, 4, 5].map((star) => {
      const fill = Math.max(0, Math.min(1, value - star + 1)) * 100;
      return <span key={star} style={{ fontSize: size, backgroundImage: `linear-gradient(90deg, #ffe500 ${fill}%, #666 ${fill}%)`, backgroundClip: 'text', color: 'transparent' }}>★</span>;
    })}
  </span>;
}

function ReviewCard({ review }: { review: AvaliacaoLoja }) {
  const [expanded, setExpanded] = useState(false);
  return <article className="grid min-h-[205px] grid-cols-[100px_1fr] gap-x-5 rounded-[28px] bg-[#f6f3e4] p-5 text-black sm:grid-cols-[154px_1fr] sm:gap-x-6 sm:px-[30px] sm:py-[26px]">
    {review.user.profilePictureUrl ? <div aria-hidden="true" className="row-span-2 h-24 w-24 rounded-full bg-cover bg-center sm:h-[154px] sm:w-[154px]" style={{ backgroundImage: `url("${review.user.profilePictureUrl}")` }} /> : <div className="row-span-2 grid h-24 w-24 place-items-center rounded-full bg-[#d9d2b8] text-2xl text-white sm:h-[154px] sm:w-[154px]" aria-hidden="true">{review.user.name.slice(0, 1).toUpperCase()}</div>}
    <div className="flex flex-wrap items-start justify-between gap-2">
      <h2 className="text-xl font-medium sm:text-[28px]">{review.user.name}</h2><Stars value={review.rating} size={22} />
    </div>
    <div className="min-w-0">
      <p className={expanded ? 'text-base sm:text-xl' : 'line-clamp-3 text-base sm:text-xl'}>{review.comment || 'Avaliação sem comentário.'}</p>
      {review.comment && review.comment.length > 130 && <button type="button" onClick={() => setExpanded((current) => !current)} className="mt-1 text-[#8a38f5] hover:underline">{expanded ? 'ver menos' : 'ver mais'}</button>}
    </div>
  </article>;
}

type SessionState =
  | { status: 'checking' }
  | { status: 'visitor' }
  | { status: 'authenticated'; userId: number };

export default function AvaliacoesLoja({ storeId }: { storeId: number }) {
  const [result, setResult] = useState<{ storeId: number; data: RespostaAvaliacoesLoja } | null>(null);
  const [failedStoreId, setFailedStoreId] = useState<number | null>(null);
  const [session, setSession] = useState<SessionState>({ status: 'checking' });
  useEffect(() => {
    let active = true;
    listarAvaliacoesLoja(storeId).then((data) => { if (active) setResult({ storeId, data }); }).catch(() => { if (active) setFailedStoreId(storeId); });
    return () => { active = false; };
  }, [storeId]);
  useEffect(() => {
    let active = true;
    const token = localStorage.getItem('@App:token');
    Promise.resolve(token)
      .then((storedToken) => storedToken ? getCurrentUser() : null)
      .then((user) => {
        if (active) setSession(user ? { status: 'authenticated', userId: user.id } : { status: 'visitor' });
      })
      .catch(() => { if (active) setSession({ status: 'visitor' }); });
    return () => { active = false; };
  }, []);
  const data = result?.storeId === storeId ? result.data : null;
  const error = failedStoreId === storeId;
  const store = data?.store;
  const reviews = data?.ratings;
  const authenticated = session.status === 'authenticated';
  const isOwner = authenticated && store !== undefined && session.userId === store.ownerId;
  const average = reviews?.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  return <main className={`${leagueSpartan.className} min-h-screen bg-black text-white`}>
    <Header variant={authenticated ? 'authenticated' : 'guest'} />
    <section className="relative flex h-[539px] items-center justify-center overflow-hidden bg-[#171717] bg-cover bg-center" style={store?.bannerUrl ? { backgroundImage: `linear-gradient(rgba(0,0,0,.48),rgba(0,0,0,.48)),url(${store.bannerUrl})` } : undefined}>
      {isOwner && <ControlesProprietario />}
      {store?.name && <h1 className="px-5 text-center text-5xl font-light sm:text-7xl">{store.name}</h1>}
    </section>
    <section className="mx-auto min-h-[1845px] max-w-[1440px] px-5 pb-20 pt-12 sm:px-8 lg:px-0">
      <h2 className="text-center text-4xl sm:text-[54px]">Reviews e Comentários</h2>
      {reviews && reviews.length > 0 && <div className="mt-8 text-center"><p className="text-6xl sm:text-[76px]">{average.toFixed(2)}</p><Stars value={average} size={48} /><p className="mt-1 text-sm text-white/70">{reviews.length} {reviews.length === 1 ? 'avaliação' : 'avaliações'}</p></div>}
      {authenticated && <BotaoAdicionarReview />}
      <div className="mx-auto mt-12 flex w-full max-w-[930px] flex-col gap-[45px]">
        {data === null && !error && <p className="py-12 text-center">Carregando avaliações...</p>}
        {error && <p role="alert" className="py-12 text-center">Não foi possível carregar as avaliações desta loja.</p>}
        {reviews?.length === 0 && <p className="py-12 text-center">Esta loja ainda não possui avaliações.</p>}
        {reviews?.map((review) => <ReviewCard key={review.id} review={review} />)}
      </div>
    </section>
  </main>;
}
