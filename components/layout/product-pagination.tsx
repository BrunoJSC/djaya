"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ProductPaginationProps {
  totalProducts: number;
  productsPerPage?: number;
}

export function ProductPagination({
  totalProducts,
  productsPerPage = 12,
}: ProductPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") || "1");
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    const queryString = params.toString();
    return queryString ? `${pathname}?${queryString}` : pathname;
  };

  // Generate page numbers to show
  const getVisiblePages = () => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 7) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <Pagination className="mt-16">
      <PaginationContent className="gap-1">
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              href={createPageUrl(currentPage - 1)}
              text="Anterior"
              className="text-xs tracking-wider text-neutral-500 hover:text-neutral-900"
            />
          </PaginationItem>
        )}

        {getVisiblePages().map((page, index) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis className="text-neutral-400" />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href={createPageUrl(page)}
                isActive={page === currentPage}
                className={
                  page === currentPage
                    ? "border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800 hover:text-white"
                    : "text-neutral-500 hover:text-neutral-900"
                }
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext
              href={createPageUrl(currentPage + 1)}
              text="Próxima"
              className="text-xs tracking-wider text-neutral-500 hover:text-neutral-900"
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
