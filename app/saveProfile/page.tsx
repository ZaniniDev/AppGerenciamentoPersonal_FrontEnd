import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { authClient } from "@/app/_lib/auth-client";
import { SaveProfileForm } from "./_components/save-profile-form";
import { BottomNav } from "@/app/_components/bottom-nav";

export default async function SaveProfilePage() {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  if (!session.data?.user) redirect("/auth");

  return (
    <>
      <SaveProfileForm />
      <BottomNav activePage="profile" />
    </>
  );
}
