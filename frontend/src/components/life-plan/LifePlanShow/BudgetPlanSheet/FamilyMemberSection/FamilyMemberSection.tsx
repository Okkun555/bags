import {
  Alert,
  Button,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import type { FC } from "react";
import { useFetchFamilyMembers } from "@/repositories/life-plan/familyMembersRepository";
import { relationshipLabels, type FamilyMember } from "@/types/familyMember";
import { SectionFrame } from "../../SectionFrame";
import { DeleteFamilyMemberDialog } from "./DeleteFamilyMemberDialog";
import { FamilyMemberFormDialog } from "./FamilyMemberFormDialog";

type Props = {
  lifePlanId: number;
};

/** 家族メンバーセクション(初期設定の案内・一覧・登録) */
export const FamilyMemberSection: FC<Props> = ({ lifePlanId }) => {
  const { familyMembers, isLoading } = useFetchFamilyMembers(lifePlanId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<FamilyMember | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FamilyMember | null>(null);

  const addButton = (
    <Button variant="contained" onClick={() => setIsDialogOpen(true)}>
      メンバーを追加
    </Button>
  );

  return (
    <>
      <SectionFrame title="家族メンバー">
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
          <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>名前</TableCell>
                  <TableCell>続柄</TableCell>
                  <TableCell>現在の年齢</TableCell>
                  <TableCell align="center" width={160}>
                    操作
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {familyMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{relationshipLabels[member.relationship]}</TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {dayjs().diff(dayjs(member.birthday), "year")}歳
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ justifyContent: "center" }}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          color="inherit"
                          onClick={() => setEditTarget(member)}
                        >
                          編集
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          onClick={() => setDeleteTarget(member)}
                        >
                          削除
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {addButton}
          </Stack>
        )}
      </SectionFrame>

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
