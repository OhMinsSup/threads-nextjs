"use server";

import type { FieldErrors } from "react-hook-form";
import { redirect } from "next/navigation";

import type { CoreClientResponse } from "@thread/sdk";
import type { FormFieldSignUpSchema } from "@thread/sdk/schema";
import { createClient } from "@thread/sdk";
import { HttpResultStatus } from "@thread/sdk/enum";
import { isHttpError, isThreadError } from "@thread/sdk/error";

import { PAGE_ENDPOINTS } from "~/constants/constants";
import { env } from "~/env";

type ZodValidateError = FieldErrors<FormFieldSignUpSchema>;

export type PreviousState = ZodValidateError | undefined | boolean;

const defaultErrorMessage = {
  email: {
    message: "인증에 실패했습니다. 이메일을 확인해주세요.",
  },
};

export async function serverAction(
  _: PreviousState,
  input: FormFieldSignUpSchema,
) {
  let isRedirect = false;

  const client = createClient(env.NEXT_PUBLIC_SERVER_URL);

  try {
    await client.auth.rpc("signUp").call(input);
    isRedirect = true;
    return true;
  } catch (error) {
    isRedirect = false;
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
        case HttpResultStatus.NOT_EXIST: {
          return error.data.message;
        }
        default: {
          return defaultErrorMessage;
        }
      }
    }
  } finally {
    if (isRedirect) {
      redirect(PAGE_ENDPOINTS.AUTH.SIGNIN);
    }
  }
}
