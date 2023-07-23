import { Table } from "@mantine/core";

const elements = [
  {
    index: 6,
    submission_id: 12.011,
    date: "01/01/2023",
    time: "2:00pm",
    score: 100,
  },
  {
    index: 7,
    submission_id: 14.007,
    date: "01/01/2023",
    time: "2:00pm",
    score: 100,
  },
  {
    index: 39,
    submission_id: 88.906,
    date: "01/01/2023",
    time: "2:00pm",
    score: 100,
  },
  {
    index: 56,
    submission_id: 137.33,
    date: "01/01/2023",
    time: "2:00pm",
    score: 100,
  },
  {
    index: 58,
    submission_id: 140.12,
    date: "01/01/2023",
    time: "2:00pm",
    score: 100,
  },
];

export function Submissions() {
  const rows = elements.map((element) => (
    <tr key={element.index} className="text-primary-01 dark:text-white">
      <td>{element.index}</td>
      <td>{element.submission_id}</td>
      <td>{element.date}</td>
      <td>{element.time}</td>
      <td>{element.score}</td>
    </tr>
  ));

  return (
    <>
      <h1 className="text-lg text-primary-01 dark:text-white font-semibold font-secondary">
        Submissions
      </h1>
      <p className="py-6">
        Here is a record of all the submissions you have made for this
        competition.
      </p>
      <Table border={2} verticalSpacing="lg" className="border rounded-md">
        <thead>
          <tr>
            <th className="font-semibold text-primary-01 dark:text-white">#</th>
            <th className="font-semibold text-primary-01 dark:text-white">
              Submission ID
            </th>
            <th className="font-semibold text-primary-01 dark:text-white">
              Date
            </th>
            <th className="font-semibold text-primary-01 dark:text-white">
              Time
            </th>
            <th className="font-semibold text-primary-01 dark:text-white">
              Score
            </th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </>
  );
}
