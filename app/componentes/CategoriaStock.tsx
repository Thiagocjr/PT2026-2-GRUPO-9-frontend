'use client';

import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CardProdutoReservado from './CardProdutoReservado';
import { ChevronDown, ChevronLeft, ChevronRight, Package, Search, ShoppingBag, Store, User, LogOut } from 'lucide-react';

export type ProdutoCategoria = {
  id: string;
  nome: string;
  preco: number;
  disponivel: boolean;
  imagem: string;
  selo: string;
  filtro: string;
};

type Props = {
  titulo: [string, string];
  mascote: string;
  filtros: string[];
  produtos: ProdutoCategoria[];
  logado?: boolean;
  itensPorPagina?: number;
};

type Ordem = '' | 'menor' | 'maior' | 'az';

const ESPACOS_RESERVADOS = 10;

const moeda = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function CardProduto({ produto }: { produto: ProdutoCategoria }) {
  const [imagemErro, setImagemErro] = useState(false);
  const [seloErro, setSeloErro] = useState(false);

  return (
    <Link
      href={`/produtos/${produto.id}`}
      className="relative flex h-[230px] flex-col rounded-[28px] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:h-[245px]"
    >
      <div className="absolute right-2 top-2 z-10">
        {seloErro ? (
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F3EEDC] text-xs font-bold text-purple-600">
            {produto.nome.slice(0, 2).toUpperCase()}
          </span>
        ) : (
          <Image
            src={produto.selo}
            alt=""
            width={44}
            height={44}
            onError={() => setSeloErro(true)}
            className="h-11 w-11 rounded-full bg-white object-cover"
          />
        )}
      </div>
      <div className="relative min-h-0 flex-1">
        {imagemErro ? (
          <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[#F6F3E4] text-purple-600/60">
            <Package className="h-10 w-10" strokeWidth={1.5} />
          </div>
        ) : (
          <Image
            src={produto.imagem}
            alt={produto.nome}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            onError={() => setImagemErro(true)}
            className="object-contain"
          />
        )}
      </div>

      <div className="mt-3">
        <h3 className="truncate text-base font-medium text-black sm:text-lg">{produto.nome}</h3>
        <p className="text-sm text-black sm:text-base">{moeda(produto.preco)}</p>
        <span
          className={`text-[10px] font-semibold uppercase ${
            produto.disponivel ? 'text-[#A3D10F]' : 'text-red-600'
          }`}
        >
          {produto.disponivel ? 'Disponível' : 'Indisponível'}
        </span>
      </div>
    </Link>
  );
}

