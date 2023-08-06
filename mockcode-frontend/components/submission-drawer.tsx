import {
  ActionIcon,
  Box,
  Button,
  Drawer,
  FileButton,
  Group,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { DocumentText } from "iconsax-react";
import Image from "next/image";
import Competition1 from "@/public/competition1.png";
import { useGetCompetion } from "@/api/dashboard";
import { useRouter } from "next/router";
import { Solution, Solutions } from "@/utils/interfaces";

export function SubmissionsDrawer({
  opened,
  close,
  currentSolution,
}: {
  opened: boolean;
  close: () => void;
  currentSolution: Solutions | null;
}) {
  const router = useRouter();
  const challengeId = router.query.id as string;
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
      </Stack>
      <Stack>
        <Button size="md" fullWidth loading={false} onClick={() => {}}>
          Go to leaderboard
        </Button>
        <Button
          size="md"
          variant="outline"
          fullWidth
          loading={false}
          onClick={() => {}}
        >
          View Submissions
        </Button>
        <Button
          size="md"
          variant="white"
          fullWidth
          loading={false}
          onClick={() => {}}
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
  // const [file, setFile] = useState<File | null>(null);
  const inputFileLinkPath = solution.inputFile.split("/");
  const inputFileName = inputFileLinkPath[inputFileLinkPath.length - 1];

  return (
    <tr>
      <td style={{ display: "flex", alignItems: "center" }}>
        <DocumentText size="18" color="#1B2063" />
        <Text className="font-primary" color="#312A50" ml={4}>
          {solution.inputFile}
        </Text>
      </td>
      <td>
        <Text className="font-primary" style={{ color: "#FBB040" }}>
          {solution.outputFile}
        </Text>
      </td>
      <td>{solution.score}</td>
    </tr>
  );
}
