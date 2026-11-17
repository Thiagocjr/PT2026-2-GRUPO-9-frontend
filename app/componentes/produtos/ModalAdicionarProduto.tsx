'use client';

import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { ImagePlus, ChevronDown, Minus, Plus, X } from 'lucide-react';
import { League_Spartan } from 'next/font/google';

type Props = {
  open: boolean;
  onClose: () => void;
};

type Subcategoria = 'Doce' | 'Salgado';

const leagueSpartan = League_Spartan({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] });
const subcategorias: Subcategoria[] = ['Doce', 'Salgado'];
const moedaBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const agrupadorBR = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
const simboloMoeda = moedaBRL.formatToParts(0).find((parte) => parte.type === 'currency')?.value ?? 'R$';

function formatarCentavos(centavos: bigint) {
  const reais = agrupadorBR.format(centavos / 100n);
  const centavosFormatados = (centavos % 100n).toString().padStart(2, '0');
  return `${simboloMoeda}\u00a0${reais},${centavosFormatados}`;
}

export default function ModalAdicionarProduto({ open, onClose }: Props) {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [subcategoria, setSubcategoria] = useState<Subcategoria | ''>('');
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [opcaoAtiva, setOpcaoAtiva] = useState(0);
  const [precoCentavos, setPrecoCentavos] = useState(0n);
  const [quantidade, setQuantidade] = useState(0);
  const [quantidadeDigitada, setQuantidadeDigitada] = useState('0');

  const dialogRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const precoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const root = document.createElement('div');
    root.dataset.modalAdicionarProduto = 'true';
    document.body.appendChild(root);
    setPortalRoot(root);
    return () => root.remove();
  }, []);

  useEffect(() => {
    const limparFormulario = () => {
      setNome('');
      setDescricao('');
      setSubcategoria('');
      setDropdownAberto(false);
      setOpcaoAtiva(0);
      setPrecoCentavos(0n);
      setQuantidade(0);
      setQuantidadeDigitada('0');
    };

    if (!open) {
      limparFormulario();
      return;
    }

    const focoAnterior = document.activeElement;
    const overflowAnterior = document.body.style.overflow;
    const elementosInertes = Array.from(document.body.children)
      .filter((elemento): elemento is HTMLElement => elemento instanceof HTMLElement && elemento !== portalRoot)
      .map((elemento) => ({ elemento, inert: elemento.inert, ariaHidden: elemento.getAttribute('aria-hidden') }));

    document.body.style.overflow = 'hidden';
    elementosInertes.forEach(({ elemento }) => {
      elemento.inert = true;
      elemento.setAttribute('aria-hidden', 'true');
    });

    const focusFrame = window.requestAnimationFrame(() => dialogRef.current?.focus());

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = overflowAnterior;
      elementosInertes.forEach(({ elemento, inert, ariaHidden }) => {
        elemento.inert = inert;
        if (ariaHidden === null) elemento.removeAttribute('aria-hidden');
        else elemento.setAttribute('aria-hidden', ariaHidden);
      });
      if (focoAnterior instanceof HTMLElement && focoAnterior.isConnected) {
        window.requestAnimationFrame(() => focoAnterior.focus());
      }
    };
  }, [open, portalRoot]);

  useEffect(() => {
    if (!open || !dropdownAberto) return;

    const fecharAoClicarFora = (event: PointerEvent) => {
      if (event.target instanceof Node && !dropdownRef.current?.contains(event.target)) {
        setDropdownAberto(false);
      }
    };

    document.addEventListener('pointerdown', fecharAoClicarFora);
    return () => document.removeEventListener('pointerdown', fecharAoClicarFora);
  }, [open, dropdownAberto]);

  const fecharDropdown = () => {
    setDropdownAberto(false);
    dropdownTriggerRef.current?.focus();
  };

  const selecionarSubcategoria = (opcao: Subcategoria) => {
    setSubcategoria(opcao);
    fecharDropdown();
  };

  const lidarComTecladoDialogo = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      if (dropdownAberto) fecharDropdown();
      else onClose();
      return;
    }

    if (event.key !== 'Tab') return;

    const focaveis = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ) ?? []).filter((elemento) => elemento.tabIndex >= 0);
    if (!focaveis.length) {
      event.preventDefault();
      dialogRef.current?.focus();
      return;
    }

    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];
    const focoAtual = document.activeElement;

    if (event.shiftKey && (focoAtual === primeiro || focoAtual === dialogRef.current)) {
      event.preventDefault();
      ultimo.focus();
    } else if (!event.shiftKey && (focoAtual === ultimo || focoAtual === dialogRef.current)) {
      event.preventDefault();
      primeiro.focus();
    }
  };

  const abrirDropdown = (indice = 0) => {
    setOpcaoAtiva(indice);
    setDropdownAberto(true);
    window.requestAnimationFrame(() => optionRefs.current[indice]?.focus());
  };

  const lidarComTecladoOpcao = (event: KeyboardEvent<HTMLButtonElement>, indice: number) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      fecharDropdown();
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const deslocamento = event.key === 'ArrowDown' ? 1 : -1;
      const proximoIndice = (indice + deslocamento + subcategorias.length) % subcategorias.length;
      setOpcaoAtiva(proximoIndice);
      optionRefs.current[proximoIndice]?.focus();
      return;
    }

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      const proximoIndice = event.key === 'Home' ? 0 : subcategorias.length - 1;
      setOpcaoAtiva(proximoIndice);
      optionRefs.current[proximoIndice]?.focus();
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selecionarSubcategoria(subcategorias[indice]);
    }
  };

  const mudarPreco = (event: ChangeEvent<HTMLInputElement>) => {
    const digitos = event.target.value.replace(/\D/g, '');
    setPrecoCentavos(digitos ? BigInt(digitos) : 0n);
    window.requestAnimationFrame(() => {
      const input = precoInputRef.current;
      if (input) input.setSelectionRange(input.value.length, input.value.length);
    });
  };

  const mudarQuantidadeDigitada = (event: ChangeEvent<HTMLInputElement>) => {
    const valor = event.target.value;
    if (valor !== '' && !/^\d+$/.test(valor)) return;
    if (valor.length > 2 || (valor !== '' && Number(valor) > 99)) return;
    setQuantidadeDigitada(valor);
    if (valor !== '') setQuantidade(Number(valor));
  };

  const ajustarQuantidade = (ajuste: number) => {
    const proximaQuantidade = Math.max(0, Math.min(99, quantidade + ajuste));
    setQuantidade(proximaQuantidade);
    setQuantidadeDigitada(String(proximaQuantidade));
  };

  if (!open || !portalRoot) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-modal-adicionar-produto"
        tabIndex={-1}
        onKeyDown={lidarComTecladoDialogo}
        className={`${leagueSpartan.className} relative w-full max-w-[560px] max-h-[calc(100dvh-24px)] overflow-y-auto rounded-[18px] bg-[#f1f1f1] px-5 pb-5 pt-4 text-black shadow-[0_18px_60px_rgba(0,0,0,0.35)] outline-none sm:max-h-[calc(100dvh-48px)] sm:px-[30px] sm:pb-[26px] sm:pt-5`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar modal"
          className="absolute right-3 top-2 grid h-8 w-8 place-items-center rounded-full text-black transition hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-[#6a38f3]"
        >
          <X aria-hidden="true" size={21} strokeWidth={1.7} />
        </button>

        <h2 id="titulo-modal-adicionar-produto" className="mb-4 text-center text-lg font-medium sm:mb-5 sm:text-xl">
          Adicionar Produto
        </h2>

        <div className="mb-3" role="group" aria-label="Imagens do produto. Adição de imagens indisponível nesta etapa.">
          <div className="grid h-[100px] place-items-center rounded-[10px] border-2 border-dashed border-[#9b6aff] text-center text-[#6a38f3] sm:h-[104px]">
            <div className="flex flex-col items-center gap-1">
              <ImagePlus aria-hidden="true" size={27} strokeWidth={1.8} />
              <span className="text-[12px] leading-none">Anexe as fotos do seu produto</span>
              <span className="sr-only">A inclusão de imagens ainda não está disponível.</span>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((item) => (
              <div key={item} aria-hidden="true" className="grid h-[78px] place-items-center rounded-[9px] border-2 border-dashed border-[#9b6aff] text-[#6a38f3] sm:h-[84px]">
                <ImagePlus size={24} strokeWidth={1.8} />
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={(event) => event.preventDefault()} className="space-y-[10px]">
          <div>
            <label htmlFor="nome-produto" className="sr-only">Nome do produto</label>
            <input
              id="nome-produto"
              type="text"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              placeholder="Nome do produto"
              className="h-[38px] w-full rounded-full bg-white px-4 text-sm text-black outline-none placeholder:text-[#999] focus-visible:ring-2 focus-visible:ring-[#8a38f5]"
            />
          </div>

          <div ref={dropdownRef} className="relative" onBlur={(event) => {
            const proximoFoco = event.relatedTarget;
            if (!(proximoFoco instanceof Node) || !event.currentTarget.contains(proximoFoco)) setDropdownAberto(false);
          }}>
            <span id="label-subcategoria" className="sr-only">Subcategoria</span>
            <button
              ref={dropdownTriggerRef}
              type="button"
              aria-labelledby="label-subcategoria"
              aria-haspopup="listbox"
              aria-expanded={dropdownAberto}
              aria-controls="opcoes-subcategoria"
              onClick={() => dropdownAberto ? setDropdownAberto(false) : abrirDropdown(subcategorias.indexOf(subcategoria as Subcategoria) >= 0 ? subcategorias.indexOf(subcategoria as Subcategoria) : 0)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                  event.preventDefault();
                  if (!dropdownAberto) {
                    const selecionada = subcategorias.indexOf(subcategoria as Subcategoria);
                    abrirDropdown(selecionada >= 0 ? selecionada : 0);
                  } else optionRefs.current[opcaoAtiva]?.focus();
                }
              }}
              className="flex h-[38px] w-full items-center justify-between rounded-full bg-white px-4 text-left text-sm text-[#929292] outline-none focus-visible:ring-2 focus-visible:ring-[#8a38f5]"
            >
              <span className={subcategoria ? 'text-black' : ''}>{subcategoria || 'Subcategoria'}</span>
              <ChevronDown aria-hidden="true" size={17} strokeWidth={1.4} className={`transition-transform ${dropdownAberto ? 'rotate-180' : ''}`} />
            </button>

            {dropdownAberto && (
              <div
                id="opcoes-subcategoria"
                role="listbox"
                aria-labelledby="label-subcategoria"
                className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 rounded-[16px] bg-white px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.14)]"
              >
                {subcategorias.map((opcao, indice) => (
                  <button
                    key={opcao}
                    ref={(elemento) => { optionRefs.current[indice] = elemento; }}
                    id={`subcategoria-${indice}`}
                    type="button"
                    role="option"
                    aria-selected={subcategoria === opcao}
                    tabIndex={opcaoAtiva === indice ? 0 : -1}
                    onMouseEnter={() => setOpcaoAtiva(indice)}
                    onClick={() => selecionarSubcategoria(opcao)}
                    onKeyDown={(event) => lidarComTecladoOpcao(event, indice)}
                    className="flex w-full items-center gap-2 py-0.5 text-left text-[17px] leading-tight text-[#7139ff] outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-[#8a38f5]"
                  >
                    <span aria-hidden="true" className="grid h-[15px] w-[15px] shrink-0 place-items-center rounded-full border border-[#7139ff]">
                      {subcategoria === opcao && <span className="h-[7px] w-[7px] rounded-full bg-[#7139ff]" />}
                    </span>
                    {opcao}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="descricao-produto" className="sr-only">Descrição do produto</label>
            <textarea
              id="descricao-produto"
              value={descricao}
              onChange={(event) => setDescricao(event.target.value)}
              placeholder="Descrição do produto"
              rows={3}
              className="min-h-[74px] w-full resize-y rounded-[12px] bg-white px-4 py-3 text-sm text-black outline-none placeholder:text-[#555] focus-visible:ring-2 focus-visible:ring-[#8a38f5] sm:min-h-[82px]"
            />
          </div>

          <div>
            <label htmlFor="preco-produto" className="sr-only">Preço do produto</label>
            <input
              ref={precoInputRef}
              id="preco-produto"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={formatarCentavos(precoCentavos)}
              onChange={mudarPreco}
              className="h-[38px] w-full rounded-full bg-white px-4 text-sm text-black outline-none focus-visible:ring-2 focus-visible:ring-[#8a38f5]"
            />
          </div>

          <div className="flex items-center justify-center gap-7 py-1 text-[#7139ff]">
            <button
              type="button"
              aria-label="Diminuir quantidade"
              disabled={quantidade === 0}
              onClick={() => ajustarQuantidade(-1)}
              className="grid h-10 w-10 place-items-center rounded-full border border-[#7139ff] transition hover:bg-[#7139ff]/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Minus aria-hidden="true" size={19} strokeWidth={1.7} />
            </button>
            <label htmlFor="quantidade-produto" className="sr-only">Quantidade</label>
            <input
              id="quantidade-produto"
              type="text"
              inputMode="numeric"
              value={quantidadeDigitada}
              onChange={mudarQuantidadeDigitada}
              onBlur={() => {
                if (quantidadeDigitada === '') {
                  setQuantidade(0);
                  setQuantidadeDigitada('0');
                } else setQuantidadeDigitada(String(quantidade));
              }}
              aria-valuemin={0}
              aria-valuemax={99}
              aria-valuenow={quantidade}
              className="w-12 bg-transparent text-center text-[32px] leading-none text-[#7139ff] outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-[#8a38f5]"
            />
            <button
              type="button"
              aria-label="Aumentar quantidade"
              disabled={quantidade === 99}
              onClick={() => ajustarQuantidade(1)}
              className="grid h-10 w-10 place-items-center rounded-full border border-[#7139ff] transition hover:bg-[#7139ff]/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus aria-hidden="true" size={20} strokeWidth={1.7} />
            </button>
          </div>

          <button
            type="button"
            disabled
            title="Cadastro de produto ainda indisponível"
            className="mx-auto block h-[34px] w-[min(210px,75%)] rounded-full bg-[#7139ff] text-sm font-medium text-white opacity-90 shadow-sm disabled:cursor-not-allowed"
          >
            Adicionar
            <span className="sr-only"> — cadastro de produto ainda indisponível</span>
          </button>
        </form>
      </div>
    </div>,
    portalRoot,
  );
}
