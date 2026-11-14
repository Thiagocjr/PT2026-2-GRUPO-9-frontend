import type { ProdutoCategoria } from '../componentes/CategoriaStock';

export type Categoria = {
  slug: string;
  nome: string;
  titulo: [string, string];
  mascote: string;
  filtros: string[];
  produtos: ProdutoCategoria[];
};

const MASCOTE = '/StockLee-Eletronicos.png';

export const categorias: Categoria[] = [
  {
    slug: 'mercado',
    nome: 'Mercado',
    titulo: ['O mercado inteiro', 'em um só lugar'],
    mascote: MASCOTE,
    filtros: ['Padaria', 'Frutas', 'Bebidas', 'Limpeza', 'Outros'],
    produtos: [],
  },
  {
    slug: 'farmacia',
    nome: 'Farmácia',
    titulo: ['Cuidado e saúde', 'a um clique de você'],
    mascote: MASCOTE,
    filtros: ['Medicamentos', 'Higiene', 'Vitaminas', 'Bem-estar', 'Outros'],
    produtos: [],
  },
  {
    slug: 'beleza',
    nome: 'Beleza',
    titulo: ['Realce a sua beleza', 'em um só lugar'],
    mascote: MASCOTE,
    filtros: ['Maquiagem', 'Cabelo', 'Pele', 'Perfumes', 'Outros'],
    produtos: [],
  },
  {
    slug: 'moda',
    nome: 'Moda',
    titulo: ['O seu estilo', 'em um só lugar'],
    mascote: MASCOTE,
    filtros: ['Feminino', 'Masculino', 'Calçados', 'Acessórios', 'Outros'],
    produtos: [],
  },
  {
    slug: 'eletronicos',
    nome: 'Eletrônicos',
    titulo: ['O universo da tecnologia', 'em um só lugar'],
    mascote: MASCOTE,
    filtros: ['Celulares', 'Notebooks', 'TVs', 'Acessórios', 'Outros'],
    produtos: [],
  },
  {
    slug: 'jogos',
    nome: 'Jogos',
    titulo: ['O mundo dos games', 'em um só lugar'],
    mascote: MASCOTE,
    filtros: ['Consoles', 'PC', 'Acessórios', 'Jogos', 'Outros'],
    produtos: [],
  },
  {
    slug: 'brinquedos',
    nome: 'Brinquedos',
    titulo: ['Diversão para todas', 'as idades'],
    mascote: MASCOTE,
    filtros: ['Bonecas', 'Carrinhos', 'Educativos', 'Jogos', 'Outros'],
    produtos: [],
  },
  {
    slug: 'casa',
    nome: 'Casa',
    titulo: ['Tudo para deixar a casa', 'do seu jeito'],
    mascote: MASCOTE,
    filtros: ['Decoração', 'Cozinha', 'Quarto', 'Banheiro', 'Outros'],
    produtos: [],
  },
];

export function getCategoria(slug: string) {
  return categorias.find((c) => c.slug === slug);
}