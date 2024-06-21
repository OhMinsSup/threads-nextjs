import { HttpException, HttpExceptionOptions } from "@nestjs/common";

export type HttpErrorData<D = any> = {
  resultCode: number;
  message?: string | string[] | Record<string, any> | null;
  error?: string | string[] | Record<string, any> | null;
  result: D;
};

export class HttpError<D = any> extends HttpException {
  static __http_error__ = true;

  private readonly _input: HttpErrorData<D>;

  constructor(
    input: HttpErrorData<D>,
    response: string | Record<string, any>,
    status: number,
    options?: HttpExceptionOptions,
  ) {
    super(response, status, options);

    this._input = input;
  }

  isHttpError(): this is HttpError<D> {
    return (
      this._input !== undefined &&
      Object.prototype.hasOwnProperty.call(this, "getData")
    );
  }

  getData() {
    return this._input;
  }
}

export function isHttpError<DataT = unknown>(
  input: any,
): input is HttpError<DataT> {
  return input?.constructor?.__http_error__ === true;
}

export const assertHttpError = <D = any>(
  condition: boolean,
  input: HttpErrorData<D>,
  response: string | Record<string, any>,
  status: number,
  options?: HttpExceptionOptions,
) => {
  if (condition) {
    throw new HttpError(input, response, status, options);
  }
  return;
};
