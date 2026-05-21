"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  if (images.length === 0) {
    return (
      <div className="aspect-[3/4] w-full bg-paper-deep border hairline grid place-items-center font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
        {"\u2014 no image \u2014"}
      </div>
    );
  }
  const current = images[active] ?? images[0];

  return (
    <div className="grid grid-cols-12 gap-3 md:gap-4">
      {images.length > 1 && (
        <div className="col-span-12 md:col-span-2 order-2 md:order-1 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              className={`relative shrink-0 w-16 h-20 md:w-full md:h-auto md:aspect-[4/5] border transition-all ${
                active === i
                  ? "border-ink"
                  : "hairline-strong hover:border-ink/60"
              }`}
              aria-label={`Image ${i + 1}`}
            >
              <Image
                src={src}
                alt={`${alt} ${i + 1}`}
                fill
                sizes="100px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
      <div className={`order-1 md:order-2 ${images.length > 1 ? "col-span-12 md:col-span-10" : "col-span-12"}`}>
        <div className="relative w-full aspect-[3/4] bg-paper-deep">
          <Image
            src={current}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
            priority
          />
          <div className="absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/80 bg-paper/85 backdrop-blur px-1.5 py-0.5">
            {String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </div>
        </div>
      </div>
    </div>
  );
}
