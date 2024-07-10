import React from "react";

interface ContentLayoutProps {
  deviceType?: string;
  children: React.ReactNode;
}

export default function ContentLayout({ children }: ContentLayoutProps) {
  return <div>{children}</div>;
}