export default function CategoriaStock({
  titulo,
  mascote,
  filtros,
  produtos,
  logado = false,
  itensPorPagina = 15,
}: Props) {
  const router = useRouter();
  const home = logado ? '/home_logado' : '/home_visitante';
  const [busca, setBusca] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState('');
  const [ordem, setOrdem] = useState<Ordem>('');
  const [pagina, setPagina] = useState(1);
  const [mascoteSrc, setMascoteSrc] = useState(mascote);
  const topoGrade = useRef<HTMLDivElement>(null);

  function handleSair() {
    router.push('/login');
  }

  const lista = useMemo(() => {
    let resultado = produtos.filter((p) => {
      const passaFiltro = !filtroAtivo || p.filtro === filtroAtivo;
      const passaBusca = p.nome.toLowerCase().includes(busca.trim().toLowerCase());
      return passaFiltro && passaBusca;
    });

    if (ordem === 'menor') resultado = [...resultado].sort((a, b) => a.preco - b.preco);
    if (ordem === 'maior') resultado = [...resultado].sort((a, b) => b.preco - a.preco);
    if (ordem === 'az') resultado = [...resultado].sort((a, b) => a.nome.localeCompare(b.nome));

    return resultado;
  }, [produtos, filtroAtivo, busca, ordem]);

  const semProdutos = produtos.length === 0;
  const totalPaginas = Math.max(1, Math.ceil(lista.length / itensPorPagina));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const visiveis = lista.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina);

  const inicio = Math.max(1, Math.min(paginaAtual - 2, totalPaginas - 4));
  const fim = Math.min(totalPaginas, inicio + 4);
  const numeros = Array.from({ length: fim - inicio + 1 }, (_, i) => inicio + i);

  function irParaPagina(n: number) {
    setPagina(Math.min(Math.max(1, n), totalPaginas));
    topoGrade.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <main className="min-h-screen w-full bg-[#F6F3E4]">
      <section className="w-full bg-black text-white">
        <div className="mx-auto w-full max-w-[1450px] px-4 sm:px-6 lg:px-14">
          <header className="flex items-center justify-between py-5">
            <Link href={home}>
              <Image
                src="/LOGO-Stock.io.png"
                alt="Logo Stock.io"
                width={443}
                height={88}
                priority
                className="block h-auto w-[120px] object-contain sm:w-[150px] lg:w-[165px]"
              />
            </Link>

            <nav className="flex items-center gap-4 sm:gap-6">
              <Link href="/carrinho" aria-label="Sacola" className="hover:text-[#9a5cff]">
                <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" />
              </Link>
              <Link href="/lojas" aria-label="Lojas" className="hover:text-[#9a5cff]">
                <Store className="h-5 w-5 sm:h-6 sm:w-6" />
              </Link>
              {logado ? (
                <>
                  <Link href="/perfil" aria-label="Perfil" className="hover:text-[#9a5cff]">
                    <User className="h-5 w-5 sm:h-6 sm:w-6" />
                  </Link>
                  <button
                    type="button"
                    onClick={handleSair}
                    aria-label="Sair"
                    className="hover:text-[#9a5cff]"
                  >
                    <LogOut className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-xs font-semibold tracking-wide hover:text-[#9a5cff] sm:text-sm"
                  >
                    LOGIN
                  </Link>
                  <Link
                    href="/cadastro"
                    className="rounded-full bg-purple-600 px-5 py-1.5 text-xs font-bold transition hover:bg-purple-700 sm:px-10 sm:text-sm"
                  >
                    CADASTRE-SE
                  </Link>
                </>
              )}
            </nav>
          </header>
          <div className="flex flex-col items-center gap-2 md:flex-row md:items-end md:justify-center md:gap-6">
            <h1 className="self-center pb-4 pt-8 text-center text-3xl font-extrabold leading-tight sm:text-4xl md:pt-0 md:text-right lg:text-5xl xl:text-6xl">
              {titulo[0]}
              <br />
              {titulo[1]}
            </h1>
            <div className="relative mt-6 h-[320px] w-[210px] shrink-0 overflow-hidden sm:mt-8 sm:h-[400px] sm:w-[255px] lg:mt-10 lg:h-[480px] lg:w-[310px] xl:mt-12 xl:h-[540px] xl:w-[350px]">
              <Image
                src={mascoteSrc}
                onError={() => setMascoteSrc('/StockLee-Hero.png')}
                alt="Mascote da Stock.io"
                width={0}
                height={0}
                priority
                sizes="(max-width: 640px) 210px, (max-width: 1024px) 255px, 350px"
                className="absolute left-0 top-0 block h-auto w-full"
              />
            </div>
          </div>
        </div>
      </section>
      <div className="mx-auto w-full max-w-[1450px] px-4 pb-16 sm:px-6 lg:px-14">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex justify-center pt-6 md:justify-end"
        >
          <div className="relative w-full max-w-[450px]">
            <input
              type="text"
              placeholder="Procurar por..."
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setPagina(1);
              }}
              className="h-10 w-full rounded-full bg-white px-6 pr-12 text-sm text-black shadow-sm outline-none placeholder:text-[#B9A7F5] focus:ring-2 focus:ring-[#7B2FF7]"
            />
            <button
              type="submit"
              aria-label="Buscar"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B9A7F5] hover:text-purple-600"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>

        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-3 overflow-x-auto px-1 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:overflow-visible">
            {filtros.map((filtro) => {
              const ativo = filtroAtivo === filtro;
              return (
                <button
                  key={filtro}
                  type="button"
                  onClick={() => {
                    setFiltroAtivo(ativo ? '' : filtro);
                    setPagina(1);
                  }}
                  className={`h-9 shrink-0 rounded-full px-8 text-xs font-medium shadow-sm transition ${
                    ativo
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-[#B9A7F5] hover:text-purple-600'
                  }`}
                >
                  {filtro}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-[345px]">
            <select
              value={ordem}
              onChange={(e) => {
                setOrdem(e.target.value as Ordem);
                setPagina(1);
              }}
              aria-label="Ordenar por"
              className="h-11 w-full cursor-pointer appearance-none rounded-full bg-white px-6 pr-12 text-lg text-[#B9A7F5] shadow-sm outline-none focus:ring-2 focus:ring-[#7B2FF7]"
            >
              <option value="">ordenar por</option>
              <option value="menor">Menor preço</option>
              <option value="maior">Maior preço</option>
              <option value="az">Nome (A–Z)</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#B9A7F5]" />
          </div>
        </div>
        <div ref={topoGrade} className="scroll-mt-4" />
        {semProdutos ? (
          <>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {Array.from({ length: ESPACOS_RESERVADOS }, (_, i) => (
                <CardProdutoReservado key={i} />
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-gray-500">
              Os produtos cadastrados pelas lojas vão aparecer aqui.
            </p>
          </>
        ) : lista.length > 0 ? (
          <>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {visiveis.map((produto) => (
                <CardProduto key={produto.id} produto={produto} />
              ))}
            </div>

            <nav
              aria-label="Paginação"
              className="mt-10 flex items-center justify-center gap-2 text-black sm:gap-4"
            >
              <button
                type="button"
                onClick={() => irParaPagina(paginaAtual - 1)}
                disabled={paginaAtual === 1}
                aria-label="Página anterior"
                className="p-2 transition hover:text-purple-600 disabled:opacity-30 disabled:hover:text-black"
              >
                <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
              </button>

              {numeros.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => irParaPagina(n)}
                  aria-current={n === paginaAtual ? 'page' : undefined}
                  className={`w-9 text-2xl transition hover:text-purple-600 sm:w-12 sm:text-3xl ${
                    n === paginaAtual ? 'font-bold' : 'font-light'
                  }`}
                >
                  {n}
                </button>
              ))}

              <button
                type="button"
                onClick={() => irParaPagina(paginaAtual + 1)}
                disabled={paginaAtual === totalPaginas}
                aria-label="Próxima página"
                className="p-2 transition hover:text-purple-600 disabled:opacity-30 disabled:hover:text-black"
              >
                <ChevronRight className="h-6 w-6" strokeWidth={1.5} />
              </button>
            </nav>
          </>
        ) : (
          <p className="mt-16 text-center text-sm text-gray-500">Nenhum produto encontrado.</p>
        )}
      </div>
    </main>
  );
}