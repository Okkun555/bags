import type { Dayjs } from "dayjs";

export type CurrentUser = {
  userId: User["id"];
  email: User["email"];
  profile?: Profile;
};

export type User = {
  id: number;
  email: string;
};

export type Profile = {
  id: number;
  name: string;
  dateOfBirth: Dayjs;
  gender: "male" | "female" | "other";
};
