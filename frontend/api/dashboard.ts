import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from ".";
import { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { APP_TOKENS } from "@/utils/constants";
import { showNotification } from "@mantine/notifications";
import { Competition, LeaderboardEntry, Solutions } from "@/utils/interfaces";
import { queryClient } from "@/pages/_app";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export function useUserDetails() {
  return useQuery({
    queryKey: ["me"],
    queryFn: function (): Promise<AxiosResponse<User>> {
      return axiosInstance.get(`/me/`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(APP_TOKENS.TOKEN)}`,
        },
      });
    },
  });
}

export function useGetGithubLoginUrl() {
  return useQuery({
    queryKey: ["login-url", "github"],
    queryFn: function (): Promise<AxiosResponse<{ to: string }>> {
      return axiosInstance.get(`/auth/github?medium=github`);
    },
  });
}

export function useGetCompetions(active: boolean) {
  return useQuery({
    queryKey: ["competitions", active],
    queryFn: function (): Promise<AxiosResponse<Competition[]>> {
      return axiosInstance.get(
        active ? "/challenges/?isOpen=true" : "/challenges/"
      );
    },
  });
}

export function useGetCompetion(id: string) {
  return useQuery({
    queryKey: ["competitions", id],
    queryFn: function (): Promise<AxiosResponse<Competition>> {
      return axiosInstance.get(`/challenges/${id}`);
    },
  });
}

export function useGetLeaderboard(id: string) {
  return useQuery({
    queryKey: ["leaderboard", id],
    queryFn: function (): Promise<AxiosResponse<LeaderboardEntry[]>> {
      return axiosInstance.get(`/leaderboard/?challengeId=${id}`);
    },
  });
}

export function useGetSolutions(id: string) {
  return useQuery({
    queryKey: ["solutions", id],
    queryFn: function (): Promise<AxiosResponse<Solutions[]>> {
      return axiosInstance.get(`/submissions/?challengeId=${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(APP_TOKENS.TOKEN)}`,
        },
      });
    },
  });
}

export function useSubmitSolution(successCb: () => void) {
  return useMutation({
    mutationFn: (solutions: FormData): Promise<AxiosResponse<Solutions>> =>
      axiosInstance.post("/submissions/", solutions, {
        headers: {
          Authorization: `Bearer ${Cookies.get(APP_TOKENS.TOKEN)}`,
        },
      }),
    onSuccess: () => {
      showNotification({
        title: "Operation successful",
        message: "Submission uploaded",
        color: "green",
      });

      successCb();
    },
    onError: () => {
      showNotification({
        title: "Error occured",
        message: "Unable to submit",
        color: "red",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(["solutions"]);
    },
  });
}
