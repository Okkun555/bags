import { WithHeaderLayout } from "@/components/layouts/WithHeaderLayout";

export const NewProfile = () => {
  console.log("test");
  return (
    <WithHeaderLayout pageTitle="プロフィール作成">
      <div>Profile</div>
    </WithHeaderLayout>
  );
};
