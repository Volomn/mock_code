import { GithubIcon } from "@/components/icons/github-icon";
import { GoogleIcon } from "@/components/icons/google-icon";
import Link from "next/link";

export default function Signup() {
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

      <div className="w-[450px] mx-auto text-center flex flex-col gap-4 bg-white dark:bg-[#14171F] rounded p-5 border dark:border-[#14171F] px-10 py-12 shadow dark:shadow-lg dark:shadow-[#0A090B80] font-secondary font-medium text-primary-01 dark:text-white">
        <h3 className="text-lg self-start font-semibold">Sign up</h3>
        <button className="px-8 py-6 border rounded flex items-center gap-2">
          <GoogleIcon /> <span>Signup with Google</span>
        </button>
        <button className="px-8 py-6 border rounded flex items-center gap-2">
          <GithubIcon /> <span>Signup with Github</span>
        </button>
        <Link
          href="/login"
          className="text-[#3615BD] dark:text-slate-300 underline font-normal"
        >{`I have an account`}</Link>
      </div>
    </main>
  );
}
