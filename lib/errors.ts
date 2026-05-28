export type ErrorType =
  | "bad_request"
  | "unauthorized"
  | "not_found"
  | "rate_limit"
  | "offline";

export type Surface = "api" | "database" | "r2";

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
  switch (errorCode) {
    case "bad_request:api":
      return "The request couldn't be processed. Please check your input and try again.";
    case "bad_request:database":
      return "We couldn't complete that database operation. Please try again.";
    case "bad_request:r2":
      return "The file couldn't be uploaded. Please check the file and try again.";

    case "unauthorized:api":
      return "You need to be signed in to do that.";
    case "unauthorized:database":
      return "You don't have permission to access this data.";
    case "unauthorized:r2":
      return "You don't have permission to upload or read this file.";

    case "not_found:api":
      return "We couldn't find what you were looking for.";
    case "not_found:database":
      return "That record doesn't exist or has been removed.";
    case "not_found:r2":
      return "That file no longer exists.";

    case "rate_limit:api":
      return "You're sending requests a little too quickly. Please slow down and try again.";
    case "rate_limit:database":
      return "The database is busy right now. Please try again in a moment.";
    case "rate_limit:r2":
      return "Too many uploads in a short period. Please wait a moment and try again.";

    case "offline:api":
      return "The service is temporarily unavailable. Please try again shortly.";
    case "offline:database":
      return "The database is temporarily unavailable. Please try again shortly.";
    case "offline:r2":
      return "Storage is temporarily unavailable. Please try again shortly.";

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
