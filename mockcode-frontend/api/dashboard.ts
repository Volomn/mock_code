import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from ".";
import { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { APP_TOKENS } from "@/utils/constants";
import { showNotification } from "@mantine/notifications";

export function useGetCompetions() {
  return useQuery({
    queryKey: ["competitions"],
    queryFn: function (): Promise<AxiosResponse<Competition[]>> {
      return axiosInstance.get("/challenges/");
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

export function useSubmitSolution() {
  return useMutation({
    mutationFn: (solutions: FormData) =>
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
    },
    onError: () => {
      showNotification({
        title: "Error occured",
        message: "Unable to submit",
        color: "red",
      });
    },
  });
}
