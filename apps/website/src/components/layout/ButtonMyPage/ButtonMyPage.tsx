"use client";

import React from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import { cn } from "@thread/ui";

import type { NavItem } from "~/constants/nav";
import { mainNavbuttonVariants } from "~/constants/nav";

interface ButtonMyPageProps {
  item: NavItem;
  type: "footer" | "header";
}

export default function ButtonMyPage({ item, type }: ButtonMyPageProps) {
  const segment = useSelectedLayoutSegment();
  // const { data } = api.auth.getRequireSession.useQuery();

  // const href = data ? PAGE_ENDPOINTS.USER.ID(data.user.id) : "#";
  const href = "#";

  const isActive = Boolean(segment && href.startsWith(`/${segment}`));

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
      <item.icon />
    </Link>
  );
}
