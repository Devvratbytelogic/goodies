"use client";

import { useState } from "react";
import { LuSearch } from "react-icons/lu";
import ImageComponent from "@/components/layout/common/ImageComponent";

type ProductGalleryProps = {
  images: string[];
  alt: string;
};

export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  if (!current) {
    return null;
  }

  return (
    <div>
      <div className="relative bg-surface">
        <div className="relative aspect-4/3">
          <ImageComponent
            src={current}
            alt={alt}
            width={1200}
            height={900}
            objectFit="contain"
            sizes="(max-width: 1024px) 92vw, 42vw"
            preload={active === 0}
            fetchPriority={active === 0 ? "high" : "auto"}
          />
        </div>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-e-3 top-3 inline-flex size-10 items-center justify-center rounded-full bg-background/90 text-heading shadow-sm ring-1 ring-border/80"
        >
          <LuSearch className="size-5" />
        </span>
      </div>

      {images.length > 1 ? (
        <ol className="mt-3 flex flex-wrap gap-3">
          {images.map((src, index) => {
            const selected = index === active;
            return (
              <li key={src}>
                <button
                  type="button"
                  aria-label={`${alt} ${index + 1}`}
                  aria-current={selected ? "true" : undefined}
                  onClick={() => setActive(index)}
                  className={`relative size-24 overflow-hidden bg-surface ring-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:size-28 ${selected ? "ring-2 ring-heading" : "ring-border"
                    }`}
                >
                  <ImageComponent
                    src={src}
                    alt=""
                    width={224}
                    height={224}
                    objectFit="cover"
                    sizes="112px"
                  />
                </button>
              </li>
            );
          })}
        </ol>
      ) : null}
    </div>
  );
}
