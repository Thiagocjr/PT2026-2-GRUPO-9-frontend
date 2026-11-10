import { notFound } from 'next/navigation';
import CategoriaStock from './CategoriaStock';
import { getCategoria } from '../dados/categorias';

export default function PaginaCategoria({
  slug,
  logado = false,
}: {
  slug: string;
  logado?: boolean;
}) {
  const categoria = getCategoria(slug);

  if (!categoria) notFound();

  return (
    <CategoriaStock
      key={`${logado}-${categoria.slug}`}
      titulo={categoria.titulo}
      mascote={categoria.mascote}
      filtros={categoria.filtros}
      produtos={categoria.produtos}
      logado={logado}
    />
  );
}