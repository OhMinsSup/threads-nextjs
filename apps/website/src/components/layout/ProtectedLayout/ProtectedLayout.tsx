import React from "react";
import Link from "next/link";

import { cn } from "@thread/ui";
import { Button, buttonVariants } from "@thread/ui/button";

import { Icons } from "~/components/icons";
import { ContentLayout } from "~/components/layout/ContentLayout";
import { Sidebar } from "~/components/layout/Sidebar";
import { PAGE_ENDPOINTS } from "~/constants/constants";

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
          <ContentLayout>{children}</ContentLayout>
          <Link
            href={PAGE_ENDPOINTS.THREADS.ROOT}
            className={cn(buttonVariants(), "fixed bottom-5 right-6")}
          >
            <Icons.add />
          </Link>
        </div>
      </div>
    </div>
  );
}
