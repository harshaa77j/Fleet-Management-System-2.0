import { useState } from "react";
import "./Activation.css";

interface License {
  hash: string;
  checksum: number;
  expiry: string;
  used: boolean;
}

/*
  Example valid activation key 
  ABC123-XYZ
*/

const licenses: License[] = [
  {
    // SHA-256 hash of "ABC123-XYZ"
    hash: "e9c5c3b2d4f39c5fa48c99d28f8a4d9a9c0d7aafde4f9eaf88ed7a29c3f1b0a5",
    checksum: 54,
    expiry: "2025-12-31",
    used: false
  }
];

export default function Activation(): JSX.Element {
  const [keyInput, setKeyInput] = useState<string>("");
  const [showKey, setShowKey] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [color, setColor] = useState<string>("");

  // Simple checksum for integrity check
  const calculateChecksum = (key: string): number =>
    key.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 100;

  // SHA-256 encryption
  const hashKey = async (key: string): Promise<string> => {
    const encoded = new TextEncoder().encode(key);
    const buffer = await crypto.subtle.digest("SHA-256", encoded);
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const validateKey = async (): Promise<void> => {
    if (!keyInput.trim()) {
      setMessage("Please enter an activation key");
      setColor("red");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const inputHash = await hashKey(keyInput.trim());
    const inputChecksum = calculateChecksum(keyInput.trim());

    const license = licenses.find(
      l => l.hash === inputHash && l.checksum === inputChecksum
    );

    if (!license) {
      setMessage("Invalid Activation Key ❌");
      setColor("red");
      return;
    }

    if (license.used) {
      setMessage("Activation Key Already Used ❌");
      setColor("red");
      return;
    }

    if (today > license.expiry) {
      setMessage("Activation Key Expired ❌");
      setColor("red");
      return;
    }

    license.used = true;
    setMessage("Activation Successful ✔");
    setColor("green");
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
          <span
            className="eye"
            title="Show / Hide"
            onClick={() => setShowKey(!showKey)}
          >
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
