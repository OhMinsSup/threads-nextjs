import { auth } from "@thread/auth";
import { Separator } from "@thread/ui/separator";

import { FeedArea } from "~/components/layout/FeedArea";
import { FeedHeader } from "~/components/layout/FeedHeader";
import { FeedInput } from "~/components/layout/FeedInput";
import { ContentLayout as MCL } from "~/components/layout/MainLayout";
import { ContentLayout as PCL } from "~/components/layout/ProtectedLayout";

export default async function Page() {
  const session = await auth();
  const ContentLayout = session ? PCL : MCL;
  return (
    <ContentLayout>
      <FeedHeader />
      <FeedArea>
        <FeedInput />
        <Separator orientation="horizontal" />
      </FeedArea>
    </ContentLayout>
  );
}
