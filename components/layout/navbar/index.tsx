import { UserIcon } from "@heroicons/react/24/outline";
import CartModal from "components/cart/modal";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import MobileMenu from "./mobile-menu";
import PrataNavigationMenu from "./prata-navigation-menu";

const leftMenuItemsBeforePrata = [
  { title: "OURO", path: "/search/ouro" },
];

const leftMenuItemsAfterPrata = [
  { title: "LAÇOS", path: "/search/lacos" },
  { title: "PEDRA", path: "/search/pedra" },
];

const prataMenuItem = { title: "PRATA", path: "/search/prata" };

const rightMenuItems = [
  { title: "SOBRE", path: "/sobre" },
  { title: "ONDE ESTAMOS", path: "/onde-estamos" },
];

const navLinkClass =
  "text-[11px] font-medium tracking-[0.18em] text-neutral-500 uppercase transition-colors hover:text-neutral-900";

export async function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200/50 supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-3 sm:px-6 lg:px-12">
        {/* Mobile menu & Left Links */}
        <div className="flex flex-1 items-center justify-start">
          <div className="md:hidden">
            <Suspense fallback={null}>
              <MobileMenu
                menu={[
                  ...leftMenuItemsBeforePrata,
                  prataMenuItem,
                  ...leftMenuItemsAfterPrata,
                  ...rightMenuItems,
                ]}
              />
            </Suspense>
          </div>
          <ul className="hidden md:flex md:items-center md:gap-6">
            {leftMenuItemsBeforePrata.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.path}
                  prefetch={true}
                  className={navLinkClass}
                >
                  {item.title}
                </Link>
              </li>
            ))}
            <li>
              <PrataNavigationMenu />
            </li>
            {leftMenuItemsAfterPrata.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.path}
                  prefetch={true}
                  className={navLinkClass}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Center Logo */}
        <div className="flex flex-none flex-col items-center justify-center">
          <Link
            href="/"
            prefetch={true}
            className="flex flex-col items-center justify-center"
          >
            <span className="text-xl font-bold tracking-[0.26em] text-neutral-900 uppercase sm:text-2xl">
              DJAYA LEVY
            </span>
          </Link>
        </div>

        {/* Right Links & Icons */}
        <div className="flex flex-1 items-center justify-end gap-4 md:gap-5">
          <ul className="hidden md:flex md:items-center md:gap-6">
            {rightMenuItems.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.path}
                  prefetch={true}
                  className={navLinkClass}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            {/* Account */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Account"
              className="group flex items-center justify-center transition-colors hover:text-neutral-900"
            >
              <UserIcon className="h-5 w-5 text-neutral-400 transition-colors group-hover:text-neutral-900" />
            </Button>
            {/* Cart */}
            <Suspense fallback={null}>
              <CartModal />
            </Suspense>
          </div>
        </div>
      </div>
    </nav>
  );
}
