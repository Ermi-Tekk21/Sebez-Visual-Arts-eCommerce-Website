"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import BackgroundImage from "../../../../public/assets/images/hero.jpg";
import useAuthStore from "@/stores/AuthStore";
import { useRouter } from "next/navigation";

const AddProduct = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated); // Get isAuthenticated from useAuthStore
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/signin"); // Redirect to signin page if not authenticated
    }
  }, []);
  const [formData, setFormData] = useState({
    category: "Drawings",
    item_name: "",
    description: "",
    quantity: 1,
    price: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:8000/api/product/createProduct",
        formData,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      setSuccess("Product added successfully!");
      setError("");
      setFormData({
        category: "Drawings",
        item_name: "",
        description: "",
        quantity: 1,
        price: "",
      });
    } catch (error) {
      setError(error.response ? error.response.data : "Something went wrong");
      setSuccess("");
    }
  };

  return (
    <div className="flex min-h-screen items-center  justify-center bg-gray-900">
      <div className="absolute inset-0">
        <Image
          src={BackgroundImage}
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="opacity-40"
        />
      </div>
      <div className="bg-white z-10 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Product</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="Drawings">Drawings</option>
              <option value="Sketches">Sketches</option>
              <option value="Paintings">Paintings</option>
              <option value="Sculptures">Sculptures</option>
              <option value="Portraits">Portraits</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Item Name
            </label>
            <input
              type="text"
              name="item_name"
              value={formData.item_name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
              min="1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Price
            </label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
