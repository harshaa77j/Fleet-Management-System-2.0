import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Activation.css";

export default function Activation() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [activationKey, setActivationKey] = useState("");
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async () => {
    setMessage("");
    setColor("");

    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address");
      setColor("red");
      return;
    }

    if (!activationKey.trim()) {
      setMessage("Activation key is required");
      setColor("red");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/activation/onboard-manager`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            activationKey: activationKey.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Activation failed");
        setColor("red");
        return;
      }

      setMessage(data.message || "Activation successful. Check your email.");
      setColor("green");

      

    } catch (error) {
      setMessage("Unable to connect to server");
      setColor("red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <h2>Account Activation</h2>
        <p className="subtitle">
          Enter your company email and activation key
        </p>

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
          <label>Activation Key</label>
          <input
            type="text"
            placeholder="Enter activation key"
            value={activationKey}
            onChange={(e) => setActivationKey(e.target.value.toUpperCase())}
          />
        </div>

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>

        {message && (
          <div className="message" style={{ color }}>
            {message}
          </div>
        )}

        {/* Login redirect */}
        <p className="alt-link">
          Already have credentials?{" "}
          <span className="link" onClick={() => navigate("/login")}>
            Go to Login
          </span>
        </p>
      </div>
    </div>
  );
}
