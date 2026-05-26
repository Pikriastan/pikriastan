export type ErrorType =
  | "bad_request"
  | "unauthorized"
  | "not_found"
  | "rate_limit"
  | "offline";

export type Surface = "product" | "auth" | "api" | "database";

export type ErrorCode = `${ErrorType}:${Surface}`;

export class WebError extends Error {
  type: ErrorType;
  surface: Surface;
  statusCode: number;

  constructor(errorCode: ErrorCode, cause?: string) {
    super();

    const [type, surface] = errorCode.split(":");

    this.type = type as ErrorType;
    this.cause = cause;
    this.surface = surface as Surface;
    this.statusCode = getStatusCodeByType(this.type);
  }
}

export function getMessageByErrorCode(errorCode: ErrorCode): string {
  if (errorCode.includes("database")) {
    return "An error occurred while executing a database query.";
  }

  switch (errorCode) {
    case "bad_request:api":
      return "The request couldn't be processed. Please check your input and try again.";

    case "unauthorized:auth":
      return "Only admin users can access this.";

    case "not_found:product":
      return "The requested product was not found. Please check the URL and try again.";

    default:
      return "Something went wrong. Please try again later.";
  }
}

function getStatusCodeByType(type: ErrorType) {
  switch (type) {
    case "bad_request":
      return 400;
    case "unauthorized":
      return 401;
    case "not_found":
      return 404;
    case "rate_limit":
      return 429;
    case "offline":
      return 503;
    default:
      return 500;
  }
}
