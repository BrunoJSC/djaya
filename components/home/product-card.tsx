import Price from "components/price";
import { Product } from "lib/shopify/types";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "minimal";
}

export function ProductCard({ product, variant = "minimal" }: Readonly<ProductCardProps>) {
  const isNew = product.tags.includes("New");

  return (
    <Link href={`/product/${product.handle}`} className="group block">
      <div className="relative">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-50">
          {product.featuredImage && (
            <Image
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              quality={85}
              priority={false}
            />
          )}

          {/* New Badge */}
          {isNew && (
            <span className="absolute left-2 top-2 bg-white/90 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.2em] text-neutral-900 backdrop-blur-sm">
              New
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className={`mt-5 ${variant === "minimal" ? "text-center" : ""}`}>
          {/* Product Title */}
          <h3 className="font-medium text-sm text-neutral-900 group-hover:text-neutral-600">
            {product.title}
          </h3>

          {/* Price */}
          <div className="mt-1.5">
            <Price
              amount={product.priceRange.minVariantPrice.amount}
              currencyCode={product.priceRange.minVariantPrice.currencyCode}
              className="text-xs text-neutral-500"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
