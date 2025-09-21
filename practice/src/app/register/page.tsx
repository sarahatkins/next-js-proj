import { auth } from "~/server/auth";
import Register from "../_components/register";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  console.log("sess", session);

  if (session?.user) {
    redirect("./");
  }
  
  return <Register />;
}
