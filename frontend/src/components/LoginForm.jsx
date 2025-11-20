import React, { useState } from "react";
import useAuthStore from "../store/authStore";

export default function Login() {
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login({ email, password });

    if (!result.success) {
      setError(result.message || "Credenciales incorrectas");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-lg">
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="mb-4">
        <label className="font-bold">Email:</label>
        <input
          type="email"
          className="border rounded w-full px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="font-bold">Password:</label>
        <input
          type="password"
          className="border rounded w-full px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button className="bg-blue-500 text-white w-full py-2 rounded">
        Login
      </button>
    </form>
  );
}
