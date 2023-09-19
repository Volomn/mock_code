import {
  ActionIcon,
  Box,
  Button,
  Drawer,
  FileButton,
  Group,
  Skeleton,
  Stack,
  Text,
  clsx,
  useMantineColorScheme,
} from "@mantine/core";
import { DocumentText } from "iconsax-react";
import Image from "next/image";
import { useState } from "react";

import UploadIcon from "@/public/upload-icon.svg";
import Competition1 from "@/public/competition1.png";
import { useGetCompetion, useSubmitSolution } from "@/api/dashboard";
import { useRouter } from "next/router";
import { SubmissionsDrawer } from "./submission-drawer";

export function SubmitDrawer({
  opened,
  close,
  open,
}: {
  opened: boolean;
  close: () => void;
  open: () => void;
}) {
  const router = useRouter();
  const challengeId = router.query.id as string;
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmissionsDrawerOpen, setIsSubmissionsDrawerOpen] = useState(false);
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const { isLoading, data } = useGetCompetion(challengeId);
  const {
    mutate: submitSolution,
    isLoading: submitSolutionLoading,
    isSuccess: submitSucess,
    data: submissionData,
  } = useSubmitSolution(() => {
    // close();
    setIsSubmissionsDrawerOpen(true);
  });

  function addFile(index: number, file: File) {
    const currentFiles = [...files];
    currentFiles[index] = file;
    setFiles(currentFiles);
  }

  function handleFileSubmit() {
    const inputFileNames = data?.data.inputFiles.map((inputFile) => {
      const fileLinkPath = inputFile.split("/");
      const fileName = fileLinkPath[fileLinkPath.length - 1];
      return fileName;
    });
    const formData = new FormData();
    files.forEach((file) => formData.append("output", file));
    inputFileNames?.forEach((file) => formData.append("input", file));
    formData.append("challengeId", challengeId);

    submitSolution(formData);
  }

  // if (submitSolutionLoading) {
  //   return <Skeleton height="70vh" />;
  // }

  if (submissionData && isSubmissionsDrawerOpen) {
    return (
      <SubmissionsDrawer
        currentSolution={submissionData.data}
        openSubmitDrawer={() => {
          setFiles([]);
          setIsSubmissionsDrawerOpen(false);
          open();
        }}
        opened={isSubmissionsDrawerOpen}
        close={() => {
          close();
          setIsSubmissionsDrawerOpen(false);
        }}
      />
    );
  }

  return (
    <Drawer
      opened={opened}
      onClose={() => {
        close();
        setFiles([]);
      }}
      title={
        <Text weight={600} size={20} className="font-secondary">
          Submit File
        </Text>
      }
      position="right"
    >
      {submitSolutionLoading ? (
        <Skeleton height="70vh" />
      ) : (
        <>
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
            {data?.data.inputFiles.map((file: string, idx) => (
              <SolutionUpload
                key={idx}
                idx={idx}
                fileLink={file}
                addFile={addFile}
                file={files[idx] || null}
              />
            ))}
          </Stack>

          <Button
            size="lg"
            disabled={!data?.data || files.length < 1}
            fullWidth
            loading={submitSolutionLoading}
            onClick={handleFileSubmit}
            className="bg-primary-01 hover-bg-primary-01"
          >
            Submit
          </Button>
        </>
      )}
    </Drawer>
  );
}

function SolutionUpload({
  idx,
  addFile,
  fileLink,
  file,
}: {
  idx: number;
  addFile: (arg0: number, arg1: File) => void;
  fileLink: string;
  file: File | null;
}) {
  const fileLinkPath = fileLink.split("/");
  const fileName = fileLinkPath[fileLinkPath.length - 1];
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  function handleFileSelect(file: File) {
    if (file) {
      addFile(idx, file);
    }
  }
  return (
    <Group position="apart">
      <Group spacing="xs">
        <DocumentText size="24" color={dark ? "white" : "#1B2063"} />
        <Text className="font-primary" color={dark ? "gray.3" : "#1B2063"}>
          {fileName}
        </Text>
      </Group>
      <Group>
        <Text className="font-primary" style={{ color: "#FBB040" }}>
          {file ? `${file.name} ${(file.size / 1024).toFixed(2)}kb` : ""}
        </Text>
        <FileButton onChange={handleFileSelect} accept="">
          {(props) => (
            <ActionIcon
              {...props}
              className={clsx(dark ? "text-white" : "#1B2063")}
            >
              <UploadIcon />
            </ActionIcon>
          )}
        </FileButton>
      </Group>
    </Group>
  );
}
