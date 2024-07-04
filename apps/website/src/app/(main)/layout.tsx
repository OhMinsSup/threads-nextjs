import React from "react";

import { auth } from "@thread/auth";

import { MainLayout } from "~/components/layout/MainLayout";
import { ProtectedLayout } from "~/components/layout/ProtectedLayout";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const session = await auth();
  const Component = session ? ProtectedLayout : MainLayout;
  return <Component>{children}</Component>;
}
