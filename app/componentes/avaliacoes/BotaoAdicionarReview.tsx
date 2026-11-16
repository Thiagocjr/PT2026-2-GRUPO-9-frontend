import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['400'] });

export default function BotaoAdicionarReview({ onAddReview }: { onAddReview?: () => void }) {
  return (
    <div className="mx-auto mt-12 w-full max-w-[930px]">
      <button
        type="button"
        disabled={!onAddReview}
        onClick={onAddReview}
        aria-label="Adicionar Review (funcionalidade futura)"
        aria-describedby="review-future-status"
        className={`${inter.className} h-[59px] w-full rounded-full bg-[#6a38f3] text-2xl text-white shadow-[0_7px_7px_rgba(0,0,0,0.25)] disabled:cursor-not-allowed disabled:opacity-75 sm:text-[42px]`}
      >
        Adicionar Review
      </button>
      <p id="review-future-status" className="mt-2 text-center text-sm text-white/70">
        Funcionalidade ainda não disponível.
      </p>
    </div>
  );
}
