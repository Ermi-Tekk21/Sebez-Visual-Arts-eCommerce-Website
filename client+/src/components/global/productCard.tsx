import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import useAuthStore from "@/stores/AuthStore";
import Link from 'next/link'
interface ProductCardProps {
  id: string;
  title: string;
  image: string;
  price: number;
  description: string;
  artist: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ title, image, price, description, artist }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated); // Get isAuthenticated from useAuthStore

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>by {artist}</CardDescription>
      </CardHeader>
      <CardContent>
        <Image src={image} alt={title} width={300} height={300} />
        <p>{description}</p>
      </CardContent>
      <CardFooter className='flex justify-between'>
        <p>${price}</p>
        
                    {isAuthenticated ? 
                    (<button className="bg-custom-green-b text-white px-3 py-2 rounded">
                      add to cart
                    </button>) :
                    
                    (
                    
                    <Link href="/auth/signin"><button className="bg-custom-green-b text-white px-3 py-2 rounded">
                    add to cart
                  </button>
                    </Link>
                    )
                  }
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
