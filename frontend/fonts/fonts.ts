import { Karla, Crimson_Text } from "next/font/google";

export const karla = Karla({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-karla",
});

export const crimson = Crimson_Text({
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-crimson",
});
