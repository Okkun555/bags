import "./App.css";
import { Route, Routes } from "react-router";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { AuthProvider } from "./providers/AuthProvider";
import { ProtectedRoute } from "./components/routes/ProtectedRoute";
import { GuestRoute } from "./components/routes/GuestRoute";
import Dashboard from "./pages/Dashboard";
import NewProfile from "./pages/NewProfile";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/profile/new" element={<NewProfile />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
