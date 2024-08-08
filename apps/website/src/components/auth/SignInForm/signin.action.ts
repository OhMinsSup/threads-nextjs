"use server";

import type { FieldErrors } from "react-hook-form";
import { redirect } from "next/navigation";

import type { ClientResponse } from "@thread/sdk";
import type { FormFieldSignInSchema } from "@thread/sdk/schema";
import { HttpResultStatus } from "@thread/sdk/enum";
import { isAppError, isHttpError } from "@thread/sdk/error";

import { signIn } from "~/auth";
import { PAGE_ENDPOINTS } from "~/constants/constants";

type ZodValidateError = FieldErrors<FormFieldSignInSchema>;

export type State = FieldErrors<FormFieldSignInSchema> | undefined | boolean;

const defaultErrorMessage = {
  email: {
    message: "인증에 실패했습니다. 이메일을 확인해주세요.",
  },
};

export async function submitAction(
  _: State,
  input: FormFieldSignInSchema,
): Promise<State> {
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
      if (isAppError<ZodValidateError>(error) && error.data) {
        return error.data;
      }

      if (isHttpError<ClientResponse>(error) && error.data) {
        switch (error.data.resultCode) {
          case HttpResultStatus.INVALID: {
            return (
              Array.isArray(error.data.message)
                ? error.data.message.at(0)
                : defaultErrorMessage
            ) as State;
          }
          case HttpResultStatus.INCORRECT_PASSWORD:
          case HttpResultStatus.NOT_EXIST: {
            return error.data.message as State;
          }
          default: {
            return defaultErrorMessage as State;
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
