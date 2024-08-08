import { ErrorDisplayType } from "../constants/error-display";

export class AppError<DataT = unknown> extends Error {
  static __app_error__ = true;
  fatal = false;
  unhandled = false;
  displayType = ErrorDisplayType.NONE;
  data?: DataT;
  cause?: unknown;

  constructor(message: string, opts: { cause?: unknown } = {}) {
    // @ts-nocheck - https://v8.dev/features/error-cause
    super(message, opts);

    // Polyfill cause for other runtimes
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }

  toJSON() {
    const obj: Pick<AppError<DataT>, "message" | "data"> = {
      message: this.message,
    };

    if (this.data !== undefined) {
      obj.data = this.data;
    }

    return obj;
  }
}

export function createError<DataT = unknown>(
  input: string | Partial<AppError<DataT>>,
) {
  if (typeof input === "string") {
    return new AppError<DataT>(input);
  }

  if (isError<DataT>(input)) {
    return input;
  }

  const err = new AppError<DataT>(input.message ?? "", {
    cause: input.cause || input,
  });

  if ("stack" in input) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        },
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
        // Ignore
      }
    }
  }

  if (input.data) {
    err.data = input.data;
  }

  if (input.fatal !== undefined) {
    err.fatal = input.fatal;
  }

  if (input.unhandled !== undefined) {
    err.unhandled = input.unhandled;
  }

  if (input.displayType) {
    err.displayType = input.displayType;
  }

  return err;
}

export function isError<DataT = unknown>(input: any): input is AppError<DataT> {
  return input?.constructor?.__app_error__ === true;
}
