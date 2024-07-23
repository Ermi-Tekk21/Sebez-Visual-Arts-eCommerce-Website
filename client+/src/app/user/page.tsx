"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/AuthStore";
import ProductPage from "@/components/landingPage/product-page";
import axios from "axios";

const UserPage = () => {
  const [userData, setUserData] = useState<any>({});
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
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
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData.role && userData.role !== "user") {
      router.push(`/${userData.role}`);
    }
    if (!isAuthenticated) {
      logout();
    }
  }, [userData, isAuthenticated, router, logout]);

  return (
    <div className="mt-20">
      <ProductPage />
    </div>
  );
};

export default UserPage;

//
