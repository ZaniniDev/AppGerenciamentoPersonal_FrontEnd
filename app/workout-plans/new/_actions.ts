"use server";

import { headers } from "next/headers";
import { authClient } from "@/app/_lib/auth-client";
import {
  createWorkoutPlanForUser,
  type CreateWorkoutPlanForUserBody,
} from "@/app/_lib/api/fetch-generated";

export async function createWorkoutPlanAction(
  body: CreateWorkoutPlanForUserBody,
) {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) {
    return { status: 401 as const, data: { error: "Não autorizado", code: "Unauthorized" } };
  }

  return createWorkoutPlanForUser(session.data.user.id, body);
}
