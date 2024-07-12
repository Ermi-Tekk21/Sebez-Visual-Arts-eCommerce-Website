"use client";
import React, { useEffect } from "react";
import { useCart } from "../../../stores/cart-store";
import { Button } from "../../../components/ui/button";
import useAuthStore from "@/stores/AuthStore";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/signin");
    }
  }, []);
  const cart = useCart();

  const totalSum = cart.checkout.reduce((sum, item) => sum + item.totalPrice, 0);
if (totalSum === 0) {
  router.push("/user");
}
  return (
<div className="flex gap-2 items-center">
<div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 mt-20">Order Summary</h2>
          <div className="h-[500px] overflow-y-auto pe-3">
            {cart.checkout.map((product) => (
              <div
                key={product.id}
                className="grid sm:grid-cols-2 gap-6 border border-gray-200 rounded-lg mb-4 p-4 items-center"
              >
                <div className="px-4 py-6 bg-gray-100 rounded-md">
                  <img src={product.image} alt={product.title} className="w-full object-contain" />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between font-semibold text-gray-800">
                    {product.title}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-gray-500">Quantity</div>
                    <span className="text-gray-800">{product.amount}</span>
                  </div>
                  <div className="flex gap-6 mt-4">
                    <p className="text-gray-500">Total Price</p>
                    <span className="text-gray-800">{product.totalPrice} ETB</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 mt-10 justify-center items-center m-auto align-center">
        <div className="mt-6 bg-gray-800 text-white rounded-lg p-4 flex justify-between items-center">
            <h4 className="text-lg font-bold">Total price</h4>
            <span className="text-xl font-semibold">{totalSum} ETB</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-6">Complete your order</h2>
          <form className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Personal Details</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="px-4 py-3.5 bg-white text-gray-800 w-full text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 outline-none"
                  />
                </div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="px-4 py-3.5 bg-white text-gray-800 w-full text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 outline-none"
                  />
                </div>
                <div className="relative flex items-center">
                  <input
                    type="email"
                    placeholder="Email"
                    className="px-4 py-3.5 bg-white text-gray-800 w-full text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 outline-none"
                  />
                </div>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    placeholder="Phone No."
                    className="px-4 py-3.5 bg-white text-gray-800 w-full text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 outline-none"
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Shipping Address</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Address Line"
                  className="px-4 py-3.5 bg-white text-gray-800 w-full text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 outline-none"
                />
                <input
                  type="text"
                  placeholder="City"
                  className="px-4 py-3.5 bg-white text-gray-800 w-full text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 outline-none"
                />
                <input
                  type="text"
                  placeholder="State"
                  className="px-4 py-3.5 bg-white text-gray-800 w-full text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 outline-none"
                />
                <input
                  type="text"
                  placeholder="Zip Code"
                  className="px-4 py-3.5 bg-white text-gray-800 w-full text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-6 max-sm:flex-col mt-10">
              <Button
                type="button"
                className="rounded-md px-6 py-3 w-full text-sm font-semibold bg-transparent hover:bg-gray-100 border-2 text-gray-800"
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="rounded-md px-6 py-3 w-full text-sm font-semibold bg-gray-800 text-white hover:bg-gray-700"
              >
                Complete Purchase
              </Button>
            </div>
          </form>
        </div>
</div>


    
  );
}
