"use client";

import React, { useState } from "react";
import { Expand, LogOut, Minimize, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import userTag from "../../../public/assets/icons/manage.svg";
import productTag from "../../../public/assets/icons/products.svg";
import profileTag from "../../../public/assets/icons/profile.svg";
import useAuthStore from "@/stores/AuthStore";

const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

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
        {/* <Link href="/admin/dashboard" legacyBehavior>
                    <a className="text-white">{isExpanded ? 'Dashboard' : 'D'}</a>
                </Link> */}
        <div className="">
          <Link href="/admin/users" legacyBehavior>
            <a className="text-white ">
              {isExpanded ? (
                <div className="bordered shadow-md rounded-md px-3 border-[1px]">
                  Users
                </div>
              ) : (
                <div className="bg-white rounded-full p-1 hover:p-2">
                  <Image src={userTag} alt="" className="text-white z-0 " />
                </div>
              )}
            </a>
          </Link>
        </div>
        <Link href="/admin/products" legacyBehavior>
          <a className="text-white">
            {isExpanded ? (
              <div className="bordered rounded-md px-3 shadow-md border-[1px]">
                Products
              </div>
            ) : (
              <div className="bg-white rounded-full p-1 hover:p-2">
                <Image src={productTag} alt="" className="text-white z-0" />
              </div>
            )}
          </a>
        </Link>
        {/* <Link href="/admin/orders" legacyBehavior>
                    <a className="text-white">{isExpanded ? 'Orders' : 'O'}</a>
                </Link> */}
        <Link href="/admin/Profile" legacyBehavior>
          <a className="text-white">
            {isExpanded ? (
              <div className="bordered shadow-md rounded-md px-3 border-[1px]">
                Profile
              </div>
            ) : (
              <div className="bg-white rounded-full p-1 hover:p-2">
                <Image src={profileTag} alt="" className="text-white z-0" />
              </div>
            )}
          </a>
        </Link>
        <div className="text-white">
          {isExpanded ? (
            <button className="bordered shadow-md rounded-md px-3 border-[1px]">
              Log out
            </button>
          ) : (
            <button onClick={logout}>
              <LogOut />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
