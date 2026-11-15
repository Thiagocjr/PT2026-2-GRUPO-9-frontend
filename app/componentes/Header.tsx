'use client';

import Image from 'next/image';
import Link from 'next/link';
import { LogOut, ShoppingBag, Store, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header({ variant = 'guest', profileHref = '/perfil' }: { variant?: 'guest' | 'authenticated'; profileHref?: string }) {
  const router = useRouter();
  return (
    <header className="h-[92px] w-full bg-black text-white">
      <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-[5%]">
        <Link href={variant === 'guest' ? '/home_visitante' : '/home_logado'} aria-label="Stock.io">
          <Image src="/LOGO-Stock.io.png" alt="Stock.io" width={220} height={44} priority className="h-auto w-[150px] sm:w-[190px]" />
        </Link>
        <nav className="flex items-center gap-5 sm:gap-8" aria-label="Navegação principal">
          <Link href="/lojas" aria-label="Lojas" className="transition hover:text-[#c8e600]"><Store className="h-6 w-6" /></Link>
          <Link href="/carrinho" aria-label="Sacola" className="transition hover:text-[#c8e600]"><ShoppingBag className="h-6 w-6" /></Link>
          {variant === 'guest' ? <>
            <Link href="/login" className="text-sm font-semibold hover:text-[#c8e600]">LOGIN</Link>
            <Link href="/cadastro" className="rounded-full bg-[#6a38f3] px-6 py-2 text-sm font-semibold hover:bg-purple-700">CADASTRE-SE</Link>
          </> : <>
            <Link href={profileHref} aria-label="Perfil" className="hover:text-[#c8e600]"><User className="h-6 w-6" /></Link>
            <button type="button" onClick={() => router.push('/login')} aria-label="Sair" className="hover:text-[#c8e600]"><LogOut className="h-6 w-6" /></button>
          </>}
        </nav>
      </div>
    </header>
  );
}
