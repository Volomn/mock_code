import dayjs from "dayjs";

export function formatDate(date: string | undefined) {
  if (!date) return "Unknown";
  return dayjs(date).format("MMMM D, YYYY");
}

export function formatTime(time: string | undefined) {
  if (!time) return "Unknown";
  return dayjs(time).format("h:mm A");
}
