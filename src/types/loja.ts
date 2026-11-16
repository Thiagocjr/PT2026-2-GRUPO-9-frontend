export type LojaPublica = {
  id: number;
  name: string;
  description: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  stickerUrl: string | null;
  ownerId: number;
  ownerName: string;
};

export type ProdutoLoja = {
  id: number;
  name: string;
  description: string | null;
  price: number | string;
  stock: number;
  createdAt: string;
  images: Array<{
    id: number;
    imageUrl: string;
    order: number;
  }>;
  averageRating: number | null;
  ratingCount: number;
};
