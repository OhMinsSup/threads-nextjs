import React from "react";

import { MainLayout } from "~/components/layout/MainLayout";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <MainLayout>{children}</MainLayout>;
}
