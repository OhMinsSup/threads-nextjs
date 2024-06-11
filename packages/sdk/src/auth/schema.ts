import * as z from "zod";

export const signInSchema = z.object({
  username: z.string().min(1, "유저명은 1글자 이상이어야 합니다."),
  password: z.string().min(6, "비밀번호는 6글자 이상이어야 합니다."),
});

export const signUpSchema = z
  .object({
    confirmPassword: z.string().min(6, "비밀번호는 6글자 이상이어야 합니다."),
  })
  .merge(signInSchema)
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export const schema = {
  signIn: signInSchema,
  signUp: signUpSchema,
};

export type FormFieldSignInSchema = z.infer<typeof schema.signIn>;

export type FormFieldSignUpSchema = z.infer<typeof schema.signUp>;
