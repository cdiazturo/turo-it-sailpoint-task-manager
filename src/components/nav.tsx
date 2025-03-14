import { Menu, Settings } from "lucide-react";
import * as React from "react";
import { Link, useLocation } from "react-router";

import { TuroLogo } from "@/components/turo-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MainNav() {
  const location = useLocation();
  const pathname = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const routes = [
    {
      href: "/",
      label: "Dashboard",
      active: pathname === "/",
    },
    {
      href: "/tasks",
      label: "All Tasks",
      active: pathname === "/tasks",
    },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-surface-primary border-b border-stroke-primary">
      <div className="flex h-20 items-center px-8 container max-w-screen-2xl mx-auto">
        <div className="flex items-center space-x-12">
          <Link to="/" className="flex items-center">
            <TuroLogo
              variant="filled"
              width={100}
              height={32}
              color="currentColor"
            />
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            {routes.map((route) => (
              <Link
                key={route.href}
                to={route.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-interactive relative py-2",
                  route.active
                    ? "text-interactive after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-interactive"
                    : "text-text-secondary",
                )}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="ml-auto flex items-center space-x-6">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:bg-surface-secondary"
          >
            <Link to="/settings">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </Button>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-sm font-medium"
              >
                Account
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-sm">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
          <Button
            className="md:hidden"
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-stroke-primary p-4">
          <nav className="flex flex-col space-y-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                to={route.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-interactive",
                  route.active ? "text-interactive" : "text-text-secondary",
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
