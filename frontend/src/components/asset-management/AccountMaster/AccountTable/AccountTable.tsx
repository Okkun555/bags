import { VerticalTable } from "@/components/shared/VerticalTable";
import { useFetchAccounts } from "@/repositories/asset-management/accountRepository";
import type { AccountType } from "@/types/assetManagement";
import {
  Button,
  Chip,
  CircularProgress,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export const AccountTable = () => {
  const { accounts, isLoading } = useFetchAccounts();

  if (isLoading) {
    return <CircularProgress size={32} />;
  }

  return (
    <>
      <TableContainer>
        <VerticalTable>
          <TableHead
            sx={{
              backgroundColor: "#F5F5F5",
              "& .MuiTableCell-root": {
                fontWeight: 600,
                color: "text.secondary",
              },
            }}
          >
            <TableRow>
              <TableCell width={300}>口座名</TableCell>
              <TableCell width={120}>口座コード</TableCell>
              <TableCell width={120}>口座種別</TableCell>
              <TableCell>備考</TableCell>
              <TableCell align="center" width={100}>
                操作
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {accounts?.map((account) => (
              <TableRow key={account.id} hover>
                <TableCell>{account.name}</TableCell>
                <TableCell>{account.code}</TableCell>
                <TableCell>
                  <AccountTypeLabel type={account?.accountType} />
                </TableCell>
                <TableCell>{account.memo}</TableCell>
                <TableCell align="center">
                  <Button size="small" variant="contained" color="inherit">
                    操作
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </VerticalTable>
      </TableContainer>
    </>
  );
};

const AccountTypeLabel = ({ type }: { type: AccountType }) => {
  switch (type) {
    case "cash":
      return <Chip label="現金" />;
    case "bank":
      return <Chip label="銀行口座" />;
    case "securities":
      return <Chip label="証券口座" />;
    case "pension":
      return <Chip label="年金" />;
    case "insurance":
      return <Chip label="保険" />;
    case "other":
      return <Chip label="その他" />;
    default:
      throw new Error("不正な値です");
  }
};
