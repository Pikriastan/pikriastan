import { useSignal } from "@preact/signals";

export const ProductGallery = ({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) => {
  const active = useSignal(0);

  if (images.length === 0) {
    return (
      <div className="grid aspect-3/4 w-full place-items-center bg-paper-deep font-mono text-[10px] text-muted uppercase tracking-[0.3em]">
        {"\u2014"}
      </div>
    );
  }
  const current = images[active.value] ?? images[0];

  return (
    <div className="flex min-w-0 max-w-full flex-col gap-3 md:gap-4">
      <div className="relative aspect-3/4 w-full max-w-full overflow-hidden bg-paper-deep">
        <img
          alt={alt}
          className="product-card-img absolute inset-0 h-full w-full object-cover"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          src={current}
        />
      </div>
      {images.length > 1 && (
        <div className="grid min-w-0 grid-cols-4 gap-2 md:grid-cols-6 md:gap-3">
          {images.map((src, i) => (
            <button
              aria-label={`Image ${i + 1}`}
              className={`relative aspect-4/5 min-w-0 overflow-hidden transition-opacity ${
                active.value === i
                  ? "opacity-100"
                  : "opacity-60 hover:opacity-100"
              }`}
              key={src}
              onClick={() => (active.value = i)}
              type="button"
            >
              <img
                alt={`${alt} ${i + 1}`}
                className="product-card-img absolute inset-0 h-full w-full object-cover"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                src={src}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
