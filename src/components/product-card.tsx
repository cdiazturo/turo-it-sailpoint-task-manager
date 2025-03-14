import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { CalendarDays, Cloud, Database, Globe, Shield } from "lucide-react";
import type { ProductBeta } from "sailpoint-api-client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ProductCard({ product }: { product: ProductBeta }) {
  // Get license count
  const licenseCount = product.licenses?.length || 0;

  return (
    <Card className="bg-sidebar text-sidebar-foreground border-0 transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="bg-primary text-primary-foreground mr-2 flex h-8 w-8 items-center justify-center rounded-full">
              <span className="text-xs font-bold">
                {product.productName?.charAt(0) || "P"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sidebar-foreground text-base font-medium">
                {product.productName?.toUpperCase()}
              </span>
              <span className="text-muted-foreground text-xs capitalize">
                {product.status}
              </span>
            </div>
          </div>
          {product.url && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sidebar-primary hover:text-primary transition-colors"
                  >
                    <Globe className="h-5 w-5" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open {product.productName?.toUpperCase()} UI</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2 pt-2">
          {product.dateCreated && (
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center text-xs">
                <CalendarDays className="mr-2 h-3.5 w-3.5" />
                <span>Created</span>
              </div>
              <span className="text-sm font-medium">
                {new Date(product.dateCreated).toLocaleDateString()}
              </span>
            </div>
          )}

          {product.apiUrl && (
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center text-xs">
                <Cloud className="mr-2 h-3.5 w-3.5" />
                <span>API</span>
              </div>
              <span className="max-w-[180px] truncate text-sm font-medium">
                {product.apiUrl.replace(/^https?:\/\//, "")}
              </span>
            </div>
          )}

          {product.zone && (
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground flex items-center text-xs">
                <Database className="mr-2 h-3.5 w-3.5" />
                <span>Zone</span>
              </div>
              <span className="text-sm font-medium">{product.zone}</span>
            </div>
          )}
        </div>

        {licenseCount > 0 && (
          <div className="border-sidebar-border border-t pt-4">
            <div className="mb-3 flex items-center">
              <Shield className="text-primary mr-2 h-4 w-4" />
              <span className="text-muted-foreground text-xs font-medium">
                Licenses ({licenseCount})
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.licenses?.slice(0, 3).map((license) => (
                <TooltipProvider key={license.licenseId}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="bg-sidebar-accent text-sidebar-accent-foreground inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium">
                        {license.licenseId?.split(":")[1]}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="rounded-md">
                      <p>{license.legacyFeatureName || license.licenseId}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
              {licenseCount > 3 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="bg-sidebar-accent text-sidebar-accent-foreground inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium">
                        +{licenseCount - 3} more
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="rounded-md">
                      <div className="max-w-xs">
                        <p className="mb-1 font-medium">Additional licenses:</p>
                        <ul className="space-y-1 text-xs">
                          {product.licenses?.slice(3).map((license) => (
                            <li key={license.licenseId}>
                              {license.licenseId?.split(":")[1]}{" "}
                              {license.legacyFeatureName
                                ? `(${license.legacyFeatureName})`
                                : ""}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
