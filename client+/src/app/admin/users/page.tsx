"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import BackgroundImage from "../../../../public/assets/images/hero.jpg";
import useAuthStore from "@/stores/AuthStore";

const GetUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated); // Get isAuthenticated from useAuthStore
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/signin"); // Redirect to signin page if not authenticated
    }
  }, []);
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:8000/api/user/getalluser",
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        setUsers(response.data);
      } catch (error) {
        setError(error.response ? error.response.data : "Something went wrong");
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:3010/api/user/delete/${userId}`, {
        headers: {
          "x-auth-token": token,
        },
      });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      setError(error.response ? error.response.data : "Something went wrong");
    }
  };

  const handleEdit = (userId) => {
    // Implement the logic for editing a user, e.g., redirect to an edit page
  };

  return (
    <div className="flex min-h-screen items-center  justify-center bg-gray-900">
      <div className="absolute inset-0">
        <Image
          src={BackgroundImage}
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="opacity-40 z-0"
        />
      </div>
      <div className="bg-white z-10 p-8 rounded shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Users</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="bg-gray-50">
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.role}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEdit(user._id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600 transition duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetUsers;
