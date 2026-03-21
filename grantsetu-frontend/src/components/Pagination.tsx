"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  page: number;
  pages: number;
  total: number;
}

export default function Pagination({ page, pages, total }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (pages <= 1) return null;

  function goToPage(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`/grants?${params.toString()}`);
  }

  const visiblePages: number[] = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(pages, page + 2); i++) {
    visiblePages.push(i);
  }

  return (
    <nav className="flex items-center justify-between py-6" aria-label="Pagination">
      <p className="text-sm text-brand-400">
        Page {page} of {pages} ({total} grants)
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1.5 text-sm border border-brand-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-50 transition-colors font-medium text-brand-600"
          aria-label="Previous page"
        >
          Prev
        </button>
        {visiblePages[0] > 1 && (
          <>
            <button onClick={() => goToPage(1)} className="px-3 py-1.5 text-sm border border-brand-200 rounded-lg hover:bg-brand-50 text-brand-600 font-medium">1</button>
            {visiblePages[0] > 2 && <span className="px-1 text-brand-300">...</span>}
          </>
        )}
        {visiblePages.map((p) => (
          <button
            key={p}
            onClick={() => goToPage(p)}
            className={`px-3 py-1.5 text-sm border rounded-lg font-medium transition-colors ${
              p === page
                ? "bg-brand-900 text-white border-brand-900"
                : "border-brand-200 hover:bg-brand-50 text-brand-600"
            }`}
          >
            {p}
          </button>
        ))}
        {visiblePages[visiblePages.length - 1] < pages && (
          <>
            {visiblePages[visiblePages.length - 1] < pages - 1 && <span className="px-1 text-brand-300">...</span>}
            <button onClick={() => goToPage(pages)} className="px-3 py-1.5 text-sm border border-brand-200 rounded-lg hover:bg-brand-50 text-brand-600 font-medium">{pages}</button>
          </>
        )}
        <button
          onClick={() => goToPage(page + 1)}
          disabled={page >= pages}
          className="px-3 py-1.5 text-sm border border-brand-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-50 transition-colors font-medium text-brand-600"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </nav>
  );
}
