import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Drawer,
  FileButton,
  Group,
  Stack,
  Table,
  Text,
  clsx,
  useMantineColorScheme,
} from "@mantine/core";
import { DocumentText } from "iconsax-react";
import Image from "next/image";
import Competition1 from "@/public/competition1.png";
import { useGetCompetion } from "@/api/dashboard";
import { useRouter } from "next/router";
import { Solution, Solutions } from "@/utils/interfaces";
import DownloadIcon from "@/public/download-icon-small.svg";
import { formatDate, formatTime } from "@/utils/date-formatter";

export function SubmissionsDrawer({
  opened,
  close,
  currentSolution,
  openSubmitDrawer,
}: {
  opened: boolean;
  close: () => void;
  currentSolution: Solutions | null;
  openSubmitDrawer: () => void;
}) {
  const router = useRouter();
  const challengeId = router.query.id as string;
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const { isLoading, data } = useGetCompetion(challengeId);

  return (
    <Drawer
      opened={opened}
      onClose={() => {
        close();
      }}
      title={
        <Text weight={600} size={20} className="font-secondary">
          Submit File
        </Text>
      }
      position="right"
    >
      <Group>
        <Box h={50} w={50} pos="relative">
          <Image
            src={Competition1}
            style={{
              objectPosition: "center",
              objectFit: "cover",
              borderRadius: "6px",
            }}
            fill
            alt=""
          />
        </Box>
        <Stack spacing={0}>
          <Text className="font-secondary">{data?.data.name}</Text>
          <Text className="font-primary">
            Upload solution for each input file
          </Text>
        </Stack>
      </Group>

      <Stack my={24}>
        <Table withBorder verticalSpacing="sm">
          <thead>
            <tr>
              <th>Input file(s)</th>
              <th>Output file(s)</th>
              <th>Scored point(s)</th>
            </tr>
          </thead>
          <tbody>
            {currentSolution?.solutions.map((solution, idx) => (
              <SolutionUpload key={idx} idx={idx} solution={solution} />
            ))}
          </tbody>
        </Table>

        <Stack py="lg">
          <Group>
            <Text>Total Point:</Text> <Text>{currentSolution?.totalScore}</Text>
          </Group>
          <Group>
            <Text>Time:</Text> {formatDate(currentSolution?.createdAt)}{" "}
            {formatTime(currentSolution?.createdAt)}
          </Group>
        </Stack>
      </Stack>
      <Stack spacing="xs">
        <Button
          size="md"
          fullWidth
          loading={false}
          onClick={() => {
            router.push(`/challenges/${challengeId}/?tab=leaderboard`);
            close();
            
          }}
          className="bg-primary-01 hover:bg-primary-01"
        >
          Go to leaderboard
        </Button>
        <Button
          size="md"
          variant="outline"
          color={dark ? "gray.3" : "#312A50"}
          fullWidth
          onClick={close}
        >
          View Submissions
        </Button>
        <Button
          size="md"
          variant="white"
          color={dark ? "gray.3" : "#312A50"}
          fullWidth
          onClick={openSubmitDrawer}
        >
          New Submission
        </Button>
      </Stack>
    </Drawer>
  );
}

function SolutionUpload({
  idx,
  solution,
}: {
  idx: number;
  solution: Solution;
}) {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <tr>
      <td>
        <Group spacing="xs">
          <span className={clsx(dark ? "text-white" : "text-primary-01")}>
            <DocumentText size="18" color="currentColor" />
          </span>
          <Text
            className="font-primary"
            color={dark ? "white" : "#312A50"}
            ml={4}
          >
            {getFilenameFromUrl(solution.inputFile)}
          </Text>
        </Group>
      </td>
      <td>
        <Group spacing="xs">
          <Text className="font-primary" style={{ color: "#FBB040" }}>
            {getFilenameFromUrl(solution.outputFile)}
          </Text>
          <Anchor href={solution.outputFile} download>
            <span className={clsx(dark ? "text-[#FBB040]" : "text-primary-01")}>
              <DownloadIcon />
            </span>
          </Anchor>
        </Group>
      </td>
      <td>{solution.score}</td>
    </tr>
  );
}

function getFilenameFromUrl(url: string) {
  const inputFileLinkPath = url.split("/");
  const inputFileName = inputFileLinkPath[inputFileLinkPath.length - 1];

  return inputFileName;
}
