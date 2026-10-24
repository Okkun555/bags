import { Table } from "@mui/material";
import type { FC, ReactNode } from "react";

type Props = { children: ReactNode };

export const VerticalTable: FC<Props> = ({ children }) => (
  <Table
    sx={{
      "& .MuiTableCell-root": {
        borderRight: "1px solid",
        borderColor: "divider",
      },
      "& .MuiTableCell-root:last-child": {
        borderRight: 0,
      },
    }}
  >
    {children}
  </Table>
);
