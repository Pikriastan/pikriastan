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
      <div className="grid aspect-3/4 w-full place-items-center bg-paper-deep font-mono text-[10px] text-muted uppercase tracking-[0.3em]">
        {"\u2014"}
      </div>
    );
  }
  const current = images[active] ?? images[0];

  return (
    <div className="flex flex-col gap-3 md:gap-4">
      <div className="relative aspect-3/4 w-full overflow-hidden bg-paper-deep">
        <Image
          alt={alt}
          className="object-cover"
          fill
          priority
          quality={95}
          sizes="(min-width: 1024px) 60vw, 100vw"
          src={current}
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 md:grid-cols-6 md:gap-3">
          {images.map((src, i) => (
            <button
              aria-label={`Image ${i + 1}`}
              className={`relative aspect-4/5 overflow-hidden transition-opacity ${
                active === i ? "opacity-100" : "opacity-60 hover:opacity-100"
              }`}
              key={src}
              onClick={() => setActive(i)}
              type="button"
            >
              <Image
                alt={`${alt} ${i + 1}`}
                className="object-cover"
                fill
                quality={90}
                sizes="160px"
                src={src}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
