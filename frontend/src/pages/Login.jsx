// import { useState } from "react";
// import { Link } from "react-router-dom";
// import "../styles/Login.css";
// import eyeOpen from "../assets/eye-open.svg";
// import eyeClosed from "../assets/eye-closed.svg";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [color, setColor] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const API_BASE_URL =
//     import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   const handleLogin = async () => {
//     setMessage("");
//     setColor("");

//     // Email validation
//     if (!emailRegex.test(email)) {
//       setMessage("Please enter a valid email address");
//       setColor("red");
//       return;
//     }

//     // Password validation
//     if (!password.trim()) {
//       setMessage("Password is required");
//       setColor("red");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await fetch(`${API_BASE_URL}/manager/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ 
//           email: email.trim(), 
//           password: password 
//         })
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setMessage(data.message || "Login failed");
//         setColor("red");
//         return;
//       }

//       setMessage(data.message || "Login successful");
//       setColor("green");

//       // TODO: Store token and redirect to dashboard
//       // localStorage.setItem('token', data.token);
//       // navigate('/dashboard');

//     } catch (error) {
//       setMessage("Unable to connect to server");
//       setColor("red");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <div className="login-container">
//       <h2>Manager Login</h2>

//       <div className="field">
//         <label>Email</label>
//         <input
//           type="email"
//           placeholder="manager@company.com"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//       </div>

//       <div className="field">
//         <label>Password</label>
//         <div className="password-wrapper">
//           <input
//             type={showPassword ? "text" : "password"}
//             placeholder="Enter your password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <button
//             type="button"
//             className="eye-button"
//             onClick={togglePasswordVisibility}
//             aria-label={showPassword ? "Hide password" : "Show password"}
//           >
//             {showPassword ? (
//               <img src={eyeOpen} alt="Hide password" className="eye-icon" />
//             ) : (
//               <img src={eyeClosed} alt="Show password" className="eye-icon" />
//             )}
//           </button>
//         </div>
//       </div>

//       <button onClick={handleLogin} disabled={loading}>
//         {loading ? "Logging in..." : "Login"}
//       </button>

//       {message && (
//         <div className="message" style={{ color }}>
//           {message}
//         </div>
//       )}

//       <p className="alt-link">
//         New manager?{" "}
//         <Link to="/activation" className="link">
//           Activate account
//         </Link>
//       </p>
//     </div>
//   );
// };

// export default Login;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";   // ✅ added useNavigate
import "../styles/Login.css";
import eyeOpen from "../assets/eye-open.svg";
import eyeClosed from "../assets/eye-closed.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();   // ✅ added

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = async () => {
    setMessage("");
    setColor("");

    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address");
      setColor("red");
      return;
    }

    if (!password.trim()) {
      setMessage("Password is required");
      setColor("red");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/manager/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Login failed");
        setColor("red");
        return;
      }

      setMessage(data.message || "Login successful");
      setColor("green");

      // ✅ STORE TOKEN & REDIRECT
      localStorage.setItem("token", data.token);
      navigate("/Landingpage");

    } catch (error) {
      setMessage("Unable to connect to server");
      setColor("red");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <h2>Manager Login</h2>

      <div className="field">
        <label>Email</label>
        <input
          type="email"
          placeholder="manager@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="field">
        <label>Password</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="eye-button"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <img
              src={showPassword ? eyeOpen : eyeClosed}
              alt="Toggle password"
              className="eye-icon"
            />
          </button>
        </div>
      </div>

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      {message && (
        <div className="message" style={{ color }}>
          {message}
        </div>
      )}

      <p className="alt-link">
        New manager?{" "}
        <Link to="/activation" className="link">
          Activate account
        </Link>
      </p>
    </div>
  );
};

export default Login;
