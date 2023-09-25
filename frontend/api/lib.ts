const baseURL = process.env.APP_BASE_URL;

export async function getGithubAuthDetails() {
  const res = await fetch(`${baseURL}/auth/github?medium=github`);

  if (!res.ok) throw new Error("Unable to fetch Github auth details");
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
  if (!res.ok) throw new Error("Unable to sign in with Github");

  return res.json();
}
