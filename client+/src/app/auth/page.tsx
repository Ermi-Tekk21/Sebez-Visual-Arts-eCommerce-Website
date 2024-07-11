"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const [nameOrEmail, setNameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/auth", {
        nameOrEmail,
        password,
      });
      localStorage.setItem("token", response.data.token);
      console.log("Token:", response.data.token);

      const userResponse = await axios.get(
        "http://localhost:8000/api/user/getMe",
        {
          headers: {
            "x-auth-token": response.data.token,
          },
        }
      );

      // console.log('User Response:', userResponse.data);
      const user = userResponse.data;
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/users");
      }
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label
              htmlFor="nameOrEmail"
              className="block text-sm font-medium text-gray-700"
            >
              Email or Username:
            </label>
            <input
              type="text"
              id="nameOrEmail"
              value={nameOrEmail}
              onChange={(e) => setNameOrEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
