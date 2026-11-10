import { notFound } from 'next/navigation';
import CategoriaStock from '../../componentes/CategoriaStock';
import { categorias, getCategoria } from '../../dados/categorias';

export function generateStaticParams() {
  return categorias.map((c) => ({ slug: c.slug }));
}

export default async function PaginaCategoria({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categoria = getCategoria(slug);

  if (!categoria) notFound();

  return (
    <CategoriaStock
      key={categoria.slug}
      titulo={categoria.titulo}
      mascote={categoria.mascote}
      filtros={categoria.filtros}
      produtos={categoria.produtos}
    />
  );
}