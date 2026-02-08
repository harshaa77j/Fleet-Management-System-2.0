// import { Routes, Route, Navigate } from "react-router-dom";
// import Activation from "./pages/Activation";
// import Login from "./pages/Login";
// import Landingpage from "./pages/Landingpage";

// function PrivateRoute({ children }) {
//   const token = localStorage.getItem("token");
//   return token ? children : <Navigate to="/login" replace />;
// }


// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Navigate to="/activation" />} />
//       <Route path="/activation" element={<Activation />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/Landingpage" element={<Landingpage />} />
//     </Routes>
//   );
// }

// export default App;

import { Routes, Route, Navigate } from "react-router-dom";
import Activation from "./pages/Activation";
import Login from "./pages/Login";
import Landingpage from "./pages/Landingpage";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/activation" />} />
      <Route path="/activation" element={<Activation />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/Landingpage"
        element={
          <PrivateRoute>
            <Landingpage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;

