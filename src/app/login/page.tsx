'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({
    userName: "",
    password: "",
  });

  const [error, setError] = useState("");


  

  // 🔐 handleSubmit runs when user clicks login
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      // store user info
      localStorage.setItem("user", JSON.stringify(data.user));

      // redirect to homepage
      router.push("/");
    } else {
      setError(data.error || "Login failed");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-black text-white">
      <form
        className="w-80 space-y-4 bg-zinc-900 p-6 rounded"
        onSubmit={handleSubmit}
      >
        <h1 className="text-center text-2xl font-bold">Login</h1>

        {error && <p className="text-red-500">{error}</p>}

        <input
          placeholder="User Name"
          className="w-full p-2 bg-gray-800"
          onChange={(e) =>
            setForm({ ...form, userName: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 bg-gray-800"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="w-full bg-red-600 p-2 rounded">
          Login
        </button>

        <p className="text-center text-sm">
          New user?{" "}
          <a href="/register" className="text-red-500">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
