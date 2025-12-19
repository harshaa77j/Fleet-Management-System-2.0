import { Routes, Route } from "react-router-dom";
import Activation from "./components/Activation";
import Login from "./components/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Activation />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
