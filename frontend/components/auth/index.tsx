import { getGithubAuthDetails, getGoogleAuthDetails } from "@/api/auth";
import { ReactNode } from "react";

export async function GoogleAuth({ children }: { children: ReactNode }) {
  const googleAuthDetails = await getGoogleAuthDetails();

  return <a href={googleAuthDetails.to}>{children}</a>;
}

export async function GithubAuth({ children }: { children: ReactNode }) {
  const githubAuthDetails = await getGithubAuthDetails();

  return <a href={githubAuthDetails.to}>{children}</a>;
}
