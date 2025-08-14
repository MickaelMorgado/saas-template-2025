"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: "User Management" },
    { href: "/dashboard/price-plans", label: "Price Plans" },
    { href: "/dashboard/pages", label: "Pages Content Editor" },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Dashboard
          </h2>
        </div>
        <nav className="mt-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block py-3 px-6 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 ${
                pathname === link.href
                  ? "bg-gray-200 dark:bg-gray-700 font-semibold"
                  : ""
              }`}
            >
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
