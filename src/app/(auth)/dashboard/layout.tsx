"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, BarChart, FileText, List } from "lucide-react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: "User Management", icon: Users },
    { href: "/dashboard/price-plans", label: "Price Plans", icon: BarChart },
    {
      href: "/dashboard/pages",
      label: "Pages Content Editor",
      icon: FileText,
    },
    { href: "/dashboard/leads", label: "Leads", icon: List },
  ];

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 bg-card shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        </div>
        <nav className="mt-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center py-3 px-6 text-muted-foreground hover:bg-muted ${
                pathname === link.href ? "bg-muted font-semibold" : ""
              }`}
            >
              <link.icon className="mr-4 h-5 w-5" />
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
};

export default DashboardLayout;
