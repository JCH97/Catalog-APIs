export interface IResultError {
  code: string;
  message: string;
  details?: unknown;
  throw(): never;
}

export class AppError implements IResultError {
  constructor(
    public code: string,
    public message: string,
    public details?: unknown
  ) {}

  throw(): never {
    throw new Error(`${this.code}: ${this.message}`);
  }

  static Unauthorized(msg = 'Unauthorized') { return new AppError('UNAUTHORIZED', msg); }
  static NotFound(msg = 'Not found') { return new AppError('NOT_FOUND', msg); }
  static Conflict(msg = 'Conflict') { return new AppError('CONFLICT', msg); }
  static Validation(msg = 'Validation error', details?: unknown) {
    return new AppError('VALIDATION', msg, details);
  }
  static Internal(msg = 'Internal error', details?: unknown) {
    return new AppError('INTERNAL', msg, details);
  }
}