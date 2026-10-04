import { GuestRoute } from "@/routes/GuestRoute";
import { Signup } from "@/components/auth/Signup";
import { Login } from "@/components/auth/Login";
import { NewProfile } from "@/components/setting/Profile/NewProfile";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { paths } from "./paths";
import { Navigate, Route, Routes as RouterRoutes } from "react-router";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { BudgetManagementLayout } from "@/components/budget-management";
import { MonthlyPlanList } from "@/components/budget-management/MonthlyPlanList";
import { MonthlyPlanDetail } from "@/components/budget-management/MonthlyPlanDetail";
import { BudgetItemSetting } from "@/components/budget-management/BudgetItemSetting";

export default function Routes() {
  return (
    <RouterRoutes>
      <Route element={<GuestRoute />}>
        <Route path={paths.auth.signup} element={<Signup />} />
        <Route path={paths.auth.login} element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path={paths.profile.new} element={<NewProfile />} />
        <Route path={paths.dashboard} element={<Dashboard />} />

        <Route path="/budget-management" element={<BudgetManagementLayout />}>
          <Route
            index
            element={
              <Navigate to={paths.budgetManagement.monthlyPlans} replace />
            }
          />
          <Route
            path={paths.budgetManagement.monthlyPlans}
            element={<MonthlyPlanList />}
          />
          <Route
            path={paths.budgetManagement.monthlyPlanDetailPattern}
            element={<MonthlyPlanDetail />}
          />
          <Route
            path={paths.budgetManagement.budgetItem}
            element={<BudgetItemSetting />}
          />
        </Route>
      </Route>
    </RouterRoutes>
  );
}
