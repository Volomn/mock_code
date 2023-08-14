import axios from "axios";

const baseURL = process.env.APP_BASE_URL;
export async function getGoogleAuthDetails() {
  const res = await fetch(`${baseURL}/auth/google?medium=google`);

  if (!res.ok) throw new Error("Unable to fetch Google auth details");
  return res.json();
}

export async function getGithubAuthDetails() {
  const res = await fetch(`${baseURL}/auth/github?medium=github`);

  if (!res.ok) throw new Error("Unable to fetch Github auth details");
  return res.json();
}

export async function signInWithGoogle({
  state,
  code,
}: {
  state: string;
  code: string;
}) {
  const res = await fetch(
    `${baseURL}/auth/google?state=${state}&code=${code}`,
    { method: "post", body: null }
  );
  console.log(res);
  if (!res.ok) throw new Error("Unable to sign in with Google");

  return res.json();
}

export async function signInWithGithub({
  state,
  code,
}: {
  state: string;
  code: string;
}) {
  const res = await fetch(
    `${baseURL}/auth/github?state=${state}&code=${code}`,
    { method: "post", body: null }
  );
  if (!res.ok) throw new Error("Unable to sign in with Google");

  return res.json();
}
