import { useGetLeaderboard } from "@/api/dashboard";
import { Container, Skeleton, Table, Text } from "@mantine/core";
import { useRouter } from "next/router";

export function Leaderboard() {
  const router = useRouter();
  const { data, isLoading } = useGetLeaderboard(router.query.id as string);
  return (
    <Skeleton visible={isLoading}>
      <Container size="lg" py={64}>
        <Text style={{}} weight={600} size={24} className="font-secondary">
          Solutions
        </Text>

        <Text component="p" mt={20} className="font-primary">
          Here is a record of all the submissions you have made for this
          competition.
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
      </Container>
    </Skeleton>
  );
}
