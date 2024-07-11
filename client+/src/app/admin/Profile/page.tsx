"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import BackgroundImage from "../../../../public/assets/images/hero.jpg";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/AuthStore";
const Profile = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated); // Get isAuthenticated from useAuthStore
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/signin"); // Redirect to signin page if not authenticated
    }
  }, []);
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:8000/api/user/getMe",
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        setUserData(response.data);
      } catch (error) {
        // setError(error.response ? error.response.data : 'Something went wrong');
        console.log(error);
      }
    };

    fetchUserData();
  }, []);

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
      <div className="bg-white p-8 z-10 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {userData ? (
          <div>
            <div className="mb-4">
              <h3 className="text-xl font-semibold">Name:</h3>
              <p className="text-gray-700">{userData.name}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-semibold">Email:</h3>
              <p className="text-gray-700">{userData.email}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-semibold">Address:</h3>
              <p className="text-gray-700">{userData.address}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-semibold">Role:</h3>
              <p className="text-gray-700">{userData.role}</p>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;