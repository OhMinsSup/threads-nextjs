"use client";

import Link from "next/link";

import { cn } from "@thread/ui";

import { mainNavbuttonVariants, NavItem } from "~/constants/nav";
import { useMainLinkActive } from "~/hooks/useMainLinkActive";

interface ButtonLinkProps {
  item: NavItem;
  type: "footer" | "header";
}

export default function ButtonLink({ item, type }: ButtonLinkProps) {
  const { isActive, href } = useMainLinkActive({ item });

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
