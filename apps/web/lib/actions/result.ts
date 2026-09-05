import {
  type DataSourceErrorCode,
  isDataSourceError,
} from "@xforge/contracts/errors";
import { ZodError } from "zod";

export type ActionErrorCode =
  | "CONFLICT"
  | "INVARIANT"
  | "NOT_FOUND"
  | "VALIDATION";

export interface ActionFailure {
  error: {
    code: ActionErrorCode;
    fields?: Record<string, string[]>;
    message: string;
  };
  ok: false;
}

export interface ActionSuccess<T> {
  data: T;
  ok: true;
}

/**
 * What a server action returns to the UI. Expected outcomes are values the
 * UI can render (a field error, a conflict toast); only unexpected failures
 * throw, and those reach error.tsx.
 */
export type ActionResult<T = void> = ActionFailure | ActionSuccess<T>;

const codeOf: Record<DataSourceErrorCode, ActionErrorCode> = {
  Conflict: "CONFLICT",
  Invariant: "INVARIANT",
  NotFound: "NOT_FOUND",
  Validation: "VALIDATION",
};

export const success = <T>(data: T): ActionSuccess<T> => ({ data, ok: true });

export const failure = (
  code: ActionErrorCode,
  message: string,
  fields?: Record<string, string[]>
): ActionFailure => ({
  error: fields ? { code, fields, message } : { code, message },
  ok: false,
});

const fieldErrors = (error: ZodError): Record<string, string[]> => {
  const fields: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.map(String).join(".") || "form";
    const messages = fields[key] ?? [];
    messages.push(issue.message);
    fields[key] = messages;
  }
  return fields;
};

export const toActionResult = async <T>(
  work: () => Promise<T>
): Promise<ActionResult<T>> => {
  try {
    return success(await work());
  } catch (error) {
    if (error instanceof ZodError) {
      return failure(
        "VALIDATION",
        "Check the highlighted fields",
        fieldErrors(error)
      );
    }
    if (isDataSourceError(error)) {
      const field = error.details?.field;
      return failure(
        codeOf[error.code],
        error.message,
        typeof field === "string" ? { [field]: [error.message] } : undefined
      );
    }
    throw error;
  }
};
