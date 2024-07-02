import React from "react";
import { headers } from "next/headers";
import { userAgent } from "next/server";

import type { Session } from "@thread/auth";

import Desktop from "./Desktop";
import Mobile from "./Mobile";
import Wrapper from "./Wrapper";

interface HeaderProps {
  session: Session | null;
}

export default async function Header({ session }: HeaderProps) {
  const { device } = await Promise.resolve(userAgent({ headers: headers() }));
  const viewport = device.type === "mobile" ? "mobile" : "desktop";
  return (
    <Wrapper
      serverFallback={viewport === "mobile"}
      desktop={<Desktop session={session} />}
      mobile={<Mobile session={session} />}
    />
  );
}
