"use server";

import { redirect } from "next/navigation";
import { type FieldErrors } from "react-hook-form";

import { isError } from "@thread/error/http";
import { usersService } from "@thread/trpc/services/users.services";
import { type FormFieldsSchema } from "@thread/validators/signup";

import { PAGE_ENDPOINTS } from "~/constants/constants";

export type PreviousState = FieldErrors<FormFieldsSchema> | undefined | boolean;

export async function serverAction(_: PreviousState, input: FormFieldsSchema) {
  let redirectFlag = false;
  try {
    await usersService.signup(input);
    redirectFlag = true;
    return true;
  } catch (error) {
    redirectFlag = false;
    if (isError(error)) {
      return {
        username: {
          message: error.message,
        },
      } as FieldErrors<FormFieldsSchema>;
    }
  } finally {
    if (redirectFlag) {
      redirect(PAGE_ENDPOINTS.AUTH.SIGNIN);
    }
  }
}
