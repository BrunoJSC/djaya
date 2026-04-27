"use client";

import clsx from "clsx";
import { ProductOption, ProductVariant } from "lib/shopify/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
    const isSize =
      optionNameLowerCase.includes("size") ||
      optionNameLowerCase.includes("tamanho") ||
      optionNameLowerCase.includes("aro");
    const isColor =
      optionNameLowerCase.includes("color") ||
      optionNameLowerCase.includes("metal") ||
      optionNameLowerCase.includes("cor");

    // Detect if it's ring sizes (numbers between 10-30)
    const isRingSize =
      isSize &&
      option.values.every((v) => {
        const n = Number(v);
        return !isNaN(n) && n >= 8 && n <= 35;
      });

    return (
      <div
        key={option.id}
        className="mb-8 border-b border-neutral-200 pb-8 last:border-b-0 last:pb-0"
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-900">
            {option.name}
            {isSize && activeValue && (
              <span className="ml-2 font-normal text-neutral-500">
                — {activeValue}
              </span>
            )}
          </span>
          {isSize && <SizeGuideButton />}
          {isColor && (
            <span className="text-[10px] text-neutral-500">
              {activeValue || option.values[0]}
            </span>
          )}
        </div>

        {isRingSize ? (
          <RingSizeSelector
            option={option}
            activeValue={activeValue || option.values[0] || ""}
            combinations={combinations}
            options={options}
            searchParams={searchParams}
            onSelect={(value) => updateOption(optionNameLowerCase, value)}
          />
        ) : (
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

              const isActive =
                activeValue === value ||
                (!activeValue && value === option.values[0]);

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
                    isActive && !isColor
                      ? "border-neutral-900 bg-neutral-50"
                      : "border-neutral-200 hover:border-neutral-400",
                    !isAvailableForSale && "opacity-40",
                  )}
                  style={isColor ? getMetalColor(value) : {}}
                >
                  {!isColor && value}
                  {isColor && isActive && (
                    <span className="absolute -inset-1 rounded-full border border-neutral-400" />
                  )}
                  {!isAvailableForSale && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="h-full w-[1px] bg-neutral-300 rotate-45" />
                    </span>
                  )}
                </button>
              );
            })}
          </dd>
        )}
      </div>
    );
  });
}

// Ring size selector — horizontal scroll with active indicator
function RingSizeSelector({
  option,
  activeValue,
  combinations,
  options,
  searchParams,
  onSelect,
}: {
  option: ProductOption;
  activeValue: string;
  combinations: Combination[];
  options: ProductOption[];
  searchParams: URLSearchParams;
  onSelect: (value: string) => void;
}) {
  const optionNameLowerCase = option.name.toLowerCase();

  return (
    <div className="relative">
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
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

          const isActive = activeValue === value;

          return (
            <button
              key={value}
              type="button"
              onClick={() => onSelect(value)}
              disabled={!isAvailableForSale}
              aria-label={`Aro ${value}${isAvailableForSale ? "" : " - Indisponível"}`}
              className={clsx(
                "relative flex h-12 w-12 shrink-0 items-center justify-center border text-sm transition-all duration-200",
                isActive
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 text-neutral-700 hover:border-neutral-400",
                !isAvailableForSale && "opacity-30 line-through",
              )}
            >
              {value}
            </button>
          );
        })}
      </div>

      {/* Ring size reference */}
      <div className="mt-4 flex items-center gap-4 text-[10px] text-neutral-400">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 border border-neutral-900 bg-neutral-900" />
          Selecionado
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 border border-neutral-200" />
          Disponível
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 border border-neutral-200 opacity-30 line-through" />
          Indisponível
        </span>
      </div>
    </div>
  );
}

