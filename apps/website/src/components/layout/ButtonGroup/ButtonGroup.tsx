import type { NavItem } from "~/constants/nav";
import { ButtonLink } from "~/components/layout/ButtonLink";
import { ButtonMyPage } from "~/components/layout/ButtonMyPage";

interface ButtonGroupProps {
  item: NavItem;
  type: "footer" | "header";
}

export default function ButtonGroup({ item, type }: ButtonGroupProps) {
  switch (item.type) {
    case "link": {
      return <ButtonLink item={item} type={type} />;
    }
    case "myPage": {
      return <ButtonMyPage item={item} type={type} />;
    }
    default: {
      return null;
    }
  }
}
