import { Button, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { AddAccountDialog } from "./AddAccountDialog";
import { AccountTable } from "./AccountTable";

export const AccountMaster = () => {
  const [isOpenAddAccountDialog, setIsOpenAddAccountDialog] =
    useState<boolean>(false);

  return (
    <Stack spacing={2}>
      <Stack
        direction="row"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body1">
          資産管理用の口座を種別毎に登録し、金融機関マスターを管理します。
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="outlined"
          onClick={() => setIsOpenAddAccountDialog(true)}
        >
          追加
        </Button>
      </Stack>

      <AccountTable />

      <AddAccountDialog
        isOpen={isOpenAddAccountDialog}
        handleClose={() => setIsOpenAddAccountDialog(false)}
      />
    </Stack>
  );
};
