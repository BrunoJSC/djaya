"use client";

import clsx from "clsx";
import { ProductOption, ProductVariant } from "lib/shopify/types";
import { useRouter, useSearchParams } from "next/navigation";

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

export function VariantSelector({
  options,
  variants,
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasNoOptionsOrJustOneOption =
    !options.length ||
    (options.length === 1 && options[0]?.values.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const combinations: Combination[] = variants.map((variant) => ({
    id: variant.id,
    availableForSale: variant.availableForSale,
    ...variant.selectedOptions.reduce(
      (accumulator, option) => ({
        ...accumulator,
        [option.name.toLowerCase()]: option.value,
      }),
      {},
    ),
  }));

  const updateOption = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return options.map((option) => {
    const optionNameLowerCase = option.name.toLowerCase();
    const activeValue = searchParams.get(optionNameLowerCase);
    const isSize = optionNameLowerCase.includes("size") || optionNameLowerCase.includes("tamanho");
    const isColor = optionNameLowerCase.includes("color") || optionNameLowerCase.includes("metal") || optionNameLowerCase.includes("cor");

    return (
      <div key={option.id} className="mb-8 border-b border-neutral-200 pb-8 last:border-b-0 last:pb-0">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-900">
            {option.name}
          </span>
          {isSize ? (
            <button
              type="button"
              className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 transition-colors hover:text-neutral-900"
            >
              Guia de Medidas
            </button>
          ) : (
            <span className="text-[10px] text-neutral-500">
              {activeValue || option.values[0]}
            </span>
          )}
        </div>

        <dd className="flex flex-wrap gap-3">
          {option.values.map((value) => {
            const optionParams: Record<string, string> = {};
            searchParams.forEach((v, k) => (optionParams[k] = v));
            optionParams[optionNameLowerCase] = value;

            const filtered = Object.entries(optionParams).filter(
              ([key, value]) =>
                options.find(
                  (opt) =>
                    opt.name.toLowerCase() === key &&
                    opt.values.includes(value),
                ),
            );
            const isAvailableForSale = combinations.find((combination) =>
              filtered.every(
                ([key, value]) =>
                  combination[key] === value && combination.availableForSale,
              ),
            );

            const isActive = activeValue === value || (!activeValue && value === option.values[0]);

            return (
              <button
                type="button"
                onClick={() => updateOption(optionNameLowerCase, value)}
                key={value}
                aria-disabled={!isAvailableForSale}
                disabled={!isAvailableForSale}
                title={`${option.name} ${value}${isAvailableForSale ? "" : " (Indisponível)"}`}
                className={clsx(
                  "relative transition-all duration-200",
                  isColor
                    ? "h-11 w-11 rounded-full border border-neutral-300 shadow-sm"
                    : "min-w-[56px] h-12 border px-4 text-xs font-light",
                  isActive && !isColor ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 hover:border-neutral-400",
                  !isAvailableForSale && "opacity-40"
                )}
                style={isColor ? getMetalColor(value) : {}}
              >
                {!isColor && value}
                {/* Selected indicator for color swatches */}
                {isColor && isActive && (
                  <span className="absolute -inset-1 rounded-full border border-neutral-400" />
                )}
                {/* Availability indicator */}
                {!isAvailableForSale && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="h-full w-[1px] bg-neutral-300 rotate-45" />
                  </span>
                )}
              </button>
            );
          })}
        </dd>
      </div>
    );
  });
}

function getMetalColor(value: string) {
  const metalColors: Record<string, React.CSSProperties> = {
    "Yellow Gold": { backgroundColor: "#E3C986" }, // Soft Gold
    "Ouro Amarelo": { backgroundColor: "#E3C986" },
    "White Gold": { backgroundColor: "#F0EFEB" }, // Soft White/Platinum
    "Ouro Branco": { backgroundColor: "#F0EFEB" },
    "Rose Gold": { backgroundColor: "#E6B8A2" }, // Soft Rose
    "Ouro Rosé": { backgroundColor: "#E6B8A2" },
    "Silver": { backgroundColor: "#D3D3D3" },
    "Prata": { backgroundColor: "#D3D3D3" },
    "Ouro Branco 18k": { backgroundColor: "#F0EFEB" },
  };

  return metalColors[value] || { backgroundColor: value.toLowerCase() };
}

