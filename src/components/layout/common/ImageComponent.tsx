import Image, { type ImageProps } from "next/image";

type ImageComponentProps = Omit<ImageProps, "alt" | "src" | "sizes" | "quality"> & {
  src: ImageProps["src"];
  /** Empty string is allowed for decorative images. */
  alt: string;
  /**
   * The width the image actually occupies on screen.
   * Example: a half-width photo uses `"(max-width: 1024px) 100vw, 50vw"`.
   * A 56px logo uses `"56px"`.
   */
  sizes: string;
  objectFit?: "cover" | "contain";
  /** 65 for the one large hero. 75 for everything else. */
  quality?: 65 | 75;
};

export default function ImageComponent({
  className = "",
  objectFit,
  alt,
  src,
  sizes,
  quality = 75,
  ...props
}: ImageComponentProps) {
  if (typeof src === "string" && src.trim().length === 0) {
    return null;
  }

  const fitClass =
    objectFit === "cover" ? "object-cover" : objectFit === "contain" ? "object-contain" : "";

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      sizes={sizes}
      quality={quality}
      className={`${fitClass} h-full w-full ${className}`.trim()}
    />
  );
}
