import Image from "next/image";
import BannerVector from "@/public/banner-vector.png";
import GoogleIcon from "@/public/google-icon.svg";
import GithubIcon from "@/public/github.svg";

import {
  Anchor,
  Box,
  Button,
  Center,
  Container,
  Group,
  Text,
  clsx,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { AppLayout } from "@/layouts/app-layout";
import { sora } from "@/utils/fonts";
import { getGithubAuthDetails, getGoogleAuthDetails } from "@/api/lib";

export default function Home({
  githubAuthDetails,
  googleAuthDetails,
}: {
  githubAuthDetails: { to: string };
  googleAuthDetails: { to: string };
}) {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  return (
    <AppLayout>
      <Center style={{ minHeight: "calc(100vh - 90px - 64px)" }}>
        <Container
          size={700}
          py={40}
          ta={{ base: "left", sm: "center" }}
          style={{ fontFamily: "var(--font-sora)" }}
          className={sora.className}
        >
          <Text
            size={48}
            weight={600}
            style={{ lineHeight: "56px", fontFamily: "var(--font-sora)" }}
            className={clsx(dark ? "text-white" : "text-[#1B2063]")}
          >
            Code like a hero, change the world like a legend.
          </Text>
          <Text
            py={16}
            size={18}
            weight={300}
            className={clsx(
              dark ? "text-white" : "text-[#312A50]",
              "font-secondary"
            )}
          >
            Lorem ipsum dolor sit amet consectetur. Turpis ipsum etiam id nisi
            tempus sed elementum at. Pellentesque morbi imperdiet egestas.
          </Text>
          <Group position="center" mt={16} mb={32}>
            <Anchor href={googleAuthDetails.to}>
              <Button
                size="lg"
                variant="outline"
                leftIcon={<GoogleIcon />}
                className={clsx(
                  dark
                    ? "text-white border-white"
                    : "text-[##1B2063] border-[#1B2063]",
                  "font-secondary hover:bg-transparent"
                )}
                style={{ fontWeight: 400 }}
              >
                Sign up with Google
              </Button>
            </Anchor>
            <Anchor href={githubAuthDetails.to}>
              <Button
                size="lg"
                variant="outline"
                leftIcon={<GithubIcon />}
                className={clsx(
                  dark
                    ? "text-white border-white"
                    : "text-[##1B2063] border-[#1B2063]",
                  "font-secondary hover:bg-transparent"
                )}
                style={{ fontWeight: 400 }}
              >
                Sign up with Github
              </Button>
            </Anchor>
          </Group>
          <Container pos="relative" h={350}>
            <Image
              src={BannerVector}
              style={{ objectFit: "fill" }}
              fill
              quality={100}
              alt="vector"
            />
          </Container>
        </Container>
      </Center>
    </AppLayout>
  );
}

export async function getServerSideProps() {
  const googleAuthDetails = await getGoogleAuthDetails();
  const githubAuthDetails = await getGithubAuthDetails();

  console.log({ githubAuthDetails, googleAuthDetails });
  return {
    props: {
      googleAuthDetails,
      githubAuthDetails,
    },
  };
}
