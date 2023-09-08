import { useGetLeaderboard } from "@/api/dashboard";
import {
  Container,
  Flex,
  Skeleton,
  Table,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { useRouter } from "next/router";

export function Leaderboard() {
  const router = useRouter();
  const { data, isLoading } = useGetLeaderboard(router.query.id as string);

  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <Skeleton visible={isLoading}>
      <Container size="lg" py={64}>
        <Text style={{}} weight={600} size={24} className="font-secondary">
          Leaderboard
        </Text>
        {!data?.data || data?.data.length < 1 ? (
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
            <Text size={20}>Leaderboard is empty</Text>
          </Flex>
        ) : (
          <>
            <Text component="p" mt={20} className="font-primary">
              Here is a list of other competitors who have solved this problem,
              and their respective scores
            </Text>

            <Table withBorder verticalSpacing="lg" highlightOnHover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Score</th>
                  <th>Entries</th>
                </tr>
              </thead>
              <tbody>
                {data?.data.map((entry, idx) => (
                  <tr key={entry.id}>
                    <td>{idx + 1}</td>
                    <td>{`${entry.firstName} ${entry.lastName}`}</td>
                    <td>{entry.submissionScore}</td>
                    <td>-</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </Container>
    </Skeleton>
  );
}
