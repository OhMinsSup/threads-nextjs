import { headers } from "next/headers";
import { userAgent } from "next/server";

import { auth } from "~/auth";
import { ContentLayout as MCL } from "~/components/layout/MainLayout";
import { ContentLayout as PCL } from "~/components/layout/ProtectedLayout";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const session = await auth();
  const agent = userAgent({ headers: headers() });
  const ContentLayout = session ? PCL : MCL;
  return (
    <ContentLayout deviceType={agent.device.type}>{children}</ContentLayout>
  );
}
