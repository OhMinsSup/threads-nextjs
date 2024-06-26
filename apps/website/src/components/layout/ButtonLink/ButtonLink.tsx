"use client";

import Link from "next/link";

import { cn } from "@thread/ui";

import type { NavItem } from "~/constants/nav";
import { Icons } from "~/components/icons";
import { mainNavbuttonVariants } from "~/constants/nav";
import { useMainLinkActive } from "~/hooks/useMainLinkActive";

interface ButtonLinkProps {
  item: NavItem;
  type: "footer" | "header";
}

export default function ButtonLink({ item, type }: ButtonLinkProps) {
  const { isActive, href } = useMainLinkActive({ item });

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
