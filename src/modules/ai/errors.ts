export type AIErrorKind =
  | "config"
  | "auth"
  | "rateLimit"
  | "network"
  | "timeout"
  | "server"
  | "badRequest"
  | "notFound"
  | "aborted"
  | "unknown";

export class AIError extends Error {
  constructor(
    public readonly kind: AIErrorKind,
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "AIError";
  }
}

/** Map an HTTP status code to an error kind. Status 0 means no response. */
export function kindFromStatus(status: number): AIErrorKind {
  if (status === 0) return "network";
  if (status === 401 || status === 403) return "auth";
  if (status === 429) return "rateLimit";
  if (status === 408 || status === 504) return "timeout";
  if (status >= 500) return "server";
  if (status === 404) return "notFound";
  if (status >= 400) return "badRequest";
  return "unknown";
}

/** Fluent message ID (without addon prefix) for each error kind. */
export function errorLocaleKey(kind: AIErrorKind): string {
  return `error-${kind}`;
}
