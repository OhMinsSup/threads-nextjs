import { Separator } from "@thread/ui/separator";

import { FeedArea } from "~/components/layout/FeedArea";
import { FeedHeader } from "~/components/layout/FeedHeader";
import { FeedInput } from "~/components/layout/FeedInput";

export default function Page() {
  return (
    <>
      <FeedHeader />
      <FeedArea>
        <FeedInput />
        <Separator orientation="horizontal" />
      </FeedArea>
    </>
  );
}
