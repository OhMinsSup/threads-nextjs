import type { ApiInput, FnNameKey, MethodType } from "./types";
import ApiBuilder from "./api.builder";

export class ApiTransformBuilder<
  FnKey extends FnNameKey = FnNameKey,
> extends ApiBuilder<FnKey> {
  post(body?: ApiInput<FnKey>) {
    this.method = "POST";
    if (body) {
      this.body = body;
    }
    return this;
  }

  get() {
    this.method = "GET";
    return this;
  }

  put(body?: ApiInput<FnKey>) {
    this.method = "PUT";
    if (body) {
      this.body = body;
    }
    return this;
  }

  delete() {
    this.method = "DELETE";
    return this;
  }

  patch(body?: ApiInput<FnKey>) {
    this.method = "PATCH";
    if (body) {
      this.body = body;
    }
    return this;
  }

  head() {
    this.method = "HEAD";
    return this;
  }

  /**
   * Set the AbortSignal for the fetch request.
   *
   * @param signal - The AbortSignal to use for the fetch request
   */
  abortSignal(signal: AbortSignal): this {
    this.signal = signal;
    return this;
  }

  input(body: ApiInput<FnKey>) {
    this.body = body;
    return this;
  }

  setMethod(method: MethodType) {
    this.method = method;
    return this;
  }
}
