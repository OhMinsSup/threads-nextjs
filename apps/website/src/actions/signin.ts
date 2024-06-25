"use server";

import type { FieldErrors } from "react-hook-form";
import { redirect } from "next/navigation";

import type { FormFieldSignInSchema } from "@thread/sdk/schema";
import { signIn } from "@thread/auth";

// import { HttpStatus } from "@thread/enum/http-status";
// import { isError } from "@thread/error/http";

import { PAGE_ENDPOINTS } from "~/constants/constants";

export type PreviousState =
  | FieldErrors<FormFieldSignInSchema>
  | undefined
  | boolean;

export async function serverAction(
  _: PreviousState,
  input: FormFieldSignInSchema,
) {
  let redirectFlag = false;
  try {
    await signIn("credentials", {
      ...input,
      redirect: false,
    });

    redirectFlag = true;
    return true;
  } catch (e) {
    redirectFlag = false;
    // Auth.js signIn method throws a CallbackRouteError
    if (e instanceof Error && e.name === "CallbackRouteError") {
      console.error(e);
      // const error = (e as any).cause?.err;
      // if (isError(error)) {
      //   switch (error.statusCode) {
      //     case HttpStatus.BAD_REQUEST: {
      //       return {
      //         ...(error.data
      //           ? {
      //               [(error.data as any).key]: {
      //                 message: [(error.data as any).message],
      //               },
      //             }
      //           : {}),
      //       } as FieldErrors<FormFieldSignInSchema>;
      //     }
      //     case HttpStatus.NOT_FOUND: {
      //       return {
      //         username: {
      //           message: "유저를 찾을 수 없습니다",
      //         },
      //       } as FieldErrors<FormFieldSignInSchema>;
      //     }
      //     case HttpStatus.UNAUTHORIZED: {
      //       return {
      //         password: {
      //           message: "비밀번호가 일치하지 않습니다",
      //         },
      //       } as FieldErrors<FormFieldSignInSchema>;
      //     }
      //   }
      // }
    }
  } finally {
    if (redirectFlag) {
      redirect(PAGE_ENDPOINTS.ROOT);
    }
  }
}