// Size guide button with mobile-friendly modal (bottom sheet on mobile)
function SizeGuideButton() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 underline underline-offset-4 transition-colors hover:text-neutral-900"
      >
        Guia de Medidas
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          {/* Modal: flex column — header fixed, body scrolls */}
          <div
            className={clsx(
              "relative flex w-full flex-col bg-white shadow-2xl",
              "max-h-[85vh] rounded-t-2xl",
              "sm:mx-4 sm:max-w-lg sm:rounded-t-none sm:max-h-[80vh]"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile drag handle */}
            <div className="flex shrink-0 justify-center pt-3 pb-0 sm:hidden">
              <div className="h-1 w-10 rounded-full bg-neutral-300" />
            </div>

            {/* Header — always visible */}
            <div className="flex shrink-0 items-center justify-between bg-white px-5 py-4 sm:px-8 sm:py-6 border-b border-neutral-100 rounded-t-2xl sm:rounded-t-none">
              <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                Guia de Medidas — Anéis
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Fechar guia de medidas"
                className="flex items-center justify-center h-8 w-8 shrink-0 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Scrollable content — takes remaining space */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-8 pt-4 sm:px-8 sm:pb-8 sm:pt-6">
              <p className="mb-5 text-xs leading-relaxed text-neutral-500">
                Para descobrir seu tamanho, meça o diâmetro interno de um anel que
                sirva confortavelmente ou meça a circunferência do seu dedo com
                uma fita métrica.
              </p>

              <div className="overflow-hidden border border-neutral-200">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50">
                      <th className="px-3 py-3 text-left font-medium text-neutral-900 sm:px-4">
                        Aro
                      </th>
                      <th className="px-3 py-3 text-left font-medium text-neutral-900 sm:px-4">
                        Diâmetro (mm)
                      </th>
                      <th className="px-3 py-3 text-left font-medium text-neutral-900 sm:px-4">
                        Circunf. (mm)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {RING_SIZE_TABLE.map((row, i) => (
                      <tr
                        key={row.size}
                        className={clsx(
                          "border-b border-neutral-100 last:border-0",
                          i % 2 === 0 ? "bg-white" : "bg-neutral-50/50",
                        )}
                      >
                        <td className="px-3 py-2.5 font-medium text-neutral-900 sm:px-4">
                          {row.size}
                        </td>
                        <td className="px-3 py-2.5 text-neutral-600 sm:px-4">
                          {row.diameter}
                        </td>
                        <td className="px-3 py-2.5 text-neutral-600 sm:px-4">
                          {row.circumference}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-[10px] text-neutral-400">
                Em caso de dúvida, entre em contato conosco para uma medição
                personalizada.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const RING_SIZE_TABLE = [
  { size: 10, diameter: "15.9", circumference: "49.9" },
  { size: 11, diameter: "16.3", circumference: "51.2" },
  { size: 12, diameter: "16.7", circumference: "52.5" },
  { size: 13, diameter: "17.1", circumference: "53.7" },
  { size: 14, diameter: "17.5", circumference: "54.9" },
  { size: 15, diameter: "17.9", circumference: "56.2" },
  { size: 16, diameter: "18.3", circumference: "57.5" },
  { size: 17, diameter: "18.7", circumference: "58.7" },
  { size: 18, diameter: "19.1", circumference: "60.0" },
  { size: 19, diameter: "19.5", circumference: "61.2" },
  { size: 20, diameter: "19.9", circumference: "62.5" },
  { size: 21, diameter: "20.3", circumference: "63.7" },
  { size: 22, diameter: "20.7", circumference: "64.9" },
  { size: 23, diameter: "21.1", circumference: "66.2" },
  { size: 24, diameter: "21.5", circumference: "67.5" },
  { size: 25, diameter: "21.9", circumference: "68.7" },
  { size: 26, diameter: "22.3", circumference: "70.0" },
  { size: 27, diameter: "22.7", circumference: "71.2" },
  { size: 28, diameter: "23.1", circumference: "72.5" },
];

function getMetalColor(value: string) {
  const metalColors: Record<string, React.CSSProperties> = {
    "Yellow Gold": { backgroundColor: "#E3C986" },
    "Ouro Amarelo": { backgroundColor: "#E3C986" },
    "White Gold": { backgroundColor: "#F0EFEB" },
    "Ouro Branco": { backgroundColor: "#F0EFEB" },
    "Rose Gold": { backgroundColor: "#E6B8A2" },
    "Ouro Rosé": { backgroundColor: "#E6B8A2" },
    Silver: { backgroundColor: "#D3D3D3" },
    Prata: { backgroundColor: "#D3D3D3" },
    "Ouro Branco 18k": { backgroundColor: "#F0EFEB" },
  };

  return metalColors[value] || { backgroundColor: value.toLowerCase() };
}
