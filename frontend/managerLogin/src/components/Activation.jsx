import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Activation.css";

/*
  Valid activation key:
  ABC123-XYZ
*/

const LICENSE = {
  hash: "9d45b49f6d93c5e10e38d07c8c6c3b7d8b47a41a7e9b57f4fa9f2b91e6b5b0b3",
  checksum: 54,
  expiry: "2025-12-31",
};

export default function Activation() {
  const navigate = useNavigate();

  const [keyInput, setKeyInput] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("");

  const calculateChecksum = (key) =>
    key.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 100;

  const hashKey = async (key) => {
    const encoded = new TextEncoder().encode(key);
    const buffer = await crypto.subtle.digest("SHA-256", encoded);
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const validateKey = async () => {
    setMessage(""); // reset message on each click

    if (!keyInput.trim()) {
      setMessage("Please enter an activation key");
      setColor("red");
      return;
    }

    if (localStorage.getItem("licenseUsed")) {
      setMessage("Activation Key Already Used ❌");
      setColor("red");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const trimmedKey = keyInput.trim();

    const inputHash = await hashKey(trimmedKey);
    const inputChecksum = calculateChecksum(trimmedKey);

    if (inputHash !== LICENSE.hash || inputChecksum !== LICENSE.checksum) {
      setMessage("Invalid Activation Key ❌");
      setColor("red");
      return;
    }

    if (today > LICENSE.expiry) {
      setMessage("Activation Key Expired ❌");
      setColor("red");
      return;
    }

    // success
    localStorage.setItem("licenseUsed", "true");
    localStorage.setItem("activated", "true");

    setMessage("Activation Successful ✔");
    setColor("green");

    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="page">
      <div className="container">
        <h2>Enter Activation Key</h2>

        <div className="field">
          <input
            type={showKey ? "text" : "password"}
            placeholder="Activation Key"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
          />
          <span className="eye" onClick={() => setShowKey(!showKey)}>
            👁
          </span>
        </div>

        <button onClick={validateKey}>Validate</button>

        <div className="message" style={{ color }}>
          {message}
        </div>
      </div>
    </div>
  );
}
