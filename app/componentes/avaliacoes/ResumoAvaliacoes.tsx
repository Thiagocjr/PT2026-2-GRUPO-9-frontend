import Estrelas from './Estrelas';

export default function ResumoAvaliacoes({ average, count }: { average: number; count: number }) {
  return (
    <div className="mt-8 text-center">
      <p className="text-6xl sm:text-[76px]">{average.toFixed(2)}</p>
      <Estrelas value={average} size={48} />
      <p className="mt-1 text-sm text-white/70">{count} {count === 1 ? 'avaliação' : 'avaliações'}</p>
    </div>
  );
}
