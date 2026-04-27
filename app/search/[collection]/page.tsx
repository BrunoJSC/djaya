import { getCollection, getCollectionProducts } from "lib/shopify";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import { ProductPagination } from "components/layout/product-pagination";
import { defaultSort, sorting } from "lib/constants";

const PRODUCTS_PER_PAGE = 12;

export async function generateMetadata(props: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const collection = await getCollection(params.collection);

  if (!collection) return notFound();

  return {
    title: collection.seo?.title || collection.title,
    description:
      collection.seo?.description ||
      collection.description ||
      `Produtos da coleção ${collection.title}`,
  };
}

export default async function CategoryPage(
  props: Readonly<{
    params: Promise<{ collection: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
  }>,
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { sort, page } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;
  const collection = await getCollection(params.collection);
  const allProducts = await getCollectionProducts({
    collection: params.collection,
    sortKey,
    reverse,
  });

  if (!collection) return notFound();

  // Pagination
  const currentPage = Number(page || "1");
  const totalProducts = allProducts.length;
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const products = allProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  return (
    <section className="min-h-screen bg-white py-12">
      {/* Header */}
      <div className="mx-auto mb-12 max-w-screen-2xl px-4 sm:px-6 lg:px-12">
        <p className="text-[10px] font-medium tracking-[0.3em] text-neutral-400 uppercase">
          {collection.title}
        </p>
        <h1 className="mt-3 text-3xl font-bold text-neutral-900 sm:text-4xl">
          {collection.title}
        </h1>
        {totalProducts > 0 && (
          <p className="mt-2 text-xs text-neutral-400">
            {totalProducts} {totalProducts === 1 ? "produto" : "produtos"}
          </p>
        )}
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-sm text-neutral-400">
            Nenhum produto encontrado nesta coleção.
          </p>
        </div>
      ) : (
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-12">
          <Grid className="grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12">
            <ProductGridItems products={products} />
          </Grid>

          {/* Pagination */}
          <ProductPagination
            totalProducts={totalProducts}
            productsPerPage={PRODUCTS_PER_PAGE}
          />
        </div>
      )}
    </section>
  );
}
