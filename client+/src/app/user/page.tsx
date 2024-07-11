"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/AuthStore";
import ProductPage from "@/components/landingPage/product-page";

const UserPage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated); // Get isAuthenticated from useAuthStore
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/signin"); // Redirect to signin page if not authenticated
    }
  }, []);

  return (
    <div className="mt-20">
      <ProductPage />
    </div>
  );
};

export default UserPage;

//
