export default function Estrelas({ value, size = 28 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex text-[#ffe500]" role="img" aria-label={`${value} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = Math.max(0, Math.min(1, value - star + 1)) * 100;
        return (
          <span
            key={star}
            aria-hidden="true"
            style={{ fontSize: size, backgroundImage: `linear-gradient(90deg, #ffe500 ${fill}%, #666 ${fill}%)`, backgroundClip: 'text', color: 'transparent' }}
          >
            ★
          </span>
        );
      })}
    </span>
  );
}
