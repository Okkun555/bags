import "./App.css";
import { Route, Routes } from "react-router";
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
import HouseholdBudget from "./pages/HouseholdBudget";

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
            <Route path="/household-budget" element={<HouseholdBudget />} />

            <Route path="/profile/new" element={<NewProfile />} />
          </Route>
        </Routes>
      </AuthProvider>
    </LocalizationProvider>
  );
}

export default App;
