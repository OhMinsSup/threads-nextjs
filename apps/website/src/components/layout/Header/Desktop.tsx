import React from "react";

import type { Session } from "@thread/auth";
import { cn } from "@thread/ui";

import { HeaderLogo } from "~/components/layout/HeaderLogo";
import { HeaderMenu } from "~/components/layout/HeaderMenu";
import { HeaderNavigation } from "~/components/layout/HeaderNavigation";
import styles from "./styles.module.css";

interface DesktopProps {
  session?: Session | null;
}

export default function Desktop({ session }: DesktopProps) {
  return (
    <header className={cn(styles.header_desktop)} id="item-desktop-header">
      <HeaderLogo />
      <HeaderNavigation />
      <HeaderMenu session={session} />
    </header>
  );
}

Desktop.displayName = "Desktop";
