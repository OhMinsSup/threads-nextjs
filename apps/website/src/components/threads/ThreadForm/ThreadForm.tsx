"use client";

import React, { useCallback, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { $generateHtmlFromNodes } from "@lexical/html";
import {
  type EditorState,
  type LexicalEditor as ReactLexicalEditor,
} from "lexical";
import { FieldErrors, FieldPath, get, useForm } from "react-hook-form";

import type { FormFieldsCreateSchema } from "@thread/validators/thread";
import { useBeforeUnload } from "@thread/hooks/useBeforeUnload";
import { cn } from "@thread/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@thread/ui/avatar";
import { Button } from "@thread/ui/button";
import { Form, FormControl, FormField, FormItem } from "@thread/ui/form";
import { schema } from "@thread/validators/thread";

import type { LexicalEditorProps } from "~/components/editor/lexical-editor";
import LexicalEditor from "~/components/editor/lexical-editor";
import { ClientOnly } from "~/components/shared/ClientOnly";

interface ThreadFormProps {
  editorState?: LexicalEditorProps["editorState"];
}

export default function ThreadForm({ editorState }: ThreadFormProps) {
  const form = useForm<FormFieldsCreateSchema>({
    resolver: zodResolver(schema.create),
    defaultValues: {
      text: "",
    },
    criteriaMode: "firstError",
    reValidateMode: "onSubmit",
  });

  const [, startTransition] = useTransition();

  const onSubmit = (values: FormFieldsCreateSchema) => {};

  const {
    watch,
    formState: { errors },
  } = form;

  const watchText = watch("text");

  const onEditorUpdate = useCallback(
    (
      editorState: EditorState,
      editor: ReactLexicalEditor,
      onUpdate: (...event: any[]) => void,
    ) => {
      editor.update(() => {
        if (editorState.isEmpty()) {
          onUpdate("");
          return;
        }
        const htmlString = $generateHtmlFromNodes(editor, null);
        onUpdate(htmlString);
      });

      startTransition(() => {
        const htmlJSON = JSON.stringify(editorState);
        form.setValue("htmlJSON", editorState.isEmpty() ? undefined : htmlJSON);
      });
    },
    [form],
  );

  return (
    <>
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center justify-center space-x-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">이름</p>
          </div>
        </div>
        <Button>게시</Button>
      </div>
      <div className="grid gap-6 py-6">
        <Form {...form}>
          <form id="threads-form" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-5">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <ClientOnly fallback={<LexicalEditor.Skeleton />}>
                          <LexicalEditor
                            editorState={editorState}
                            editable={!field.disabled}
                            onChange={(editorState, editor) => {
                              onEditorUpdate(
                                editorState,
                                editor,
                                field.onChange,
                              );
                            }}
                            onBlur={(editorState, editor) => {
                              onEditorUpdate(editorState, editor, field.onBlur);
                            }}
                          />
                        </ClientOnly>
                      </FormControl>
                      <ThreadForm.EditorMessage
                        errors={errors}
                        id={field.name}
                      />
                    </FormItem>
                  );
                }}
              />
            </div>
          </form>
        </Form>
      </div>
      {watchText && watchText.length > 0 ? <ThreadForm.BeforeUnload /> : null}
    </>
  );
}

interface EditorMessageProps {
  errors: FieldErrors<FormFieldsCreateSchema>;
  id: FieldPath<FormFieldsCreateSchema>;
  remoteError?: string | null;
}

ThreadForm.EditorMessage = function Item({
  errors,
  id,
  remoteError,
}: EditorMessageProps) {
  const errorMsgFn = useCallback((text: string) => {
    return (
      <p className={cn("text-sm font-medium text-red-500 dark:text-red-900")}>
        {text}
      </p>
    );
  }, []);

  if (remoteError) {
    return errorMsgFn(remoteError);
  }

  const error = get(errors, id);

  const body = error ? String(error?.message) : null;

  if (!body) {
    return null;
  }

  return errorMsgFn(body);
};

ThreadForm.BeforeUnload = function Item() {
  useBeforeUnload(
    (evt) => {
      const returnValue =
        "화면을 벗어나면 작업이 취소됩니다. 화면을 벗어나시겠습니까?";

      evt.preventDefault();
      evt.returnValue = returnValue;

      return returnValue;
    },
    {
      capture: true,
    },
  );

  return null;
};
