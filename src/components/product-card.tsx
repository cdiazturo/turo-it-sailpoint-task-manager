import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import {
  Badge,
  CalendarDays,
  Cloud,
  Database,
  Globe,
  Shield,
} from "lucide-react";
import type { ProductBeta } from "sailpoint-api-client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getContainerRadius } from "@/lib/utils";

export function ProductCard({ product }: { product: ProductBeta }) {
  // Get license count
  const licenseCount = product.licenses?.length || 0;

  return (
    <Card
      className={`elevation-1 hover:elevation-2 transition-shadow ${getContainerRadius("sm")}`}
    >
      <CardHeader>
        <div className="mb-2 flex items-start justify-between">
          <div className="flex items-center">
            <Badge
              className={`bg-interactive text-interactive-contrast-secondary mr-2 ${getContainerRadius("xs")}`}
            >
              {product.productName?.toUpperCase()}
            </Badge>
            <span className="text-text-secondary text-sm capitalize">
              {product.status}
            </span>
          </div>
          {product.url && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-interactive hover:text-interactive-hover"
                  >
                    <Globe className="h-4 w-4" />
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

      <CardContent>
        <div className="space-y-2 text-sm">
          {product.dateCreated && (
            <div className="text-text-secondary flex items-center">
              <CalendarDays className="mr-1 h-3 w-3" />
              Created: {new Date(product.dateCreated).toLocaleDateString()}
            </div>
          )}

          {product.apiUrl && (
            <div className="text-text-secondary flex items-center">
              <Cloud className="mr-1 h-3 w-3" />
              API: {product.apiUrl.replace(/^https?:\/\//, "")}
            </div>
          )}

          {product.zone && (
            <div className="text-text-secondary flex items-center">
              <Database className="mr-1 h-3 w-3" />
              Zone: {product.zone}
            </div>
          )}

          {licenseCount > 0 && (
            <div className="mt-3">
              <div className="mb-1 flex items-center">
                <Shield className="text-interactive mr-1 h-3 w-3" />
                <span className="text-text-secondary text-xs">
                  Licenses ({licenseCount})
                </span>
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {product.licenses?.slice(0, 3).map((license) => (
                  <TooltipProvider key={license.licenseId}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="bg-surface-secondary inline-flex items-center rounded-full px-2 py-0.5 text-xs">
                          {license.licenseId?.split(":")[1]}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className={getContainerRadius("xs")}>
                        <p>{license.legacyFeatureName || license.licenseId}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
                {licenseCount > 3 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="bg-surface-secondary inline-flex items-center rounded-full px-2 py-0.5 text-xs">
                          +{licenseCount - 3} more
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className={getContainerRadius("xs")}>
                        <div className="max-w-xs">
                          <p className="mb-1 font-medium">
                            Additional licenses:
                          </p>
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
        </div>
      </CardContent>
    </Card>
  );
}
