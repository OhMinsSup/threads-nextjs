"use client";

import Link from "next/link";

import { cn } from "@thread/ui";

import type { NavItem } from "~/constants/nav";
import { Icons } from "~/components/icons";
import { useMainLinkActive } from "~/hooks/useMainLinkActive";
import styles from "./styles.module.css";

interface ButtonLinkProps {
  item: NavItem;
  type: "footer" | "header";
}

export default function ButtonLink({ item }: ButtonLinkProps) {
  const { isActive, href } = useMainLinkActive({ item });

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
