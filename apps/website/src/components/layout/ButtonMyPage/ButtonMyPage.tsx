"use client";

import React from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import { cn } from "@thread/ui";

import type { NavItem } from "~/constants/nav";
import { Icons } from "~/components/icons";
import styles from "./styles.module.css";

interface ButtonMyPageProps {
  item: NavItem;
  type: "footer" | "header";
}

export default function ButtonMyPage({ item }: ButtonMyPageProps) {
  const segment = useSelectedLayoutSegment();
  const href = "#";

  const isActive = Boolean(segment && href.startsWith(`/${segment}`));

  const Icon = Icons[item.icon];

  return (
    <Link href={item.disabled ? "#" : href} className={cn(styles.root)}>
      <div className={styles.root_icon_container}>
        <Icon
          className={cn(isActive && "!text-foreground")}
          aria-label={item.title}
          role="img"
        />
      </div>
      <div className={styles.overlay} />
    </Link>
  );
}
