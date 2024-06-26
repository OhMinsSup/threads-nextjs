import React, { useEffect, useMemo, useRef } from "react";
import { signOut, useSession } from "next-auth/react";

export default function Token() {
  const { data: session, update } = useSession();

  const sessionError = useMemo(() => {
    if (!session) return false;
    if (session.error === "RefreshAccessTokenError") {
      return true;
    }
    return false;
  }, [session]);

  // const onRefresh = () => {
  //   try {
  //     const res = await axiosClient.post("/api/auth/refresh", {
  //       refreshToken: session?.user.refreshToken,
  //     });
  //     await update({ user: res.data });
  //   } catch (error) {
  //     if (error instanceof AxiosError) {
  //       message.loading("Refresh token expired, logging out");
  //       setTimeout(signOut, 1000);
  //     }
  //   } finally {
  //     if (isFirstMounted) {
  //       setIsFirstMounted(false);
  //     }
  //   }
  // }

  // Auto logout when refresh token expired
  useEffect(() => {
    if (sessionError) {
      console.log("[Refresh token error, logging out]");
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      setTimeout(() => signOut(), 1000);
    }
  }, [sessionError]);

  // Auto refresh token after interval
  // useEffect(() => {
  //   const updateAccessToken = async () => {};

  //   if (session) {
  //     // Check if first render
  //     if (isFirstMounted) {
  //       updateAccessToken();
  //     }

  //     // Keep checking after atime
  //     const timer = setInterval(updateAccessToken, refreshTime);

  //     // Clean up
  //     return () => clearInterval(timer);
  //   }
  // }, [session, refreshTime, isFirstMounted, message, update]);

  return <div>Token</div>;
}
