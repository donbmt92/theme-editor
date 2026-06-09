import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ImageUpload from '@/components/ui/image-upload'
import { ThemeParams } from '@/types'
import { Plus, Trash2, Package, Truck, FileCheck, Users, Lightbulb, Shield, TrendingUp, FileText, Coffee } from 'lucide-react'
import { useState } from 'react'

interface ProductsTabProps {
  themeParams: ThemeParams
  updateThemeParam: (path: string[], value: string | number | unknown) => void
}

interface ProductsContent {
  variant?: 'alternating' | 'grid' | 'featured';
  title?: string;
  description?: string;
  backgroundColor?: string;
  textColor?: string;
  primaryColor?: string;
  colorMode?: 'theme' | 'custom';
  titleSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  titleWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  descriptionSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  descriptionWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  items?: ProductItem[];
  services?: ServiceItem[];
}

interface ProductItem {
  id?: string;
  name: string;
  description: string;
  price?: string;
  category?: string;
  image?: string;
}

interface ServiceItem {
  id?: string;
  name: string;
  description: string;
  icon?: string;
  cta?: string;
  features?: string[];
}

const ProductsTab = ({ themeParams, updateThemeParam }: ProductsTabProps) => {
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', category: '', image: '' })
  const [newService, setNewService] = useState({ name: '', description: '', icon: 'Package', cta: '', features: [''] })

  const products: ProductsContent = themeParams.content?.products || {}
  const productsItems = products.items || []
  const services = products.services || []

  const addProduct = () => {
    if (newProduct.name && newProduct.description) {
      const updatedProducts = [...productsItems, {
        id: `product-${Date.now()}`,
        ...newProduct
      }]
      updateThemeParam(['content', 'products', 'items'], updatedProducts)
      setNewProduct({ name: '', description: '', price: '', category: '', image: '' })
    }
  }

  const removeProduct = (index: number) => {
    const updatedProducts = productsItems.filter((_, i) => i !== index)
    updateThemeParam(['content', 'products', 'items'], updatedProducts)
  }

  const addService = () => {
    if (newService.name && newService.description) {
      const updatedServices = [...services, {
        id: `service-${Date.now()}`,
        ...newService
      }]
      updateThemeParam(['content', 'products', 'services'], updatedServices)
      setNewService({ name: '', description: '', icon: 'Package', cta: '', features: [''] })
    }
  }

  const removeService = (index: number) => {
    const updatedServices = services.filter((_, i) => i !== index)
    updateThemeParam(['content', 'products', 'services'], updatedServices)
  }

  const addServiceFeature = (serviceIndex: number) => {
    const updatedServices = [...services]
    updatedServices[serviceIndex].features = [...(updatedServices[serviceIndex].features || []), '']
    updateThemeParam(['content', 'products', 'services'], updatedServices)
  }

  const removeServiceFeature = (serviceIndex: number, featureIndex: number) => {
    const updatedServices = [...services]
    updatedServices[serviceIndex].features = updatedServices[serviceIndex].features?.filter((_, i) => i !== featureIndex) || []
    updateThemeParam(['content', 'products', 'services'], updatedServices)
  }

  const updateServiceFeature = (serviceIndex: number, featureIndex: number, value: string) => {
    const updatedServices = [...services]
    if (updatedServices[serviceIndex]?.features) {
      updatedServices[serviceIndex].features![featureIndex] = value
      updateThemeParam(['content', 'products', 'services'], updatedServices)
    }
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Package': return Package
      case 'Truck': return Truck
      case 'FileCheck': return FileCheck
      case 'Users': return Users
      case 'Lightbulb': return Lightbulb
      case 'Shield': return Shield
      case 'TrendingUp': return TrendingUp
      case 'FileText': return FileText
      case 'Coffee': return Coffee
      default: return Package
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Swap section</h3>
        <div>
          <Label htmlFor="productsVariant">Kieu hien thi san pham</Label>
          <Select
            value={products.variant || 'alternating'}
            onValueChange={(value) => updateThemeParam(['content', 'products', 'variant'], value)}
          >
            <SelectTrigger id="productsVariant">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alternating">Alternating rows</SelectItem>
              <SelectItem value="grid">Product grid</SelectItem>
              <SelectItem value="featured">Featured first</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>
      {/* Nội dung chính */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Nội dung chính</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Tiêu đề section</Label>
            <Input
              id="title"
              value={products.title || ''}
              onChange={(e) => updateThemeParam(['content', 'products', 'title'], e.target.value)}
              placeholder="Giải Pháp Xuất Nhập Khẩu Toàn Diện"
            />
          </div>

          <div>
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={products.description || ''}
              onChange={(e) => updateThemeParam(['content', 'products', 'description'], e.target.value)}
              placeholder="Mô tả về các sản phẩm và dịch vụ mà bạn cung cấp"
              rows={3}
            />
          </div>
        </div>
      </Card>

      {/* Màu sắc */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Màu sắc</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="colorMode">Chế độ màu</Label>
            <Select
              value={products.colorMode || 'theme'}
              onValueChange={(value) => updateThemeParam(['content', 'products', 'colorMode'], value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="theme">Sử dụng màu chủ đề</SelectItem>
                <SelectItem value="custom">Màu tùy chỉnh</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {products.colorMode === 'custom' && (
            <>
              <div>
                <Label htmlFor="backgroundColor">Màu nền section</Label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={products.backgroundColor || '#F8F9FA'}
                    onChange={(e) => updateThemeParam(['content', 'products', 'backgroundColor'], e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={products.backgroundColor || '#F8F9FA'}
                    onChange={(e) => updateThemeParam(['content', 'products', 'backgroundColor'], e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="textColor">Màu chữ</Label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={products.textColor || '#000000'}
                    onChange={(e) => updateThemeParam(['content', 'products', 'textColor'], e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={products.textColor || '#000000'}
                    onChange={(e) => updateThemeParam(['content', 'products', 'textColor'], e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="primaryColor">Màu chính</Label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={products.primaryColor || '#2563EB'}
                    onChange={(e) => updateThemeParam(['content', 'products', 'primaryColor'], e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={products.primaryColor || '#2563EB'}
                    onChange={(e) => updateThemeParam(['content', 'products', 'primaryColor'], e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </Card>



      {/* Danh sách sản phẩm */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Danh sách sản phẩm</h3>
        <div className="space-y-4">
          {productsItems.map((product, index) => (
            <div key={product.id || index} className="border rounded-lg p-4 bg-blue-50">
              <div className="flex items-center space-x-3 mb-3">
                <Coffee className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Sản phẩm {index + 1}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeProduct(index)}
                  className="text-red-600 hover:text-red-700 ml-auto"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <Label htmlFor={`product-name-${index}`}>Tên sản phẩm</Label>
                  <Input
                    id={`product-name-${index}`}
                    value={product.name}
                    onChange={(e) => {
                      const updatedProducts = [...productsItems]
                      updatedProducts[index] = { ...product, name: e.target.value }
                      updateThemeParam(['content', 'products', 'items'], updatedProducts)
                    }}
                    placeholder="Tên sản phẩm"
                  />
                </div>

                <div>
                  <Label htmlFor={`product-category-${index}`}>Danh mục</Label>
                  <Input
                    id={`product-category-${index}`}
                    value={product.category || ''}
                    onChange={(e) => {
                      const updatedProducts = [...productsItems]
                      updatedProducts[index] = { ...product, category: e.target.value }
                      updateThemeParam(['content', 'products', 'items'], updatedProducts)
                    }}
                    placeholder="Danh mục sản phẩm"
                  />
                </div>
              </div>

              <div className="mb-3">
                <Label htmlFor={`product-description-${index}`}>Mô tả</Label>
                <Textarea
                  id={`product-description-${index}`}
                  value={product.description}
                  onChange={(e) => {
                    const updatedProducts = [...productsItems]
                    updatedProducts[index] = { ...product, description: e.target.value }
                    updateThemeParam(['content', 'products', 'items'], updatedProducts)
                  }}
                  placeholder="Mô tả chi tiết về sản phẩm"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`product-price-${index}`}>Giá</Label>
                  <Input
                    id={`product-price-${index}`}
                    value={product.price || ''}
                    onChange={(e) => {
                      const updatedProducts = [...productsItems]
                      updatedProducts[index] = { ...product, price: e.target.value }
                      updateThemeParam(['content', 'products', 'items'], updatedProducts)
                    }}
                    placeholder="Giá sản phẩm"
                  />
                </div>

                <div>
                  <Label htmlFor={`product-image-${index}`}>Hình ảnh</Label>
                  <ImageUpload
                    value={product.image || ''}
                    onChange={(imageUrl) => {
                      const updatedProducts = [...productsItems]
                      updatedProducts[index] = { ...product, image: imageUrl }
                      updateThemeParam(['content', 'products', 'items'], updatedProducts)
                    }}
                    placeholder="Chọn hình ảnh"
                  />
                </div>
              </div>

              {/* Preview hình ảnh */}
              {product.image && (
                <div className="mt-3">
                  <Label>Xem trước hình ảnh</Label>
                  <div className="mt-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <h4 className="font-medium mb-3">Thêm sản phẩm mới</h4>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <Label htmlFor="new-product-name">Tên sản phẩm</Label>
                <Input
                  id="new-product-name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Tên sản phẩm mới"
                />
              </div>

              <div>
                <Label htmlFor="new-product-category">Danh mục</Label>
                <Input
                  id="new-product-category"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  placeholder="Danh mục sản phẩm"
                />
              </div>
            </div>

            <div className="mb-3">
              <Label htmlFor="new-product-description">Mô tả</Label>
              <Textarea
                id="new-product-description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Mô tả chi tiết về sản phẩm mới"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <Label htmlFor="new-product-price">Giá</Label>
                <Input
                  id="new-product-price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="Giá sản phẩm"
                />
              </div>

              <div>
                <Label htmlFor="new-product-image">Hình ảnh</Label>
                <ImageUpload
                  value={newProduct.image}
                  onChange={(imageUrl) => setNewProduct({ ...newProduct, image: imageUrl })}
                  placeholder="Chọn hình ảnh"
                />
              </div>
            </div>

            {/* Preview hình ảnh cho sản phẩm mới */}
            {newProduct.image && (
              <div className="mb-3">
                <Label>Xem trước hình ảnh</Label>
                <div className="mt-2">
                  <img
                    src={newProduct.image}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              </div>
            )}

            <Button onClick={addProduct} size="sm" className="w-full">
              <Plus className="w-4 h-4 mr-1" />
              Thêm sản phẩm
            </Button>
          </div>
        </div>
      </Card>

      {/* Danh sách dịch vụ */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Danh sách dịch vụ</h3>
        <div className="space-y-4">
          {services.map((service, index) => (
            <div key={service.id || index} className="border rounded-lg p-4 bg-green-50">
              <div className="flex items-center space-x-3 mb-3">
                {(() => {
                  const IconComponent = getIconComponent(service.icon || 'Package')
                  return <IconComponent className="h-5 w-5 text-green-600" />
                })()}
                <span className="text-sm font-medium text-gray-600">Dịch vụ {index + 1}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeService(index)}
                  className="text-red-600 hover:text-red-700 ml-auto"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <Label htmlFor={`service-icon-${index}`}>Icon</Label>
                  <Select
                    value={service.icon || 'Package'}
                    onValueChange={(value) => {
                      const updatedServices = [...services]
                      updatedServices[index] = { ...service, icon: value }
                      updateThemeParam(['content', 'products', 'services'], updatedServices)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Package">📦 Gói hàng</SelectItem>
                      <SelectItem value="Truck">🚚 Vận chuyển</SelectItem>
                      <SelectItem value="FileCheck">📋 Kiểm tra</SelectItem>
                      <SelectItem value="Users">👥 Người dùng</SelectItem>
                      <SelectItem value="Lightbulb">💡 Ý tưởng</SelectItem>
                      <SelectItem value="Shield">🛡️ Bảo vệ</SelectItem>
                      <SelectItem value="TrendingUp">📈 Xu hướng</SelectItem>
                      <SelectItem value="FileText">📄 Tài liệu</SelectItem>
                      <SelectItem value="Coffee">☕ Cà phê</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2">
                  <Label htmlFor={`service-name-${index}`}>Tên dịch vụ</Label>
                  <Input
                    id={`service-name-${index}`}
                    value={service.name}
                    onChange={(e) => {
                      const updatedServices = [...services]
                      updatedServices[index] = { ...service, name: e.target.value }
                      updateThemeParam(['content', 'products', 'services'], updatedServices)
                    }}
                    placeholder="Tên dịch vụ"
                  />
                </div>
              </div>

              <div className="mb-3">
                <Label htmlFor={`service-description-${index}`}>Mô tả</Label>
                <Textarea
                  id={`service-description-${index}`}
                  value={service.description}
                  onChange={(e) => {
                    const updatedServices = [...services]
                    updatedServices[index] = { ...service, description: e.target.value }
                    updateThemeParam(['content', 'products', 'services'], updatedServices)
                  }}
                  placeholder="Mô tả chi tiết về dịch vụ"
                  rows={2}
                />
              </div>

              <div className="mb-3">
                <Label htmlFor={`service-cta-${index}`}>Nút CTA</Label>
                <Input
                  id={`service-cta-${index}`}
                  value={service.cta || ''}
                  onChange={(e) => {
                    const updatedServices = [...services]
                    updatedServices[index] = { ...service, cta: e.target.value }
                    updateThemeParam(['content', 'products', 'services'], updatedServices)
                  }}
                  placeholder="Văn bản nút CTA"
                />
              </div>

              <div>
                <Label>Tính năng dịch vụ</Label>
                <div className="space-y-2 mt-2">
                  {(service.features || []).map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <Input
                        value={feature}
                        onChange={(e) => updateServiceFeature(index, featureIndex, e.target.value)}
                        placeholder="Tính năng dịch vụ"
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeServiceFeature(index, featureIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addServiceFeature(index)}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Thêm tính năng
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <h4 className="font-medium mb-3">Thêm dịch vụ mới</h4>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <Label htmlFor="new-service-icon">Icon</Label>
                <Select
                  value={newService.icon}
                  onValueChange={(value) => setNewService({ ...newService, icon: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Package">📦 Gói hàng</SelectItem>
                    <SelectItem value="Truck">🚚 Vận chuyển</SelectItem>
                    <SelectItem value="FileCheck">📋 Kiểm tra</SelectItem>
                    <SelectItem value="Users">👥 Người dùng</SelectItem>
                    <SelectItem value="Lightbulb">💡 Ý tưởng</SelectItem>
                    <SelectItem value="Shield">🛡️ Bảo vệ</SelectItem>
                    <SelectItem value="TrendingUp">📈 Xu hướng</SelectItem>
                    <SelectItem value="FileText">📄 Tài liệu</SelectItem>
                    <SelectItem value="Coffee">☕ Cà phê</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="new-service-name">Tên dịch vụ</Label>
                <Input
                  id="new-service-name"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  placeholder="Tên dịch vụ mới"
                />
              </div>
            </div>

            <div className="mb-3">
              <Label htmlFor="new-service-description">Mô tả</Label>
              <Textarea
                id="new-service-description"
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                placeholder="Mô tả chi tiết về dịch vụ mới"
                rows={2}
              />
            </div>

            <div className="mb-3">
              <Label>Tính năng dịch vụ</Label>
              <div className="space-y-2 mt-2">
                {newService.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center space-x-2">
                    <Input
                      value={feature}
                      onChange={(e) => {
                        const updatedFeatures = [...newService.features]
                        updatedFeatures[featureIndex] = e.target.value
                        setNewService({ ...newService, features: updatedFeatures })
                      }}
                      placeholder="Tính năng dịch vụ"
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const updatedFeatures = newService.features.filter((_, i) => i !== featureIndex)
                        setNewService({ ...newService, features: updatedFeatures })
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNewService({ ...newService, features: [...newService.features, ''] })}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm tính năng
                </Button>
              </div>
            </div>

            <Button onClick={addService} size="sm" className="w-full">
              <Plus className="w-4 h-4 mr-1" />
              Thêm dịch vụ
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ProductsTab
