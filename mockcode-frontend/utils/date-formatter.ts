import dayjs from "dayjs";

export function formatDate(date: string) {
  return dayjs(date).format("MMMM D, YYYY");
}

export function formatTime(time: string) {
  return dayjs(time).format("h:mm A");
}
