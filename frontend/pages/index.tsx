import Image from "next/image";
import BannerVector from "@/public/banner-vector.png";
import GithubIcon from "@/public/github.svg";

import {
  Anchor,
  Button,
  Center,
  Container,
  Group,
  Text,
  clsx,
  useMantineColorScheme,
} from "@mantine/core";
import { AppLayout } from "@/layouts/app-layout";
import { sora } from "@/utils/fonts";
import { getGithubAuthDetails } from "@/api/lib";
import { useAuthStatus } from "@/hooks/auth";

export default function Home({
  githubAuthDetails,
}: {
  githubAuthDetails: { to: string };
}) {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const [isAuthenticated] = useAuthStatus();

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
            Embark on a journey to challenge your coding prowess in our
            competitions, all while embracing the joy of the experience.
          </Text>
          {!isAuthenticated && (
            <Group position="center" mt={16} mb={32}>
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
                  Continue with Github
                </Button>
              </Anchor>
            </Group>
          )}
          <Container pos="relative" h={350}>
            <Image
              src={BannerVector}
              style={{ objectFit: "contain" }}
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
  const githubAuthDetails = await getGithubAuthDetails();

  return {
    props: {
      githubAuthDetails,
    },
  };
}
