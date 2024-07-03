"use server";

import type { FieldErrors } from "react-hook-form";
import { redirect } from "next/navigation";

import type { CoreClientResponse } from "@thread/sdk";
import type { FormFieldSignInSchema } from "@thread/sdk/schema";
import { signIn } from "@thread/auth";
import { HttpResultStatus } from "@thread/sdk/enum";
import { isHttpError, isThreadError } from "@thread/sdk/error";

import { PAGE_ENDPOINTS } from "~/constants/constants";

type ZodValidateError = FieldErrors<FormFieldSignInSchema>;

export type PreviousState =
  | FieldErrors<FormFieldSignInSchema>
  | undefined
  | boolean;

const defaultErrorMessage = {
  email: {
    message: "인증에 실패했습니다. 이메일을 확인해주세요.",
  },
};

export async function serverAction(
  _: PreviousState,
  input: FormFieldSignInSchema,
) {
  let isRedirect = false;
  try {
    await signIn("credentials", {
      ...input,
      redirect: false,
    });
    isRedirect = true;
    return true;
  } catch (e) {
    isRedirect = false;
    // Auth.js signIn method throws a CallbackRouteError
    if (e instanceof Error && e.name === "CallbackRouteError") {
      console.error(e);
      // @ts-expect-error - The error object has a cause property
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const error = e.cause?.err;
      if (isThreadError<ZodValidateError>(error) && error.data) {
        return error.data;
      }

      if (isHttpError<CoreClientResponse>(error) && error.data) {
        switch (error.data.resultCode) {
          case HttpResultStatus.INVALID: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return Array.isArray(error.data.message)
              ? error.data.message.at(0)
              : defaultErrorMessage;
          }
          case HttpResultStatus.INCORRECT_PASSWORD:
          case HttpResultStatus.NOT_EXIST: {
            return error.data.message;
          }
          default: {
            return defaultErrorMessage;
          }
        }
      }
    }
  } finally {
    if (isRedirect) {
      redirect(PAGE_ENDPOINTS.ROOT);
    }
  }
}
