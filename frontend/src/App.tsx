import "./App.css";
import { Route, Routes } from "react-router";
import Signup from "@/pages/Signup";
import Login from "@/pages/Login";
import { AuthProvider } from "./providers/AuthProvider";
import Dashboard from "./pages/Dashboard";
import { ProtectedRoute } from "./components/routes/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
