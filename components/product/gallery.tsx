"use client";

import { ArrowLeftIcon, ArrowRightIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useState } from "react";

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

  // Touch/swipe state
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isSwiping = useRef(false);

  const updateImage = useCallback(
    (index: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("image", index);
      router.replace(`?${params.toString()}`, { scroll: false });
      setIsZoomed(false);
    },
    [router, searchParams],
  );

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

  // Touch handlers for swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0]!.clientX;
    touchEndX.current = e.targetTouches[0]!.clientX;
    isSwiping.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0]!.clientX;
    const diff = Math.abs(touchStartX.current - touchEndX.current);
    if (diff > 10) {
      isSwiping.current = true;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isSwiping.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (diff > threshold) {
      // Swipe left → next image
      updateImage(nextImageIndex.toString());
    } else if (diff < -threshold) {
      // Swipe right → previous image
      updateImage(previousImageIndex.toString());
    }
    isSwiping.current = false;
  }, [nextImageIndex, previousImageIndex, updateImage]);

  return (
    <div className="flex h-full w-full gap-4">
      {/* Thumbnails Sidebar — Desktop only */}
      {images.length > 1 && (
        <div className="hidden lg:flex w-24 shrink-0 flex-col gap-4 overflow-y-auto no-scrollbar pb-4 pt-1 px-1">
          {images.map((img, index) => (
            <button
              key={`${index}-${img.src}`}
              type="button"
              onClick={() => updateImage(index.toString())}
              aria-label={`Ver imagem ${index + 1}`}
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
                quality={90}
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="group relative flex-1 h-full overflow-hidden bg-neutral-50 border border-neutral-100">
        {/* Desktop: Zoom interaction */}
        <div
          ref={imageRef}
          role="region"
          aria-label="Imagem do produto com zoom"
          tabIndex={0}
          className={clsx(
            "relative h-full w-full overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-neutral-900",
            "lg:cursor-zoom-in",
            isZoomed && "lg:cursor-zoom-out"
          )}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          onFocus={() => setIsZoomed(true)}
          onBlur={() => setIsZoomed(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {images[imageIndex] && (
            <Image
              className={clsx(
                "h-full w-full object-cover object-center transition-transform duration-300 mix-blend-multiply",
                isZoomed && "lg:scale-150"
              )}
              style={isZoomed ? {
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
              } : {}}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              alt={images[imageIndex]?.altText || ""}
              src={images[imageIndex]?.src || ""}
              quality={90}
              priority={true}
            />
          )}
        </div>

        {/* Zoom Indicator — Desktop only */}
        <div className="absolute right-6 top-6 hidden lg:block opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs text-neutral-600 shadow-lg">
            <MagnifyingGlassIcon className="h-3.5 w-3.5" />
            <span>Zoom</span>
          </div>
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            {/* Mobile: always visible, semi-transparent */}
            <button
              type="button"
              onClick={() => updateImage(previousImageIndex.toString())}
              aria-label="Imagem anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center h-10 w-10 rounded-full bg-white/80 text-neutral-700 shadow-md transition-all active:scale-95 lg:left-4 lg:h-11 lg:w-11 lg:opacity-0 lg:group-hover:opacity-100 lg:hover:bg-white lg:hover:scale-110"
            >
              <ArrowLeftIcon className="h-4 w-4 lg:h-5 lg:w-5" />
            </button>
            <button
              type="button"
              onClick={() => updateImage(nextImageIndex.toString())}
              aria-label="Próxima imagem"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center h-10 w-10 rounded-full bg-white/80 text-neutral-700 shadow-md transition-all active:scale-95 lg:right-4 lg:h-11 lg:w-11 lg:opacity-0 lg:group-hover:opacity-100 lg:hover:bg-white lg:hover:scale-110"
            >
              <ArrowRightIcon className="h-4 w-4 lg:h-5 lg:w-5" />
            </button>
          </>
        )}

        {/* Image Counter — Mobile */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 lg:hidden">
            <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-medium tracking-wider text-neutral-600 shadow-sm">
              {imageIndex + 1} / {images.length}
            </span>
          </div>
        )}

        {/* Dot Indicators — Mobile */}
        {images.length > 1 && (
          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2.5 lg:hidden">
            {images.map((_, index) => (
              <button
                key={`dot-${index}-${images[index]?.src}`}
                type="button"
                onClick={() => updateImage(index.toString())}
                aria-label={`Ver imagem ${index + 1}`}
                className={clsx(
                  "h-2 rounded-full transition-all duration-300",
                  index === imageIndex
                    ? "w-7 bg-neutral-800"
                    : "w-2 bg-neutral-800/30 active:bg-neutral-800/60"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
