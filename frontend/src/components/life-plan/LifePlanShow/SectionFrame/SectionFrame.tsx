import { Paper, Stack, Typography } from "@mui/material";
import type { FC, ReactNode } from "react";

type Props = {
  title: string;
  children?: ReactNode;
};

/** 予算計画シート内のセクション枠 */
export const SectionFrame: FC<Props> = ({ title, children }) => {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={1}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        {children ?? (
          <Typography variant="body2" color="text.secondary">
            まだ登録されていません。
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};
