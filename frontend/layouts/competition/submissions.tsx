import { useGetSolutions } from "@/api/dashboard";
import { SubmissionsDrawer } from "@/components/submission-drawer";
import { LoadingSkeleton } from "@/pages/challenges/[id]";
import { formatDate, formatTime } from "@/utils/date-formatter";
import { Solutions } from "@/utils/interfaces";
import {
  Button,
  Container,
  Flex,
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
  const [currentSolution, setCurrentSolution] = useState<null | Solutions>(
    null
  );
  const { isLoading: solutionsLoading, data: solutions } = useGetSolutions(
    router.query.id as string
  );
  function openSubmissionDetails(solution: Solutions) {
    setSubmissionsDrawerOpen(true);
    setCurrentSolution(solution);
  }

  if (solutionsLoading) return <LoadingSkeleton />;

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
