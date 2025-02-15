"use client";

import React, { useEffect, useState } from "react";
import { Expand, LogOut, Minimize } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import userTag from "../../../public/assets/icons/manage.svg";
import productTag from "../../../public/assets/icons/products.svg";
import profileTag from "../../../public/assets/icons/profile.svg";
import prdList from "../../../public/assets/icons/listPrd.svg";
import useAuthStore from "@/stores/AuthStore";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "../ui/use-toast";

const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userData, setUserData] = useState<{}>({});
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const pathname = usePathname();
  const router = useRouter();
  const currentTime = Date.now() / 1000;

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      const decodedToken = jwtDecode(token);
      setTimeout(() => {
        setIsExpanded(true);
      }, 1000);
      if (decodedToken.exp < currentTime) {
        console.log("exprired token");
        toast({
          variant: "default",
          description: "Token expired please try again",
        });
        logout();
        router.push("/auth/signin");
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
        console.error(error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      logout();
    }
  }, [isAuthenticated, logout]);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };
  const isadmin = userData.role === "admin";
  const isuserListRoute = pathname.includes("admin/users");
  const isGetProductListRoute = pathname.includes("admin/getProducts");
  const isAddProductListRoute = pathname.includes("/admin/products");
  const isuProfileRoute = pathname.includes("/admin/Profile");

  return (
    <div
      className={`h-screen z-10 bg-gray-800 ${
        isExpanded ? "w-60" : "w-16"
      } transition-all duration-300 static items-center`}
    >
      <div className="flex justify-end">
        <button
          onClick={toggleSidebar}
          className="p-2 text-white focus:outline-none"
        >
          {isExpanded ? <Minimize /> : <Expand />}
        </button>
      </div>
      <div className="flex flex-col items-center mt-4 space-y-4">
        {isadmin && (
          <div>
            <Link href="/admin/users" legacyBehavior>
              <a className="text-white ">
                {isExpanded ? (
                  <div
                    className={`bordered shadow-md rounded-md px-3 border-[1px] ${
                      isuserListRoute && "bg-white text-blue-950"
                    }`}
                  >
                    Get Users
                  </div>
                ) : (
                  <div
                    className={`bg-white rounded-full p-1 hover:p-2 ${
                      isuserListRoute && "bg-slate-500 p-3"
                    }`}
                  >
                    <Image
                      src={userTag}
                      alt="User Tag"
                      className="text-white z-0"
                    />
                  </div>
                )}
              </a>
            </Link>
          </div>
        )}

        <Link href="/admin/products" legacyBehavior>
          <a className="text-white">
            {isExpanded ? (
              <div
                className={`bordered shadow-md rounded-md px-3 border-[1px] ${
                  isAddProductListRoute && "bg-white text-blue-950"
                }`}
              >
                Add Products
              </div>
            ) : (
              <div
                className={`bg-white rounded-full p-1 hover:p-2 ${
                  isAddProductListRoute && "bg-slate-500 p-3"
                }`}
              >
                <Image
                  src={productTag}
                  alt="Product Tag"
                  className="text-white z-0"
                />
              </div>
            )}
          </a>
        </Link>

        {isadmin && (
          <div>
            <Link href="/admin/getProducts" legacyBehavior>
              <a className="text-white">
                {isExpanded ? (
                  <div
                    className={`bordered shadow-md rounded-md px-3 border-[1px] ${
                      isGetProductListRoute && "bg-white text-blue-950"
                    }`}
                  >
                    Get Products
                  </div>
                ) : (
                  <div
                    className={`bg-white rounded-full p-1 hover:p-2 ${
                      isGetProductListRoute && "bg-slate-500 p-3"
                    }`}
                  >
                    <Image
                      src={prdList}
                      alt="Product List"
                      className="text-white z-0"
                    />
                  </div>
                )}
              </a>
            </Link>
          </div>
        )}

        <Link href="/admin/Profile" legacyBehavior>
          <a className="text-white">
            {isExpanded ? (
              <div
                className={`bordered shadow-md rounded-md px-3 border-[1px] ${
                  isuProfileRoute && "bg-white text-blue-950"
                }`}
              >
                Profile
              </div>
            ) : (
              <div
                className={`bg-white rounded-full p-1 hover:p-2 ${
                  isuProfileRoute && "bg-slate-500 p-3"
                }`}
              >
                <Image
                  src={profileTag}
                  alt="Profile Tag"
                  className="text-white z-0"
                />
              </div>
            )}
          </a>
        </Link>

        <div className="text-white">
          {isExpanded ? (
            <button
              onClick={() => {
                logout();
                router.push("/auth/signin");
              }}
              className="hover:bg-red-600 hover:text-white bordered shadow-md rounded-md px-3 border-[1px]"
            >
              Log out
            </button>
          ) : (
            <button
              onClick={() => {
                logout();
                router.push("/auth/signin");
              }}
              className="hover:bg-red-600 hover:rounded-md p-3"
            >
              <LogOut />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
