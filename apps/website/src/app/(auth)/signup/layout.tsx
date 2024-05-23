import React from "react";
import Link from "next/link";

import { cn } from "@thread/ui";
import { buttonVariants } from "@thread/ui/button";

import { Icons } from "~/components/icons";
import { PAGE_ENDPOINTS } from "~/constants/constants";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href={PAGE_ENDPOINTS.AUTH.SIGNIN}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8",
        )}
      >
        로그인
      </Link>
      <div className={cn("hidden h-full bg-muted lg:block")} />
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Icons.threads className="mx-auto size-8" />
          </div>
          {children}
          <p
            className={cn(
              "space-x-3 px-8 text-center text-sm text-muted-foreground",
            )}
          >
            <Link
              href="/terms"
              className={cn("hover:text-brand underline underline-offset-4")}
            >
              Threads 약관
            </Link>
            <Link
              href="/privacy"
              className={cn("hover:text-brand underline underline-offset-4")}
            >
              개인정보처리방침
            </Link>
            <Link
              href="/cookie"
              className={cn("hover:text-brand underline underline-offset-4")}
            >
              쿠키정책
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
