export type DataSourceErrorCode =
  | "Conflict"
  | "Invariant"
  | "NotFound"
  | "Validation";

/**
 * The only error an adapter may raise for an expected outcome. Anything else
 * that escapes an adapter is an operational failure and reaches error.tsx.
 */
export class DataSourceError extends Error {
  readonly code: DataSourceErrorCode;
  readonly details: Record<string, unknown> | undefined;

  constructor(
    code: DataSourceErrorCode,
    message: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "DataSourceError";
    this.code = code;
    this.details = details;
  }
}

export const isDataSourceError = (error: unknown): error is DataSourceError =>
  error instanceof DataSourceError;
