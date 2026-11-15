export type AvaliacaoLoja = {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    name: string;
    profilePictureUrl: string | null;
  };
};

export type RespostaAvaliacoesLoja = {
  store: {
    id: number;
    name: string;
    bannerUrl: string | null;
  };
  ratings: AvaliacaoLoja[];
};
