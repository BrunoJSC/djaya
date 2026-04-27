import StackedSticky, { type StackedItem } from "components/home/stacked-sticky";
import { getCollection, getCollectionProducts } from "lib/shopify";
import Link from "next/link";

export const metadata = {
  description:
    "Loja de joias finas com pecas exclusivas em ouro, prata e pedras preciosas.",
  openGraph: {
    type: "website",
  },
};

type FeaturedCollection = {
  handle: string;
  title: string;
  description: string;
  imageUrl: string | null;
  imageAlt: string;
};

export default async function HomePage() {
  const featuredCollectionHandles = [
    "colecao-v-nus",
    "amuletos",
    "arco-iris",
    "deep-waters",
  ];

  const featuredCollections = await Promise.all(
    featuredCollectionHandles.map(async (handle): Promise<FeaturedCollection> => {
      const [collection, products] = await Promise.all([
        getCollection(handle),
        getCollectionProducts({ collection: handle }),
      ]);
      const fallbackImage = products.find((product) => product.featuredImage?.url)
        ?.featuredImage;

      return {
        handle,
        title: collection?.title || handle.replaceAll("-", " "),
        description:
          collection?.description?.trim() ||
          "Uma selecao autoral com joias de identidade marcante.",
        imageUrl: collection?.image?.url || fallbackImage?.url || null,
        imageAlt:
          collection?.image?.altText || collection?.title || "Colecao em destaque",
      };
    }),
  );

  const visibleCollections = featuredCollections.filter(
    (collection) => collection.imageUrl,
  );

  const items: StackedItem[] = visibleCollections.map((collection) => ({
    eyebrow: collection.handle === "colecao-v-nus" ? "Djaya Levy" : "Colecao",
    title: collection.title,
    description:
      collection.handle === "colecao-v-nus"
        ? "Uma selecao autoral em alta joalheria."
        : collection.description,
    href: `/search/${collection.handle}`,
    cta: "Explorar colecao",
    imageUrl: collection.imageUrl!,
    imageAlt: collection.imageAlt,
  }));

  return (
    <>
      {/* Sticky stacking (paused page) */}
      {items.length > 0 ? (
        <StackedSticky items={items} />
      ) : (
        <section className="w-full bg-background py-24">
          <div className="flex min-h-[40vh] items-center justify-center px-6 text-center">
            <p className="max-w-xl text-sm tracking-[0.15em] text-muted-foreground uppercase">
              Adicione imagens nas colecoes em destaque para exibir a home.
            </p>
          </div>
        </section>
      )}

      {/* Services strip, similar pattern to luxury maisons */}
      <section className="bg-white">
        <div className="mx-auto max-w-screen-2xl px-4 py-32 sm:px-6 lg:px-12">
          <div className="grid gap-12 border-y border-neutral-100 py-20 md:grid-cols-3">
            <div>
              <p className="text-[10px] font-medium tracking-[0.32em] text-neutral-900 uppercase">
                Entrega
              </p>
              <p className="mt-4 text-xs leading-relaxed text-neutral-400">
                Envio com embalagem segura e acompanhamento.
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium tracking-[0.32em] text-neutral-900 uppercase">
                Trocas
              </p>
              <p className="mt-4 text-xs leading-relaxed text-neutral-400">
                Troca ou devolução facilitada conforme política.
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium tracking-[0.32em] text-neutral-900 uppercase">
                Embalagem
              </p>
              <p className="mt-4 text-xs leading-relaxed text-neutral-400">
                Apresentação premium projetada para presentear.
              </p>
            </div>
          </div>

          <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-[10px] font-medium tracking-[0.34em] text-neutral-400 uppercase">
              La Maison
            </p>
            <Link
              href="/sobre"
              className="border-b border-neutral-300 pb-1 text-[10px] font-medium tracking-[0.32em] text-neutral-900 uppercase hover:border-neutral-900 transition-colors"
            >
              Conheça o atelier
            </Link>
          </div>
        </div>
      </section>

    </>
  );
}
