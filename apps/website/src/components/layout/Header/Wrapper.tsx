"use client";

import type React from "react";

import { useMediaQuery } from "@thread/hooks/useMediaQuery";

interface WrapperProps {
  serverFallback: boolean;
  mobile?: React.ReactNode;
  desktop?: React.ReactNode;
}

export default function Wrapper(props: WrapperProps) {
  const isMobile = useMediaQuery("(max-width: 700px)", props.serverFallback);
  return isMobile ? props.mobile : props.desktop;
}

Wrapper.displayName = "HeaderWrapper";
