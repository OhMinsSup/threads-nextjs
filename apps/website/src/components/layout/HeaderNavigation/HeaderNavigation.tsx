import React from "react";
import Link from "next/link";

import type { Session } from "@thread/auth";
import { cn } from "@thread/ui";
import { buttonVariants } from "@thread/ui/button";

import { Icons } from "~/components/icons";
import { ButtonGroup } from "~/components/layout/ButtonGroup";
import { UserMenu } from "~/components/layout/UserMenu";
import { PAGE_ENDPOINTS } from "~/constants/constants";
import { NAV_CONFIG } from "~/constants/nav";

interface HeaderNavigationProps {
  session: Session | null;
}

export default function HeaderNavigation({ session }: HeaderNavigationProps) {
  return (
    <>
      <Link
        href={PAGE_ENDPOINTS.ROOT}
        className="flex w-full items-center justify-center hover:scale-110 sm:block sm:w-auto"
      >
        <Icons.threadsWhite className="hidden size-8 dark:block" />
        <Icons.threads className="block size-8 dark:hidden" />
      </Link>

      <nav className="hidden gap-4 sm:flex lg:gap-6">
        {NAV_CONFIG.mainNav.map((item, index) => (
          <ButtonGroup
            key={`main-nav-${index.toString()}`}
            item={item}
            type="header"
          />
        ))}
      </nav>

      {session ? (
        <nav>
          <UserMenu />
        </nav>
      ) : (
        <div>
          <Link
            aria-label="로그인"
            href={PAGE_ENDPOINTS.AUTH.SIGNIN}
            className={cn(buttonVariants())}
          >
            로그인
          </Link>
        </div>
      )}
    </>
  );
}
