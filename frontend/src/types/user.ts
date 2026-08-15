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
  dateOfBirth: string;
  gender: "male" | "female" | "other";
};
