"use client";

import React from "react";

import { MainHeader } from "~/components/layout/MainHeader";
import { MainMobileFooterNav } from "~/components/layout/MainMobileFooterNav";
import { MainNav } from "~/components/layout/MainNav";

interface MainLayoutProps {
  before?: React.ReactNode;
  children: React.ReactNode;
  after?: React.ReactNode;
}

export default function MainLayout({
  children,
  before,
  after,
}: MainLayoutProps) {
  return (
    <div className="flex flex-col">
      <MainHeader>
        <MainNav />
      </MainHeader>
      <main className="flex-1">
        <div className="container max-w-2xl px-4">
          {before}
          {children}
          {after}
        </div>
      </main>
      <MainMobileFooterNav />
    </div>
  );
}
