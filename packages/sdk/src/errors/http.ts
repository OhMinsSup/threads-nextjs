import { ErrorDisplayType } from "../constants/error-display";
import { HttpStatus } from "../constants/http-status";

export class HttpError<DataT = unknown> extends Error {
  static __thread_http_error__ = true;
  statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  fatal = false;
  unhandled = false;
  displayType = ErrorDisplayType.NONE;
  statusMessage?: string;
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
    const obj: Pick<
      HttpError<DataT>,
      "message" | "statusCode" | "statusMessage" | "data"
    > = {
      message: this.message,
      statusCode: this.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
    };

    if (this.statusMessage) {
      obj.statusMessage = this.statusMessage;
    }
    if (this.data !== undefined) {
      obj.data = this.data;
    }

    return obj;
  }
}

export function createError<DataT = unknown>(
  input:
    | string
    | (Partial<HttpError<DataT>> & {
        status?: number;
        statusText?: string;
      }),
) {
  if (typeof input === "string") {
    return new HttpError<DataT>(input);
  }

  if (isError<DataT>(input)) {
    return input;
  }

  const err = new HttpError<DataT>(input.message ?? input.statusMessage ?? "", {
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

  if (input.statusCode) {
    err.statusCode = input.statusCode;
  } else if (input.status) {
    err.statusCode = input.status;
  }

  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
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

export function isError<DataT = unknown>(
  input: any,
): input is HttpError<DataT> {
  return input?.constructor?.__thread_http_error__ === true;
}
