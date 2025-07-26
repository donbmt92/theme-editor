'use client'

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Coffee } from "lucide-react";
import { ThemeParams } from "@/types";

interface ProductItem {
  id?: string;
  name: string;
  description: string;
  price?: string;
  category?: string;
  image?: string;
}

interface ProductsServicesContent {
  title?: string;
  description?: string;
  backgroundColor?: string;
  textColor?: string;
  items?: ProductItem[];
}

interface ProductsServicesProps {
  theme: ThemeParams;
  content: ProductsServicesContent;
}

const ProductsServices = ({ theme, content }: ProductsServicesProps) => {
  return (
    <section 
      id="products" 
      className="py-20"
      style={{
        backgroundColor: content.backgroundColor || theme.sections?.products?.backgroundColor || '#F0F4F8'
      }}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ 
              color: content.textColor || theme.sections?.products?.textColor || theme.colors.text
            }}
          >
            {content.title}
          </h2>
          <p 
            className="text-xl max-w-3xl mx-auto"
            style={{ 
              color: theme.colors.muted || '#718096'
            }}
          >
            {content.description}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(content.items || [
            {
              id: "1",
              name: "Cà Phê Robusta",
              description: "Cà phê Robusta Việt Nam với hương vị đậm đà, hàm lượng caffeine cao, phù hợp cho espresso",
              price: "2.50 USD/kg",
              category: "Robusta"
            },
            {
              id: "2", 
              name: "Cà Phê Arabica",
              description: "Cà phê Arabica Tây Nguyên với hương vị tinh tế, chua nhẹ, hương hoa quả đặc trưng",
              price: "4.20 USD/kg",
              category: "Arabica"
            },
            {
              id: "3",
              name: "Cà Phê Chồn", 
              description: "Cà phê chồn cao cấp với hương vị độc đáo, được chế biến tự nhiên qua hệ tiêu hóa của chồn",
              price: "150 USD/kg",
              category: "Premium"
            }
          ]).map((product, index) => (
            <Card
              key={product.id || index}
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Product Image */}
              <div className="h-48 overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Coffee 
                      className="group-hover:scale-110 transition-transform duration-300" 
                      size={64}
                      style={{ color: theme.colors.primary }}
                    />
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 
                    className="text-xl font-bold"
                    style={{ color: theme.colors.text }}
                  >
                    {product.name}
                  </h3>
                  {product.category && (
                    <span 
                      className="px-3 py-1 rounded-full text-sm font-semibold"
                      style={{ 
                        backgroundColor: `${theme.colors.accent}2A`,
                        color: theme.colors.primary
                      }}
                    >
                      {product.category}
                    </span>
                  )}
                </div>
                
                <p 
                  className="mb-4"
                  style={{ color: theme.colors.muted || '#718096' }}
                >
                  {product.description}
                </p>
                
                {product.price && (
                  <div 
                    className="text-xl font-bold mb-4"
                    style={{ color: theme.colors.primary }}
                  >
                    {product.price}
                  </div>
                )}
                
                <Button 
                  variant="outline" 
                  className="w-full group"
                  style={{
                    borderColor: theme.colors.primary,
                    color: theme.colors.primary
                  }}
                >
                  Tìm hiểu thêm
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card 
            className="p-8 border-2 max-w-3xl mx-auto"
            style={{
              backgroundColor: 'rgba(255,255,255,0.8)',
              borderColor: `${theme.colors.primary}33`
            }}
          >
            <h3 
              className="text-2xl font-bold mb-4"
              style={{ color: theme.colors.text }}
            >
              Cần tư vấn dịch vụ phù hợp?
            </h3>
            <p 
              className="mb-6"
              style={{ color: theme.colors.muted || '#718096' }}
            >
              Đội ngũ chuyên gia của chúng tôi sẽ tư vấn miễn phí về gói dịch vụ 
              phù hợp nhất với nhu cầu và quy mô của doanh nghiệp bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="premium" 
                size="lg"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: '#FFFFFF'
                }}
              >
                Tư vấn miễn phí
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                style={{
                  borderColor: theme.colors.primary,
                  color: theme.colors.primary
                }}
              >
                Xem báo giá
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProductsServices; 