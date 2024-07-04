import type { LucideIcon } from "lucide-react";

import { cn } from "@thread/ui";

import type { Icons } from "~/components/icons";
import { PAGE_ENDPOINTS } from "./constants";

export interface NavItem {
  id:
    | "home"
    | "search"
    | "thread"
    | "activity"
    | "myPage"
    | "all"
    | "follow"
    | "replies"
    | "mentions"
    | "reposts"
    | "recommendation"
    | "like"
    | "saved";
  type: "link" | "myPage";
  title: string;
  href?: string;
  relationHrefs?: string[];
  disabled?: boolean;
  icon: keyof typeof Icons;
  relationIcons?: Record<string, LucideIcon>;
}

export type ScrollNavItem = Pick<NavItem, "id" | "type" | "title"> & {
  href: string;
};

export const NAV_CONFIG = {
  mainNav: [
    {
      id: "home",
      type: "link",
      title: "Home",
      href: PAGE_ENDPOINTS.ROOT,
      icon: "home",
    },
    {
      id: "search",
      type: "link",
      title: "Search",
      href: PAGE_ENDPOINTS.SEARCH,
      icon: "search",
    },
    {
      id: "thread",
      type: "link",
      title: "Threads",
      href: PAGE_ENDPOINTS.THREADS.ROOT,
      icon: "pen",
    },
    {
      id: "like",
      type: "link",
      title: "Like",
      href: PAGE_ENDPOINTS.LIKED,
      icon: "heart",
    },
    {
      id: "myPage",
      type: "myPage",
      title: "My Page",
      icon: "user",
    },
  ] as NavItem[],
  feedHeaderNav: [
    {
      id: "recommendation",
      type: "link",
      title: "회원님을 위한 추천",
      href: PAGE_ENDPOINTS.ROOT,
    },
    {
      id: "follow",
      type: "link",
      title: "팔로잉",
      href: PAGE_ENDPOINTS.FOLLOWING,
    },
    {
      id: "like",
      type: "link",
      title: "좋아요",
      href: PAGE_ENDPOINTS.LIKED,
    },
    {
      id: "saved",
      type: "link",
      title: "저장됨",
      href: PAGE_ENDPOINTS.SAVED,
    },
  ] as NavItem[],
  scrollNav: [
    {
      id: "all",
      type: "like",
      title: "모두",
      href: PAGE_ENDPOINTS.ACTIVITY.ROOT,
    },
    {
      id: "follow",
      type: "link",
      title: "팔로우",
      href: PAGE_ENDPOINTS.ACTIVITY.FOLLOWS,
    },
    {
      id: "replies",
      type: "link",
      title: "답글",
      href: PAGE_ENDPOINTS.ACTIVITY.REPLIES,
    },
    {
      id: "mentions",
      type: "link",
      title: "언급",
      href: PAGE_ENDPOINTS.ACTIVITY.MENTIONS,
    },
    {
      id: "reposts",
      type: "link",
      title: "리포스트",
      href: PAGE_ENDPOINTS.ACTIVITY.REPOSTS,
    },
  ] as ScrollNavItem[],
};

interface MainNavbuttonVariantsParams {
  item: NavItem;
  type: "footer" | "header";
  isActive?: boolean;
  isPending?: boolean;
  isTransitioning?: boolean;
}

export const mainNavbuttonVariants = ({
  item,
  type,
  isActive,
}: MainNavbuttonVariantsParams) => {
  return cn(
    // "relative mx-[2px] my-1 flex touch-manipulation select-none flex-row items-stretch justify-center bg-transparent px-8 py-5 transition-transform",
    isActive ? "text-foreground" : "text-foreground/60",
    item.disabled && "cursor-not-allowed opacity-90",
  );
};
