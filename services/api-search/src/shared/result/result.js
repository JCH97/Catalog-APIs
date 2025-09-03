// A Result monad encapsulating success or failure. This implementation
// mirrors the canonical TypeScript version provided in the project
// specification but is adapted to JavaScript with JSDoc for type hints.
import { Optional } from '../optional.base.js';

/**
 * Represents the result of an operation, encapsulating success or failure.
 * @template R
 * @template E
 * @class
 */
export class Result {
  /**
   * Creates a new Result. Callers should use the static Ok/Fail
   * factories instead of invoking this constructor directly.
   * @constructor
   * @param {boolean} isSuccess - Indicates whether the result is success.
   * @param {E|null} [error] - The error value if failure.
   * @param {R} [value] - The success value if success.
   */
  constructor(isSuccess, error = null, value) {
    if (isSuccess && error) {
      throw new Error('InvalidOperation: A successful result cannot contain an error');
    }
    if (!isSuccess && !error) {
      throw new Error('InvalidOperation: A failing result must contain an error message');
    }
    /** @type {boolean} */
    this.isSuccess = isSuccess;
    /** @type {boolean} */
    this.isFailure = !isSuccess;
    /** @type {E|null} */
    this._error = error;
    /** @type {R|undefined} */
    this._value = value;
    Object.freeze(this);
  }

  /**
   * Returns the contained value wrapped as Optional or null if failure.
   * @returns {R|null} The value if success, otherwise null.
   */
  getValue() {
    return Optional(this.isSuccess ? this._value : null);
  }

  /**
   * Returns the contained error wrapped as Optional or null if success.
   * @returns {E|null} The error if failure, otherwise null.
   */
  errorValue() {
    return Optional(this.isFailure ? this._error : null);
  }

  /**
   * Maps the contained value synchronously. Error is propagated.
   * @template T
   * @param {(a: R) => T} func
   * @returns {Result<T,E>}
   */
  map(func) {
    return this.isSuccess ? Result.Ok(func(this._value)) : Result.Fail(this._error);
  }

  /**
   * Maps the contained value asynchronously. Error is propagated.
   * @template T
   * @param {(a: R) => Promise<T>} func
   * @returns {Promise<Result<T,E>>}
   */
  async mapAsync(func) {
    return this.isSuccess ? Result.Ok(await func(this._value)) : Result.Fail(this._error);
  }

  /**
   * Applies a function to the contained value or returns a default if failure.
   * @template T
   * @param {T} def
   * @param {(a: R) => T} func
   * @returns {T}
   */
  mapOr(def, func) {
    return this.isSuccess ? func(this._value) : def;
  }

  /**
   * Async variant of mapOr.
   * @template T
   * @param {T} def
   * @param {(a: R) => T | Promise<T>} func
   * @returns {Promise<T>}
   */
  async mapOrAsync(def, func) {
    return this.isSuccess ? func(this._value) : def;
  }

  /**
   * Applies a function on success or a fallback on error asynchronously.
   * @template T
   * @param {(err: E) => Promise<T>} def
   * @param {(a: R) => Promise<T>} func
   * @returns {Promise<T>}
   */
  async mapOrElseAsync(def, func) {
    return this.isSuccess ? func(this._value) : def(this._error);
  }

  /**
   * Applies a function on success or a fallback on error synchronously.
   * @template T
   * @param {(err: E) => T} def
   * @param {(a: R) => T} func
   * @returns {T}
   */
  mapOrElse(def, func) {
    return this.isSuccess ? func(this._value) : def(this._error);
  }

  /**
   * Maps the error to another type asynchronously, preserving success values.
   * @template F
   * @param {(a: E) => Promise<F>} func
   * @returns {Promise<Result<R,F>>}
   */
  async mapOrErrorAsync(func) {
    return this.isFailure ? Result.Fail(await func(this._error)) : Result.Ok(this._value);
  }

  /**
   * Maps the error to another type synchronously, preserving success values.
   * @template F
   * @param {(a: E) => F} func
   * @returns {Result<R,F>}
   */
  mapOrError(func) {
    return this.isFailure ? Result.Fail(func(this._error)) : Result.Ok(this._value);
  }

