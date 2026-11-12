import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { FC } from "react";

/** 表示用に整形した収入・投資の1行 */
export type EntryRow = {
  id: number;
  typeLabel: string;
  /** 年額 */
  amount: number;
  startFrom: number;
  endTo: number | null;
  memo: string | null;
};

type Props = {
  title: string;
  /** 見出しの色(MUI のパレットキー) */
  color: string;
  /** 追加ボタンの文言(例: 収入を追加) */
  addLabel: string;
  rows: Array<EntryRow>;
  onAdd: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

/** 期間の表示(終了年が NULL のときは「2026年〜」) */
const formatPeriod = (startFrom: number, endTo: number | null) =>
  endTo === null ? `${startFrom}年〜` : `${startFrom}年〜${endTo}年`;

const yen = (value: number) => `${value.toLocaleString("ja-JP")}円`;

/** メンバーカード内の収入・投資セクション(見出しに年額合計、表で一覧) */
export const EntrySection: FC<Props> = ({
  title,
  color,
  addLabel,
  rows,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const total = rows.reduce((sum, row) => sum + row.amount, 0);

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
        <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: color }} />
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ flexGrow: 1, fontSize: "1.2rem" }}>
          年 {yen(total)}
        </Typography>
        <Button
          variant="outlined"
          size="large"
          onClick={onAdd}
          sx={{ borderStyle: "dashed", borderRadius: 2, fontSize: "1.1rem" }}
        >
          ＋ {addLabel}
        </Button>
      </Stack>
      {rows.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
          登録されていません
        </Typography>
      ) : (
        <Table sx={{ "& .MuiTableCell-root": { fontSize: "1.15rem" } }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "text.secondary" }}>種別</TableCell>
              <TableCell align="right" sx={{ color: "text.secondary" }}>
                金額（年額）
              </TableCell>
              <TableCell sx={{ color: "text.secondary" }}>期間</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} sx={{ "&:last-child td": { border: 0 } }}>
                <TableCell>
                  <Box>{row.typeLabel}</Box>
                  {row.memo && (
                    <Typography color="text.secondary" sx={{ fontSize: "1rem" }}>
                      {row.memo}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <Box>{yen(row.amount)}</Box>
                  <Typography color="text.secondary" sx={{ fontSize: "1rem" }}>
                    月 {yen(Math.round(row.amount / 12))}
                  </Typography>
                </TableCell>
                <TableCell>{formatPeriod(row.startFrom, row.endTo)}</TableCell>
                <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                  <Button size="large" onClick={() => onEdit(row.id)}>
                    編集
                  </Button>
                  <Button size="large" color="error" onClick={() => onDelete(row.id)}>
                    削除
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Stack>
  );
};
