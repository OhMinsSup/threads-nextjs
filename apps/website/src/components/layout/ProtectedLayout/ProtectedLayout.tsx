import React from "react";

import { Sidebar } from "~/components/layout/Sidebar";
import FloatingActionButton from "./FloatingActionButton";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: MainLayoutProps) {
  return (
    <div>
      <div>
        {/* Loading Jazzy bar */}
        <div>
          <Sidebar />
          <>{children}</>
          <FloatingActionButton />
        </div>
      </div>
    </div>
  );
}

ProtectedLayout.displayName = "ProtectedLayout";
