import { Package } from 'lucide-react';

export default function CardProdutoReservado() {
  return (
    <div
      aria-hidden="true"
      className="flex h-[230px] flex-col rounded-[28px] border-2 border-dashed border-[#B9A7F5]/50 bg-white/60 p-4 sm:h-[245px]"
    >
      <div className="flex h-11 justify-end">
        <span className="h-11 w-11 rounded-full bg-[#F3EEDC]" />
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center text-[#B9A7F5]/70">
        <Package className="h-10 w-10" strokeWidth={1.5} />
      </div>

      <div className="mt-3 space-y-1.5">
        <span className="block h-3.5 w-3/4 rounded-full bg-[#F3EEDC]" />
        <span className="block h-3 w-1/2 rounded-full bg-[#F3EEDC]" />
        <span className="block h-2 w-1/4 rounded-full bg-[#F3EEDC]" />
      </div>
    </div>
  );
}