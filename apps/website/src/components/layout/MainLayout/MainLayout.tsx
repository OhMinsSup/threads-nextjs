import React from "react";

import { cn } from "@thread/ui";

import { FooterNavigation } from "~/components/layout/FooterNavigation";
import { Header } from "~/components/layout/Header";
import styles from "./styles.module.css";

interface MainLayoutProps {
  deviceType?: string;
  children: React.ReactNode;
  before?: React.ReactNode;
  after?: React.ReactNode;
}

function Fallback() {
  console.log("Loading...");
  return <>Loading...</>;
}

export default function MainLayout({
  children,
  before,
  after,
}: MainLayoutProps) {
  return (
    <div>
      <React.Suspense fallback={<Fallback />}>
        <Header />
      </React.Suspense>
      <main className="flex-1">
        <div className="container max-w-2xl px-4">
          {before}
          {children}
          {after}
        </div>
      </main>
      <nav className={cn(styles.footer)} id="item-footer">
        <FooterNavigation />
      </nav>
    </div>
  );
}

MainLayout.displayName = "MainLayout";
