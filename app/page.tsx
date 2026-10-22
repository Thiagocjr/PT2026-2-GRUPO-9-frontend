import Image from 'next/image';

export default function Cadastro() {
  return (
    <main className="min-h-screen w-full bg-orange-50 px-6 pb-0 pt-10 md:px-14 md:pt-10">

      <div className="mt-4 mx-auto grid w-full max-w-[1450px] grid-cols-1 items-start gap-8 md:grid-cols-[750px_minmax(0,1fr)] md:gap-[100px]">
        <section className="min-h-[700px] w-full rounded-[28px] bg-black px-[55px] pt-[55px] text-white">

          <h1 className="mb-6 whitespace-nowrap text-center text-xl font-extrabold">
            CRIE SUA CONTA
          </h1>

          <form className="flex flex-col gap-2">

            <input type="text" placeholder="Nome Completo"
              className="h-12 w-full rounded-full bg-white px-5 text-base text-black outline-none focus:ring-2 focus:ring-purple-500" />

            <input type="text" placeholder="Username"
              className="h-12 w-full rounded-full bg-white px-5 text-base text-black outline-none focus:ring-2 focus:ring-purple-500" />

            <input type="email" placeholder="Email"
              className="h-12 w-full rounded-full bg-white px-5 text-base text-black outline-none focus:ring-2 focus:ring-purple-500" />

            <input type="password" placeholder="Senha"
              className="h-12 w-full rounded-full bg-white px-5 text-base text-black outline-none focus:ring-2 focus:ring-purple-500" />

            <input type="password" placeholder="Confirmar Senha"
              className="h-12 w-full rounded-full bg-white px-5 text-base text-black outline-none focus:ring-2 focus:ring-purple-500" />

            <button type="submit"
              className="mt-4 h-12 w-full rounded-full bg-purple-600 text-base font-bold text-white transition hover:bg-purple-700">
              CRIAR CONTA
            </button>

          </form>

          <p className="mt-4 whitespace-nowrap text-[15px] text-gray-300">
            Já possui uma conta?
            <a href="/login" className="font-bold text-purple-500 hover:text-purple-600">
              Login
            </a>
          </p>
        </section>
        
<section className="flex h-full min-w-0 flex-col items-center md:-ml-1">
  <div className="flex h-[100px] w-full items-center justify-center">
    <Image
      src="/LOGO Stock.io.png"
      alt="Logo Stock.io"
      width={460}
      height={150}
      priority
      className="mb-28 h-auto w-[460px] object-contain"
    />
  </div>
  <div className="relative mt-4 h-[750px] w-[450px] shrink-0 overflow-hidden">
    <Image
      src="/StockLee - Mascote da Stock.io.png"
      alt="StockLee - Mascote da Stock.io"
      fill
      priority
      sizes="750px"
      className="object-cover object-top"
    />
        </div>
       </section>
      </div>
     </main>
  );
}