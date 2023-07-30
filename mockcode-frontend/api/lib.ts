const baseURL = process.env.APP_BASE_URL;
export async function getGoogleAuthDetails() {
  const res = await fetch(`${baseURL}/auth/google`);

  if (!res.ok) throw new Error("Unable to fetch Google auth details");
  return res.json();
}

export async function getGithubAuthDetails() {
  const res = await fetch(`${baseURL}/auth/github`);

  if (!res.ok) throw new Error("Unable to fetch Github auth details");
  return res.json();
}
