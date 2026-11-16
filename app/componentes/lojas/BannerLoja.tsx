import Image from 'next/image';
import ControlesProprietario from '../avaliacoes/ControlesProprietario';

type StoreVisualData = {
  name: string;
  bannerUrl: string | null;
  description?: string | null;
  logoUrl?: string | null;
  ownerName?: string | null;
};

type Props = {
  store: StoreVisualData;
  isOwner: boolean;
  showDetails?: boolean;
};

export default function BannerLoja({ store, isOwner, showDetails = false }: Props) {
  return (
    <section
      className="relative flex h-[360px] items-center justify-center overflow-hidden bg-[#171717] bg-cover bg-center sm:h-[440px] lg:h-[539px]"
      style={store.bannerUrl ? { backgroundImage: `linear-gradient(rgba(0,0,0,.48),rgba(0,0,0,.48)),url("${store.bannerUrl}")` } : undefined}
    >
      {isOwner && <ControlesProprietario />}
      <div className="flex flex-col items-center px-5 text-center text-[#f6f3e4]">
        {showDetails && store.logoUrl ? (
          <Image src={store.logoUrl} alt={store.name} width={552} height={180} unoptimized className="max-h-[180px] w-auto max-w-[min(80vw,552px)] object-contain" />
        ) : (
          <h1 className="text-5xl font-light sm:text-7xl">{store.name}</h1>
        )}
        {showDetails && store.description && <p className="self-start text-xl sm:text-[33px]">{store.description}</p>}
      </div>
      {showDetails && store.ownerName && (
        <p className="absolute bottom-5 right-5 text-sm font-light text-white sm:bottom-8 sm:right-[8%] sm:text-xl">
          by {store.ownerName}
        </p>
      )}
    </section>
  );
}
