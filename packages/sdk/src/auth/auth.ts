import type { FormFieldSignUpSchema } from "./schema";

export interface Auth {
  signup(args: FormFieldSignUpSchema): void;
}
