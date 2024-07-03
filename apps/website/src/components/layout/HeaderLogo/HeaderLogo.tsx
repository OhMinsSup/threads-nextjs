import React from "react";
import Link from "next/link";

import { Icons } from "~/components/icons";
import { PAGE_ENDPOINTS } from "~/constants/constants";
import styles from "./style.module.css";

export default function HeaderLogo() {
  return (
    <div className="ml-[19px] size-8">
      <Link href={PAGE_ENDPOINTS.ROOT} aria-label="홈">
        <Icons.threadsWhite className="hidden size-8 transition-transform hover:scale-110 dark:block" />
        <Icons.threads className="block size-8 transition-transform hover:scale-110 dark:hidden" />
      </Link>
    </div>
  );
}

HeaderLogo.Sidebar = function Item() {
  return (
    <Link href={PAGE_ENDPOINTS.ROOT} aria-label="홈" className="size-[34px]">
      <Icons.threadsSidebar className="fill-current transition-transform hover:scale-110" />
    </Link>
  );
};

HeaderLogo.displayName = "HeaderLogo";
