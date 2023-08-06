import { AppLayout } from "@/layouts/app-layout";
import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Container,
  Drawer,
  FileButton,
  Group,
  Skeleton,
  Stack,
  Table,
  Tabs,
  Text,
} from "@mantine/core";
import Image from "next/image";
import Competition1 from "@/public/competition1.png";
import { GetServerSidePropsContext } from "next";
import {
  useGetCompetion,
  useGetSolutions,
  useSubmitSolution,
} from "@/api/dashboard";
import { useState } from "react";
import { DocumentText } from "iconsax-react";
import DownloadIcon from "@/public/download-icon.svg";
import UploadIcon from "@/public/upload-icon.svg";
import { formatDate, formatTime } from "@/utils/date-formatter";
import { SubmitDrawer } from "@/components/submit-drawer";
import { SubmissionsDrawer } from "@/components/submission-drawer";
import { Solutions } from "@/utils/interfaces";
import { Leaderboard } from "@/layouts/competition/leaderboard";
export default function Dashboard({ challengeId }: { challengeId: string }) {
  const { isLoading, data } = useGetCompetion(challengeId);
  const { isLoading: solutionsLoading, data: solutions } =
    useGetSolutions(challengeId);
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const [submissionsDrawerOpen, setSubmissionsDrawerOpen] = useState(false);
  const [currentSolution, setCurrentSolution] = useState<null | Solutions>(
    null
  );

  function openSubmissionDetails(solution: Solutions) {
    setSubmissionsDrawerOpen(true);
    setCurrentSolution(solution);
  }

  return (
    <AppLayout>
      <Container size="xl" py={64}>
        {isLoading || solutionsLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <Box pos="relative" h={200}>
              <Image
                src={Competition1}
                style={{ objectFit: "cover", objectPosition: "center" }}
                fill
                alt=""
              />
            </Box>

            <Box my={8}>
              <Tabs defaultValue="description">
                <Tabs.List>
                  <Tabs.Tab value="description">Description</Tabs.Tab>
                  <Tabs.Tab value="input-files">Input files</Tabs.Tab>
                  <Tabs.Tab value="submissions">Submissions</Tabs.Tab>
                  <Tabs.Tab value="leaderboard">Leaderboard</Tabs.Tab>

                  <Button
                    ml="auto"
                    size="md"
                    onClick={() => setDrawerIsOpen(true)}
                  >
                    Submit answer
                  </Button>
                </Tabs.List>

                <Tabs.Panel value="description">
                  <Container size="lg" py={64}>
                    <Text
                      style={{}}
                      weight={600}
                      size={24}
                      className="font-secondary"
                    >
                      {data?.data.name}
                    </Text>

                    <Text component="p" className="font-primary">
                      {data?.data.problemStatement}
                    </Text>
                  </Container>
                </Tabs.Panel>

                <Tabs.Panel value="input-files">
                  <Container size="lg" py={64}>
                    <Text
                      style={{}}
                      weight={600}
                      size={24}
                      className="font-secondary"
                    >
                      Input Files
                    </Text>

                    <Text component="p" mt={20} className="font-primary">
                      Download the files below:
                    </Text>
                    <Stack>
                      {data?.data.inputFiles.map((file: string, idx) => (
                        <Group key={idx} position="apart">
                          <Text className="font-primary">
                            Input file {idx + 1}
                          </Text>

                          <Anchor href={file} download>
                            <DownloadIcon />
                          </Anchor>
                        </Group>
                      ))}
                    </Stack>
                  </Container>
                </Tabs.Panel>
                <Tabs.Panel value="submissions">
                  <Container size="lg" py={64}>
                    <Text
                      style={{}}
                      weight={600}
                      size={24}
                      className="font-secondary"
                    >
                      Solutions
                    </Text>

                    <Text component="p" mt={20} className="font-primary">
                      Here is a record of all the submissions you have made for
                      this competition.
                    </Text>

                    <Table
                      withBorder
                      horizontalSpacing="lg"
                      verticalSpacing="lg"
                      highlightOnHover
                    >
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Submission ID</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {solutions?.data.map((solution) => (
                          <tr key={solution.id}>
                            <td>{solution.id}</td>
                            <td>{solution.id}</td>
                            <td>{formatDate(solution.createdAt)}</td>
                            <td>{formatTime(solution.createdAt)}</td>
                            <td>{solution.totalScore}</td>
                            <td>
                              <Button
                                size="xs"
                                variant="white"
                                onClick={() => openSubmissionDetails(solution)}
                              >
                                View submissions
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Container>
                </Tabs.Panel>
                <Tabs.Panel value="leaderboard">
                  <Leaderboard/>
                </Tabs.Panel>
              </Tabs>
            </Box>
          </>
        )}
      </Container>
      <SubmitDrawer
        close={() => setDrawerIsOpen(false)}
        opened={drawerIsOpen}
      />
      <SubmissionsDrawer
        close={() => setSubmissionsDrawerOpen(false)}
        opened={submissionsDrawerOpen}
        currentSolution={currentSolution}
      />
    </AppLayout>
  );
}

function LoadingSkeleton() {
  return (
    <>
      <Skeleton height={200} />
      <Skeleton height={800} my={8} />
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const id = ctx.query.id;

  return {
    props: {
      challengeId: id,
    },
  };
}
