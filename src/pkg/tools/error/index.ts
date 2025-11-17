import { ErrorNew } from "./error.type";

export function NewError(
  message: string,
  code: number = 400,
  details?: any,
): ErrorNew {
  return {
    message,
    code,
    details,
  };
}
