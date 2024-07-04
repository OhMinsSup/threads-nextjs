"use client";

import React from "react";
import { usePathname } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@thread/ui/select";

import { NAV_CONFIG } from "~/constants/nav";

export default function FeedHeader() {
  const pathname = usePathname();
  return (
    <div className="sticky top-0 z-[1] flex min-h-[60px] w-full items-center">
      <div className="absolute left-[-12px] right-[-12px] z-0 grid grid-cols-[1fr_minmax(auto,65%)_1fr] items-center justify-center gap-x-4 px-4">
        <div className="flex items-center justify-start pl-2">
          PageSelectBox
        </div>
        <div className="flex items-center justify-center gap-x-2">
          <Select value={pathname}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a timezone" />
            </SelectTrigger>
            <SelectContent>
              {NAV_CONFIG.feedHeaderNav.map((item) => (
                <SelectItem
                  key={`select-page-${item.id}`}
                  value={item.href as unknown as string}
                >
                  {item.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex h-[60px] items-center justify-end gap-x-2 pr-2">
          PageSelectBox
        </div>
      </div>
    </div>
  );
}
