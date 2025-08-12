import Link from "next/link";
import { redirect } from "next/navigation";

import { LatestPost } from "~/app/_components/post";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import RegisterClient from "./_components/RegisterClient";

export default async function Home() {
  // redirect("/entries");
  
  return <RegisterClient />

}
