import React from "react";

import { cn } from "@thread/ui";

import styles from "./styles.module.css";

interface ContentLayoutProps {
  children: React.ReactNode;
}

export default function ContentLayout({ children }: ContentLayoutProps) {
  return (
    <div className="relative">
      <div className="relative flex flex-col">
        <div className="relative top-0 flex min-h-screen flex-col">
          <div
            className="flex w-full justify-center px-5"
            title="content-page-layout"
          >
            <div className="flex min-h-screen">
              <div
                className={cn(
                  "flex w-[640px] max-w-[640px] flex-grow flex-col",
                  styles.root,
                )}
              >
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
