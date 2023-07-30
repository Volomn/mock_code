import { googleLogin } from "@/api/auth";
import { GithubIcon } from "@/components/icons/github-icon";
import { GoogleIcon } from "@/components/icons/google-icon";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default async function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const state = searchParams.get("state");
  const code = searchParams.get("code");

  if (state && code) {
    const authResponse = await googleLogin(code, state);
    console.log({ authResponse });
  }

  return (
    <main
      className={`flex flex-grow flex-col gap-4 items-center justify-start dark:text-white`}
    >
      <Link
        href="/"
        className="font-secondary text-2xl mt-10 mb-20 text-primary-01 dark:text-white"
      >
        Mock
      </Link>

      <div className="w-[450px] mx-auto text-center flex flex-col items-center gap-4 bg-white dark:bg-[#14171F] rounded p-5 border dark:border-[#14171F] px-10 py-12 shadow dark:shadow-lg dark:shadow-[#0A090B80] font-secondary font-medium text-primary-01 dark:text-white">
        <h3 className="text-lg font-semibold">Login</h3>

        <button className="px-8 py-6 border rounded flex items-center justify-center gap-2">
          <GoogleIcon /> <span>Login with Google</span>
        </button>
        <button className="px-8 py-6 border rounded flex items-center justify-center gap-2">
          <GithubIcon /> <span>Login with Github</span>
        </button>

        <Link
          href="/signup"
          className="text-[#3615BD] dark:text-slate-300 underline font-normal"
        >{`I don't have an account`}</Link>
      </div>
    </main>
  );
}
