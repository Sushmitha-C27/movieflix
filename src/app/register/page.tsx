'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    userName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      alert(`Registered! Your User ID is ${data.userId}`);
      router.push("/login");
    } else {
      setError(data.error || "Registration failed");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-black text-white">
      <form
        className="w-80 space-y-4 bg-zinc-900 p-6 rounded"
        onSubmit={handleSubmit}
      >
        <h1 className="text-center text-2xl font-bold">Register</h1>

        {error && <p className="text-red-500">{error}</p>}

        <input
          placeholder="User Name"
          className="w-full p-2 bg-gray-800"
          onChange={(e) =>
            setForm({ ...form, userName: e.target.value })
          }
        />

        <input
          placeholder="Email"
          className="w-full p-2 bg-gray-800"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          placeholder="Phone"
          className="w-full p-2 bg-gray-800"
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
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
          Register
        </button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-red-500">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
