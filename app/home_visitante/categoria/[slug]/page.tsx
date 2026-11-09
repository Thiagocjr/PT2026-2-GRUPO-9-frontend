import PaginaCategoria from '../../../componentes/Paginacategoria';
import { categorias } from '../../../dados/categorias';

export function generateStaticParams() {
  return categorias.map((c) => ({ slug: c.slug }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PaginaCategoria slug={slug} />;
}