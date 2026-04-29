"use client";

import { useMemo, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

type FilterDefinition = {
  key: string;
  label: string;
  placeholder: string;
  options: string[];
};

export function DashboardFilters({
  filters
}: {
  filters: FilterDefinition[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const hasActiveFilters = useMemo(
    () => filters.some((filter) => searchParams.get(filter.key)),
    [filters, searchParams]
  );

  function updateQuery(key: string, value: string) {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }

    startTransition(() => {
      router.replace(nextParams.toString() ? `${pathname}?${nextParams}` : pathname, {
        scroll: false
      });
    });
  }

  function clearFilters() {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }

  return (
    <div className="p-4">
      <div className="flex flex-col items-center justify-end gap-3 sm:flex-row sm:flex-wrap">
        {filters.map((filter) => (
          <label key={filter.key} className="flex min-w-[12rem] flex-col gap-2 text-sm">
            <select
              value={searchParams.get(filter.key) ?? ""}
              onChange={(event) => updateQuery(filter.key, event.target.value)}
              className="select h-11 rounded-xl border-slate-200 bg-white text-sm text-slate-700"
              disabled={isPending}
            >
              <option value="">{filter.placeholder}</option>
              {filter.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ))}

        <Button
          type="button"
          variant="outline"
          className="min-w-[8rem]"
          onClick={clearFilters}
          disabled={!hasActiveFilters || isPending}
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
}
