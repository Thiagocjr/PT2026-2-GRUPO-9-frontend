'use client';

import { useState } from 'react';
import type { AvaliacaoLoja } from '@/src/types/avaliacoes';
import Estrelas from './Estrelas';

export default function CardAvaliacao({ review }: { review: AvaliacaoLoja }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <article className="grid min-h-[205px] grid-cols-[100px_1fr] gap-x-5 rounded-[28px] bg-[#f6f3e4] p-5 text-black sm:grid-cols-[154px_1fr] sm:gap-x-6 sm:px-[30px] sm:py-[26px]">
      {review.user.profilePictureUrl ? (
        <div aria-hidden="true" className="row-span-2 h-24 w-24 rounded-full bg-cover bg-center sm:h-[154px] sm:w-[154px]" style={{ backgroundImage: `url("${review.user.profilePictureUrl}")` }} />
      ) : (
        <div className="row-span-2 grid h-24 w-24 place-items-center rounded-full bg-[#d9d2b8] text-2xl text-white sm:h-[154px] sm:w-[154px]" aria-hidden="true">{review.user.name.slice(0, 1).toUpperCase()}</div>
      )}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-xl font-medium sm:text-[28px]">{review.user.name}</h2>
        <Estrelas value={review.rating} size={22} />
      </div>
      <div className="min-w-0">
        <p className={expanded ? 'text-base sm:text-xl' : 'line-clamp-3 text-base sm:text-xl'}>{review.comment || 'Avaliação sem comentário.'}</p>
        {review.comment && review.comment.length > 130 && (
          <button type="button" onClick={() => setExpanded((current) => !current)} className="mt-1 text-[#8a38f5] hover:underline">
            {expanded ? 'ver menos' : 'ver mais'}
          </button>
        )}
      </div>
    </article>
  );
}
