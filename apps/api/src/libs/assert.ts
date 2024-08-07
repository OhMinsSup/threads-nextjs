import type { HttpException } from "@nestjs/common";

type Assert = (
  condition: unknown,
  message?: string,
  ErrorType?: new (message?: string) => HttpException,
) => asserts condition;

export const assert: Assert = (condition, message, ErrorType) => {
  if (!condition) {
    if (ErrorType) {
      if (message) {
        throw new ErrorType(message);
      }

      throw new ErrorType();
    }

    throw new Error(message);
  }
};

export function assertNotNull<T>(item: T): item is NonNullable<T> {
  return item !== null && item !== undefined;
}
