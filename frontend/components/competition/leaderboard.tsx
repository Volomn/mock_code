import { Table, Avatar } from "@mantine/core";

const elements = [
  {
    index: 6,
    users: "Saxon X",
    members: "01/01/2023",
    score: "1.000000",
    entries: "2",
  },
  {
    index: 7,
    users: "Saxon X",
    members: "01/01/2023",
    score: "1.000000",
    entries: "2",
  },
  {
    index: 39,
    users: "Saxon X",
    members: "01/01/2023",
    score: "1.000000",
    entries: "2",
  },
  {
    index: 56,
    users: "Saxon X",
    members: "01/01/2023",
    score: "1.000000",
    entries: "2",
  },
  {
    index: 58,
    users: "Saxon X",
    members: "01/01/2023",
    score: "1.000000",
    entries: "2",
  },
];

export function Leaderboard() {
  const rows = elements.map((element) => (
    <tr key={element.index} className="text-primary-01 dark:text-neutral-01">
      <td>{element.index}</td>
      <td>{element.users}</td>
      <td>
        <Avatar color="green" radius="xl">
          AA
        </Avatar>
      </td>
      <td>{element.score}</td>
      <td>{element.entries}</td>
    </tr>
  ));

  return (
    <>
      <h1 className="text-lg text-primary-01 dark:text-white font-semibold font-secondary">
        Submissions
      </h1>
      <p className="py-6">
        The rankings on the leaderboard reflect the performance of each
        participant on the entire set of test data
      </p>
      <Table border={2} verticalSpacing="lg" className="border rounded-md">
        <thead>
          <tr>
            <th className="font-semibold text-primary-01 dark:text-white">#</th>
            <th className="font-semibold text-primary-01 dark:text-white">
              Users
            </th>
            <th className="font-semibold text-primary-01 dark:text-white">
              Members
            </th>
            <th className="font-semibold text-primary-01 dark:text-white">
              Score
            </th>
            <th className="font-semibold text-primary-01 dark:text-white">
              Entries
            </th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </>
  );
}
