import React from "react";
import Link from "next/link";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";

function Navbar() {
    return (
        <div className="bg-[#82bd69] p-4 flex justify-between items-center">
            <nav className="flex justify-between items-center w-full">
                <ul className="flex space-x-4">
                    <li>
                        <Link href="/">
                            <p className="text-white hover:text-green-200 transition duration-1000 ease-in-out">
                                Home
                            </p>
                        </Link>
                    </li>
                    <li>
                        <Link href="/products">
                            <p className="text-white hover:text-green-200 transition duration-300 ease-in-out">
                                Products
                            </p>
                        </Link>
                    </li>
                    <li>
                        <Link href="/users">
                            <p className="text-white hover:text-green-200 transition duration-300 ease-in-out">
                                Users
                            </p>
                        </Link>
                    </li>
                    <li>
                        <Link href="/kpi">
                            <p className="text-white hover:text-green-200 transition duration-300 ease-in-out">
                                KPI
                            </p>
                        </Link>
                    </li>
                </ul>
                <div className="flex space-x-4">
                    <Link href="/login">
                        <Button variant="outline">Login</Button>
                    </Link>
                    <Link href="/register">
                        <Button variant="outline">Register</Button>
                    </Link>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
