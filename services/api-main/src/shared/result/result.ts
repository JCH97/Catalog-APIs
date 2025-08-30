import type { IResultError } from '../errors.js';
import { Optional } from '../optional.base.js';

/**
 * A Result monad encapsulating either a success value or an error.
 * The class enforces a strict distinction between successful and failing
 * outcomes and provides a rich API for mapping and chaining operations
 * while preserving type safety. Adapted from a canonical implementation
 * provided by the user.
 *
 * @template R The type of the successful value
 * @template E The type of the error (must extend IResultError)
 */
export class Result<R, E extends IResultError = IResultError> {
  public readonly isSuccess: boolean;
  public readonly isFailure: boolean;
  private readonly _error: E;
  private readonly _value: R;

  /**
   * Creates a new Result. The constructor is protected because callers
   * should use the static Ok/Fail factories instead. When constructing
   * a successful result, `error` must be omitted; when constructing a
   * failing result, `error` must be provided and `value` must be
   * undefined.
   *
   * @param isSuccess Whether the result represents success
   * @param error     The error value if failure
   * @param value     The success value if success
   */
  protected constructor(isSuccess: boolean, error?: E | null, value?: R) {
    if (isSuccess && error) {
      throw new Error('InvalidOperation: A successful result cannot contain an error');
    }
    if (!isSuccess && !error) {
      throw new Error('InvalidOperation: A failing result must contain an error message');
    }
    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    // We cast here because TypeScript does not narrow types in constructors
    this._error = error as any;
    this._value = value as any;
    Object.freeze(this);
  }

  /**
   * Returns the contained success value wrapped in an Optional. If the
   * result is a failure, returns Optional(null).
   */
  public getValue(): Optional<R> {
    return Optional(this.isSuccess ? this._value : null);
  }

  /**
   * Returns the contained error wrapped in an Optional. If the result
   * is a success, returns Optional(null).
   */
  public errorValue(): Optional<E> {
    return Optional(this.isFailure ? this._error : null);
  }

  /**
   * Applies a synchronous function to the contained success value,
   * returning a new Result with the transformed value. Does not
   * transform the error.
   */
  public map<T>(func: (a: R) => T): Result<T, E> {
    return this.isSuccess ? Result.Ok(func(this._value)) : Result.Fail(this._error);
  }

  /**
   * Applies an asynchronous function to the contained success value,
   * returning a new Result. Does not transform the error.
   */
  public async mapAsync<T>(func: (a: R) => Promise<T>): Promise<Result<T, E>> {
    return this.isSuccess ? Result.Ok(await func(this._value)) : Result.Fail(this._error);
  }

  /**
   * Maps the contained value if success, otherwise returns a default
   * value. Useful for providing a fallback without throwing.
   */
  public mapOr<T>(def: T, func: (a: R) => T): T {
    return this.isSuccess ? func(this._value) : def;
  }

  /**
   * Async variant of mapOr. Applies the provided function on success or
   * returns a provided default. The function may return a promise.
   */
  public async mapOrAsync<T>(def: T, func: (a: R) => T | Promise<T>): Promise<T> {
    return this.isSuccess ? func(this._value) : def;
  }

  /**
   * Applies a function to the contained success value or a fallback
   * function to the contained error value, returning a promise.
   */
  public async mapOrElseAsync<T>(def: (a: E) => Promise<T>, func: (a: R) => Promise<T>): Promise<T> {
    return this.isSuccess ? func(this._value) : def(this._error);
  }

  /**
   * Synchronous version of mapOrElseAsync. Applies `func` if success
   * or `def` if failure.
   */
  public mapOrElse<T>(def: (a: E) => T, func: (a: R) => T): T {
    return this.isSuccess ? func(this._value) : def(this._error);
  }

  /**
   * Maps the error to another type asynchronously, leaving success
   * values untouched. Allows error transformation while preserving
   * success values.
   */
  public async mapOrErrorAsync<F extends IResultError = IResultError>(func: (a: E) => Promise<F>): Promise<Result<R, F>> {
    return this.isFailure ? Result.Fail<R, F>(await func(this._error)) : Result.Ok<R, F>(this._value);
  }

  /**
   * Synchronous version of mapOrErrorAsync. Maps the error using the
   * provided function if failure, leaving success values untouched.
   */
  public mapOrError<F extends IResultError = IResultError>(func: (a: E) => F): Result<R, F> {
    return this.isFailure ? Result.Fail<R, F>(func(this._error)) : Result.Ok<R, F>(this._value);
  }

