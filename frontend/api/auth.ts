
const baseURL = process.env.API_BASE_URL;
export async function getGoogleAuthDetails() {
  const res = await fetch(`${baseURL}/auth/google`, { cache: "no-cache" });

  if (!res.ok) throw new Error("Unable to fetch Google auth details");
  return res.json();
}

export async function getGithubAuthDetails() {
  const res = await fetch(`${baseURL}/auth/github`, { cache: "no-cache" });

  if (!res.ok) throw new Error("Unable to fetch Github auth details");
  return res.json();
}

export async function googleLogin(code: string, state: string) {
  const res = await fetch(`${baseURL}/auth/google?state=${state}&code=${code}`);
  if (!res.ok) throw new Error("Unable to fetch Github auth details");
  return res.json()
}