export type CurrentUser = {
  userId: User["id"];
  email: User["email"];
};

export type User = {
  id: number;
  email: string;
};
