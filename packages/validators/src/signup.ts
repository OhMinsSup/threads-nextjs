import * as z from "zod";

import { schema as $signinSchema } from "./signin";

export const schema = z
  .object({
    confirmPassword: z.string().min(6, "비밀번호는 6글자 이상이어야 합니다."),
  })
  .merge($signinSchema)
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export type FormFieldsSchem = z.infer<typeof schema>;
