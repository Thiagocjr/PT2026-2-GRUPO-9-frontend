'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AtSign,
  ChevronLeft,
  LogOut,
  Mail,
  ShoppingBag,
  Store,
  User,
} from 'lucide-react';
import CardProdutoReservado from './CardProdutoReservado';
import { CardProduto, type ProdutoCategoria } from './CategoriaStock';
type Usuario = {
  nome: string;
  username: string;
  email: string;
};
type Props = {
  proprio?: boolean; // true = o usuário está vendo o PRÓPRIO perfil (mostra "Editar Perfil")
  usuario?: Usuario; // dados do usuário (virão do cadastro/backend)
  produtos?: ProdutoCategoria[]; // produtos da loja do usuário (virão do cadastro da loja)
};
const USUARIO_PADRAO: Usuario = {
  nome: 'Nome do usuário',
  username: 'username',
  email: 'email@exemplo.com',
};
const ESPACOS_RESERVADOS = 5;

export default function PerfilStock({
  proprio = false,
  usuario = USUARIO_PADRAO,
  produtos = [],
}: Props) {
  const router = useRouter();
  const home = proprio ? '/home_logado' : '/home_visitante';

  function handleSair() {
    router.push('/login');
  }

  return (
    <main className="min-h-screen w-full bg-[#F6F3E4]">
      <section className="relative h-[230px] w-full bg-black text-white sm:h-[270px] lg:h-[320px]">
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
              {proprio ? (
                <>
                  <Link
                    href="/perfil_logado"
                    aria-label="Perfil"
                    className="text-[#C8E600]"
                  >
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
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="mx-auto w-full max-w-[1450px] px-4 sm:px-6 lg:px-14">
            <div className="flex translate-y-[28%] items-center gap-5">
              <button
                type="button"
                onClick={() => router.back()}
                aria-label="Voltar"
                className="shrink-0 text-white hover:text-[#9a5cff]"
              >
                <ChevronLeft className="h-9 w-9" strokeWidth={1.5} />
              </button>

              <div className="flex h-[110px] w-[110px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#D9D2B8] text-white/80 sm:h-[130px] sm:w-[130px] lg:h-[170px] lg:w-[170px]">
                <User className="h-1/2 w-1/2" strokeWidth={1.2} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1450px] px-4 pb-16 sm:px-6 lg:px-14">
        <div className="flex items-start justify-between gap-4 pl-14 pt-10 sm:pt-12 lg:pt-[72px]">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold text-black sm:text-3xl lg:text-4xl">
              {usuario.nome}
            </h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
              <AtSign className="h-3.5 w-3.5" />
              {usuario.username}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
              <Mail className="h-3.5 w-3.5" />
              {usuario.email}
            </p>
          </div>

          {proprio && (
            <Link
              href="/perfil_logado/editar"
              className="flex h-10 w-[150px] shrink-0 items-center justify-center rounded-full bg-purple-600 text-xs font-semibold text-white transition hover:bg-purple-700 sm:w-[220px] sm:text-sm lg:w-[260px]"
            >
              Editar Perfil
            </Link>
          )}
        </div>

        <section className="mt-10">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-extrabold text-black sm:text-2xl">Produtos</h2>
            <Link
              href="/produtos"
              className="text-xs font-semibold text-purple-600 hover:text-purple-800"
            >
              ver mais
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {produtos.length > 0
              ? produtos.map((produto) => <CardProduto key={produto.id} produto={produto} />)
              : Array.from({ length: ESPACOS_RESERVADOS }, (_, i) => (
                  <CardProdutoReservado key={i} />
                ))}
          </div>

          {produtos.length === 0 && (
            <p className="mt-6 text-center text-sm text-gray-500">
              {proprio
                ? 'Os produtos da sua loja vão aparecer aqui.'
                : 'Os produtos da loja deste usuário vão aparecer aqui.'}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}