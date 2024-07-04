import React from "react";

import { cn } from "@thread/ui";

import { ButtonGroup } from "~/components/layout/ButtonGroup";
import { NAV_CONFIG } from "~/constants/nav";
import styles from "./styles.module.css";

export default function FooterNavigation() {
  return (
    <>
      {NAV_CONFIG.mainNav.map((item, index) => (
        <div key={`footer-nav-${index}`} className={cn(styles.root)}>
          <ButtonGroup item={item} type="footer" />
        </div>
      ))}
    </>
  );
}

FooterNavigation.displayName = "FooterNavigation";
