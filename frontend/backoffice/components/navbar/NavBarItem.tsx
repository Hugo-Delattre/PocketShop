"use client";

import {
  ChartLineIcon,
  HomeIcon,
  PackageSearchIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = {
  home: {
    path: "/",
    icon: HomeIcon,
  },
  users: {
    path: "/users",
    icon: UsersIcon,
  },
  products: {
    path: "/products",
    icon: PackageSearchIcon,
  },
  kpis: {
    path: "/reports",
    icon: ChartLineIcon,
  },
};

export function NavBarItem({ route }: { route: keyof typeof routes }) {
  const href = routes[route].path;
  const Icon = routes[route].icon;

  const pathName = usePathname();
  const isActive = pathName === href;

  return (
    <li className="w-full aspect-square">
      <Link
        href={href}
        className={`bg-blue hover:bg-transparentBlue ${
          isActive ? "bg-lightBlue" : ""
        } rounded-lg transition-colors w-full h-full grid place-items-center`}
         arial-label={`${route} link`}
      >
        <Icon className="stroke-white"/>
        <span className="sr-only">{route}</span>
      </Link>
    </li>
  );
}
