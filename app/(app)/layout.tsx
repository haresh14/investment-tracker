import type { ReactNode } from "react";

import { AppShell } from "@/components/app-shell";
import { EnvSetupState } from "@/components/env-setup-state";
import { requireUser } from "@/lib/data";
import { hasSupabaseEnv } from "@/lib/env";

export default async function ProtectedLayout({
  children
}: {
  children: ReactNode;
}) {
  if (!hasSupabaseEnv()) {
    return <EnvSetupState />;
  }

  await requireUser();
  return <AppShell>{children}</AppShell>;
}
