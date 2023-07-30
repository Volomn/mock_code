import { AppLayout } from "@/layouts/app-layout";
import { Anchor, Button, Center, Stack, Text } from "@mantine/core";
import GoogleIcon from "@/public/google-icon.svg";
import GithubIcon from "@/public/github.svg";
import { GetServerSidePropsContext } from "next";

import jwt_decode from "jwt-decode";
import { useSignupWithGoogle } from "@/api/auth";
import { useEffect } from "react";

interface LoginProps {
  code: string;
  state: string;
  medium: "google" | "github";
}
export default function Login({ code, state, medium }: LoginProps) {
  // if(medium)

  const { mutateAsync: signupWithGoogle, isLoading: signupWithGoogleLoading } =
    useSignupWithGoogle(state, code);

//   useEffect(function () {
//     if (medium) {
//       if (medium === "google") {
//         signupWithGoogle().then((result) => console.log({ result }));
//       } else if (medium === "github") {
//         console.log({ code, state, medium });
//       }
//     }
//   }, []);

  function handleSignupWithGoogle() {
    signupWithGoogle().then((result) => console.log({ result }));
  }
  return (
    <AppLayout>
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
            <Button
              size="lg"
              variant="outline"
              fullWidth
              leftIcon={<GoogleIcon />}
              onClick={handleSignupWithGoogle}
              loading={signupWithGoogleLoading}
            >
              Login with Google
            </Button>
            <Button
              size="lg"
              variant="outline"
              fullWidth
              leftIcon={<GithubIcon />}
            >
              Login with Github
            </Button>
          </Stack>

          <Anchor>I have an account</Anchor>
        </Stack>
      </Center>
    </AppLayout>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { code, state } = ctx.query;
  const decodedState: { extra: string } = jwt_decode(state as string);

  return {
    props: {
      code: code || null,
      state: state || null,
      medium: decodedState?.extra || null,
    },
  };
}
