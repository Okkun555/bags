import type { User } from "./user";

// 認証
export type AccountCreateResponse = {
  token: string;
  user: User;
};
