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
      <div className="aspect-[3/4] w-full bg-paper-deep grid place-items-center font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
        {"\u2014"}
      </div>
    );
  }
  const current = images[active] ?? images[0];

  return (
    <div className="flex flex-col gap-3 md:gap-4">
      <div className="relative w-full aspect-[3/4] bg-paper-deep overflow-hidden">
        <Image
          src={current}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2 md:gap-3">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              className={`relative aspect-[4/5] overflow-hidden transition-opacity ${
                active === i ? "opacity-100" : "opacity-60 hover:opacity-100"
              }`}
              aria-label={`Image ${i + 1}`}
            >
              <Image
                src={src}
                alt={`${alt} ${i + 1}`}
                fill
                sizes="160px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
