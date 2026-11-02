"use client";

import { useState } from "react";
import ImageComponent from "@/components/layout/common/ImageComponent";
import ImageMagnify from "@/components/product/ImageMagnify";

type ProductGalleryProps = {
  images: string[];
  alt: string;
};

export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const hasMany = images.length > 1;
  const current = images[active] ?? images[0];

  if (!current) {
    return null;
  }

  return (
    <div>
      <ImageMagnify images={images} alt={alt} active={active} onActiveChange={setActive} />

      {hasMany ? (
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
                  className={`relative size-24 overflow-hidden bg-surface ring-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:size-28 ${selected ? "ring-2 ring-heading" : "ring-border"}`}
                >
                  <ImageComponent src={src} alt="" width={224} height={224} objectFit="cover" sizes="112px" />
                </button>
              </li>
            );
          })}
        </ol>
      ) : null}
    </div>
  );
}
