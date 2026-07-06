import { Button } from "@mui/material";
import "./App.css";
import { Route, Routes } from "react-router";
import { Signup } from "./components/auth/Signup";

function App() {
  return (
    <>
      <Routes>
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;
