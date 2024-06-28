import React from "react";

import { auth } from "@thread/auth";

import { Footer } from "~/components/layout/Footer";
import { Header } from "~/components/layout/Header";
import { HeaderNavigation } from "~/components/layout/HeaderNavigation";

interface MainLayoutProps {
  children: React.ReactNode;
  before?: React.ReactNode;
  after?: React.ReactNode;
}

export default async function MainLayout({
  children,
  before,
  after,
}: MainLayoutProps) {
  const session = await auth();

  return (
    <div className="flex flex-col">
      <Header>
        <HeaderNavigation session={session} />
      </Header>
      <main className="flex-1">
        <div className="container max-w-2xl px-4">
          {before}
          {children}
          {after}
        </div>
      </main>
      <Footer />
    </div>
  );
}
