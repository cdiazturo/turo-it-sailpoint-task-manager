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
      className={`elevation-1 mb-8 overflow-hidden ${getContainerRadius("md")}`}
    >
      <div className="bg-surface-02 absolute top-0 right-0 h-32 w-32 rounded-bl-full opacity-20"></div>

      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-display mb-2 text-4xl">
              {tenantInfo.fullName}
            </CardTitle>
            <CardDescription className="text-lg">
              Tenant:{" "}
              <span className="text-foreground font-medium">
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
            className={`bg-surface-02 bg-opacity-10 px-3 py-1 text-sm ${getContainerRadius("xs")}`}
          >
            {tenantInfo.region}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-4 flex items-center text-lg font-medium">
              <Server className="text-primary mr-2 h-5 w-5" />
              Tenant Information
            </h3>
            <div className="space-y-3">
              <div className="border-border flex justify-between border-b pb-2">
                <span className="text-text-02">ID</span>
                <span className="text-foreground font-medium">
                  {tenantInfo.id}
                </span>
              </div>
              <div className="border-border flex justify-between border-b pb-2">
                <span className="text-text-02">Pod</span>
                <span className="text-foreground font-medium">
                  {tenantInfo.pod}
                </span>
              </div>
              <div className="border-border flex justify-between border-b pb-2">
                <span className="text-text-02">Region</span>
                <span className="text-foreground font-medium">
                  {tenantInfo.region}
                </span>
              </div>
              {idnProduct?.attributes?.maxRegisteredUsers && (
                <div className="border-border flex justify-between border-b pb-2">
                  <span className="text-text-02">Max Users</span>
                  <span className="text-foreground font-medium">
                    {Number(
                      idnProduct.attributes.maxRegisteredUsers,
                    ).toLocaleString()}
                  </span>
                </div>
              )}
              {idnProduct?.attributes?.domain && (
                <div className="border-border flex justify-between border-b pb-2">
                  <span className="text-text-02">Domain</span>
                  <span className="text-foreground font-medium">
                    {idnProduct.attributes.domain}
                  </span>
                </div>
              )}
              <div className="border-border flex justify-between border-b pb-2">
                <span className="text-text-02">Products</span>
                <span className="text-foreground font-medium">
                  {tenantInfo.products?.length}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 flex items-center text-lg font-medium">
              <Package className="text-primary mr-2 h-5 w-5" />
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
