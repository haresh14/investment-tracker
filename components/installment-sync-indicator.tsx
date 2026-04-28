"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

type SyncState = "idle" | "syncing" | "done" | "error";

export function InstallmentSyncIndicator({
  investmentId,
  className
}: {
  investmentId: string;
  className?: string;
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

  const tooltipMessage =
    state === "syncing"
      ? "Checking for missing installments..."
      : state === "done"
        ? "Installments are up to date."
        : message;

  return (
    <div
      className={[
        "tooltip tooltip-left flex items-center",
        className ?? ""
      ].join(" ")}
      data-tip={tooltipMessage}
    >
      {state === "syncing" ? (
        <span
          aria-label="Checking installments"
          className="loading loading-spinner loading-sm text-brand-600"
        />
      ) : state === "done" ? (
        <CheckCircle2
          aria-label="Installments synced"
          className="h-4 w-4 text-emerald-600"
        />
      ) : (
        <AlertCircle
          aria-label="Installment sync failed"
          className="h-4 w-4 text-amber-600"
        />
      )}
    </div>
  );
}
