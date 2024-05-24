"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

import { cn } from "@thread/ui";
import { Button, buttonVariants } from "@thread/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@thread/ui/dropdown-menu";

import { Icons } from "~/components/icons";
import { PAGE_ENDPOINTS } from "~/constants/constants";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const { setTheme, theme } = useTheme();

  const onChaneTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [setTheme, theme]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={cn(
          "leading-tight hover:text-foreground",
          open ? "text-foreground" : "text-foreground/60",
        )}
      >
        <Icons.alignLeft />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" sideOffset={20}>
        <DropdownMenuItem>
          <Button
            className="h-auto w-full justify-start space-x-2 p-0"
            variant="ghost"
            onClick={onChaneTheme}
            size="sm"
          >
            {theme === "dark" ? <Icons.sun /> : <Icons.moon />}
            <span>
              {theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
            </span>
          </Button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Button
            className="h-auto w-full justify-start p-0"
            variant="ghost"
            size="sm"
          >
            설정
          </Button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            href={PAGE_ENDPOINTS.SAVED}
            className={cn(
              buttonVariants({
                variant: "ghost",
                size: "sm",
              }),
              "h-auto w-full justify-start p-0",
            )}
          >
            저장됨
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            href={PAGE_ENDPOINTS.LIKED}
            className={cn(
              buttonVariants({
                variant: "ghost",
                size: "sm",
              }),
              "h-auto w-full justify-start p-0",
            )}
          >
            좋아요
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button
            type="submit"
            className="h-auto w-full justify-start space-x-2 p-0"
            variant="ghost"
            size="sm"
          >
            <span>로그아웃</span>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
