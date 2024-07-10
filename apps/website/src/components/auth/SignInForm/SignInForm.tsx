"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";

import type { FormFieldSignInSchema } from "@thread/sdk/schema";
import { authSchema } from "@thread/sdk/schema";
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
import { isBoolean, isUndefined } from "@thread/utils/assertion";

import type { State } from "./signin.action";
import { Icons } from "~/components/icons";
import { InputPassword } from "~/components/shared/InputPassword";
import { submitAction } from "./signin.action";

type FormField = FormFieldSignInSchema;

export default function SignInForm() {
  const [state, formAction, isPending] = useFormState<State, FormField>(
    submitAction,
    undefined,
  );

  const form = useForm<FormField>({
    progressive: true,
    resolver: zodResolver(authSchema.signIn),
    defaultValues: {
      email: "",
      password: "",
    },
    errors: isUndefined(state) || isBoolean(state) ? undefined : state,
    reValidateMode: "onBlur",
  });

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form id="signin-form" onSubmit={form.handleSubmit(formAction)}>
          <div className="grid gap-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input
                      data-testid="email"
                      placeholder="example@example.com"
                      autoCapitalize="none"
                      autoComplete="email"
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
            <Button
              type="submit"
              disabled={isPending}
              aria-disabled={isPending}
            >
              {isPending ? (
                <Icons.spinner className="mr-2 size-4 animate-spin" />
              ) : null}
              <span>로그인</span>
            </Button>
          </div>
        </form>
      </Form>
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
