"use client";

import { useEffect, useState } from "react";
import Image, { type ImageProps } from "next/image";

/** Shown whenever `src` is missing/empty or the image fails to load. */
const DEFAULT_FALLBACK_SRC = "/images/image-fallback.svg";

type ImageComponentProps = ImageProps & {
    /** Optional shorthand for object-fit, appended to `className`. */
    objectFit?: "cover" | "contain";
    /** Overrides the default fallback image used on load/path errors. */
    fallbackSrc?: string;
};

export default function ImageComponent({
    className = "",
    objectFit,
    alt,
    src,
    fallbackSrc = DEFAULT_FALLBACK_SRC,
    onError,
    onLoad,
    unoptimized,
    ...props
}: ImageComponentProps) {
    const isSrcEmpty =
        !src || (typeof src === "string" && src.trim().length === 0);
    const [hasError, setHasError] = useState(isSrcEmpty);

    // Reset the error state whenever a new `src` is provided, so the
    // component recovers once a valid path is passed in again.
    useEffect(() => {
        setHasError(isSrcEmpty);
    }, [src, isSrcEmpty]);

    const objectFitClass =
        objectFit === "cover" ? "object-cover" : objectFit === "contain" ? "object-contain" : "";

    const isShowingFallback = hasError || isSrcEmpty;
    const resolvedSrc = isShowingFallback ? fallbackSrc : src;

    return (
        <Image
            alt={alt || "Image unavailable"}
            src={resolvedSrc}
            className={`${objectFitClass} h-full w-full ${className}`.trim()}
            // The fallback is a local SVG; skip the optimizer for it so it
            // always renders even if the original request failed upstream.
            unoptimized={isShowingFallback ? true : unoptimized}
            onError={(event) => {
                setHasError(true);
                onError?.(event);
            }}
            onLoad={(event) => {
                // Guard against a broken image that still "loads" with 0 size.
                const img = event.currentTarget;
                if (img.naturalWidth === 0 && img.naturalHeight === 0) {
                    setHasError(true);
                }
                onLoad?.(event);
            }}
            {...props}
        />
    );
}
