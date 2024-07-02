import React from "react";

import { cn } from "@thread/ui";

import { ButtonGroup } from "~/components/layout/ButtonGroup";
import { NAV_CONFIG } from "~/constants/nav";
import styles from "./styles.module.css";

export default function HeaderNavigation() {
  return (
    <div className={cn(styles.root)} id="item-navigation">
      <nav className="mx-auto grid w-full grid-cols-[repeat(5,20%)] items-center">
        {NAV_CONFIG.mainNav.map((item, index) => (
          <ButtonGroup
            key={`main-nav-${index.toString()}`}
            item={item}
            type="header"
          />
        ))}
      </nav>
    </div>
  );
}
