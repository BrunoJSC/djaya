import { cn } from "@/lib/utils";
import { CartProvider } from "components/cart/cart-context";
import Footer from "components/layout/footer";
import { Navbar } from "components/layout/navbar";
import { getCart } from "lib/shopify";
import { baseUrl } from "lib/utils";
import { Roboto } from "next/font/google";

import { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const { SITE_NAME } = process.env;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {

  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart();

  return (
    <html lang="pt-BR" className={cn(roboto.variable, "font-sans")} suppressHydrationWarning>
      <body className="antialiased selection:bg-amber-200 selection:text-amber-900" suppressHydrationWarning>
        <CartProvider cartPromise={cart}>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster closeButton />
        </CartProvider>
      </body>
    </html>
  );
}
