import React from "react";
import Link from "next/link";

import { cn } from "@thread/ui";
import { buttonVariants } from "@thread/ui/button";

import { Icons } from "~/components/icons";
import { PAGE_ENDPOINTS } from "~/constants/constants";

export default function FloatingActionButton() {
  return (
    <Link
      href={PAGE_ENDPOINTS.THREADS.ROOT}
      className={cn(
        buttonVariants({ variant: "secondary", size: "icon" }),
        "fixed bottom-5 right-6 rounded-full",
      )}
    >
      <Icons.add />
    </Link>
  );
}

FloatingActionButton.displayName = "FloatingActionButton";
