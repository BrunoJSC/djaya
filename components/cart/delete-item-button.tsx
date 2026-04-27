"use client";

import { XIcon } from "@phosphor-icons/react";
import { removeItem } from "components/cart/actions";
import type { CartItem } from "lib/shopify/types";
import { useActionState } from "react";

export function DeleteItemButton({
  item,
  optimisticUpdate,
}: {
  item: CartItem;
  optimisticUpdate: any;
}) {
  const [message, formAction] = useActionState(removeItem, null);
  const merchandiseId = item.merchandise.id;
  const removeItemAction = formAction.bind(null, merchandiseId);

  return (
    <form>
      <button
        type="submit"
        aria-label="Remover item da sacola"
        className="text-[10px] tracking-widest uppercase text-neutral-400 hover:text-neutral-900 transition-colors underline underline-offset-4"
        onClick={async () => {
          optimisticUpdate(merchandiseId, "delete");
          removeItemAction();
        }}
      >
        Remover
      </button>
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
