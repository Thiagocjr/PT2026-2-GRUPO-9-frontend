'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { loginUser } from '@/src/services/authService';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log({ email, senha });

    try {
      await loginUser({
        email,
        password: senha,
      })

      router.push('/telaInicialLogado');

    } catch (error:any) {
      setErrorMessage(error.message || 'Erro ao fazer login. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="min-h-screen w-full bg-[#F6F3E4] px-4 py-8 sm:px-6 lg:h-screen lg:overflow-y-auto lg:px-14 lg:pb-0 lg:pt-0">
      <div className="mx-auto grid w-full max-w-[1450px] grid-cols-2 items-start gap-6 lg:h-full lg:grid-cols-[480px_minmax(0,680px)] lg:justify-center lg:gap-36">
        <section className="flex min-w-0 flex-col items-center lg:h-full lg:min-h-0 lg:items-start">
          <div className="w-full lg:-mt-8">
            <Image
              src="/LOGO Stock.io.png"
              alt="Logo Stock.io"
              width={440}
              height={150}
              priority
              className="block h-auto w-[min(100%,440px)] object-contain"
            />
          </div>
          <div className="-mt-2 w-full max-w-[480px] overflow-hidden lg:block lg:min-h-0 lg:flex-1">
            <Image
              src="/Stockles - Mascote da Stock.io.png"
              alt="StockLee - Mascote da Stock.io"
              width={800}
              height={1200}
              priority
              className="block h-auto w-full"
            />
          </div>
        </section>
        <section className="mx- auto h-fit w-full self-start rounded-[36px] bg-black px-6 py-12 text-white shadow-2xl sm:px-10 lg:mt-[80px] lg:px-12 lg:py-14 lg:px-16">
          <h1 className="mb-12 text-center text-2xl font-extrabold sm:text-3xl">
            BEM VINDO DE VOLTA!
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {errorMessage && (
              <div className="rounded-2xl bg-red-500/20 p-4 text-center text-sm font-medium text-red-300 border border-red-500/30">
                {errorMessage}
              </div>
            )}
            
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-14 w-full rounded-full bg-[#F3EEDC] px-6 text-base text-black placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-[#7B2FF7]"
            />

            <div className="relative">
              <input
                type={mostrarSenha ? 'text' : 'password'}
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="h-14 w-full rounded-full bg-[#F3EEDC] px-6 pr-16 text-base text-black placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-[#7B2FF7]"
              />

            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {mostrarSenha ? (
                <EyeOff className="h-6 w-6" />
              ) : (
                <Eye className="h-6 w-6" />
              )}
            </button>
            </div>
            <div className="flex justify-center">
              <Link
                href="/recuperar-senha"
                className="text-sm text-white hover:underline"
              >
                Esqueceu sua senha?
              </Link>
            </div>

            <button
              type="submit" disabled={loading}
              className="h-14 w-full rounded-full bg-purple-600 text-base font-bold text-white transition hover:bg-purple-700"
            >
              {loading ? 'CARREGANDO...' : 'ENTRAR'}
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-200 sm:text-base">
            Não possui uma conta?{' '}
            <Link
              href="/cadastro"
              className="font-semibold text-purple-600 hover:text-[#9a5cff]"
            >
              Cadastre-se
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}