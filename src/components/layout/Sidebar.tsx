"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { Home, ListVideo, PlusCircle } from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/list", icon: ListVideo, label: "All Streamers" },
  { href: "/add", icon: PlusCircle, label: "Add Streamer" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex h-full flex-col items-center py-6">
        <nav className="flex flex-1 flex-col items-center space-y-4">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-200",
                  "hover:bg-gray-100 dark:hover:bg-gray-700",
                  "text-gray-500 dark:text-gray-400",
                  "hover:text-purple-500 dark:hover:text-purple-400",
                  isActive &&
                    "bg-purple-100 dark:bg-purple-900 text-purple-500 dark:text-purple-400",
                )}
                title={label}>
                <Icon className="w-5 h-5" />
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
