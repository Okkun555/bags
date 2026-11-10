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
import { EntrySection } from "./EntrySection";

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
              編集
            </MenuItem>
            <MenuItem
              sx={{ color: "error.main" }}
              onClick={() => {
                setMenuAnchor(null);
                onDelete();
              }}
            >
              削除
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
            onDelete={(id) =>
              setDeleteInvestment(investments.find((i) => i.id === id) ?? null)
            }
          />
        </Stack>
      </Paper>

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
