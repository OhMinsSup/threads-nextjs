import { schema as auth } from "./auth.schema";

export type {
  FormFieldRefreshTokenSchema,
  FormFieldSignInSchema,
  FormFieldSignUpSchema,
  FormFieldVerifyTokenSchema,
} from "./auth.schema";

export const schema = {
  ...auth,
};

export type Schema = typeof schema;
