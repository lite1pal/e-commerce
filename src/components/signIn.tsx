import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-900">
      <button
        className="m-5 rounded-full bg-purple-700 px-5 py-3 font-mono text-white hover:bg-purple-800"
        onClick={() => void signIn("discord")}
      >
        Sign in with Discord
      </button>
    </div>
  );
}
