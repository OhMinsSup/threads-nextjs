import React from "react";

import type { Session } from "@thread/auth";
import { cn } from "@thread/ui";

import { HeaderLogo } from "~/components/layout/HeaderLogo";
import { HeaderMenu } from "~/components/layout/HeaderMenu";
import styles from "./styles.module.css";

interface MobileProps {
  session?: Session | null;
}

export default function Mobile({ session }: MobileProps) {
  return (
    <header className={cn(styles.header_mobile)} id="item-mobile-header">
      <HeaderLogo />
      <HeaderMenu session={session} isMobile />
    </header>
  );
}

Mobile.displayName = "Mobile";
