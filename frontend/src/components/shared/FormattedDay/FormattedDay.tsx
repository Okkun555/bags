import dayjs from "dayjs";
import type { FC } from "react";

type FormattedDayProps = {
  value: string;
  withTime?: boolean;
};

export const FormattedDay: FC<FormattedDayProps> = ({
  value,
  withTime = true,
}) =>
  withTime
    ? dayjs(value).format("YYYY/MM/DD HH:mm")
    : dayjs(value).format("YYYY/MM/DD");
