import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import type { FC } from "react";
import { relationshipLabels, type FamilyMember } from "@/types/familyMember";
import { incomeTypeLabels, type Income } from "@/types/income";
import { investmentTypeLabels, type Investment } from "@/types/investment";
import { DeleteIncomeDialog, DeleteInvestmentDialog } from "./DeleteEntryDialog";
import { EntryFormDialog, type EntryKind } from "./EntryFormDialog";
import { EntrySection } from "./EntrySection";

const sumAmount = (items: Array<{ amount: number }>) =>
  items.reduce((sum, item) => sum + item.amount, 0);

type HeaderTotalProps = {
  label: string;
  color: string;
  value: number;
};

/** 見出し右側に表示する年額合計 */
const HeaderTotal: FC<HeaderTotalProps> = ({ label, color, value }) => (
  <Box sx={{ textAlign: "right" }}>
    <Stack
      direction="row"
      spacing={0.5}
      sx={{ alignItems: "center", justifyContent: "flex-end" }}
    >
      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: color }} />
      <Typography variant="body2" color="text.secondary">
        {label}（年）
      </Typography>
    </Stack>
    <Typography sx={{ fontWeight: 700, fontSize: "1.2rem" }}>
      {value.toLocaleString("ja-JP")}円
    </Typography>
  </Box>
);

type Props = {
  lifePlanId: number;
  familyMember: FamilyMember;
  incomes: Array<Income>;
  investments: Array<Investment>;
  onEdit: () => void;
  onDelete: () => void;
};

/** 家族メンバー1人分のカード(その人の収入・投資をまとめて表示) */
export const MemberCard: FC<Props> = ({
  lifePlanId,
  familyMember,
  incomes,
  investments,
  onEdit,
  onDelete,
}) => {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  /** 登録・編集ダイアログの対象(entry 未指定なら新規登録) */
  const [entryForm, setEntryForm] = useState<{
    kind: EntryKind;
    entry?: Income | Investment;
  } | null>(null);
  const [deleteIncome, setDeleteIncome] = useState<Income | null>(null);
  const [deleteInvestment, setDeleteInvestment] = useState<Investment | null>(
    null,
  );

  return (
    <>
      <Paper variant="outlined" sx={{ borderRadius: 3, width: "100%" }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: "center", p: 2.5 }}
        >
          <Avatar sx={{ bgcolor: "primary.light", color: "primary.dark", width: 48, height: 48 }}>
            {familyMember.name.charAt(0)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {familyMember.name}
              </Typography>
              <Chip
                label={relationshipLabels[familyMember.relationship]}
                sx={{ fontSize: "1rem" }}
              />
            </Stack>
            <Typography color="text.secondary" sx={{ fontSize: "1.1rem" }}>
              {dayjs().diff(dayjs(familyMember.birthday), "year")}歳（
              {dayjs(familyMember.birthday).format("YYYY/MM/DD")}生）
            </Typography>
          </Box>
          {/* MEMO: スマホ幅では非表示 */}
          <Stack
            direction="row"
            spacing={3}
            sx={{ display: { xs: "none", sm: "flex" }, mr: 1 }}
          >
            <HeaderTotal
              label="収入"
              color="success.main"
              value={sumAmount(incomes)}
            />
            <HeaderTotal
              label="投資"
              color="primary.main"
              value={sumAmount(investments)}
            />
          </Stack>
          <IconButton
            aria-label="メンバーの操作"
            onClick={(e) => setMenuAnchor(e.currentTarget)}
            sx={{ border: 1, borderColor: "divider", borderRadius: 2 }}
          >
            <MoreHorizIcon />
          </IconButton>
          <Menu
            anchorEl={menuAnchor}
            open={!!menuAnchor}
            onClose={() => setMenuAnchor(null)}
          >
            <MenuItem
              onClick={() => {
                setMenuAnchor(null);
                onEdit();
              }}
            >
              メンバーを編集
            </MenuItem>
            <MenuItem
              sx={{ color: "error.main" }}
              onClick={() => {
                setMenuAnchor(null);
                onDelete();
              }}
            >
              メンバーを削除
            </MenuItem>
          </Menu>
        </Stack>
        <Divider />
        <Stack spacing={3} sx={{ p: 2.5 }}>
          <EntrySection
            title="収入"
            color="success.main"
            addLabel="収入を追加"
            rows={incomes.map((income) => ({
              ...income,
              typeLabel: incomeTypeLabels[income.incomeType],
            }))}
            onAdd={() => setEntryForm({ kind: "income" })}
            onEdit={(id) =>
              setEntryForm({
                kind: "income",
                entry: incomes.find((i) => i.id === id),
              })
            }
            onDelete={(id) =>
              setDeleteIncome(incomes.find((i) => i.id === id) ?? null)
            }
          />
          <EntrySection
            title="投資"
            color="primary.main"
            addLabel="投資を追加"
            rows={investments.map((investment) => ({
              ...investment,
              typeLabel: investmentTypeLabels[investment.investmentType],
            }))}
            onAdd={() => setEntryForm({ kind: "investment" })}
            onEdit={(id) =>
              setEntryForm({
                kind: "investment",
                entry: investments.find((i) => i.id === id),
              })
            }
            onDelete={(id) =>
              setDeleteInvestment(investments.find((i) => i.id === id) ?? null)
            }
          />
        </Stack>
      </Paper>

      {entryForm && (
        <EntryFormDialog
          kind={entryForm.kind}
          lifePlanId={lifePlanId}
          familyMember={familyMember}
          entry={entryForm.entry}
          handleClose={() => setEntryForm(null)}
        />
      )}

      {deleteIncome && (
        <DeleteIncomeDialog
          lifePlanId={lifePlanId}
          income={deleteIncome}
          handleClose={() => setDeleteIncome(null)}
        />
      )}

      {deleteInvestment && (
        <DeleteInvestmentDialog
          lifePlanId={lifePlanId}
          investment={deleteInvestment}
          handleClose={() => setDeleteInvestment(null)}
        />
      )}
    </>
  );
};
