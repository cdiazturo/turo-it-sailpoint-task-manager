import { Package, RefreshCw, Server } from "lucide-react";
import type { TenantBeta } from "sailpoint-api-client";

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
    <Card className="mb-8 overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-surface-accent opacity-20 rounded-bl-full"></div>

      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-4xl font-freight mb-2">
              {tenantInfo.fullName}
            </CardTitle>
            <CardDescription className="text-lg">
              Tenant:{" "}
              <span className="font-medium text-foreground">
                {tenantInfo.name}
              </span>
              {orgType && (
                <Badge variant="outline" className="ml-2 capitalize">
                  {orgType}
                </Badge>
              )}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="text-sm px-3 py-1 bg-surface-accent bg-opacity-10"
          >
            {tenantInfo.region}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Server className="mr-2 h-5 w-5 text-interactive" />
              Tenant Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-stroke-primary pb-2">
                <span className="text-text-secondary">ID</span>
                <span className="font-medium">{tenantInfo.id}</span>
              </div>
              <div className="flex justify-between border-b border-stroke-primary pb-2">
                <span className="text-text-secondary">Pod</span>
                <span className="font-medium">{tenantInfo.pod}</span>
              </div>
              <div className="flex justify-between border-b border-stroke-primary pb-2">
                <span className="text-text-secondary">Region</span>
                <span className="font-medium">{tenantInfo.region}</span>
              </div>
              {idnProduct?.attributes?.maxRegisteredUsers && (
                <div className="flex justify-between border-b border-stroke-primary pb-2">
                  <span className="text-text-secondary">Max Users</span>
                  <span className="font-medium">
                    {Number(
                      idnProduct.attributes.maxRegisteredUsers,
                    ).toLocaleString()}
                  </span>
                </div>
              )}
              {idnProduct?.attributes?.domain && (
                <div className="flex justify-between border-b border-stroke-primary pb-2">
                  <span className="text-text-secondary">Domain</span>
                  <span className="font-medium">
                    {idnProduct.attributes.domain}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-b border-stroke-primary pb-2">
                <span className="text-text-secondary">Products</span>
                <span className="font-medium">
                  {tenantInfo.products?.length}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Package className="mr-2 h-5 w-5 text-interactive" />
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
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Tenant Info
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
