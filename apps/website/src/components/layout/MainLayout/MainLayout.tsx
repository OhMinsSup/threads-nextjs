"use client";

import React from "react";

import { ContentLayout } from "~/components/layout/ContentLayout";
import { Sidebar } from "~/components/layout/Sidebar";

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
    <div>
      <div>
        {/* Loading Jazzy bar */}
        <div>
          <Sidebar />
          <ContentLayout>{children}</ContentLayout>
        </div>
      </div>
    </div>
  );
}
