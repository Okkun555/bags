import { Alert, Button, CircularProgress, Stack } from "@mui/material";
import { useState } from "react";
import type { FC } from "react";
import { useFetchFamilyMembers } from "@/repositories/life-plan/familyMembersRepository";
import { useFetchIncomes } from "@/repositories/life-plan/incomesRepository";
import { useFetchInvestments } from "@/repositories/life-plan/investmentsRepository";
import type { FamilyMember } from "@/types/familyMember";
import { DeleteFamilyMemberDialog } from "./DeleteFamilyMemberDialog";
import { FamilyMemberFormDialog } from "./FamilyMemberFormDialog";
import { MemberCard } from "./MemberCard";
import { SummaryCards } from "../SummaryCards";

const sumAmount = (items: Array<{ amount: number }> | undefined) =>
  (items ?? []).reduce((sum, item) => sum + item.amount, 0);

type Props = {
  lifePlanId: number;
};

/** 家族メンバーごとのカード一覧(初期設定の案内・メンバー登録を含む) */
export const MemberCardList: FC<Props> = ({ lifePlanId }) => {
  const { familyMembers, isLoading } = useFetchFamilyMembers(lifePlanId);
  // MEMO: 収入・投資はライフプラン単位で一括取得し、メンバーごとに振り分ける(N+1回避)
  const { incomes } = useFetchIncomes(lifePlanId);
  const { investments } = useFetchInvestments(lifePlanId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<FamilyMember | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FamilyMember | null>(null);

  const addButton = (
    <Button
      variant="outlined"
      fullWidth
      onClick={() => setIsDialogOpen(true)}
      sx={{
        py: 2,
        borderStyle: "dashed",
        borderWidth: 2,
        borderRadius: 4,
        bgcolor: "background.paper",
        fontSize: "1.1rem",
        "&:hover": { borderStyle: "dashed", borderWidth: 2 },
      }}
    >
      ＋ 家族メンバーを追加
    </Button>
  );

  return (
    <>
      {isLoading || !familyMembers ? (
        <CircularProgress size={24} />
      ) : familyMembers.length === 0 ? (
        <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
          <Alert severity="info" sx={{ width: "100%" }}>
            初期設定として、このライフプランに登場する家族メンバーを登録してください。
            収入・投資はメンバーごとに記録します。
          </Alert>
          {addButton}
        </Stack>
      ) : (
        <Stack spacing={3} sx={{ alignItems: "flex-start", pb: 6 }}>
          <SummaryCards
            incomeTotal={sumAmount(incomes)}
            investmentTotal={sumAmount(investments)}
          />
          {familyMembers.map((member) => (
            <MemberCard
              key={member.id}
              lifePlanId={lifePlanId}
              familyMember={member}
              incomes={(incomes ?? []).filter(
                (income) => income.familyMemberId === member.id,
              )}
              investments={(investments ?? []).filter(
                (investment) => investment.familyMemberId === member.id,
              )}
              onEdit={() => setEditTarget(member)}
              onDelete={() => setDeleteTarget(member)}
            />
          ))}
          {addButton}
        </Stack>
      )}

      {isDialogOpen && (
        <FamilyMemberFormDialog
          lifePlanId={lifePlanId}
          handleClose={() => setIsDialogOpen(false)}
        />
      )}

      {editTarget && (
        <FamilyMemberFormDialog
          lifePlanId={lifePlanId}
          familyMember={editTarget}
          handleClose={() => setEditTarget(null)}
        />
      )}

      {deleteTarget && (
        <DeleteFamilyMemberDialog
          lifePlanId={lifePlanId}
          familyMember={deleteTarget}
          handleClose={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
};
