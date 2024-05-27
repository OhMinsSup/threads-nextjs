import React from "react";
import Link from "next/link";

import { cn } from "@thread/ui";
import { buttonVariants } from "@thread/ui/button";

import { Icons } from "~/components/icons";
import { ButtonGroup } from "~/components/layout/ButtonGroup";
import { UserMenu } from "~/components/layout/UserMenu";
import { PAGE_ENDPOINTS } from "~/constants/constants";
import { NAV_CONFIG } from "~/constants/nav";

export default function Sidebar() {
  return (
    <div className="fixed left-0 top-0 z-[1] flex h-screen min-h-[480px] w-[76px] flex-col items-center overflow-visible backdrop-blur-lg">
      <Sidebar.Top />
      <Sidebar.Middle />
      <Sidebar.Bottom />
    </div>
  );
}

Sidebar.Top = function Item() {
  return (
    <div className="flex justify-center overflow-hidden py-[15px]">
      <Link
        href={PAGE_ENDPOINTS.ROOT}
        className={cn(
          buttonVariants({
            size: "icon",
            variant: "ghost",
            className: "hover:scale-110 hover:bg-inherit",
          }),
        )}
      >
        <Icons.threads_v2 className="size-auto fill-current" />
      </Link>
    </div>
  );
};

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
