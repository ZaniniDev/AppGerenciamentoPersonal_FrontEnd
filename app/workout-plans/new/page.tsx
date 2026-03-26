import { redirect } from "next/navigation";
import { authClient } from "@/app/_lib/auth-client";
import { headers } from "next/headers";
import { listWorkoutPlans } from "@/app/_lib/api/fetch-generated";
import { CreateWorkoutPlanForm } from "./_components/create-workout-plan-form";

export default async function NewWorkoutPlanPage() {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) redirect("/auth");

  const plansResult = await listWorkoutPlans({ active: "true" });
  const hasActivePlan =
    plansResult.status === 200 && plansResult.data.length > 0;

  return <CreateWorkoutPlanForm hasActivePlan={hasActivePlan} />;
}
