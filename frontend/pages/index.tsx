import Image from "next/image";
import BannerVector from "@/public/banner-vector.png";
import GithubIcon from "@/public/github.svg";

import {
  Anchor,
  Box,
  Button,
  Center,
  Container,
  Flex,
  Group,
  Stack,
  Text,
  clsx,
  useMantineColorScheme,
} from "@mantine/core";
import { AppLayout } from "@/layouts/app-layout";
import { sora } from "@/utils/fonts";
import { getGithubAuthDetails } from "@/api/lib";
import { useAuthStatus } from "@/hooks/auth";

import AlgorithmIcon from "@/public/algorithms.svg";
import DataStructuresIcon from "@/public/data-structure.svg";
import PerformanceIcon from "@/public/performance-optimization.svg";
import { useGetCompetions } from "@/api/dashboard";
import { Competition } from "./challenges";

export default function Home({
  githubAuthDetails,
}: {
  githubAuthDetails: { to: string };
}) {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const [isAuthenticated] = useAuthStatus();
  const { isLoading, data } = useGetCompetions(true);

  return (
    <AppLayout>
      <Container
        size="xl"
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
        }}
        w="100%"
      >
        <Group style={{ marginBlock: "auto" }} w="100%">
          <Box
            // size={700}
            w={650}
            py={40}
            ta={{ base: "center", sm: "left" }}
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
              <Anchor mt={16} mb={32} href={githubAuthDetails.to}>
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
            )}
          </Box>
          <Container className="flex-grow" pos="relative" h={400}>
            <Image
              src={BannerVector}
              style={{ objectFit: "contain" }}
              fill
              quality={100}
              alt="vector"
            />
          </Container>
        </Group>
      </Container>
      <Box
        bg="#FAFAFA"
        className={clsx(
          dark ? "bg-[#14171F] text-[#FAFAFA]" : "bg-[#FAFAFA] text-[#14171F]"
        )}
        p="48px"
      >
        <Center>
          <Stack className={clsx(dark ? "text-[#FAFAFA]" : "text-[#14171F]")}>
            <Text
              size={30}
              className="font-secondary"
              ta={{ base: "center", sm: "left" }}
            >
              Take your game to the next level and improve your skill set.
            </Text>

            <Group color="#181818" spacing={32} position="center">
              <Group spacing="sm">
                <AlgorithmIcon />
                <Text>Algorithms</Text>
              </Group>
              <Group spacing="sm">
                <DataStructuresIcon />
                <Text>Data Structures</Text>
              </Group>
              <Group spacing="sm">
                <PerformanceIcon />
                <Text>Performance Optimization</Text>
              </Group>
            </Group>
          </Stack>
        </Center>
      </Box>
      {data && data?.data.length > 0 && (
        <Container size="xl" py={"64px"}>
          <Flex
            direction={{ base: "column-reverse", sm: "row" }}
            justify={{ sm: "center" }}
            align="center"
            gap={{ base: 40, sm: 64 }}
          >
            <Box className="shrink-0">
              <Box miw="400px" maw={"600px"}>
                <Competition competition={data.data[data.data.length - 1]} />
              </Box>
            </Box>
            <Stack maw={600}>
              <Text
                weight={600}
                lh="48px"
                className={clsx(
                  dark ? "text-white" : "text-[#1B2063]",
                  "font-secondary text-[32px] sm:text-[40px]"
                )}
              >
                Participate in our ongoing competition
              </Text>
              <Text
                className={clsx(
                  dark ? "text-white" : "text-[##1B2063]",
                  "font-primary hover:bg-transparent"
                )}
              >
                Join the ranks of passionate coders and challenge your skills by
                actively participating in our thrilling ongoing competition.
              </Text>
            </Stack>
          </Flex>
        </Container>
      )}
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
