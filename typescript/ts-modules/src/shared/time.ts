import dayjs from "dayjs";

export function now(): string {
  return dayjs().format();
}