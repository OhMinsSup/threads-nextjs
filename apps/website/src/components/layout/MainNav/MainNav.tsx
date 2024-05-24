import Link from "next/link";

import { Icons } from "~/components/icons";
import { ButtonGroup } from "~/components/layout/ButtonGroup";
import { UserMenu } from "~/components/layout/UserMenu";
import { PAGE_ENDPOINTS } from "~/constants/constants";
import { NAV_CONFIG } from "~/constants/nav";

export default function MainNav() {
  return (
    <>
      <Link
        href={PAGE_ENDPOINTS.ROOT}
        className="flex w-full items-center justify-center hover:scale-110 sm:block sm:w-auto"
      >
        <Icons.logo className="size-8" />
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

      <nav>
        <UserMenu />
      </nav>
    </>
  );
}
