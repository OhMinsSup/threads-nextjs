import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { cn } from "@thread/ui";
import { Toaster } from "@thread/ui/toaster";
import { getRequestInfo } from "@thread/utils/request";

import "~/app/globals.css";

import { headers } from "next/headers";

import { SITE_CONFIG } from "~/constants/constants";
import { Provider } from "~/store";

// eslint-disable-next-line @typescript-eslint/require-await
export async function generateMetadata(): Promise<Metadata> {
  const info = getRequestInfo(headers());
  const metadataBase = new URL(info.domainUrl);
  const manifestURL = new URL(SITE_CONFIG.manifest, metadataBase);

  return {
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    icons: {
      icon: SITE_CONFIG.favicon,
      apple: SITE_CONFIG.apple57x57,
      other: [
        {
          url: SITE_CONFIG.apple180x180,
          sizes: "180x180",
        },
        {
          url: SITE_CONFIG.apple256x256,
          sizes: "256x256",
        },
      ],
    },
    metadataBase,
    manifest: manifestURL,
    alternates: {
      canonical: metadataBase,
    },
    openGraph: {
      title: SITE_CONFIG.title,
      description: SITE_CONFIG.description,
      url: metadataBase.href,
      siteName: SITE_CONFIG.title,
      images: [
        {
          url: SITE_CONFIG.ogImage,
        },
      ],
      locale: "ko_KR",
      type: "article",
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout(props: LayoutProps) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <Provider>
          {props.children}
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
