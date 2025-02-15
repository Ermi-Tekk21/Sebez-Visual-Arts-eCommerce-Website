import React, { useState, useEffect } from "react";
import Image from "next/image";
import Logo from "../../../public/assets/images/sebezLogo.png";
import navBG from "../../../public/assets/images/navBG.jpg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useAuthStore from "@/stores/AuthStore";
import Cart from "./cart";
import { useRouter } from "next/navigation";
import ProductDetail from "./product_detail";

interface Product {
  category: string;
  item_name: string;
}

interface Category {
  name: string;
  products: Product[];
}

const NavBar: React.FC = () => {
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const router= useRouter()
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/product/getallProducts"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        console.log(data);

        // Group products by category
        const groupedCategories = groupProductsByCategory(data);
        setCategories(groupedCategories);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setShowNav(currentScrollPos <= 0 || currentScrollPos < lastScrollY);
      setLastScrollY(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleProductsClick = () => {
    setIsProductsDropdownOpen(!isProductsDropdownOpen);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
    
  };

  const filteredProducts = categories.reduce(
    (accumulator: Product[], category: Category) => {
      return [
        ...accumulator,
        ...category.products.filter(
          (product) =>
            (product.item_name &&
              product.item_name.toLowerCase().includes(searchTerm)) ||
            (product.category &&
              product.category.toLowerCase().includes(searchTerm))
        ),
      ];
    },
    []
  );

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };
  
  
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

  const pathname = usePathname();
  const ishome = pathname === "/";
  const isSignupRoute = pathname.includes("/auth/signup");
  const isAuthRoute = pathname.includes("/auth");
  const isArtist = pathname.includes("/artist");
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  return (
    <main>
      
      {!isArtist && (
        <div
          className={`${
            showNav ? "translate-y-0" : "-translate-y-full"
          } bg-custom-green-a shadow-md flex items-center justify-around pt-4 pb-4 font-semibold z-40 fixed w-full top-0 transition-transform duration-300 ease-in-out `}
        >
          <div className="absolute inset-0">
        <Image
          src={navBG}
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="opacity-10 z-0"
        />
      </div>
          <Link href="/">
            <div className="cursor-pointer">
              <Image src={Logo} alt="Sebez Logo" width={130} height={80} />
            </div>
          </Link>

          {!isAuthenticated && (
            <div className="cursor-pointer list-none flex justify-around gap-16 opacity-70">
              <nav className="hover:text-custom-green-d hover:underline">
                <Link href="/">Home</Link>
              </nav>
              <nav className="hover:text-custom-green-d hover:underline">
                <Link href="/#about-us">About Us</Link>
              </nav>
              <nav className="hover:text-custom-green-d hover:underline">
                <Link href="/#product">Products</Link>
              </nav>
              <nav className="hover:text-custom-green-d hover:underline">
                <Link href="/#contact-us">Contact Us</Link>
              </nav>
            </div>
          )}

          {/* Search and get started */}
          <div className="flex gap-10 cursor-pointer z-40">
            {!isSignupRoute && !isAuthRoute && (
              <div onClick={handleProductsClick}>
              <input
                type="text"
                placeholder="Search products"
                className="px-2 py-1 rounded border border-green-400"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {isProductsDropdownOpen && (
                <div className="absolute top-14 z-10 right-0 bg-white border border-gray-300 shadow-md h-96 overflow-y-scroll">
                  <h3 className="bg-gray-600 text-white p-4 sticky top-0">
                    Product Categories
                  </h3>
                  <ul className="list-none">
                    {filteredProducts.map((product, index) => (
                      <li
                        key={index}
                        className="hover:bg-gray-400 p-2 cursor-pointer"
                        onClick={() => handleProductSelect(product)}
                      >
                        {product.category}: {product.item_name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            )}
            {isAuthenticated && <Cart />}
            <nav className="flex gap-8 align-center">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      logout();
                      router.push("/auth/signin");
                    }}
                    className="bg-custom-green-b z-40 text-white px-3 py-2 rounded"
                  >
                    Log out
                  </button>
                </>
              ) : (
                // Render other components when not authenticated
                <div className="z-40">
                  {ishome && (
                    <Link href="/auth/signin">
                      <button className="bg-custom-green-b text-white px-3 py-2 rounded">
                        Get started
                      </button>
                    </Link>
                  )}
                  {isSignupRoute ? (
                    <Link href="/auth/signin">
                      <button className="bg-custom-green-b text-white px-3 py-2 rounded">
                        Sign In
                      </button>
                    </Link>
                  ) : (
                    <Link href="/auth/signup">
                      {/* className="bg-custom-green-b text-white px-3 py-2 rounded" */}
                      {isAuthRoute && (
                        <button className="bg-custom-green-b text-white px-3 py-2 rounded">
                          Sign Up
                        </button>
                      )}
                    </Link>
                  )}
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
              <ProductDetail product={selectedProduct} isOpen={isModalOpen} onClose={handleCloseModal}/>

    </main>
  );
};

export default NavBar;