  /**
   * Returns `res` if this result is success; otherwise propagates error.
   * @template U
   * @param {Result<U,E>} res
   * @returns {Result<U,E>}
   */
  and(res) {
    return this.isSuccess ? res : Result.Fail(this._error);
  }

  /**
   * Chains a promise-returning function that returns a Result.
   * @template U
   * @param {(val: R) => Promise<Result<U,E>>} func
   * @returns {Promise<Result<U,E>>}
   */
  async andThenAsync(func) {
    return this.isSuccess ? await func(this._value) : Result.Fail(this._error);
  }

  /**
   * Chains a synchronous function that returns a Result.
   * @template U
   * @param {(val: R) => Result<U,E>} func
   * @returns {Result<U,E>}
   */
  andThen(func) {
    return this.isSuccess ? func(this._value) : Result.Fail(this._error);
  }

  /**
   * Returns `res` if this result is failure; otherwise returns success value.
   * @template F
   * @param {Result<R,F>} res
   * @returns {Result<R,F>}
   */
  or(res) {
    return this.isSuccess ? Result.Ok(this._value) : res;
  }

  /**
   * Invokes an async recovery function on error or returns success value.
   * @template F
   * @param {(err: E) => Promise<Result<R,F>>} func
   * @returns {Promise<Result<R,F>>}
   */
  async orElseAsync(func) {
    return this.isSuccess ? Result.Ok(this._value) : func(this._error);
  }

  /**
   * Invokes a synchronous recovery function on error or returns success value.
   * @template F
   * @param {(err: E) => Result<R,F>} func
   * @returns {Result<R,F>}
   */
  orElse(func) {
    return this.isSuccess ? Result.Ok(this._value) : func(this._error);
  }

  /**
   * Returns the contained value or throws with the provided message if failure.
   * @param {string} msg
   * @returns {R}
   */
  expect(msg) {
    if (this.isFailure) throw new Error(msg);
    return this._value;
  }

  /**
   * Returns the contained value or throws the stored error (if it has a
   * throw method) or a generic error otherwise.
   * @returns {R}
   */
  unwrap() {
    if (this.isFailure) {
      if (this._error && typeof this._error.throw === 'function') this._error.throw();
      throw new Error('Called unwrap on an error result');
    }
    return this._value;
  }

  /**
   * Returns the contained value or a provided default if failure.
   * @param {R} def
   * @returns {R}
   */
  unwrapOr(def) {
    return this.isSuccess ? this._value : def;
  }

  /**
   * Returns the contained value or computes it from the error asynchronously.
   * @param {(err: E) => R | Promise<R>} func
   * @returns {Promise<R>}
   */
  async unwrapOrElseAsync(func) {
    return this.isSuccess ? this._value : func(this._error);
  }

  /**
   * Returns the contained value or computes it from the error.
   * @param {(err: E) => R} func
   * @returns {R}
   */
  unwrapOrElse(func) {
    return this.isSuccess ? this._value : func(this._error);
  }

  /**
   * Returns the contained error or throws if success.
   * @returns {E}
   */
  unwrapError() {
    if (this.isSuccess) throw new Error("Unwraping error in 'Ok' result");
    return /** @type {E} */ (this._error);
  }

  /**
   * Creates a success Result.
   * @template U
   * @template F
   * @param {U} [value]
   * @returns {Result<U,F>}
   */
  static Ok(value) {
    return new Result(true, null, value);
  }

  /**
   * Creates a failure Result.
   * @template U
   * @template F
   * @param {F} error
   * @returns {Result<U,F>}
   */
  static Fail(error) {
    return new Result(false, error);
  }

  /**
   * Combines multiple Results, returning the first failure or a success
   * with undefined value if none failed.
   * @template T
   * @param {Array<Result<any, any>>} results
   * @returns {Result<T, any>}
   */
  static combine(results) {
    for (const result of results) {
      if (result.isFailure) return result;
    }
    return Result.Ok();
  }
}
