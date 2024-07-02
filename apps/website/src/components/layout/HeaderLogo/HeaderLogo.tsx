import React from "react";
import Link from "next/link";

import { Icons } from "~/components/icons";
import { PAGE_ENDPOINTS } from "~/constants/constants";

export default function HeaderLogo() {
  return (
    <div className="ml-[19px] size-8">
      <Link href={PAGE_ENDPOINTS.ROOT} className="flex">
        <Icons.threadsWhite className="hidden size-8 transition-transform hover:scale-110 dark:block" />
        <Icons.threads className="block size-8 transition-transform hover:scale-110 dark:hidden" />
      </Link>
    </div>
  );
}
