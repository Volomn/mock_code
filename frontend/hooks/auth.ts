import { useEffect, useState } from "react";
import { APP_TOKENS } from "@/utils/constants";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";

export function useAuthStatus() {
  const authToken = Cookies.get(APP_TOKENS.TOKEN);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(
    function () {
      if (!authToken) {
        setIsAuthenticated(false);
      } else {
        const tokenDetails: { exp: number } = jwt_decode(authToken);
        if (!tokenDetails.exp || tokenDetails.exp < Date.now() / 1000) {
          setIsAuthenticated(false);
        } else {
          return setIsAuthenticated(true);
        }
      }
    },
    [authToken]
  );

  return [isAuthenticated, authToken];
}

export function useLogout() {
  const router = useRouter();
  return function () {
    Cookies.remove(APP_TOKENS.TOKEN);
    router.push("/");
  };
}
