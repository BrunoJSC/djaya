import { Gallery } from "components/product/gallery";
import { ProductInfo } from "components/product/product-info";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { HIDDEN_PRODUCT_TAG } from "lib/constants";
import { getProduct, getProducts } from "lib/shopify";
import type { Image as ShopifyImage } from "lib/shopify/types";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { TruckIcon, ShieldCheckIcon, EnvelopeIcon, SparklesIcon } from "@heroicons/react/24/outline";

export async function generateStaticParams() {
  const products = await getProducts({});
  return products.map((product) => ({
    handle: product.handle,
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt,
            },
          ],
        }
      : null,
  };
}

export default async function ProductPage(
  props: Readonly<{
    params: Promise<{ handle: string }>;
  }>,
) {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage.url,
    offers: {
      "@type": "AggregateOffer",
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />

      <div className="bg-white min-h-screen">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-12">
          {(() => {
            const collection = product.collections?.find(
              (c) => c.handle !== "frontpage" && c.title.toLowerCase() !== "página inicial"
            );
            return (
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/" className="text-xs uppercase tracking-widest text-neutral-400 hover:text-neutral-900">Início</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href={collection ? `/search/${collection.handle}` : "/search"} className="text-xs uppercase tracking-widest text-neutral-400 hover:text-neutral-900">
                        {collection?.title || "Produtos"}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-xs uppercase tracking-widest text-neutral-900">{product.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            );
          })()}
        </div>

        {/* Main Product Grid */}
        <div className="mx-auto max-w-screen-2xl px-4 pb-24 sm:px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
            {/* Left: Image Gallery - Sticky */}
            <div className="w-full lg:w-3/5">
              <div className="h-[60vh] sm:h-[65vh] lg:sticky lg:top-24 lg:h-[80vh]">
                <Suspense
                  fallback={
                    <div className="flex h-full w-full items-center justify-center bg-white/50">
                      <p className="text-sm font-light text-neutral-400">Carregando imagens...</p>
                    </div>
                  }
                >
                  <Gallery
                    images={product.images.slice(0, 5).map((image: ShopifyImage) => ({
                      src: image.url,
                      altText: image.altText,
                    }))}
                  />
                </Suspense>
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="w-full lg:w-2/5 pt-4">
              <Suspense fallback={null}>
                <ProductInfo product={product} />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Trust Badges Strip */}
        <div className="border-y border-neutral-200/60 bg-white">
          <div className="mx-auto max-w-screen-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-neutral-200/60">
            <BenefitItem 
              icon={<TruckIcon className="h-6 w-6" strokeWidth={1} />} 
              label="Entrega Assegurada" 
              description="Frete grátis com seguro total e embalagem em couro assinada Djaya Levy." 
            />
            <BenefitItem 
              icon={<ShieldCheckIcon className="h-6 w-6" strokeWidth={1} />} 
              label="Garantia Vitalícia" 
              description="Cuidado contínuo, polimento e reparos em todos os ateliês da Maison." 
            />
            <BenefitItem 
              icon={<SparklesIcon className="h-6 w-6" strokeWidth={1} />} 
              label="Certificado GIA" 
              description="Cada diamante acompanha laudo gemológico independente e exclusivo." 
            />
            <BenefitItem 
              icon={<EnvelopeIcon className="h-6 w-6" strokeWidth={1} />} 
              label="Gravação Pessoal" 
              description="Inclua iniciais, datas ou mensagens em até 24 caracteres, sem custo." 
            />
          </div>
        </div>

        {/* Sobre a Peça */}
        <div className="mx-auto max-w-screen-2xl px-4 py-32 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
            {/* Left Column - Sticky Title */}
            <div className="self-start lg:sticky lg:top-32">
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-500">
                Sobre a peça
              </span>
              <h2 className="mt-8 text-4xl lg:text-5xl xl:text-6xl font-bold leading-snug text-neutral-900">
                Uma herança de cem anos, contida em um único diamante.
              </h2>
            </div>

            {/* Right Column - Accordions */}
            <div className="flex flex-col mt-4">
              <details className="group border-y border-neutral-200 py-8" open>
                <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-medium text-neutral-900 focus:outline-none">
                  A peça
                  <span className="text-neutral-400 group-open:hidden transition-transform">+</span>
                  <span className="text-neutral-400 hidden group-open:inline transition-transform">&minus;</span>
                </summary>
                <div className="pt-8 prose prose-sm md:prose-base font-sans font-light leading-relaxed text-neutral-600 max-w-none">
                  <p>Apresentado pela primeira vez no salão da Place Vendôme em 1924, o Solitário Éternel permanece, há um século, como a mais pura expressão do savoir-faire da Maison Djaya Levy.</p>
                  <p className="mt-4">A icônica cravação em seis garras eleva o diamante, permitindo que a luz o atravesse de todos os ângulos. O aro estreito em ouro branco 18k é polido à mão para um acabamento espelhado, conferindo discreta presença ao redor do dedo.</p>
                  <p className="mt-4">Cada peça é numerada, assinada e acompanhada do livro de origem da Maison — um documento que registra a história do diamante desde sua descoberta até seu novo guardião.</p>
                </div>
              </details>
              
              <details className="group border-b border-neutral-200 py-8">
                <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-medium text-neutral-900 focus:outline-none">
                  Especificações
                  <span className="text-neutral-400 group-open:hidden transition-transform">+</span>
                  <span className="text-neutral-400 hidden group-open:inline transition-transform">&minus;</span>
                </summary>
                <div className="pt-8 prose prose-sm md:prose-base font-sans font-light leading-relaxed text-neutral-600 max-w-none">
                  <dl className="grid grid-cols-2 gap-y-6">
                    <div>
                      <dt className="text-[10px] font-medium uppercase tracking-widest text-neutral-900 mb-2">Material</dt>
                      <dd className="text-sm">Ouro Branco 18k</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-medium uppercase tracking-widest text-neutral-900 mb-2">Pedra Central</dt>
                      <dd className="text-sm">Diamante redondo brilhante</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-medium uppercase tracking-widest text-neutral-900 mb-2">Quilates</dt>
                      <dd className="text-sm">1.02 ct</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-medium uppercase tracking-widest text-neutral-900 mb-2">Cor</dt>
                      <dd className="text-sm">D (Excepcionalmente Branco)</dd>
                    </div>
                  </dl>
                </div>
              </details>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

function BenefitItem({
  icon,
  label,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="mb-4 text-neutral-800">{icon}</div>
      <span className="text-lg font-medium text-neutral-900 mb-3">{label}</span>
      <span className="text-xs font-light leading-relaxed text-neutral-500 max-w-[240px]">{description}</span>
    </div>
  );
}


