import { FetchError } from "ofetch";

export {
  AppError,
  isError as isAppError,
  createError as createAppError,
} from "./errors";
export {
  HttpError,
  isError as isHttpError,
  createError as createHttpError,
} from "./errors/http";
export { FetchError };
export const isFetchError = <T = any>(input: unknown): input is FetchError<T> =>
  input instanceof FetchError;
