import { AppLayout } from "@/layouts/app-layout";
import {
  Anchor,
  Box,
  Button,
  Container,
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
import { useGetCompetion } from "@/api/dashboard";
import { useState } from "react";
import { useRouter } from "next/router";
import DownloadIcon from "@/public/download-icon.svg";
import { SubmitDrawer } from "@/components/submit-drawer";
import { Leaderboard } from "@/layouts/competition/leaderboard";
import { useAuthStatus } from "@/hooks/auth";
import { Submissions } from "@/layouts/competition/submissions";

export default function Dashboard({ challengeId }: { challengeId: string }) {
  const router = useRouter();
  const { isLoading, data } = useGetCompetion(challengeId);
  const stuff = useAuthStatus();
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  return (
    <AppLayout>
      <Container size="xl" py={64}>
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <Box pos="relative" h={200}>
              <Image
                src={Competition1}
                style={{ objectFit: "cover", objectPosition: "center" }}
                fill
                alt=""
                priority
              />
              <Box className="absolute lef-0 top-0 w-full h-full bg-black bg-opacity-40 p-10 text-white font-semibold">
                {data?.data.shortDescription}
              </Box>
            </Box>

            <Box my={8}>
              <Tabs
                value={router.query.tab as string}
                onTabChange={(value) =>
                  router.push(`/challenges/${challengeId}/?tab=${value}`)
                }
                defaultValue="description"
              >
                <Tabs.List>
                  <Tabs.Tab value="description">Description</Tabs.Tab>
                  <Tabs.Tab value="input-files">Input files</Tabs.Tab>
                  <Tabs.Tab value="submissions">Submissions</Tabs.Tab>
                  <Tabs.Tab value="leaderboard">Leaderboard</Tabs.Tab>

                  <Button
                    ml="auto"
                    size="md"
                    onClick={() => setDrawerIsOpen(true)}
                    className="bg-[#312A50]"
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
                      {data?.data.name} Problem Statement
                    </Text>

                    {data?.data.problemStatementUrl && (
                      <Box>
                        <iframe
                          className="w-full h-[1000px]"
                          allow="fullscreen"
                          datatype="pdf"
                          src={data?.data.problemStatementUrl}
                        ></iframe>
                      </Box>
                    )}
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
                  <Submissions
                    openNewSubmissionModal={() => setDrawerIsOpen(true)}
                  />
                </Tabs.Panel>
                <Tabs.Panel value="leaderboard">
                  <Leaderboard />
                </Tabs.Panel>
              </Tabs>
            </Box>
          </>
        )}
      </Container>
      <SubmitDrawer
        open={() => setDrawerIsOpen(true)}
        close={() => setDrawerIsOpen(false)}
        opened={drawerIsOpen}
      />
    </AppLayout>
  );
}

export function LoadingSkeleton() {
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
