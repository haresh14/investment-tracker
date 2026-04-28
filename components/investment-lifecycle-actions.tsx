"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Pause, Play, Square } from "lucide-react";
import { toast } from "sonner";

import type { InvestmentStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";

export function InvestmentLifecycleActions({
  id,
  status
}: {
  id: string;
  status: InvestmentStatus;
}) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState<"pause" | "resume" | "close" | null>(null);

  async function runAction(action: "pause" | "resume" | "close") {
    setLoadingAction(action);
    try {
      const res = await fetch(`/api/investments/${id}/lifecycle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ action })
      });

      if (!res.ok) {
        throw new Error("Unable to update SIP state");
      }

      toast.success(
        action === "pause"
          ? "Investment paused"
          : action === "resume"
            ? "Investment resumed"
            : "Investment closed"
      );
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Action failed");
    } finally {
      setLoadingAction(null);
    }
  }

  if (status === "closed") {
    return null;
  }

  return (
    <>
      {status === "paused" ? (
        <Button
          variant="outline"
          onClick={() => void runAction("resume")}
          disabled={loadingAction !== null}
        >
          {loadingAction === "resume" ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          Resume
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={() => void runAction("pause")}
          disabled={loadingAction !== null}
        >
          {loadingAction === "pause" ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Pause className="h-4 w-4" />
          )}
          Pause
        </Button>
      )}
      <Button
        variant="outline"
        onClick={() => void runAction("close")}
        disabled={loadingAction !== null}
      >
        {loadingAction === "close" ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <Square className="h-4 w-4" />
        )}
        Close
      </Button>
    </>
  );
}
