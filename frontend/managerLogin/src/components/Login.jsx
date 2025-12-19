import { useState } from "react";
import "./Login.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const isActivated = localStorage.getItem("activated");
    if (!isActivated) {
      navigate("/");
    }
  }, [navigate]);

  const [managerId, setManagerId] = useState("");
  const [password, setPassword] = useState("");

  // form submit handler (frontend only for now)
  const handleSubmit = (e) => {
    e.preventDefault(); // prevents page reload

    // for now just check values
    console.log("Manager ID:", managerId);
    console.log("Password:", password);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Manager Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Manager ID or Email"
              className="login-input"
              value={managerId}
              onChange={(e) => setManagerId(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Forgot password */}
          <div className="forgot-password">
            <a href="#">Forgot password?</a>
          </div>

          {/* Login button */}
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
