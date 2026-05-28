"use server";

import { z } from "zod";

import { auth } from "@/lib/auth";

const loginFormSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export interface LoginActionState {
  status: "idle" | "success" | "failed" | "invalid_data";
}

export const login = async (
  _: LoginActionState,
  formData: FormData
): Promise<LoginActionState> => {
  try {
    const validatedData = loginFormSchema.parse(Object.fromEntries(formData));

    await auth.api.signInEmail({
      body: {
        email: validatedData.email,
        password: validatedData.password,
      },
      asResponse: true,
    });

    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }

    return { status: "failed" };
  }
};
