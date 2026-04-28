import Link from "next/link";
import { ArrowRight, WalletCards } from "lucide-react";

import { Button } from "@/components/ui/button";

export function EmptyState() {
  return (
    <div className="section-shell flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-50 text-brand-600">
        <WalletCards className="h-8 w-8" />
      </div>
      <h2 className="text-2xl font-semibold text-slate-950">Start with your first investment</h2>
      <p className="mt-3 max-w-xl text-sm text-slate-500">
        Add a SIP or lumpsum to unlock future value projections, monthly funding trends,
        and milestone planning.
      </p>
      <Button asChild className="mt-6">
        <Link href="/investments/new">
          Add investment
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
