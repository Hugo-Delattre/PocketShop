import { SiteConfig } from "@/types/siteConfig";
import { BsGithub } from "react-icons/bs";
import { MdEmail } from "react-icons/md";

const OPEN_SOURCE_URL = 'https://t-dev.epitest.eu/BDX_1/trinity/app'

const baseSiteConfig = {
  name: "T-DEV-702 Trinity",
  description:
    "A mobile application for shopping with ease",
  url: "https://landingpage.weijunext.com",
  ogImage: "https://landingpage.weijunext.com/og.png",
  metadataBase: '/',
  keywords: ["T-DEV-702 Trinity", "landing page template", "awesome landing page", "next.js landing page"],
  authors: [
    {
      name: "Groupe BDX-1",
      url: "https://t-dev.epitest.eu/BDX_1/trinity/app",
      twitter: 'https://t-dev.epitest.eu/BDX_1/trinity/app',
    }
  ],
  creator: '@weijunext',
  openSourceURL: 'https://t-dev.epitest.eu/BDX_1/trinity/app',
  themeColors: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  nextThemeColor: 'dark', // next-theme option: system | dark | light
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/logo.png",
  },
  headerLinks: [
    { name: 'repo', href: OPEN_SOURCE_URL, icon: BsGithub },
  ],
  footerLinks: [
    { name: 'email', href: "mailto:andy1.de-cock@epitech.eu", icon: MdEmail },
    { name: 'github', href: "https://t-dev.epitest.eu/BDX_1/trinity/app", icon: BsGithub },
  ],
  footerProducts: [
    { url: 'https://phcopilot.ai/', name: 'Product Hunt Copilot' },
    { url: 'https://landingpage.weijunext.com/', name: 'T-DEV-702 Trinity' },
  ]
}

export const siteConfig: SiteConfig = {
  ...baseSiteConfig,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseSiteConfig.url,
    title: baseSiteConfig.name,
    images: [`${baseSiteConfig.url}/og.png`],
    description: baseSiteConfig.description,
    siteName: baseSiteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    site: baseSiteConfig.url,
    title: baseSiteConfig.name,
    description: baseSiteConfig.description,
    images: [`${baseSiteConfig.url}/og.png`],
    creator: baseSiteConfig.creator,
  },
}
