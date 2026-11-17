import Image from 'next/image';

type Props = {
  onEditStore?: () => void;
  onAddProduct?: () => void;
};

export default function ControlesProprietario({ onEditStore, onAddProduct }: Props) {
  return (
    <div className="absolute right-[8%] top-[54px] z-10 flex flex-col gap-3">
      <button
        type="button"
        disabled={!onEditStore}
        onClick={onEditStore}
        aria-label="Editar imagens da loja (funcionalidade futura)"
        title="Editar imagens da loja — funcionalidade futura"
        className="h-[45px] w-[45px] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <Image src="/avaliacoes/edit-store.svg" alt="" width={45} height={45} />
      </button>
      <button
        type="button"
        disabled={!onAddProduct}
        onClick={onAddProduct}
        aria-label={onAddProduct ? 'Adicionar produto' : 'Adicionar produto (funcionalidade futura)'}
        title={onAddProduct ? 'Adicionar produto' : 'Adicionar produto — funcionalidade futura'}
        className="h-[45px] w-[45px] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <Image src="/avaliacoes/add-product.svg" alt="" width={45} height={45} />
      </button>
    </div>
  );
}
