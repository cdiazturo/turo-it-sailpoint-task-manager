import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns the appropriate border radius class for a container based on size
 * @param size The size of the container: 'xs', 'sm', 'md', 'lg', or undefined (defaults to 'sm')
 * @returns The appropriate Tailwind CSS class for border radius
 */
export function getContainerRadius(size?: "xs" | "sm" | "md" | "lg") {
  switch (size) {
    case "xs": {
      return "rounded-xs-container";
    } // 4px
    case "md": {
      return "rounded-md-container";
    } // 12px
    case "lg": {
      return "rounded-lg-container";
    } // 16px
    case "sm": {
      return "rounded-sm-container";
    } // 8px
    default: {
      return "rounded-sm-container";
    } // 8px
  }
}
