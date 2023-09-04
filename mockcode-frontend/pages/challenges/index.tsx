import { AppLayout } from "@/layouts/app-layout";
import {
  Box,
  Container,
  Group,
  Paper,
  Skeleton,
  Stack,
  Text,
  clsx,
  useMantineColorScheme,
} from "@mantine/core";
import Image from "next/image";

import Competition1 from "@/public/competition1.png";
import { useGetCompetions } from "@/api/dashboard";
import { useRouter } from "next/router";
import { Competition } from "@/utils/interfaces";

export default function Dashboard() {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  return (
    <AppLayout>
      <Container size="xl" py={64}>
        <Stack spacing={16}>
          <h1
            className={clsx(
              dark ? "text-white" : "text-primary-01",
              "font-secondary font-semibold text-5xl m-0"
            )}
          >
            Challenges
          </h1>
          <article
            className={clsx(
              dark ? "text-white" : "text-shade-01",
              "font-primary"
            )}
            style={{ maxWidth: "1000px" }}
          >
            View all challenges read problem statement, download input files
            upload your solutions which will get scored immediately and view the
            leaderboard.
          </article>
        </Stack>

        {/* <Box mt={60}>
          <TextInput
            placeholder="Search for competitions"
            style={{ width: "100%" }}
            size="lg"
          />
        </Box> */}
        <Stack spacing={64} my={32}>
          <Competitions active />
          <Competitions active={false} />
        </Stack>
      </Container>
    </AppLayout>
  );
}

function Competitions({ active }: { active: boolean }) {
  const { isLoading, data } = useGetCompetions(active);
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  if (isLoading) {
    return (
      <Stack>
        <Skeleton height={64} />
        <Group grow>
          <Skeleton height={200} />
          <Skeleton height={200} />
          <Skeleton height={200} />
        </Group>
      </Stack>
    );
  }

  return (
    <Box>
      <Container fluid p={0}>
        <Box mb={24}>
          <h3
            className={clsx(
              dark ? "text-white" : "text-primary-01",
              "text-[28px] font-semibold"
            )}
          >
            {active ? "Active Competitions" : "All Competitions"}
          </h3>
        </Box>
        <Box
          display="grid"
          className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
        >
          {data?.data.map((competition) => (
            <Competition key={competition.id} competition={competition} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}

function Competition({ competition }: { competition: Competition }) {
  const router = useRouter();
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <Paper
      style={{
        boxShadow: "0px 4px 8px 0px rgba(27, 32, 99, 0.1)",
        cursor: "pointer",
      }}
      p={0}
      onClick={() => router.push(`/challenges/${competition.id}`)}
    >
      <Box pos="relative" h="150px">
        <Image
          src={Competition1}
          style={{ objectFit: "cover", objectPosition: "center" }}
          fill
          alt=""
        />
      </Box>
      <Stack spacing={0} px={20} pb={24}>
        <Text
          component="h3"
          weight={600}
          size={18}
          mt={16}
          mb={8}
          className={clsx(
            dark ? "text-white" : "text-primary-01",
            "font-secondary"
          )}
        >
          {competition.name}
        </Text>
        <Text component="p" m={0} lineClamp={2}>
          {competition.shortDescription || ""}
        </Text>
      </Stack>
    </Paper>
  );
}
