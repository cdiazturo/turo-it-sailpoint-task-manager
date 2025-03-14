import { Package, RefreshCw, Server } from "lucide-react";
import type { TenantBeta } from "sailpoint-api-client";

import { getContainerRadius } from "@/lib/utils";

import { ProductCard } from "./product-card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export function TenantInfo({ tenantInfo }: { tenantInfo: TenantBeta }) {
  const idnProduct = tenantInfo.products?.find((p) => p.productName === "idn");
  const orgType =
    idnProduct?.orgType || tenantInfo.products?.[0]?.orgType || "Unknown";
  return (
    <Card
      className={`mb-8 overflow-hidden elevation-1 ${getContainerRadius("md")}`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-surface-02 opacity-20 rounded-bl-full"></div>

      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-4xl font-display mb-2">
              {tenantInfo.fullName}
            </CardTitle>
            <CardDescription className="text-lg">
              Tenant:{" "}
              <span className="font-medium text-text-01">
                {tenantInfo.name}
              </span>
              {orgType && (
                <Badge
                  variant="outline"
                  className={`ml-2 capitalize ${getContainerRadius("xs")}`}
                >
                  {orgType}
                </Badge>
              )}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className={`text-sm px-3 py-1 bg-surface-02 bg-opacity-10 ${getContainerRadius("xs")}`}
          >
            {tenantInfo.region}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Server className="mr-2 h-5 w-5 text-interactive-01" />
              Tenant Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-stroke-01 pb-2">
                <span className="text-text-02">ID</span>
                <span className="font-medium text-text-01">
                  {tenantInfo.id}
                </span>
              </div>
              <div className="flex justify-between border-b border-stroke-01 pb-2">
                <span className="text-text-02">Pod</span>
                <span className="font-medium text-text-01">
                  {tenantInfo.pod}
                </span>
              </div>
              <div className="flex justify-between border-b border-stroke-01 pb-2">
                <span className="text-text-02">Region</span>
                <span className="font-medium text-text-01">
                  {tenantInfo.region}
                </span>
              </div>
              {idnProduct?.attributes?.maxRegisteredUsers && (
                <div className="flex justify-between border-b border-stroke-01 pb-2">
                  <span className="text-text-02">Max Users</span>
                  <span className="font-medium text-text-01">
                    {Number(
                      idnProduct.attributes.maxRegisteredUsers,
                    ).toLocaleString()}
                  </span>
                </div>
              )}
              {idnProduct?.attributes?.domain && (
                <div className="flex justify-between border-b border-stroke-01 pb-2">
                  <span className="text-text-02">Domain</span>
                  <span className="font-medium text-text-01">
                    {idnProduct.attributes.domain}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-b border-stroke-01 pb-2">
                <span className="text-text-02">Products</span>
                <span className="font-medium text-text-01">
                  {tenantInfo.products?.length}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Package className="mr-2 h-5 w-5 text-interactive-01" />
              Products
            </h3>
            <div className="space-y-4">
              {tenantInfo.products?.map((product) => (
                <ProductCard key={product.productName} product={product} />
              ))}
            </div>
          </div>
        </div>

        {/* Add a refresh button at the bottom */}
        <div className="mt-6 flex justify-end">
          <Button size="sm" className={getContainerRadius("xs")}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Tenant Info
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
