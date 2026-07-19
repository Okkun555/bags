import "./App.css";
import { Route, Routes } from "react-router";
import Signup from "@/pages/Signup";
import Login from "@/pages/Login";
import { AuthProvider } from "./providers/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
