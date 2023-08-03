import { AppLayout } from "@/layouts/app-layout";
import { Anchor, Button, Center, Stack, Text } from "@mantine/core";
import GoogleIcon from "@/public/google-icon.svg";
import GithubIcon from "@/public/github.svg";
import { getGithubAuthDetails, getGoogleAuthDetails } from "@/api/lib";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";

interface SignupProps {
  githubAuthDetails: { to: string };
  googleAuthDetails: { to: string };
}

export default function Signup({
  googleAuthDetails,
  githubAuthDetails,
}: SignupProps) {
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
            Sign Up
          </Text>
          <Stack spacing="md" style={{ width: "100%" }}>
            <Anchor href={googleAuthDetails.to}>
              <Button
                size="lg"
                variant="outline"
                fullWidth
                leftIcon={<GoogleIcon />}
              >
                Sign up with Google
              </Button>
            </Anchor>
            <Anchor href={githubAuthDetails.to}>
              <Button
                size="lg"
                variant="outline"
                fullWidth
                leftIcon={<GithubIcon />}
              >
                Sign up with Github
              </Button>
            </Anchor>
          </Stack>

          <Link href="/login">I have an account</Link>
        </Stack>
      </Center>
    </AppLayout>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const googleAuthDetails = await getGoogleAuthDetails();
  const githubAuthDetails = await getGithubAuthDetails();
  const { code, state } = ctx.query as Record<string, string>;

  if (!state)
    return {
      props: {
        googleAuthDetails,
        githubAuthDetails,
      },
    };
}
