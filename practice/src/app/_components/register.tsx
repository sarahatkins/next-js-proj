"use client";
import Link from "next/link";
import Image from "next/image";
import router from "next/router";
import { redirect } from "next/navigation";
export default function Register() {
  const discordAuth = () => {
    redirect(`/api/auth/signin`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
        {/* Cute journal header */}
        <h1 className="mb-2 text-2xl font-bold text-gray-800">
          Welcome to <span className="text-indigo-600">MyJournal</span> ✨
        </h1>
        <p className="mb-6 text-gray-500">
          A cozy space to capture your thoughts and reflections.
        </p>

        {/* Discord sign-in button */}
        <div className="flex justify-center">
          <button
            // href="/api/auth/signin"
            className="flex gap-2 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow-md"
            onClick={() => discordAuth()}
          >
            <Image src="/discord.png" alt="Discord" width={24} height={20} />
            Continue with Discord
          </button>
        </div>

        {/* Cute footer message */}
        <div className="mt-8 text-sm text-gray-400">
          <p>📝 Your private journal, only for you.</p>
          <p>🌙 Write anytime, anywhere.</p>
        </div>
      </div>
    </div>
  );
}
