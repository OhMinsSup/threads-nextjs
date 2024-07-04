import * as z from "zod";

export const signInSchema = z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  password: z
    .string()
    .min(6, "비밀번호는 6글자 이상이어야 합니다.")
    .max(100, "비밀번호는 100글자 이하여야 합니다."),
});

export const signUpSchema = z
  .object({
    confirmPassword: z.string().min(6, "비밀번호는 6글자 이상이어야 합니다."),
    name: z.string().max(50, "이름은 50글자 이하여야 합니다.").optional(),
    avatarUrl: z.string().url().optional(),
  })
  .merge(signInSchema)
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh Token이 필요합니다."),
});

export const verifySchema = z.object({
  token: z.string().min(1, "토큰이 필요합니다."),
});

export const schema = {
  signIn: signInSchema,
  signUp: signUpSchema,
  refresh: refreshTokenSchema,
  verify: verifySchema,
};

export type FormFieldSignInSchema = z.infer<typeof schema.signIn>;

export type FormFieldSignUpSchema = z.infer<typeof schema.signUp>;

export type FormFieldRefreshTokenSchema = z.infer<typeof schema.refresh>;

export type FormFieldVerifyTokenSchema = z.infer<typeof schema.verify>;
