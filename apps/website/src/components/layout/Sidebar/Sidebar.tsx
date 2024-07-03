import React from "react";

import { ButtonGroup } from "~/components/layout/ButtonGroup";
import { UserMenu } from "~/components/layout/UserMenu";
import { NAV_CONFIG } from "~/constants/nav";
import { HeaderLogo } from "../HeaderLogo";
import styles from "./styles.module.css";

export default function Sidebar() {
  return (
    <div className={styles.root} id="item-sidebar">
      <div className="flex flex-row justify-center py-[15px]">
        <HeaderLogo.Sidebar />
      </div>
      <div className="flex flex-grow flex-col justify-center gap-y-1">
        {NAV_CONFIG.mainNav.map((item, index) => (
          <div
            className="relative transition-transform"
            key={`main-sidebar-nav-${index.toString()}`}
          >
            <ButtonGroup item={item} type="sidebar" />
          </div>
        ))}
      </div>
      <div className="mb-[22px] h-fit">
        <UserMenu />
      </div>
    </div>
  );
}

Sidebar.displayName = "Sidebar";
