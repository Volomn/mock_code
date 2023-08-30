import { AppLayout } from "@/layouts/app-layout";
import {
  Box,
  Container,
  Group,
  Paper,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import Image from "next/image";

import Competition1 from "@/public/competition1.png";
import { useGetCompetions } from "@/api/dashboard";
import { useRouter } from "next/router";
import { Competition } from "@/utils/interfaces";

export default function Dashboard() {
  return (
    <AppLayout>
      <Container size="xl" py={64}>
        <Stack spacing={16}>
          <h1 className="font-secondary text-primary-01 font-semibold text-5xl m-0">
            Challenges
          </h1>
          <article
            className="font-primary text-shade-01 dark:text-white"
            style={{ maxWidth: "1000px" }}
          >
            Lorem ipsum dolor sit amet consectetur. Turpis luctus vel amet
            pellentesque aliquam senectus molestie placerat. Gravida proin
            mollis a morbi erat vulputate rhoncus. Massa felis leo et feugiat
            pellentesque.
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
      <Container fluid>
        <Box mb={24}>
          <h3 className="text-[28px] text-primary-01 font-semibold">
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
          className="font-secondary"
        >
          {competition.name}
        </Text>
        <Text component="p" m={0} lineClamp={2}>
          {competition.problemStatement}
        </Text>
      </Stack>
    </Paper>
  );
}
