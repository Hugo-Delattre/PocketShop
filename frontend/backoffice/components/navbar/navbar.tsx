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
          <DropdownMenuTrigger className="grid place-items-center w-full aspect-square"       
            aria-label="User menu" // Accessible name for the trigger
            aria-haspopup="true" // Indicates the button opens a menu
            aria-expanded="false" // Dynamically update this based on menu state
          >
            <CircleUserRoundIcon className="stroke-white w-7 h-7" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link
                href="/login"
                className={buttonVariants({ variant: "ghost" })}
                aria-label="Login"
              >
                Login
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href="/register"
                className={buttonVariants({ variant: "ghost" })}
                aria-label="Signup"
              >
                Signup
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <NavbarLogOut aria-label="Logout"/>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
