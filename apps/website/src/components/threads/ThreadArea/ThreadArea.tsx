import React from "react";

import { cn } from "@thread/ui";
import { Card } from "@thread/ui/card";

import styles from "./styles.module.css";

interface ThreadAreaProps {
  children: React.ReactNode;
}

export default function ThreadArea({ children }: ThreadAreaProps) {
  return (
    <Card
      className={cn(
        "relative z-0 flex min-h-[300px] flex-col overflow-y-auto overflow-x-hidden overscroll-y-auto py-2 shadow will-change-[transform,scroll]",
        styles.root,
      )}
    >
      <div className="relative flex flex-grow flex-col">{children}</div>
    </Card>
  );
}
