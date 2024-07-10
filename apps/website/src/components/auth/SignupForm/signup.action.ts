"use server";

import type { FieldErrors } from "react-hook-form";
import { redirect } from "next/navigation";

import type { ClientResponse } from "@thread/sdk";
import type { FormFieldSignUpSchema } from "@thread/sdk/schema";
import { createClient } from "@thread/sdk";
import { HttpResultStatus } from "@thread/sdk/enum";
import { isHttpError, isThreadError } from "@thread/sdk/error";

import { PAGE_ENDPOINTS } from "~/constants/constants";
import { env } from "~/env";

type ZodValidateError = FieldErrors<FormFieldSignUpSchema>;

export type State = ZodValidateError | undefined | boolean;

const defaultErrorMessage = {
  email: {
    message: "인증에 실패했습니다. 이메일을 확인해주세요.",
  },
};

export async function submitAction(
  _: State,
  input: FormFieldSignUpSchema,
): Promise<State> {
  let isRedirect = false;

  const client = createClient(env.NEXT_PUBLIC_SERVER_URL);

  try {
    await client.rpc("signUp").post(input);
    isRedirect = true;
    return true;
  } catch (error) {
    isRedirect = false;
    if (isThreadError<ZodValidateError>(error) && error.data) {
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
        case HttpResultStatus.NOT_EXIST: {
          return error.data.message as State;
        }
        default: {
          return defaultErrorMessage as State;
        }
      }
    }
  } finally {
    if (isRedirect) {
      redirect(PAGE_ENDPOINTS.AUTH.SIGNIN);
    }
  }
}