  /**
   * Returns `res` if the result is success; otherwise propagates the
   * current error. Allows chaining multiple result-returning
   * operations where subsequent operations depend on previous
   * successes.
   */
  public and<U>(res: Result<U, E>): Result<U, E> {
    return this.isSuccess ? res : Result.Fail(this._error);
  }

  /**
   * Chains a promise-returning function that returns a Result. If
   * success, the function is invoked with the contained value. If
   * failure, the current error is propagated.
   */
  public async andThenAsync<U>(func: (val: R) => Promise<Result<U, E>>): Promise<Result<U, E>> {
    return this.isSuccess ? await func(this._value) : Result.Fail(this._error);
  }

  /**
   * Chains a synchronous function that returns a Result. If success,
   * the function is invoked with the contained value; otherwise the
   * current error is propagated.
   */
  public andThen<U>(func: (val: R) => Result<U, E>): Result<U, E> {
    return this.isSuccess ? func(this._value) : Result.Fail(this._error);
  }

  /**
   * Returns the provided Result if failure, otherwise returns the
   * contained success value. Useful for providing alternate
   * computations on error.
   */
  public or<F extends IResultError = IResultError>(res: Result<R, F>): Result<R, F> {
    return this.isSuccess ? Result.Ok<R, F>(this._value) : res;
  }

  /**
   * Invokes a promise-returning function if failure, otherwise
   * returns the success value. Allows recovery from failure.
   */
  public async orElseAsync<F extends IResultError = IResultError>(func: (err: E) => Promise<Result<R, F>>): Promise<Result<R, F>> {
    return this.isSuccess ? Result.Ok<R, F>(this._value) : func(this._error);
  }

  /**
   * Invokes a synchronous function if failure, otherwise returns the
   * success value. Useful for recovery from failure.
   */
  public orElse<F extends IResultError = IResultError>(func: (err: E) => Result<R, F>): Result<R, F> {
    return this.isSuccess ? Result.Ok<R, F>(this._value) : func(this._error);
  }

  /**
   * Returns the contained success value or throws with the provided
   * message if failure. Use when you expect success and want a
   * descriptive error on failure.
   */
  public expect(msg: string): R {
    if (this.isFailure) throw new Error(msg);
    return this._value;
  }

  /**
   * Returns the contained success value or rethrows the stored error
   * (if it implements `throw()`) or throws a generic error otherwise.
   */
  public unwrap(): R {
    if (this.isFailure) {
      if (this._error && typeof (this._error as any).throw === 'function') {
        (this._error as any).throw();
      }
      throw new Error('Called unwrap on an error result');
    }
    return this._value;
  }

  /**
   * Returns the contained success value or a provided default if
   * failure. Arguments passed to unwrapOr are eagerly evaluated.
   */
  public unwrapOr(def: R): R {
    return this.isSuccess ? this._value : def;
  }

  /**
   * Returns the contained success value or computes it from the
   * error asynchronously. The closure is lazily evaluated only on
   * failure.
   */
  public async unwrapOrElseAsync(func: (err: E) => R | Promise<R>): Promise<R> {
    return this.isSuccess ? this._value : func(this._error);
  }

  /**
   * Returns the contained success value or computes it from the
   * error synchronously. The closure is lazily evaluated only on
   * failure.
   */
  public unwrapOrElse(func: (err: E) => R): R {
    return this.isSuccess ? this._value : func(this._error);
  }

  /**
   * Returns the contained error, consuming the Result. Throws if
   * called on a success result.
   */
  public unwrapError(): E {
    if (this.isSuccess) throw new Error("Unwraping error in 'Ok' result");
    return this._error;
  }

  /**
   * Creates a success Result. The error parameter is always omitted.
   */
  public static Ok<U, F extends IResultError = IResultError>(value?: U): Result<U, F> {
    // Provide undefined for error to satisfy constructor signature
    return new Result<U, F>(true, null, value);
  }

  /**
   * Creates a failure Result. The value parameter is omitted.
   */
  public static Fail<U, F extends IResultError = IResultError>(error: F): Result<U, F> {
    return new Result<U, F>(false, error);
  }

  /**
   * Combines multiple results, returning the first failure or a
   * success with undefined value if none failed. Useful for
   * validating a collection of operations.
   */
  public static combine<T>(results: Array<Result<any>>): Result<T> {
    for (const result of results) {
      if (result.isFailure) return result;
    }
    return Result.Ok<T>();
  }
}