'use client'

import Image from "next/image";
import { Coffee } from "lucide-react";
import { useProductImage } from "@/hooks/use-unsplash-image";

interface ProductImageProps {
  image?: string;
  productName: string;
  index: number;
  primaryColor: string;
  borderRadiusClass: string;
}

const ProductImage = ({
  image,
  productName,
  index,
  primaryColor,
  borderRadiusClass
}: ProductImageProps) => {
  const { imageUrl, isLoading } = useProductImage(image, productName);

  return (
    <div className={`h-48 overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 ${borderRadiusClass}`}>
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        </div>
      ) : imageUrl ? (
        <div className="relative w-full h-full">
          <Image
            src={imageUrl}
            alt={productName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover group-hover:scale-105 transition-transform duration-300 ${borderRadiusClass}`}
            priority={index < 2}
            quality={85}
          />

          {/* Unsplash Attribution */}
          {!image && (
            <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
              Unsplash
            </div>
          )}
        </div>
      ) : (
        <div className="relative w-full h-full">
          <Image
            src="https://placehold.co/400x300?text=Product+Image"
            alt={productName || "Product"}
            fill
            className={`object-cover group-hover:scale-105 transition-transform duration-300 ${borderRadiusClass}`}
          />
        </div>
      )}
    </div>
  );
};

export default ProductImage; 