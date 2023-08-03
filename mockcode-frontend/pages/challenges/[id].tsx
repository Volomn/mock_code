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
  Tabs,
  Text,
} from "@mantine/core";
import Image from "next/image";

import Competition1 from "@/public/competition1.png";
import { GetServerSidePropsContext } from "next";
import { useGetCompetion, useSubmitSolution } from "@/api/dashboard";
import { useState } from "react";
import DownloadIcon from "@/public/download-icon.svg";
import UploadIcon from "@/public/upload-icon.svg";
import { APP_TOKENS } from "@/utils/constants";
import Cookies from "js-cookie";
export default function Dashboard({ challengeId }: { challengeId: string }) {
  const { isLoading, data } = useGetCompetion(challengeId);
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const { mutate: submitSolution, isLoading: submitSolutionLoading } =
    useSubmitSolution();
  const [files, setFiles] = useState<File[]>([]);
  function openSubmissionDrawer() {
    setDrawerIsOpen(true);
  }

  function addFile(index: number, file: File) {
    const currentFiles = [...files];
    currentFiles[index] = file;
    setFiles(currentFiles);
  }

  function handleFileSubmit() {
    const formData = new FormData();
    files.forEach((file) => formData.append("input", file));
    console.log({ token: Cookies.get(APP_TOKENS.TOKEN) });
    // console.log(Cookies.get(APP_TOKENS.TOKEN_TYPE))

    submitSolution(formData);
  }
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
              />
            </Box>

            <Box my={8}>
              <Tabs defaultValue="description">
                <Tabs.List>
                  <Tabs.Tab value="description">Description</Tabs.Tab>
                  <Tabs.Tab value="input-files">Input files</Tabs.Tab>
                  <Tabs.Tab value="submissions">Submissions</Tabs.Tab>
                  <Tabs.Tab value="leaderboard">Leaderboard</Tabs.Tab>

                  <Button ml="auto" size="md" onClick={openSubmissionDrawer}>
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
              </Tabs>
            </Box>
          </>
        )}
      </Container>

      <Drawer
        opened={drawerIsOpen}
        onClose={() => {
          setDrawerIsOpen(false);
          setFiles([]);
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
              style={{ objectPosition: "center", objectFit: "cover" }}
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
          {data?.data.inputFiles.map((file: string, idx) => (
            <SolutionUpload key={idx} idx={idx} addFile={addFile} />
          ))}
        </Stack>

        <Button
          size="lg"
          disabled={!data?.data || files.length < data?.data.inputFiles.length}
          fullWidth
          loading={submitSolutionLoading}
          onClick={handleFileSubmit}
        >
          Submit
        </Button>
      </Drawer>
    </AppLayout>
  );
}

function SolutionUpload({
  idx,
  addFile,
}: {
  idx: number;
  addFile: (arg0: number, arg1: File) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const initialFilename = `Input file ${idx + 1}`;

  function handleFileSelect(file: File) {
    addFile(idx, file);
    setFile(file);
  }
  return (
    <Group position="apart">
      <Text className="font-primary">{file?.name ?? initialFilename}</Text>

      <FileButton onChange={handleFileSelect} accept="image/png,image/jpeg">
        {(props) => (
          <ActionIcon {...props}>
            <UploadIcon />
          </ActionIcon>
        )}
      </FileButton>
    </Group>
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
