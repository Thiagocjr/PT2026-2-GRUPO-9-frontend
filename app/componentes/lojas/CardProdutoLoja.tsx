'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Package } from 'lucide-react';
import type { ProdutoLoja } from '@/src/types/loja';

const formatPrice = (price: number | string) => Number(price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function CardProdutoLoja({ product }: { product: ProdutoLoja }) {
  const [imageError, setImageError] = useState(false);
  const image = product.images[0]?.imageUrl;

  return (
    <article className="flex h-[310px] w-full min-w-0 flex-col rounded-[28px] bg-white p-4 sm:rounded-[35px] sm:p-5">
      <div className="relative mx-auto h-[180px] w-full shrink-0 sm:h-[190px] sm:max-w-[190px]">
        {image && !imageError ? (
          <Image src={image} alt={product.name} fill unoptimized sizes="(max-width: 640px) 45vw, 190px" onError={() => setImageError(true)} className="object-contain" />
        ) : (
          <div className="grid h-full place-items-center rounded-xl bg-[#f6f3e4] text-purple-600/50"><Package className="h-10 w-10" strokeWidth={1.5} /></div>
        )}
      </div>
      <h3 className="mt-1 truncate text-lg font-medium text-black sm:mt-0 sm:text-[26px]">{product.name}</h3>
      <p className="mt-1 text-base text-black sm:text-[23px]">{formatPrice(product.price)}</p>
      <p className={`mt-1 text-[11px] font-medium sm:text-[14px] ${product.stock > 0 ? 'text-[#c6e700]' : 'text-[#af052a]'}`}>
        {product.stock > 0 ? 'DISPONÍVEL' : 'INDISPONÍVEL'}
      </p>
    </article>
  );
}
