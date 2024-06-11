"use server";

import type { FieldErrors } from "react-hook-form";
import { redirect } from "next/navigation";

import type { FormFieldsSchema } from "@thread/validators/signin";
import { signIn } from "@thread/auth";
import { HttpStatus } from "@thread/enum/http-status";
import { isError } from "@thread/error/http";

import { PAGE_ENDPOINTS } from "~/constants/constants";

export type PreviousState = FieldErrors<FormFieldsSchema> | undefined | boolean;

export async function serverAction(_: PreviousState, input: FormFieldsSchema) {
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
      const error = (e as any).cause?.err;
      if (isError(error)) {
        switch (error.statusCode) {
          case HttpStatus.BAD_REQUEST: {
            return {
              ...(error.data
                ? {
                    [(error.data as any).key]: {
                      message: [(error.data as any).message],
                    },
                  }
                : {}),
            } as FieldErrors<FormFieldsSchema>;
          }
          case HttpStatus.NOT_FOUND: {
            return {
              username: {
                message: "유저를 찾을 수 없습니다",
              },
            } as FieldErrors<FormFieldsSchema>;
          }
          case HttpStatus.UNAUTHORIZED: {
            return {
              password: {
                message: "비밀번호가 일치하지 않습니다",
              },
            } as FieldErrors<FormFieldsSchema>;
          }
        }
      }
    }
  } finally {
    if (redirectFlag) {
      redirect(PAGE_ENDPOINTS.ROOT);
    }
  }
}
