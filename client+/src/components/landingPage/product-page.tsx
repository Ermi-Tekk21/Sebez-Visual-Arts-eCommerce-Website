import React, { useEffect, useState } from "react";
import Image from "next/image";
import ProductCard from "@/components/global/productCard";
interface Product {
  id: string;
  category: string;
  item_name: string;
  description: string;
  quantity: number;
  price: string;
  imageUrl: string;
  artist: string;
}

interface Category {
  name: string;
  products: Product[];
}

const ProductPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // State to track selected product
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/product/getallProducts"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        // Group products by category
        const groupedCategories = groupProductsByCategory(data);
        setCategories(groupedCategories);
      } catch (error) {
        setError("Failed to fetch products");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const groupProductsByCategory = (products: Product[]): Category[] => {
    const categoriesMap = new Map<string, Category>();
    products.forEach((product) => {
      const { category } = product;
      if (categoriesMap.has(category)) {
        categoriesMap.get(category)?.products.push(product);
      } else {
        categoriesMap.set(category, { name: category, products: [product] });
      }
    });
    return Array.from(categoriesMap.values());
  };

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setSelectedProduct(null); // Reset selected product when changing category
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const selectedCategoryProducts = selectedCategory
    ? categories.find((category) => category.name === selectedCategory)?.products || []
    : [];

  return (
    <main className="relative min-h-screen bg-gray-900 text-white" id="product">
      <div className="absolute inset-0 opacity-80"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-serif text-center py-10">Find Your Desired Product</h1>

        {/* Category Sidebar */}
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-green-700 opacity-85 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">Categories</h2>
          <ul>
            {categories.map((category) => (
              <li
                key={category.name}
                onClick={() => handleCategorySelect(category.name)}
                className={`cursor-pointer py-2 px-4 mb-2 rounded-md hover:bg-green-600 ${
                  selectedCategory === category.name ? 'bg-green-300' : 'bg-green-600'
                }`}
              >
                {category.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Selected Category Products */}
        <div className="mt-8 w-full max-w-full md:max-w-4xl p-6 lg:max-w-6xl xl:max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {selectedCategoryProducts.length > 0 ? (
            selectedCategoryProducts.map((product, index) => (
              <ProductCard
                key={index}
                id={product._id}
                title={product.item_name}
                image={product.imageUrl}
                price={parseFloat(product.price)}
                description={product.description}
                artist={product.artist}
                onSelect={() => handleProductSelect(product)} // Pass onSelect function
              />
            ))
          ) : (
            <p className="text-lg text-gray-300 col-span-full text-center">
              {selectedCategory ? 'No products found in this category.' : 'Please select a category to view products.'}
            </p>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductPage;
