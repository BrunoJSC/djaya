import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import { ProductPagination } from "components/layout/product-pagination";
import { defaultSort, sorting } from "lib/constants";
import { getProducts } from "lib/shopify";

const PRODUCTS_PER_PAGE = 12;

export const metadata = {
  title: "Busca",
  description: "Busque produtos na loja.",
};

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { sort, q: searchValue, page } = searchParams as {
    [key: string]: string;
  };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const allProducts = await getProducts({
    sortKey,
    reverse,
    query: searchValue,
  });

  // Pagination
  const currentPage = Number(page || "1");
  const totalProducts = allProducts.length;
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const products = allProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const resultsText = totalProducts > 1 ? "resultados" : "resultado";

  return (
    <>
      {searchValue ? (
        <p className="mb-4">
          {totalProducts === 0
            ? "Nenhum produto encontrado para "
            : `Exibindo ${totalProducts} ${resultsText} para `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {products.length > 0 ? (
        <>
          <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <ProductGridItems products={products} />
          </Grid>

          <ProductPagination
            totalProducts={totalProducts}
            productsPerPage={PRODUCTS_PER_PAGE}
          />
        </>
      ) : null}
    </>
  );
}
