import { z } from "zod";

export type BaseActionStatus = "idle" | "success" | "failed" | "invalid_data";

export interface BaseActionState<
  T extends BaseActionStatus = BaseActionStatus,
> {
  message?: string;
  status: T;
}

interface Errors {
  failedError: string;
  zodError: string;
}

export class BaseAction {
  async run(
    callback: () => Promise<BaseActionState>,
    errors: Errors
  ): Promise<BaseActionState> {
    try {
      return await callback();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          status: "invalid_data",
          message: errors.zodError,
        };
      }

      return {
        status: "failed",
        message: errors.failedError,
      };
    }
  }
}

export async function runAction<T extends BaseActionState = BaseActionState>(
  callback: () => Promise<T>,
  errors: Errors
): Promise<BaseActionState> {
  try {
    return await callback();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        status: "invalid_data",
        message: errors.zodError,
      };
    }

    return {
      status: "failed",
      message: errors.failedError,
    };
  }
}
