"use client";

import React from "react";

import { useMediaQuery } from "@thread/hooks/useMediaQuery";

import { Sidebar } from "~/components/layout/Sidebar";
import FloatingActionButton from "./FloatingActionButton";

interface MainLayoutProps {
  deviceType?: string;
  children: React.ReactNode;
}

export default function ProtectedLayout({
  children,
  deviceType,
}: MainLayoutProps) {
  const isMobile = useMediaQuery("(max-width: 700px)", deviceType === "mobile");
  if (isMobile) {
    return <ProtectedLayout.Mobile>{children}</ProtectedLayout.Mobile>;
  }
  return <ProtectedLayout.Desktop>{children}</ProtectedLayout.Desktop>;
}

ProtectedLayout.displayName = "ProtectedLayout";

ProtectedLayout.Desktop = function Item({ children }: MainLayoutProps) {
  return (
    <div>
      <div>
        <div>
          <Sidebar />
          <>{children}</>
          <FloatingActionButton />
        </div>
      </div>
    </div>
  );
};

ProtectedLayout.Mobile = function Item({ children }: MainLayoutProps) {
  return <></>;
};
