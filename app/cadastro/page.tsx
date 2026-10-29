'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/src/services/authService';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      setMensagemErro('As senhas não coincidem');
      return;
    }

    setMensagemErro('');
    setLoading(true);
    console.log({ nome, username, email });
  
    try {
      
      await registerUser({
        name: nome,
        username: username,
        email: email,
        password: senha,
        passwordConfirmation: confirmarSenha
    });

    alert('Cadastro realizado com sucesso! Faça login para continuar.');
    router.push('/login');
    
  } catch (error: any) {
    setMensagemErro(error.message);
  } finally {
    setLoading(false);
  }
}
  return (
    <main className="min-h-screen w-full bg-[#F6F3E4] px-4 py-8 sm:px-6 lg:h-screen lg:overflow-y-auto lg:px-14 lg:pb-0 lg:pt-0">
      <div className="mx-auto grid w-full max-w-[1450px] grid-cols-2 items-start gap-6 lg:h-full lg:grid-cols-[minmax(0,680px)_480px] lg:justify-center lg:gap-36">
        <section className="mx-auto h-fit w-full self-start rounded-[36px] bg-black px-6 py-12 text-white shadow-2xl sm:px-10 lg:mt-[80px] lg:px-16 lg:py-14">
          <h1 className="mb-10 text-center text-2xl font-extrabold sm:text-3xl">
            CRIE SUA CONTA
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nome Completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="h-14 w-full rounded-full bg-[#F3EEDC] px-6 text-base text-black placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-[#7B2FF7]"
            />

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="h-14 w-full rounded-full bg-[#F3EEDC] px-6 text-base text-black placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-[#7B2FF7]"
            />

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
                minLength={8}
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

            <input
              type={mostrarSenha ? 'text' : 'password'}
              placeholder="Confirmar Senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
              className="h-14 w-full rounded-full bg-[#F3EEDC] px-6 text-base text-black placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-[#7B2FF7]"
            />

            {mensagemErro && (
              <p className="text-center text-sm text-red-400">{mensagemErro}</p>
            )}

            <button
              type="submit"
              className="mt-2 h-14 w-full rounded-full bg-purple-600 text-base font-bold text-white transition hover:bg-purple-700"
            >
              CRIAR CONTA
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-200 sm:text-base">
            Já possui uma conta?{' '}
            <Link
              href="/login"
              className="font-semibold text-purple-600 hover:text-[#9a5cff]"
            >
              Login
            </Link>
          </p>
        </section>

        <section className="flex min-w-0 flex-col items-center lg:h-full lg:min-h-0 lg:items-start">
          <div className="w-full lg:-mt-[35px]">
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
              src="/StockLee - Mascote da Stock.io.png"
              alt="StockLee - Mascote da Stock.io"
              width={800}
              height={1200}
              priority
              className="block h-auto w-full"
            />
          </div>
        </section>
      </div>
    </main>
  );
}