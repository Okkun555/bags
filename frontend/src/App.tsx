import "./App.css";
import { Navigate, Route, Routes } from "react-router";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { AuthProvider } from "./providers/AuthProvider";
import { ProtectedRoute } from "./components/routes/ProtectedRoute";
import { GuestRoute } from "./components/routes/GuestRoute";
import Dashboard from "./pages/Dashboard";
import NewProfile from "./pages/NewProfile";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/ja";
import { HouseholdBudgetLayout } from "./components/budget_management/BudgetManagementLayout";
import { MonthlyPlanList } from "./components/budget_management/MonthlyPlanList";
import { MonthlyPlanDetail } from "./components/budget_management/MonthlyPlanDetail";
import { BudgetItemSetting } from "./components/budget_management/BudgetItemSetting";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
      <AuthProvider>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/budget-management"
              element={<HouseholdBudgetLayout />}
            >
              <Route index element={<Navigate to="monthly-plans" replace />} />
              <Route path="monthly-plans" element={<MonthlyPlanList />} />
              <Route path="monthly-plans/:id" element={<MonthlyPlanDetail />} />
              <Route path="items" element={<BudgetItemSetting />} />
            </Route>

            <Route path="/profile/new" element={<NewProfile />} />
          </Route>
        </Routes>
      </AuthProvider>
    </LocalizationProvider>
  );
}

export default App;
