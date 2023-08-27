import Link from "next/link";

export default function SignIn() {
  return (
    <div className="flex h-screen w-screen items-center justify-center border bg-slate-900">
      <Link
        className="m-5 rounded-full bg-blue-700 px-5 py-3 font-mono text-white hover:animate-pulse"
        href="/api/auth/signin"
      >
        Sign in
      </Link>
    </div>
  );
}
