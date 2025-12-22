"use client";

import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/context/auth-context";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="h-16 px-6 flex items-center justify-between bg-background border-b border-border sticky top-0 z-40">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Overview
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground">
          <Bell className="w-5 h-5" />
        </Button>
        <ThemeToggle />
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-foreground">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-muted-foreground">
              {user?.email || "Employee"}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>
      </div>
    </header>
  );
}
