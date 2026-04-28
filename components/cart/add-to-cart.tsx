"use client";

import { addItem } from "components/cart/actions";
import { Product, ProductVariant } from "lib/shopify/types";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "./cart-context";

function SubmitButton({
  availableForSale,
  selectedVariantId,
}: Readonly<{
  availableForSale: boolean;
  selectedVariantId: string | undefined;
}>) {
  if (!availableForSale) {
    return (
      <Button
        disabled
        variant="secondary"
        className="flex h-auto w-full items-center justify-center gap-2 rounded-none bg-neutral-200 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-500"
      >
        Esgotado
      </Button>
    );
  }

  if (!selectedVariantId) {
    return (
      <Button
        aria-label="Por favor, selecione um tamanho"
        disabled
        className="flex h-auto w-full items-center justify-center gap-2 rounded-none bg-neutral-400 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-white opacity-80"
      >
        Selecione um tamanho
      </Button>
    );
  }

  return (
    <Button
      aria-label="Adicionar à sacola"
      type="submit"
      className="group flex h-auto w-full items-center justify-center gap-3 rounded-none bg-neutral-900 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-all hover:bg-neutral-800"
    >
      Adicionar à Sacola
    </Button>
  );
}

export function AddToCart({ product }: Readonly<{ product: Product }>) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const searchParams = useSearchParams();
  const [message, formAction] = useActionState(addItem, null);

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase()),
    ),
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const addItemAction = formAction.bind(null, selectedVariantId);
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId,
  )!;

  return (
    <form
      action={async () => {
        addCartItem(finalVariant, product);
        addItemAction();
      }}
      className="flex flex-col gap-6"
    >
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}

