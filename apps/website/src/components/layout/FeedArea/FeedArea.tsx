import React from "react";

import { cn } from "@thread/ui";
import { Card } from "@thread/ui/card";

import styles from "./styles.module.css";

interface FeedAreaProps {
  children: React.ReactNode;
}

export default function FeedArea({ children }: FeedAreaProps) {
  return (
    <Card
      className={cn(
        "relative z-0 flex min-h-0 flex-shrink flex-grow basis-full flex-col overflow-y-auto overflow-x-hidden overscroll-y-auto pt-2 shadow will-change-[transform,scroll]",
        styles.root,
      )}
    >
      <div className="relative flex flex-grow flex-col">{children}</div>
    </Card>
  );
}
