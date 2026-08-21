import type { Profile, User } from "./user";

// 認証
export type AccountCreateResponse = {
  token: string;
  user: User;
};

export type MeResponse = User;

// プロフィール
export type ProfileCreateResponse = Profile;
