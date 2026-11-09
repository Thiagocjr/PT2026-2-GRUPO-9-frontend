'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CardProdutoReservado from './CardProdutoReservado';
import {
  Search,
  ShoppingBag,
  Store,
  ShoppingBasket,
  Pill,
  Sparkles,
  Shirt,
  Laptop,
  Gamepad2,
  Blocks,
  House,
  Package,
  User,
  LogOut,
  type LucideIcon,
} from 'lucide-react';

type Categoria = { nome: string; slug: string; icone: LucideIcon };
type Produto = { nome: string; imagem: string; selo: string; categoria: string };

const categorias: Categoria[] = [
  { nome: 'Mercado', slug: 'mercado', icone: ShoppingBasket },
  { nome: 'Farmácia', slug: 'farmacia', icone: Pill },
  { nome: 'Beleza', slug: 'beleza', icone: Sparkles },
  { nome: 'Moda', slug: 'moda', icone: Shirt },
  { nome: 'Eletrônicos', slug: 'eletronicos', icone: Laptop },
  { nome: 'Jogos', slug: 'jogos', icone: Gamepad2 },
  { nome: 'Brinquedos', slug: 'brinquedos', icone: Blocks },
  { nome: 'Casa', slug: 'casa', icone: House },
];

const produtos: Produto[] = [];

const ESPACOS_RESERVADOS = 5;

function CardProduto({ produto }: { produto: Produto }) {
  const [imagemErro, setImagemErro] = useState(false);
  const [seloErro, setSeloErro] = useState(false);

  return (
    <article className="flex h-[230px] flex-col overflow-hidden rounded-[28px] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:h-[250px]">
      <div className="flex h-11 justify-end">
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
            className="h-11 w-11 rounded-full object-cover"
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

      <h3 className="mt-3 truncate text-sm font-semibold text-black">{produto.nome}</h3>
    </article>
  );
}

export default function HomeStock({ logado = false }: { logado?: boolean }) {
  const router = useRouter();
  const home = logado ? '/home_logado' : '/home_visitante';
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Mercado');
  const produtosDaCategoria = produtos.filter((p) => p.categoria === categoriaAtiva);

  function handleSair() {
    router.push('/login');
  }

  function handleBusca(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log({ busca, categoriaAtiva });
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
          <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2">
            <h1 className="self-center pb-4 pt-8 text-3xl font-extrabold leading-tight sm:text-4xl md:pt-0 lg:text-5xl">
              Do CAOS à organização,
              <br />
              em alguns cliques
            </h1>

            <div className="flex justify-center md:justify-end">
              <div className="relative h-[255px] w-[340px] overflow-hidden sm:h-[315px] sm:w-[420px] lg:h-[375px] lg:w-[500px]">
                <Image
                  src="/StockLee-Hero.png"
                  alt="StockLee - Mascote da Stock.io"
                  width={1650}
                  height={2240}
                  priority
                  className="absolute left-0 top-0 block h-auto w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1450px] px-4 pb-16 sm:px-6 lg:px-14">
        <form onSubmit={handleBusca} className="flex justify-center pt-6 md:justify-end">
          <div className="relative w-full max-w-[470px]">
            <input
              type="text"
              placeholder="Procurar por..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
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

        <section className="mt-4">
          <h2 className="text-xl font-extrabold text-black sm:text-2xl">Categoria</h2>

          <div className="-mx-1 mt-3 flex gap-4 overflow-x-auto px-1 py-2 sm:gap-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categorias.map(({ nome, icone: Icone }) => {
              const ativa = categoriaAtiva === nome;
              return (
                <button
                  key={nome}
                  type="button"
                  onClick={() => setCategoriaAtiva(nome)}
                  className={`flex h-[80px] w-[80px] shrink-0 flex-col items-center justify-center gap-1.5 rounded-[22px] bg-white text-[11px] font-medium text-black shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:h-[84px] sm:w-[84px] ${
                    ativa ? 'ring-2 ring-purple-600' : ''
                  }`}
                >
                  <Icone className="h-6 w-6 text-purple-600" strokeWidth={1.8} />
                  {nome}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-extrabold text-black sm:text-2xl">
              Produtos
              <span className="ml-1 text-[10px] font-medium text-purple-600">
                em {categoriaAtiva}
              </span>
            </h2>
            <Link
              href={`${home}/categoria/${categorias.find((c) => c.nome === categoriaAtiva)?.slug ?? ''}`}
              className="text-xs font-semibold text-purple-600 hover:text-purple-800"
            >
              ver mais
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {produtosDaCategoria.length > 0
              ? produtosDaCategoria.map((produto) => (
                  <CardProduto key={produto.nome} produto={produto} />
                ))
              : Array.from({ length: ESPACOS_RESERVADOS }, (_, i) => (
                  <CardProdutoReservado key={i} />
                ))}
          </div>

          {produtosDaCategoria.length === 0 && (
            <p className="mt-6 text-center text-sm text-gray-500">
              Os produtos cadastrados pelas lojas vão aparecer aqui.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}