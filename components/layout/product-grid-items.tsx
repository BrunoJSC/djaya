import Grid from "components/grid";
import { Product } from "lib/shopify/types";
import { ProductCard } from "components/home/product-card";

export default function ProductGridItems({
  products,
}: Readonly<{
  products: Product[];
}>) {
  return (
    <>
      {products.map((product) => (
        <Grid.Item key={product.handle} className="animate-fadeIn">
          <ProductCard product={product} variant="minimal" />
        </Grid.Item>
      ))}
    </>
  );
}
