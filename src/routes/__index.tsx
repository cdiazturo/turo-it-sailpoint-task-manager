import { Suspense } from "react";
import { data } from "react-router";
import type { TenantBeta } from "sailpoint-api-client";
import { TenantBetaApi } from "sailpoint-api-client";

import { TenantInfo } from "@/components/tenant-info";
import { getSailpointConfig } from "@/lib/sailpoint";

import type { Route } from "./+types/__index";

export function meta(_arguments: Route.MetaArgs) {
  return [
    { title: "SailPoint Task Manager" },
    {
      name: "description",
      content: "Manage SailPoint Tasks",
    },
  ];
}

export async function loader({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  params,
}: Route.LoaderArgs): Promise<{ data: TenantBeta }> {
  try {
    const config = getSailpointConfig();
    const api = new TenantBetaApi(config);
    const tenant = await api.getTenant();
    return tenant;
  } catch (error) {
    console.error("Failed to load tenant information:", error);
    throw data("Failed to load tenant information", { status: 500 });
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const tenant = loaderData.data;
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-display text-text-01 mb-6">
        SailPoint Task Manager
      </h1>
      <div className="space-y-4">
        <Suspense
          fallback={
            <div className="text-text-02">Loading tenant information...</div>
          }
        >
          <TenantInfo tenantInfo={tenant} />
        </Suspense>
      </div>
    </div>
  );
}
