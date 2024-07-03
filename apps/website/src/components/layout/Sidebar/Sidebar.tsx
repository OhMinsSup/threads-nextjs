import React from "react";
import Link from "next/link";

import { cn } from "@thread/ui";
import { buttonVariants } from "@thread/ui/button";

import { Icons } from "~/components/icons";
import { ButtonGroup } from "~/components/layout/ButtonGroup";
import { UserMenu } from "~/components/layout/UserMenu";
import { PAGE_ENDPOINTS } from "~/constants/constants";
import { NAV_CONFIG } from "~/constants/nav";
import { HeaderLogo } from "../HeaderLogo";
import styles from "./styles.module.css";

export default function Sidebar() {
  return (
    <div className={styles.root} id="item-sidebar">
      <div className="flex flex-row justify-center py-[15px]">
        <HeaderLogo.Sidebar />
      </div>
      {/* <Sidebar.Middle />
      <Sidebar.Bottom /> */}
    </div>
  );
}

Sidebar.Middle = function Item() {
  return (
    <div className="flex flex-grow flex-col justify-center gap-y-1">
      {NAV_CONFIG.mainNav.map((item, index) => (
        <ButtonGroup
          key={`main-nav-${index.toString()}`}
          item={item}
          type="header"
        />
      ))}
    </div>
  );
};

Sidebar.Bottom = function Item() {
  return (
    <div className=" mb-[22px] h-fit">
      <UserMenu />
    </div>
  );
};

Sidebar.displayName = "Sidebar";
