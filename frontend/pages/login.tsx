import {
  Anchor,
  Button,
  Center,
  Container,
  LoadingOverlay,
  Stack,
  Text,
} from "@mantine/core";
import { GetServerSidePropsContext } from "next";
import jwt_decode from "jwt-decode";
import { parseStringToObject } from "@/utils/string-object-parser";
import Cookies from "js-cookie";
import {
  getGithubAuthDetails,
  signInWithGithub,
} from "@/api/lib";

import { AppLayout } from "@/layouts/app-layout";
import GithubIcon from "@/public/github.svg";
import { APP_TOKENS } from "@/utils/constants";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Link from "next/link";

interface LoginProps {
  redirect: boolean;
  githubAuthDetails: { to: string };
  token: string;
}
export default function Login({
  redirect,
  githubAuthDetails,
  token,
}: LoginProps) {
  const router = useRouter();

  useEffect(
    function () {
      if (redirect) {
        Cookies.set(APP_TOKENS.TOKEN, token);
        router.push("/challenges");
      }
    },
    [redirect, router, token]
  );

  return (
    <AppLayout>
      <Container size="xl" pos="relative">
        {/* <LoadingOverlay visible={redirect}> */}
        <Center style={{ height: "calc(100vh - 90px - 64px)" }}>
          <Stack
            p={24}
            spacing="xl"
            style={{
              border: "1px solid #B8C0CC4D",
              boxShadow: "0px 4px 8px 0px #1B20631A",
              width: "min(100%, 400px)",
              borderRadius: "8px",
            }}
            align="center"
          >
            <Text weight={600} size="xl">
              Sign In
            </Text>
            <Stack spacing="md" style={{ width: "100%" }}>
              <Anchor href={githubAuthDetails.to}>
                <Button
                  size="lg"
                  variant="outline"
                  fullWidth
                  leftIcon={<GithubIcon />}
                >
                  Login with Github
                </Button>
              </Anchor>
            </Stack>

            <Link href="/sign-up">{`Don't have an account?`}</Link>
          </Stack>
        </Center>
        {/* </LoadingOverlay> */}
      </Container>
    </AppLayout>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const githubAuthDetails = await getGithubAuthDetails();
  const { code, state } = ctx.query as Record<string, string>;

  if (!state)
    return {
      props: {
        redirect: false,
        githubAuthDetails,
      },
    };

  const decodedState: { extra: string } = jwt_decode(state as string);
  const { medium } = parseStringToObject(decodedState.extra);
  let token = "",
    token_type = "";
  if (medium === "github") {
    const githubResponse = await signInWithGithub({
      code: code,
      state: state,
    });
    token = githubResponse.token;
    // const { token_type, token } = githubResponse;
    // Cookies.set(APP_TOKENS.TOKEN_TYPE, token_type);
    // Cookies.set(APP_TOKENS.TOKEN, token);
  }

  // console.log({
  //   code: code,
  //   state: state,
  //   extra: parseStringToObject(decodedState.extra),
  // });

  return {
    props: {
      redirect: true,
      githubAuthDetails,
      token,
    },
  };
}
