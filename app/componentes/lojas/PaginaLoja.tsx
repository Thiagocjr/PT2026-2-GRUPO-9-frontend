'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { League_Spartan } from 'next/font/google';
import Header from '../Header';
import BannerLoja from './BannerLoja';
import CardProdutoLoja from './CardProdutoLoja';
import CardAvaliacao from '../avaliacoes/CardAvaliacao';
import ResumoAvaliacoes from '../avaliacoes/ResumoAvaliacoes';
import { listarAvaliacoesLoja } from '@/src/services/avaliacoesService';
import { listarProdutosDaLoja, obterLoja } from '@/src/services/lojasService';
import { useSessaoLoja } from '@/src/hooks/useSessaoLoja';
import type { AvaliacaoLoja, RespostaAvaliacoesLoja } from '@/src/types/avaliacoes';
import type { LojaPublica, ProdutoLoja } from '@/src/types/loja';

const PAGE_SIZE = 15;
const leagueSpartan = League_Spartan({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] });

type Loaded<T> = { storeId: number; data: T };

export default function PaginaLoja({ storeId }: { storeId: number }) {
  const [storeResult, setStoreResult] = useState<Loaded<LojaPublica> | null>(null);
  const [productsResult, setProductsResult] = useState<Loaded<ProdutoLoja[]> | null>(null);
  const [ratingsResult, setRatingsResult] = useState<Loaded<RespostaAvaliacoesLoja> | null>(null);
  const [storeErrorId, setStoreErrorId] = useState<number | null>(null);
  const [productsErrorId, setProductsErrorId] = useState<number | null>(null);
  const [ratingsErrorId, setRatingsErrorId] = useState<number | null>(null);
  const [pageState, setPageState] = useState({ storeId: 0, page: 1 });
  const { authenticated, isOwner } = useSessaoLoja(storeResult?.storeId === storeId ? storeResult.data.ownerId : undefined);

  useEffect(() => {
    let active = true;
    obterLoja(storeId).then((data) => { if (active) setStoreResult({ storeId, data }); }).catch(() => { if (active) setStoreErrorId(storeId); });
    listarProdutosDaLoja(storeId).then((data) => { if (active) setProductsResult({ storeId, data }); }).catch(() => { if (active) setProductsErrorId(storeId); });
    listarAvaliacoesLoja(storeId).then((data) => { if (active) setRatingsResult({ storeId, data }); }).catch(() => { if (active) setRatingsErrorId(storeId); });
    return () => { active = false; };
  }, [storeId]);

  const store = storeResult?.storeId === storeId ? storeResult.data : null;
  const products = productsResult?.storeId === storeId ? productsResult.data : null;
  const ratingResponse = ratingsResult?.storeId === storeId ? ratingsResult.data : null;
  const reviews = ratingResponse?.ratings ?? null;
  const storeError = storeErrorId === storeId;
  const productsError = productsErrorId === storeId;
  const ratingsError = ratingsErrorId === storeId;

  const chronologicalProducts = useMemo(() => [...(products ?? [])].sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt) || a.id - b.id), [products]);
  const bestRatedProducts = useMemo(() => chronologicalProducts
    .filter((product) => product.ratingCount > 0 && product.averageRating !== null)
    .sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0) || Date.parse(a.createdAt) - Date.parse(b.createdAt) || a.id - b.id), [chronologicalProducts]);
  const pageCount = Math.max(1, Math.ceil(chronologicalProducts.length / PAGE_SIZE));
  const currentPage = pageState.storeId === storeId ? Math.min(pageState.page, pageCount) : 1;
  const visibleProducts = chronologicalProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const average = reviews?.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;

  return (
    <main className={`${leagueSpartan.className} min-h-screen bg-black text-white`}>
      <Header variant={authenticated ? 'authenticated' : 'guest'} />
      {store ? <BannerLoja store={store} isOwner={isOwner} showDetails /> : (
        <section className="grid h-[360px] place-items-center bg-[#171717] text-white sm:h-[440px] lg:h-[539px]">
          {storeError ? <p role="alert">Não foi possível carregar esta loja.</p> : <p>Carregando loja...</p>}
        </section>
      )}

      <section className="bg-black pb-12 pt-12">
        <h2 className="text-center text-4xl sm:text-[54px]">Reviews e Comentários</h2>
        {ratingsError ? <p role="alert" className="mt-8 text-center">Não foi possível carregar as avaliações.</p> : reviews === null ? <p className="mt-8 text-center">Carregando avaliações...</p> : reviews.length ? (
          <ResumoAvaliacoes average={average} count={reviews.length} />
        ) : <p className="mt-8 text-center text-white/70">Esta loja ainda não possui avaliações.</p>}
        <div className="mx-auto mt-6 flex max-w-[1212px] justify-end px-4 sm:px-0">
          <Link href={`/lojas/${storeId}/avaliacoes`} className="text-lg text-[#8a38f5] hover:underline">Mostrar mais</Link>
        </div>
        {reviews && reviews.length > 0 && (
          <div className="mt-3 overflow-x-auto overflow-y-hidden">
            <div className="mx-auto flex w-max gap-[30px] px-4 pb-4 sm:mx-0 sm:px-[calc((100vw-1212px)/2)]">
              {reviews.slice(0, 6).map((review: AvaliacaoLoja) => (
                <div className="w-[min(930px,calc(100vw-32px))] shrink-0" key={review.id}><CardAvaliacao review={review} /></div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="bg-[#d9d9d9] py-10 text-black">
        <div className="mx-auto max-w-[1212px] px-4">
          <div className="flex items-baseline gap-3">
            <h2 className="text-3xl font-medium sm:text-[36px]">Produtos</h2>
            <span className="text-sm font-medium sm:text-base">melhor avaliados</span>
            <a href="#catalogo" className="ml-auto text-sm font-medium text-[#6a38f3] hover:underline">ver mais</a>
          </div>
          {productsError ? <p role="alert" className="py-12 text-center">Não foi possível carregar os produtos.</p> : products === null ? <p className="py-12 text-center">Carregando produtos...</p> : bestRatedProducts.length ? (
            <div className="mt-6 overflow-x-auto overflow-y-hidden">
              <div className="flex w-max gap-8 pb-3">
                {bestRatedProducts.map((product) => <div key={product.id} className="w-[229px] shrink-0"><CardProdutoLoja product={product} /></div>)}
              </div>
            </div>
          ) : <p className="py-12 text-center">Ainda não há produtos avaliados nesta loja.</p>}
        </div>
      </section>

      <section id="catalogo" className="scroll-mt-6 bg-[#d9d9d9] pb-10 pt-6 text-black">
        <div className="mx-auto max-w-[1212px] px-4">
          <div className="flex items-baseline gap-3">
            <h2 className="text-3xl font-medium sm:text-[36px]">Produtos</h2>
            {store && <span className="text-sm font-medium sm:text-base">de {store.name}</span>}
            <a href="#catalogo" className="ml-auto text-sm font-medium text-[#6a38f3] hover:underline">ver mais</a>
          </div>
          {productsError ? <p role="alert" className="py-12 text-center">Não foi possível carregar os produtos.</p> : products === null ? <p className="py-12 text-center">Carregando produtos...</p> : chronologicalProducts.length ? (
            <>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-5">
                {visibleProducts.map((product) => <CardProdutoLoja key={product.id} product={product} />)}
              </div>
              {pageCount > 1 && (
                <nav aria-label="Paginação de produtos" className="mt-8 flex items-center justify-center gap-5 text-2xl">
                  <button type="button" aria-label="Página anterior" disabled={currentPage === 1} onClick={() => setPageState({ storeId, page: currentPage - 1 })} className="disabled:opacity-40"><ChevronLeft aria-hidden="true" /></button>
                  {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                    <button key={page} type="button" aria-current={currentPage === page ? 'page' : undefined} onClick={() => setPageState({ storeId, page })} className={currentPage === page ? 'font-semibold' : ''}>{page}</button>
                  ))}
                  <button type="button" aria-label="Próxima página" disabled={currentPage === pageCount} onClick={() => setPageState({ storeId, page: currentPage + 1 })} className="disabled:opacity-40"><ChevronRight aria-hidden="true" /></button>
                </nav>
              )}
            </>
          ) : <p className="py-12 text-center">Esta loja ainda não possui produtos.</p>}
        </div>
      </section>
    </main>
  );
}
