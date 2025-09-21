import { redirect } from "next/navigation";
import RootLayout from "./layout";
import { auth } from "~/server/auth";
import HomePage from "./_components/home";
import { SessionProvider } from "next-auth/react";

export default async function Home() {
  const session = await auth();
  console.log("sess", session);

  if (!session?.user) {
    redirect("./register");
  }

  return (
    <SessionProvider>
      <HomePage />
    </SessionProvider>
  );
}
