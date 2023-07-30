import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from ".";
import { AxiosResponse } from "axios";

export function useGetGoogleAuthUrl() {
  return useQuery(
    ["google-url"],
    (): Promise<AxiosResponse<{ to: string }>> =>
      axiosInstance.get("/auth/google")
  );
}

export function useGetGithubAuthUrl() {
  return useQuery(
    ["github-url"],
    (): Promise<AxiosResponse<{ to: string }>> =>
      axiosInstance.get("/auth/github")
  );
}

export function useSignupWithGoogle(state: string, code: string) {
  return useMutation(() => {
    console.log({ state, code });
    return axiosInstance.post(`/google?state=${state}&code=${code}`);
  });
}
