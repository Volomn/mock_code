import { AppLayout } from "@/layouts/app-layout";
import { Anchor, Button, Center, Stack, Text } from "@mantine/core";
import GoogleIcon from "@/public/google-icon.svg";
import GithubIcon from "@/public/github.svg";

export default function Signup() {
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
            <Button
              size="lg"
              variant="outline"
              fullWidth
              leftIcon={<GoogleIcon />}
            >
              Sign up with Google
            </Button>
            <Button
              size="lg"
              variant="outline"
              fullWidth
              leftIcon={<GithubIcon />}
            >
              Sign up with Github
            </Button>
          </Stack>

          <Anchor>I have an account</Anchor>
        </Stack>
      </Center>
    </AppLayout>
  );
}
