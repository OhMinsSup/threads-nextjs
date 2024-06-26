"use client";

import React from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import { cn } from "@thread/ui";

import type { NavItem } from "~/constants/nav";
import { Icons } from "~/components/icons";
import { mainNavbuttonVariants } from "~/constants/nav";

interface ButtonMyPageProps {
  item: NavItem;
  type: "footer" | "header";
}

export default function ButtonMyPage({ item, type }: ButtonMyPageProps) {
  const segment = useSelectedLayoutSegment();
  const href = "#";

  const isActive = Boolean(segment && href.startsWith(`/${segment}`));

  const Icon = Icons[item.icon];

  return (
    <Link
      href={item.disabled ? "#" : href}
      className={cn(
        mainNavbuttonVariants({
          item,
          type,
          isActive,
        }),
      )}
    >
      <Icon className="size-6" aria-label={item.title} role="img" />
    </Link>
  );
}
