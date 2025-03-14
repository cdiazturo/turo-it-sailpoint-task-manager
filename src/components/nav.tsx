import { LogOut, Menu, Settings } from "lucide-react";
import * as React from "react";
import { NavLink } from "react-router";

import { TuroLogo } from "@/components/turo-logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function MainNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const routes = [
    {
      href: "/",
      label: "Dashboard",
    },
    {
      href: "/tasks",
      label: "All Tasks",
    },
  ];

  return (
    <div className="bg-background border-border elevation-1 fixed top-0 right-0 left-0 z-50 border-b">
      <div className="container mx-auto flex h-20 max-w-screen-2xl items-center px-8">
        <div className="flex items-center space-x-12">
          <NavLink to="/" className="flex items-center">
            <TuroLogo
              variant="filled"
              width={100}
              height={32}
              color="currentColor"
            />
          </NavLink>
          <nav className="hidden items-center space-x-8 md:flex">
            {routes.map((route) => (
              <NavLink
                key={route.href}
                to={route.href}
                className={({ isActive }) =>
                  cn(
                    "hover:text-primary relative py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "text-primary after:bg-primary after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5"
                      : "text-muted-foreground",
                  )
                }
              >
                {route.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="ml-auto flex items-center space-x-6">
          {/* <ThemeToggle /> */}
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:bg-surface-02"
          >
            <NavLink to="/settings">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </NavLink>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-sm font-medium"
              >
                Account
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="elevation-2">
              <DropdownMenuItem className="text-sm">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
        <div className="border-border bg-background border-t p-4 md:hidden">
          <nav className="flex flex-col space-y-4">
            {routes.map((route) => (
              <NavLink
                key={route.href}
                to={route.href}
                className={({ isActive }) =>
                  cn(
                    "hover:text-primary text-sm font-medium transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {route.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
