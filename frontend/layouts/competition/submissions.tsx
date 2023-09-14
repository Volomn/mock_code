import {
  useGetGithubLoginUrl,
  useGetGoogleLoginUrl,
  useGetSolutions,
} from "@/api/dashboard";
import { SubmissionsDrawer } from "@/components/submission-drawer";
import { useAuthStatus } from "@/hooks/auth";
import { LoadingSkeleton } from "@/pages/challenges/[id]";
import { formatDate, formatTime } from "@/utils/date-formatter";
import { Solutions } from "@/utils/interfaces";
import GoogleIcon from "@/public/google-icon.svg";
import GithubIcon from "@/public/github.svg";
import {
  Anchor,
  Button,
  Center,
  Container,
  Flex,
  Group,
  Stack,
  Table,
  Text,
  clsx,
  useMantineColorScheme,
} from "@mantine/core";
import { useRouter } from "next/router";
import { useState } from "react";

export function Submissions({
  openNewSubmissionModal,
}: {
  openNewSubmissionModal(): void;
}) {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const router = useRouter();
  const [submissionsDrawerOpen, setSubmissionsDrawerOpen] = useState(false);
  const { data: googleLogin } = useGetGoogleLoginUrl();
  const { data: githubLogin } = useGetGithubLoginUrl();
  const [currentSolution, setCurrentSolution] = useState<null | Solutions>(
    null
  );
  const { isLoading: solutionsLoading, data: solutions } = useGetSolutions(
    router.query.id as string
  );
  const [isAuthenticated] = useAuthStatus();
  function openSubmissionDetails(solution: Solutions) {
    setSubmissionsDrawerOpen(true);
    setCurrentSolution(solution);
  }

  if (solutionsLoading) return <LoadingSkeleton />;

  if (!isAuthenticated) {
    return (
      <Container size="lg" py={64} mb="auto">
        <Center>
          <Stack h={200}>
            <Text style={{}} weight={600} size={24} className="font-secondary">
              You need to be authenticated to view your solutions
            </Text>

            <Group position="center">
              <Anchor href={googleLogin?.data.to}>
                <Button
                  size="lg"
                  variant="outline"
                  leftIcon={<GoogleIcon />}
                  className={clsx(
                    dark
                      ? "text-white border-white"
                      : "text-[##1B2063] border-[#1B2063]",
                    "font-secondary hover:bg-transparent"
                  )}
                  style={{ fontWeight: 400 }}
                >
                  Continue with Google
                </Button>
              </Anchor>
              <Anchor href={githubLogin?.data.to}>
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
          </Stack>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="lg" py={64}>
      <Text style={{}} weight={600} size={24} className="font-secondary">
        Solutions
      </Text>

      {!solutions?.data || solutions?.data.length < 1 ? (
        <Flex
          h={200}
          w="100%"
          justify="center"
          align="center"
          style={{ borderRadius: 8 }}
          bg={dark ? "dark.6" : "gray.1"}
          className="col-span-1 sm:col-span-2 md:col-span-3"
          styles={{
            border: dark ? "dark.9" : "gray.3",
          }}
        >
          <Text size={20}>You have not submitted any solutions</Text>
        </Flex>
      ) : (
        <>
          <Text component="p" mt={20} className="font-primary">
            Here is a record of all the submissions you have made for this
            competition.
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
                <th>Date</th>
                <th>Time</th>
                <th>Score</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {solutions?.data.map((solution) => (
                <tr key={solution.id}>
                  <td>{solution.id}</td>
                  <td>{formatDate(solution.createdAt)}</td>
                  <td>{formatTime(solution.createdAt)}</td>
                  <td>{solution.totalScore}</td>
                  <td>
                    <Button
                      size="xs"
                      variant="white"
                      onClick={() => openSubmissionDetails(solution)}
                      className={clsx(dark ? "text-white" : "text-primary-01")}
                    >
                      View submissions
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      <SubmissionsDrawer
        close={() => setSubmissionsDrawerOpen(false)}
        opened={submissionsDrawerOpen}
        currentSolution={currentSolution}
        openSubmitDrawer={() => {
          setSubmissionsDrawerOpen(false);
          openNewSubmissionModal();
        }}
      />
    </Container>
  );
}
