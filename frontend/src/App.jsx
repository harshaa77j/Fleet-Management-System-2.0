import { Routes, Route, Navigate } from "react-router-dom";
import Activation from "./pages/Activation";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/activation" />} />
      <Route path="/activation" element={<Activation />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
