"use client";

import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { updateItemQuantity } from "components/cart/actions";
import type { CartItem } from "lib/shopify/types";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";

function SubmitButton({ type }: { type: "plus" | "minus" }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      type="submit"
      aria-label={
        type === "plus" ? "Aumentar quantidade" : "Diminuir quantidade"
      }
      className="h-7 w-7 rounded-none text-neutral-400 transition-colors hover:text-neutral-900 hover:bg-neutral-100"
    >
      {type === "plus" ? (
        <PlusIcon className="h-3 w-3" />
      ) : (
        <MinusIcon className="h-3 w-3" />
      )}
    </Button>
  );
}

export function EditItemQuantityButton({
  item,
  type,
  optimisticUpdate,
}: {
  item: CartItem;
  type: "plus" | "minus";
  optimisticUpdate: any;
}) {
  const [message, formAction] = useActionState(updateItemQuantity, null);
  const payload = {
    merchandiseId: item.merchandise.id,
    quantity: type === "plus" ? item.quantity + 1 : item.quantity - 1,
  };
  const updateItemQuantityAction = formAction.bind(null, payload);

  return (
    <form
      action={async () => {
        optimisticUpdate(payload.merchandiseId, type);
        updateItemQuantityAction();
      }}
    >
      <SubmitButton type={type} />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
