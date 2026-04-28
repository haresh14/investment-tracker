"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

type SyncState = "idle" | "syncing" | "done" | "error";

export function InstallmentSyncIndicator({
  investmentId
}: {
  investmentId: string;
}) {
  const router = useRouter();
  const hasStartedRef = useRef(false);
  const [state, setState] = useState<SyncState>("idle");
  const [message, setMessage] = useState("Checking for missing installments...");

  useEffect(() => {
    if (hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;
    setState("syncing");

    async function syncInstallments() {
      try {
        const response = await fetch(`/api/investments/${investmentId}/sync-installments`, {
          method: "POST"
        });

        if (!response.ok) {
          throw new Error("Unable to generate installments right now.");
        }

        const data = (await response.json()) as { generatedCount: number };

        if (data.generatedCount > 0) {
          setMessage(
            `Generated ${data.generatedCount} installment${data.generatedCount === 1 ? "" : "s"}. Refreshing view...`
          );
          toast.success(
            `Generated ${data.generatedCount} installment${data.generatedCount === 1 ? "" : "s"}.`
          );
          router.refresh();
        } else {
          setMessage("Installments are already up to date.");
        }

        setState("done");
      } catch (error) {
        setState("error");
        setMessage(error instanceof Error ? error.message : "Installment sync failed.");
      }
    }

    void syncInstallments();
  }, [investmentId, router]);

  if (state === "idle") {
    return null;
  }

  return (
    <div className="mb-4 flex items-center gap-2 rounded-2xl border border-brand-100 bg-brand-50/80 px-3 py-2 text-sm text-brand-700">
      {state === "syncing" ? (
        <LoaderCircle className="h-4 w-4 animate-spin" />
      ) : (
        <div className="h-2 w-2 rounded-full bg-brand-500" />
      )}
      <span>{message}</span>
    </div>
  );
}
