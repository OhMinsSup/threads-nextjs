import React from "react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@thread/ui/avatar";
import { Button } from "@thread/ui/button";

import { PAGE_ENDPOINTS } from "~/constants/constants";

export default function FeedInput() {
  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between space-x-4">
        <div className="flex flex-auto items-center space-x-4">
          <Link href={PAGE_ENDPOINTS.ROOT}>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
          <div className="w-full cursor-text">
            <p className="text-base text-muted-foreground">
              스레드를 시작하세요....
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="default"
          className="ml-auto"
          size="sm"
          //   disabled={isPending}
          //   onClick={onClick}
        >
          {/* {isPending ? (
            <Icons.rotateCcw className="mr-2 size-4 animate-spin" />
          ) : null} */}
          게시
        </Button>
      </div>
    </div>
  );
}
