import { redirect } from "next/navigation";

import { getSessionUser } from "@/lib/data";
import { hasSupabaseEnv } from "@/lib/env";
import { EnvSetupState } from "@/components/env-setup-state";

export default async function HomePage() {
  if (!hasSupabaseEnv()) {
    return <EnvSetupState />;
  }

  const user = await getSessionUser();
  redirect(user ? "/dashboard" : "/signin");
}
