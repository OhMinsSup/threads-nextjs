import React from "react";
import { headers } from "next/headers";
import { userAgent } from "next/server";

import { auth } from "@thread/auth";

import { MainLayout } from "~/components/layout/MainLayout";
import { ProtectedLayout } from "~/components/layout/ProtectedLayout";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const session = await auth();
  const agent = userAgent({ headers: headers() });
  const Component = session ? ProtectedLayout : MainLayout;
  return <Component deviceType={agent.device.type}>{children}</Component>;
}
