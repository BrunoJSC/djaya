"use client";

import { HeartIcon } from "@heroicons/react/24/outline";
import { AddToCart } from "components/cart/add-to-cart";
import Price from "components/price";
import Prose from "components/prose";
import { Product } from "lib/shopify/types";
import { VariantSelector } from "./variant-selector";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: Readonly<ProductInfoProps>) {
  const collectionName = product.collections?.[0]?.title || "Coleção Exclusiva";
  const sku = product.sku || `REF. AU-${product.id.substring(product.id.length - 6).toUpperCase()}`;

  const amount = Number.parseFloat(product.priceRange.maxVariantPrice.amount);
  const currencyCode = product.priceRange.maxVariantPrice.currencyCode;
  const installmentValue = amount / 12;
  const formattedInstallment = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currencyCode,
  }).format(installmentValue);

  return (
    <div className="flex flex-col">
      {/* Meta/Collection Info */}
      <div className="mb-4">
        <p className="text-[10px] font-medium tracking-[0.24em] text-neutral-500 uppercase">
          {collectionName} &middot; ALTA JOALHERIA
        </p>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-neutral-900 sm:text-5xl lg:text-6xl">
        {product.title}
      </h1>

      {/* SKU / Reference */}
      <div className="mt-4">
        <p className="text-[10px] font-medium tracking-[0.2em] text-neutral-400 uppercase">
          {sku}
        </p>
      </div>

      {/* Price */}
      <div className="mt-8 flex flex-col gap-1">
        <Price
          amount={product.priceRange.maxVariantPrice.amount}
          currencyCode={currencyCode}
          className="text-2xl font-bold text-neutral-900 sm:text-3xl"
        />
        <span className="text-[11px] font-light text-neutral-500 tracking-wider">
          ou em até 12x de {formattedInstallment} sem juros
        </span>
      </div>

      {/* Description */}
      {product.descriptionHtml && (
        <div className="mt-6 border-b border-neutral-200 pb-8">
          <Prose
            className="prose prose-sm font-sans font-light leading-relaxed text-neutral-600 max-w-none"
            html={product.descriptionHtml}
          />
        </div>
      )}

      {/* Variants */}
      <div className="mt-8">
        <VariantSelector options={product.options} variants={product.variants} />
      </div>

      {/* Add to Cart & Favorites */}
      <div className="mt-8 flex items-center gap-4">
        <div className="flex-1">
          <AddToCart product={product} />
        </div>
        <button
          type="button"
          aria-label="Adicionar aos favoritos"
          className="flex h-14 w-14 shrink-0 items-center justify-center border border-neutral-200 bg-white text-neutral-500 transition-colors hover:border-neutral-900 hover:text-neutral-900"
        >
          <HeartIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

