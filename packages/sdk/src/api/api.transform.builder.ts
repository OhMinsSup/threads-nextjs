import type { ApiInput, FnNameKey, MethodType } from "./types";
import ApiBuilder from "./api.builder";

export class ApiTransformBuilder<
  FnKey extends FnNameKey = FnNameKey,
> extends ApiBuilder<FnKey> {
  /**
   * Post method.
   *
   * @param {ApiInput<FnKey>?} body
   */
  post(body?: ApiInput<FnKey>) {
    this.method = "POST";
    if (body) {
      this.body = body;
    }
    return this;
  }

  /**
   * Get method.
   */
  get() {
    this.method = "GET";
    return this;
  }

  /**
   * Put method.
   *
   * @param {ApiInput<FnKey>?} body
   */
  put(body?: ApiInput<FnKey>) {
    this.method = "PUT";
    if (body) {
      this.body = body;
    }
    return this;
  }

  /**
   * Delete method.
   */
  delete() {
    this.method = "DELETE";
    return this;
  }

  /**
   * Patch method.
   *
   * @param {ApiInput<FnKey>?} body
   */
  patch(body?: ApiInput<FnKey>) {
    this.method = "PATCH";
    if (body) {
      this.body = body;
    }
    return this;
  }

  /**
   * Head method.
   */
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

  /**
   *
   * Set the body for the fetch request. This will override any body set in the
   *
   * @param body
   */
  input(body: ApiInput<FnKey>) {
    this.body = body;
    return this;
  }

  /**
   *
   * Set the method for the fetch request.
   *
   * @param method
   */
  setMethod(method: MethodType) {
    this.method = method;
    return this;
  }

  /**
   * Set the pathObject for the fetch request.
   *
   * @param {Record<string, string>?} params
   */
  setPath(params?: Record<string, string>) {
    this.path = params;
    return this;
  }

  /**
   *
   * Set the searchParams for the fetch request.
   *
   * @param {Record<string, unknown>?} params
   */
  setSearchParams(params?: Record<string, unknown>) {
    this.searchParams = params;
    return this;
  }
}
