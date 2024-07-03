import React from "react";
import Link from "next/link";

import type { Session } from "@thread/auth";
import { cn } from "@thread/ui";
import { buttonVariants } from "@thread/ui/button";

import { UserMenu } from "~/components/layout/UserMenu";
import { PAGE_ENDPOINTS } from "~/constants/constants";

interface HeaderMenuProps {
  session?: Session | null;
  isMobile?: boolean;
}

export default function HeaderMenu({ session, isMobile }: HeaderMenuProps) {
  return (
    <div
      className={cn(
        isMobile
          ? "absolute right-[19px] top-[19px]"
          : "col-start-3 ml-auto mr-[13px] flex flex-col items-center",
      )}
    >
      {session ? (
        <UserMenu />
      ) : (
        <Link
          aria-label="로그인"
          href={PAGE_ENDPOINTS.AUTH.SIGNIN}
          className={cn(buttonVariants())}
        >
          로그인
        </Link>
      )}
    </div>
  );
}
