import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProductCard } from "./product-card";

const mockProduct = {
  id: "gid://shopify/Product/1",
  handle: "anel-solitaire",
  title: "Anel Solitaire Éternel",
  description: "Anel solitário em ouro branco 18k com diamante central.",
  descriptionHtml: "<p>Anel solitário em ouro branco 18k com diamante central.</p>",
  availableForSale: true,
  options: [],
  variants: [],
  tags: ["New"],
  priceRange: {
    minVariantPrice: { amount: "12900.00", currencyCode: "BRL" },
    maxVariantPrice: { amount: "12900.00", currencyCode: "BRL" },
  },
  featuredImage: {
    url: "https://placehold.co/400x500/f5f5f5/a3a3a3?text=Anel+Solitaire",
    altText: "Anel Solitaire Éternel",
    width: 400,
    height: 500,
  },
  images: [],
  seo: { title: "Anel Solitaire", description: "" },
  updatedAt: new Date().toISOString(),
  collections: [],
};

const meta: Meta<typeof ProductCard> = {
  title: "Commerce/ProductCard",
  component: ProductCard,
  parameters: {
    layout: "centered",
    nextjs: { appDirectory: true },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "radio",
      options: ["default", "minimal"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    product: mockProduct as any,
    variant: "default",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
};

export const Minimal: Story = {
  args: {
    product: mockProduct as any,
    variant: "minimal",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
};

export const WithoutBadge: Story = {
  args: {
    product: { ...mockProduct, tags: [] } as any,
    variant: "minimal",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
};
