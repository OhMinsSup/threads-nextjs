"use client";

import React, { useTransition } from "react";

import { cn } from "@thread/ui";
import { Button } from "@thread/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@thread/ui/form";
import { Input } from "@thread/ui/input";

// import { InputPassword } from "@thread/ui/input-password";

import { Icons } from "~/components/icons";

export default function SignupForm() {
  // const [isPending, startTransition] = useTransition();

  // const [state, formAction] = useFormState<PreviousState, SignUpInputSchema>(
  //   signUpAction,
  //   undefined,
  // );

  // const form = useForm<SignUpInputSchema>({
  //   resolver: zodResolver(signUpSchema),
  //   defaultValues: {
  //     username: "",
  //     password: "",
  //     confirmPassword: "",
  //   },
  //   errors: isUndefined(state) || isBoolean(state) ? undefined : state,
  //   reValidateMode: "onBlur",
  // });

  return (
    <div className="grid gap-6">
      <form
        id="signup-form"
        data-testid="signup-form"
        // onSubmit={form.handleSubmit((input) => {
        //   startTransition(() => {
        //     formAction(input);
        //   });
        // })}
      >
        <div className="grid gap-5">
          {/* <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>아이디</FormLabel>
                  <FormControl>
                    <Input
                      data-testid="username"
                      placeholder="아이디"
                      autoCapitalize="none"
                      autoComplete="username"
                      autoCorrect="off"
                      dir="ltr"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <InputPassword
                      data-testid="password"
                      placeholder="비밀번호"
                      autoComplete="current-password"
                      dir="ltr"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호 확인</FormLabel>
                  <FormControl>
                    <InputPassword
                      data-testid="confirm-password"
                      placeholder="비밀번호 확인"
                      autoComplete="current-password"
                      dir="ltr"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isPending}
              aria-disabled={isPending}
              data-testid="signup-button"
            >
              {isPending ? (
                <Icons.spinner className="mr-2 size-4 animate-spin" />
              ) : null}
              회원가입
            </Button> */}
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className={cn("bg-background px-2 text-muted-foreground")}>
            또는
          </span>
        </div>
      </div>
    </div>
  );
}
