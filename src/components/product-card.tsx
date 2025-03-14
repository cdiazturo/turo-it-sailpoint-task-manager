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

export function ProductCard({ product }: { product: ProductBeta }) {
  // Get license count
  const licenseCount = product.licenses?.length || 0;

  return (
    <div className="rounded-lg border border-stroke-primary p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <Badge className="mr-2 bg-interactive text-interactive-contrast-secondary">
            {product.productName?.toUpperCase()}
          </Badge>
          <span className="text-sm text-text-secondary capitalize">
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

      <div className="text-sm space-y-2">
        {product.dateCreated && (
          <div className="flex items-center text-text-secondary">
            <CalendarDays className="h-3 w-3 mr-1" />
            Created: {new Date(product.dateCreated).toLocaleDateString()}
          </div>
        )}

        {product.apiUrl && (
          <div className="flex items-center text-text-secondary">
            <Cloud className="h-3 w-3 mr-1" />
            API: {product.apiUrl.replace(/^https?:\/\//, "")}
          </div>
        )}

        {product.zone && (
          <div className="flex items-center text-text-secondary">
            <Database className="h-3 w-3 mr-1" />
            Zone: {product.zone}
          </div>
        )}

        {licenseCount > 0 && (
          <div className="mt-3">
            <div className="flex items-center mb-1">
              <Shield className="h-3 w-3 mr-1 text-interactive" />
              <span className="text-xs text-text-secondary">
                Licenses ({licenseCount})
              </span>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {product.licenses?.slice(0, 3).map((license) => (
                <TooltipProvider key={license.licenseId}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex items-center text-xs bg-surface-secondary rounded-full px-2 py-0.5">
                        {license.licenseId?.split(":")[1]}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{license.legacyFeatureName || license.licenseId}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
              {licenseCount > 3 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex items-center text-xs bg-surface-secondary rounded-full px-2 py-0.5">
                        +{licenseCount - 3} more
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="max-w-xs">
                        <p className="font-medium mb-1">Additional licenses:</p>
                        <ul className="text-xs space-y-1">
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
    </div>
  );
}
