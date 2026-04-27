"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "components/ui/navigation-menu";

const prataCollections = [
  {
    title: "VÊNUS",
    href: "/search/colecao-v-nus",
  },
  {
    title: "AMULETOS",
    href: "/search/amuletos",
  },
];

export default function PrataNavigationMenu() {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="group h-auto bg-transparent px-3 py-1.5 text-[11px] font-medium tracking-[0.18em] text-foreground uppercase transition-all hover:text-primary data-[state=open]:text-primary">
            PRATA
          </NavigationMenuTrigger>
          <NavigationMenuContent className="mt-2 w-[200px] rounded-2xl border border-neutral-100 bg-white p-2 shadow-xl shadow-neutral-200/50">
            <ul className="grid gap-1">
              {prataCollections.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    prefetch={true}
                    className="block rounded-xl px-3 py-2.5 text-[10px] font-medium tracking-[0.2em] text-neutral-600 transition-all hover:bg-neutral-50 hover:text-neutral-900"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
