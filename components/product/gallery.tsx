"use client";

import { ArrowLeftIcon, ArrowRightIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export function Gallery({
  images,
}: Readonly<{
  images: { src: string; altText: string }[];
}>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const imageSearchIndex = searchParams.has("image")
    ? Number.parseInt(searchParams.get("image")!)
    : 0;

  // Embla Carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
    startIndex: imageSearchIndex,
    // Disable drag on desktop (lg+) so zoom works; enable on mobile
    watchDrag: (_, event) => {
      // TouchEvent = mobile drag, MouseEvent = desktop drag
      return event instanceof TouchEvent;
    },
  });

  const [selectedIndex, setSelectedIndex] = useState(imageSearchIndex);

  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const imageRef = useRef<HTMLDivElement>(null);

  // Sync Embla selected index → URL param + local state
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);

    const params = new URLSearchParams(searchParams.toString());
    params.set("image", index.toString());
    router.replace(`?${params.toString()}`, { scroll: false });
    setIsZoomed(false);
  }, [emblaApi, router, searchParams]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Sync URL param → Embla (when user clicks thumbnail)
  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi],
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Desktop zoom handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div className="flex h-full w-full gap-4">
      {/* Thumbnails Sidebar — Desktop only */}
      {images.length > 1 && (
        <div className="hidden lg:flex w-24 shrink-0 flex-col gap-4 overflow-y-auto no-scrollbar pb-4 pt-1 px-1">
          {images.map((img, index) => (
            <button
              key={`${index}-${img.src}`}
              type="button"
              onClick={() => scrollTo(index)}
              aria-label={`Ver imagem ${index + 1}`}
              className={clsx(
                "relative aspect-square w-full overflow-hidden bg-neutral-50 transition-all",
                index === selectedIndex
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

      {/* Main Image — Embla Carousel */}
      <div className="group relative flex-1 h-full overflow-hidden bg-neutral-50 border border-neutral-100">
        {/* Embla viewport */}
        <div
          className="h-full w-full overflow-hidden"
          ref={emblaRef}
        >
          <div className="flex h-full touch-pan-y">
            {images.map((img, index) => (
              <div
                key={`slide-${index}-${img.src}`}
                className="relative h-full w-full flex-[0_0_100%] min-w-0"
              >
                {/* Desktop: Zoom interaction layer (only on active slide) */}
                <div
                  ref={index === selectedIndex ? imageRef : null}
                  role="region"
                  aria-label="Imagem do produto com zoom"
                  tabIndex={index === selectedIndex ? 0 : -1}
                  className={clsx(
                    "relative h-full w-full overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-neutral-900",
                    "lg:cursor-zoom-in",
                    isZoomed && index === selectedIndex && "lg:cursor-zoom-out"
                  )}
                  onMouseEnter={() => setIsZoomed(true)}
                  onMouseLeave={() => setIsZoomed(false)}
                  onMouseMove={handleMouseMove}
                  onFocus={() => setIsZoomed(true)}
                  onBlur={() => setIsZoomed(false)}
                >
                  <Image
                    className={clsx(
                      "h-full w-full object-cover object-center transition-transform duration-300 mix-blend-multiply",
                      isZoomed && index === selectedIndex && "lg:scale-150"
                    )}
                    style={
                      isZoomed && index === selectedIndex
                        ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }
                        : {}
                    }
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    alt={img.altText || ""}
                    src={img.src || ""}
                    quality={90}
                    priority={index === 0}
                  />
                </div>
              </div>
            ))}
          </div>
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
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Imagem anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center h-10 w-10 rounded-full bg-white/80 text-neutral-700 shadow-md transition-all active:scale-95 lg:left-4 lg:h-11 lg:w-11 lg:opacity-0 lg:group-hover:opacity-100 lg:hover:bg-white lg:hover:scale-110"
            >
              <ArrowLeftIcon className="h-4 w-4 lg:h-5 lg:w-5" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
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
              {selectedIndex + 1} / {images.length}
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
                onClick={() => scrollTo(index)}
                aria-label={`Ver imagem ${index + 1}`}
                className={clsx(
                  "h-2 rounded-full transition-all duration-300",
                  index === selectedIndex
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
