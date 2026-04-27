"use client";

import { ArrowLeftIcon, ArrowRightIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

export function Gallery({
  images,
}: Readonly<{
  images: { src: string; altText: string }[];
}>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const imageIndex = searchParams.has("image")
    ? Number.parseInt(searchParams.get("image")!)
    : 0;

  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const imageRef = useRef<HTMLDivElement>(null);

  const updateImage = (index: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("image", index);
    router.replace(`?${params.toString()}`, { scroll: false });
    setIsZoomed(false);
  };

  const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0;
  const previousImageIndex =
    imageIndex === 0 ? images.length - 1 : imageIndex - 1;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div className="flex h-full w-full gap-4">
      {/* Thumbnails Sidebar */}
      {images.length > 1 && (
        <div className="hidden lg:flex w-24 shrink-0 flex-col gap-4 overflow-y-auto no-scrollbar pb-4 pt-1 px-1">
          {images.map((img, index) => (
            <button
              key={`${index}-${img.src}`}
              type="button"
              onClick={() => updateImage(index.toString())}
              aria-label={`View image ${index + 1}`}
              className={clsx(
                "relative aspect-square w-full overflow-hidden bg-neutral-50 transition-all",
                index === imageIndex
                  ? "border border-neutral-900/40"
                  : "border border-neutral-200 opacity-60 hover:opacity-100"
              )}
            >
              <Image
                src={img.src}
                alt={img.altText}
                fill
                className="object-cover object-center mix-blend-multiply"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image - With Zoom */}
      <div className="group relative flex-1 h-full overflow-hidden bg-neutral-50 border border-neutral-100">
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <div
          ref={imageRef}
          role="region"
          aria-label="Imagem do produto com zoom"
          tabIndex={0}
          className={clsx(
            "relative h-full w-full overflow-hidden cursor-zoom-in outline-none focus-visible:ring-2 focus-visible:ring-neutral-900",
            isZoomed && "cursor-zoom-out"
          )}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          onFocus={() => setIsZoomed(true)}
          onBlur={() => setIsZoomed(false)}
        >
          {images[imageIndex] && (
            <Image
              className={clsx(
                "h-full w-full object-cover object-center transition-transform duration-300 mix-blend-multiply",
                isZoomed && "scale-150"
              )}
              style={isZoomed ? {
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
              } : {}}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              alt={images[imageIndex]?.altText || ""}
              src={images[imageIndex]?.src || ""}
              priority={true}
            />
          )}
        </div>

        {/* Zoom Indicator */}
        <div className="absolute right-6 top-6 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs text-neutral-600 shadow-lg">
            <MagnifyingGlassIcon className="h-3.5 w-3.5" />
            <span>Zoom</span>
          </div>
        </div>

        {/* Mobile Navigation Arrows */}
        {images.length > 1 && (
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => updateImage(previousImageIndex.toString())}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 text-neutral-800 opacity-0 shadow-lg transition-all hover:bg-white focus:opacity-100 group-hover:opacity-100 hover:scale-110"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => updateImage(nextImageIndex.toString())}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 text-neutral-800 opacity-0 shadow-lg transition-all hover:bg-white focus:opacity-100 group-hover:opacity-100 hover:scale-110"
            >
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Mobile Thumbnails Indicators (Dots) */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 lg:hidden">
            {images.map((_, index) => (
              <button
                key={`${index}-${images[index]?.src}`}
                type="button"
                onClick={() => updateImage(index.toString())}
                aria-label={`View image ${index + 1}`}
                className={clsx(
                  "h-1.5 w-1.5 rounded-full transition-all",
                  index === imageIndex
                    ? "w-6 bg-neutral-800"
                    : "bg-neutral-800/40 hover:bg-neutral-800/60 hover:scale-125"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

