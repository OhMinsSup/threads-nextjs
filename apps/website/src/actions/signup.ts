"use server";

import type { FieldErrors } from "react-hook-form";
import { redirect } from "next/navigation";

import type { FormFieldSignUpSchema } from "@thread/sdk/schema";
import { isError } from "@thread/error/http";
import { createClient } from "@thread/sdk";

import { PAGE_ENDPOINTS } from "~/constants/constants";
import { env } from "~/env";

export type PreviousState =
  | FieldErrors<FormFieldSignUpSchema>
  | undefined
  | boolean;

export async function serverAction(
  _: PreviousState,
  input: FormFieldSignUpSchema,
) {
  let redirectFlag = false;

  console.log("???", env.NEXT_PUBLIC_SERVER_URL);

  const client = createClient(env.NEXT_PUBLIC_SERVER_URL);

  try {
    const response = await client.auth.rpc("signUp").call(input);
    console.log("response", response);
    redirectFlag = true;
    return true;
  } catch (error) {
    console.error("error", error);
    redirectFlag = false;
    if (isError(error)) {
      return {
        username: {
          message: error.message,
        },
      } as FieldErrors<FormFieldSignUpSchema>;
    }
  } finally {
    if (redirectFlag) {
      redirect(PAGE_ENDPOINTS.AUTH.SIGNIN);
    }
  }
}
