import React from "react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { CircleUserRoundIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { NavBarItem } from "./NavBarItem";

import { NavbarLogOut } from "./navbarLogOut";

export default function Navbar() {
  return (
    <nav className="bg-blue flex flex-col justify-between items-center h-full w-full px-4 py-6">
      <ul className="space-y-2 w-full mt-24">
        <NavBarItem route="home" />
        <NavBarItem route="users" />
        <NavBarItem route="products" />
        <NavBarItem route="kpis" />
      </ul>
      <div className="space-y-4 w-full">
        <DropdownMenu>
          <DropdownMenuTrigger className="grid place-items-center w-full aspect-square">
            <CircleUserRoundIcon className="stroke-white w-7 h-7" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link
                href="/login"
                className={buttonVariants({ variant: "ghost" })}
              >
                Login
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href="/register"
                className={buttonVariants({ variant: "ghost" })}
              >
                Signup
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <NavbarLogOut />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
