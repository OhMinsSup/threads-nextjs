"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@thread/ui/button";

import { Icons } from "~/components/icons";

export default function ThreadHeader() {
  const router = useRouter();

  const onRouterBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <div className="sticky top-0 z-[1] flex min-h-[60px] w-full items-center">
      <div className="absolute left-[-12px] right-[-12px] z-0 grid grid-cols-[1fr_minmax(auto,65%)_1fr] items-center justify-center gap-x-4 px-4">
        <div className="flex items-center justify-start pl-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onRouterBack}
            role="link"
          >
            <Icons.chevronLeft className="size-6" />
          </Button>
        </div>
        <div className="flex items-center justify-center gap-x-2">
          새로운 스레드
        </div>
        <div className="flex h-[60px] items-center justify-end gap-x-2 pr-2">
          <Button variant="ghost" size="icon">
            <Icons.settings className="size-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
