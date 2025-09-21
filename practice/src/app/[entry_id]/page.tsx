"use client";
import { useParams } from "next/navigation";
import EntryPage from "../_components/entryPage";
import { SessionProvider } from "next-auth/react";

interface TablePageProps {
  params: Promise<{
    entry_id: string;
  }>;
}

export default function Page({}: React.FC<TablePageProps>) {
  const params = useParams<{ entry_id: string }>();

  return (
    <SessionProvider>
      <EntryPage entryId={Number(params.entry_id)} />
    </SessionProvider>
  );
}
