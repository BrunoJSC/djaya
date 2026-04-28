"use client";

import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { XIcon } from "@phosphor-icons/react";
import LoadingDots from "components/loading-dots";
import Price from "components/price";
import { DEFAULT_OPTION } from "lib/constants";
import { createUrl } from "lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createCartAndSetCookie, redirectToCheckout } from "./actions";
import { useCart } from "./cart-context";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemQuantityButton } from "./edit-item-quantity-button";
import OpenCart from "./open-cart";
import { Button } from "@/components/ui/button";

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal() {
  const { cart, updateCartItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);

  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie();
    }
  }, [cart]);

  useEffect(() => {
    if (
      cart?.totalQuantity &&
      cart?.totalQuantity !== quantityRef.current &&
      cart?.totalQuantity > 0
    ) {
      if (!isOpen) {
        setIsOpen(true);
      }
      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity, quantityRef]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" asChild aria-label="Abrir sacola">
          <button>
            <OpenCart quantity={cart?.totalQuantity} />
          </button>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full border-l border-neutral-200/60 bg-white p-0 sm:w-[420px]"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <SheetHeader className="px-6 py-5">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg font-bold tracking-wide text-neutral-900">
                Sacola
              </SheetTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full text-neutral-400 transition-colors hover:text-neutral-900 hover:bg-neutral-100"
              >
                <XIcon className="h-4 w-4" weight="bold" />
              </Button>
            </div>
            {cart && cart.lines.length > 0 && (
              <p className="mt-1 text-[11px] tracking-[0.1em] text-neutral-400 uppercase">
                {cart.totalQuantity} {cart.totalQuantity === 1 ? "item" : "itens"}
              </p>
            )}
          </SheetHeader>

          <div className="mx-6 h-px bg-neutral-100" />

          {!cart || cart.lines.length === 0 ? (
            /* Empty State */
            <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6">
              <ShoppingBagIcon className="h-10 w-10 text-neutral-300" strokeWidth={1} />
              <div className="text-center">
                <p className="text-lg font-bold text-neutral-900">
                  Sua sacola está vazia
                </p>
                <p className="mt-2 text-xs text-neutral-400">
                  Explore nossas coleções e encontre a joia perfeita.
                </p>
              </div>
              <Button
                variant="link"
                onClick={() => setIsOpen(false)}
                className="mt-2 h-auto p-0 rounded-none border-b border-neutral-900 pb-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-900 transition-colors hover:border-neutral-600 hover:text-neutral-600"
              >
                Continuar Explorando
              </Button>
            </div>
          ) : (
            <>
              {/* Items */}
              <ScrollArea className="flex-1">
                <ul className="px-6 py-5 space-y-5">
                  {cart.lines
                    .sort((a, b) =>
                      a.merchandise.product.title.localeCompare(
                        b.merchandise.product.title,
                      ),
                    )
                    .map((item, i) => {
                      const merchandiseSearchParams =
                        {} as MerchandiseSearchParams;

                      item.merchandise.selectedOptions.forEach(
                        ({ name, value }) => {
                          if (value !== DEFAULT_OPTION) {
                            merchandiseSearchParams[name.toLowerCase()] =
                              value;
                          }
                        },
                      );

                      const merchandiseUrl = createUrl(
                        `/product/${item.merchandise.product.handle}`,
                        new URLSearchParams(merchandiseSearchParams),
                      );

                      return (
                        <li key={i}>
                          <div className="relative flex gap-5">
                            {/* Image */}
                            <Link
                              href={merchandiseUrl}
                              onClick={() => setIsOpen(false)}
                              className="relative h-24 w-24 shrink-0 overflow-hidden bg-neutral-50"
                            >
                              <Image
                                className="h-full w-full object-cover mix-blend-multiply"
                                fill
                                sizes="96px"
                                quality={85}
                                alt={
                                  item.merchandise.product.featuredImage
                                    .altText ||
                                  item.merchandise.product.title
                                }
                                src={
                                  item.merchandise.product.featuredImage.url
                                }
                              />
                            </Link>

                            {/* Info */}
                            <div className="flex flex-1 flex-col justify-between py-1">
                              <div>
                                <div className="flex justify-between items-start gap-2">
                                  <Link
                                    href={merchandiseUrl}
                                    onClick={() => setIsOpen(false)}
                                  >
                                    <h3 className="font-medium text-sm text-neutral-900 leading-snug line-clamp-2 hover:text-neutral-600 transition-colors">
                                      {item.merchandise.product.title}
                                    </h3>
                                  </Link>
                                  <Price
                                    amount={item.cost.totalAmount.amount}
                                    currencyCode={item.cost.totalAmount.currencyCode}
                                    className="text-sm font-medium text-neutral-900 shrink-0"
                                  />
                                </div>
                                {item.merchandise.title !== DEFAULT_OPTION && (
                                  <p className="mt-1 text-[10px] tracking-[0.08em] text-neutral-400 uppercase">
                                    {item.merchandise.title}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center justify-between mt-3">
                                {/* Quantity */}
                                <div className="flex items-center gap-2">
                                  <EditItemQuantityButton
                                    item={item}
                                    type="minus"
                                    optimisticUpdate={updateCartItem}
                                  />
                                  <span className="w-4 text-center text-[11px] font-medium text-neutral-700">
                                    {item.quantity}
                                  </span>
                                  <EditItemQuantityButton
                                    item={item}
                                    type="plus"
                                    optimisticUpdate={updateCartItem}
                                  />
                                </div>
                                
                                {/* Delete button */}
                                <DeleteItemButton
                                  item={item}
                                  optimisticUpdate={updateCartItem}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Divider */}
                          {i < cart.lines.length - 1 && (
                            <div className="mt-5 h-px bg-neutral-100" />
                          )}
                        </li>
                      );
                    })}
                </ul>
              </ScrollArea>

              {/* Footer */}
              <div className="border-t border-neutral-200/80 bg-white px-6 py-5">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-400">Impostos</span>
                    <Price
                      amount={cart.cost.totalTaxAmount.amount}
                      currencyCode={cart.cost.totalTaxAmount.currencyCode}
                      className="text-xs text-neutral-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-400">Frete</span>
                    <span className="text-xs text-neutral-400">
                      Calculado no checkout
                    </span>
                  </div>
                </div>

                <div className="my-4 h-px bg-neutral-100" />

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium tracking-[0.15em] text-neutral-900 uppercase">
                    Total
                  </span>
                  <Price
                    amount={cart.cost.totalAmount.amount}
                    currencyCode={cart.cost.totalAmount.currencyCode}
                    className="text-lg font-bold text-neutral-900"
                  />
                </div>

                <form action={redirectToCheckout} className="mt-5">
                  <CheckoutButton />
                </form>

                <Button
                  variant="link"
                  onClick={() => setIsOpen(false)}
                  className="mx-auto mt-3 flex h-auto p-0 text-[10px] tracking-[0.15em] text-neutral-400 uppercase transition-colors hover:text-neutral-900"
                >
                  Continuar comprando
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function CheckoutButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="flex h-auto w-full items-center justify-center rounded-none bg-neutral-900 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
    >
      {pending ? (
        <LoadingDots className="bg-white" />
      ) : (
        "Finalizar Compra"
      )}
    </Button>
  );
}
