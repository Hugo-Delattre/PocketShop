"use client";

import { jwtConstants } from "@/utils/jwt";
import { Button } from "../ui/button";
import token from "@/lib/token";

export function NavbarLogOut() {
  const handleLogOut = () => {
    "use client";
    token.removeToken(jwtConstants.key);
    window.location.assign("/login");
  };
  return (
    <Button onClick={handleLogOut} variant="ghost">
      Log out
    </Button>
  );
}
