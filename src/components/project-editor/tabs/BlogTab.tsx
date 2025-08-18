import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ThemeParams } from '@/types'
import { Plus, Trash2, Calendar, User, TrendingUp } from 'lucide-react'

interface BlogTabProps {
  themeParams: ThemeParams
  updateThemeParam: (path: string[], value: string | number | unknown) => void
}

const BlogTab = ({ themeParams, updateThemeParam }: BlogTabProps) => {
  const addBlogPost = () => {
    const currentPosts = themeParams?.content?.blog?.posts || []
    const newPost = {
      title: '',
      excerpt: '',
      category: '',
      author: '',
      date: '',
      readTime: '',
      image: '',
      featured: false
    }
    updateThemeParam(['content', 'blog', 'posts'], [...currentPosts, newPost])
  }

  const removeBlogPost = (index: number) => {
    const currentPosts = themeParams?.content?.blog?.posts || []
    const newPosts = currentPosts.filter((_, i) => i !== index)
    updateThemeParam(['content', 'blog', 'posts'], newPosts)
  }

  const updateBlogPost = (index: number, field: string, value: string | boolean) => {
    const currentPosts = themeParams?.content?.blog?.posts || []
    const updatedPosts = currentPosts.map((post, i) => 
      i === index ? { ...post, [field]: value } : post
    )
    updateThemeParam(['content', 'blog', 'posts'], updatedPosts)
  }

  const addCategory = () => {
    const currentCategories = themeParams?.content?.blog?.categories || []
    const newCategory = { name: '', count: 0, color: '#8B4513' }
    updateThemeParam(['content', 'blog', 'categories'], [...currentCategories, newCategory])
  }

  const removeCategory = (index: number) => {
    const currentCategories = themeParams?.content?.blog?.categories || []
    const newCategories = currentCategories.filter((_, i) => i !== index)
    updateThemeParam(['content', 'blog', 'categories'], newCategories)
  }

  const updateCategory = (index: number, field: string, value: string | number) => {
    const currentCategories = themeParams?.content?.blog?.categories || []
    const updatedCategories = currentCategories.map((category, i) => 
      i === index ? { ...category, [field]: value } : category
    )
    updateThemeParam(['content', 'blog', 'categories'], updatedCategories)
  }

  return (
    <div className="space-y-6">
      {/* Header Settings */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Cài đặt chung</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tiêu đề</label>
            <Input
              value={themeParams?.content?.blog?.title || ''}
              onChange={(e) => updateThemeParam(['content', 'blog', 'title'], e.target.value)}
              placeholder="Thông Tin Ngành Mới Nhất"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phụ đề</label>
            <Textarea
              value={themeParams?.content?.blog?.subtitle || ''}
              onChange={(e) => updateThemeParam(['content', 'blog', 'subtitle'], e.target.value)}
              placeholder="Cập nhật thông tin với tin tức mới nhất, xu hướng thị trường và chuyên môn về xuất khẩu cà phê Việt Nam và thị trường nhập khẩu Mỹ."
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Màu nền</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={themeParams?.content?.blog?.backgroundColor || '#F8F9FA'}
                  onChange={(e) => updateThemeParam(['content', 'blog', 'backgroundColor'], e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300"
                />
                <Input
                  value={themeParams?.content?.blog?.backgroundColor || '#F8F9FA'}
                  onChange={(e) => updateThemeParam(['content', 'blog', 'backgroundColor'], e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Màu chữ</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={themeParams?.content?.blog?.textColor || '#2D3748'}
                  onChange={(e) => updateThemeParam(['content', 'blog', 'textColor'], e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300"
                />
                <Input
                  value={themeParams?.content?.blog?.textColor || '#2D3748'}
                  onChange={(e) => updateThemeParam(['content', 'blog', 'textColor'], e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Featured Post Settings */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Bài viết nổi bật</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tiêu đề bài viết nổi bật</label>
            <Input
              value={themeParams?.content?.blog?.featuredPost?.title || ''}
              onChange={(e) => updateThemeParam(['content', 'blog', 'featuredPost', 'title'], e.target.value)}
              placeholder="Triển Vọng Thị Trường Cà Phê 2024: Xu Hướng Nhập Khẩu Mỹ & Dự Báo Giá"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tóm tắt bài viết nổi bật</label>
            <Textarea
              value={themeParams?.content?.blog?.featuredPost?.excerpt || ''}
              onChange={(e) => updateThemeParam(['content', 'blog', 'featuredPost', 'excerpt'], e.target.value)}
              placeholder="Phân tích toàn diện thị trường cà phê Mỹ bao gồm dự báo nhu cầu, xu hướng giá cả và các yếu tố chính ảnh hưởng đến nhập khẩu từ Việt Nam."
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tác giả</label>
              <Input
                value={themeParams?.content?.blog?.featuredPost?.author || ''}
                onChange={(e) => updateThemeParam(['content', 'blog', 'featuredPost', 'author'], e.target.value)}
                placeholder="Sarah Johnson"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ngày đăng</label>
              <Input
                value={themeParams?.content?.blog?.featuredPost?.date || ''}
                onChange={(e) => updateThemeParam(['content', 'blog', 'featuredPost', 'date'], e.target.value)}
                placeholder="15 Tháng 1, 2024"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Thời gian đọc</label>
              <Input
                value={themeParams?.content?.blog?.featuredPost?.readTime || ''}
                onChange={(e) => updateThemeParam(['content', 'blog', 'featuredPost', 'readTime'], e.target.value)}
                placeholder="8 phút đọc"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hình ảnh</label>
              <Input
                value={themeParams?.content?.blog?.featuredPost?.image || ''}
                onChange={(e) => updateThemeParam(['content', 'blog', 'featuredPost', 'image'], e.target.value)}
                placeholder="URL hình ảnh (600x400px)"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Blog Posts List */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Danh sách bài viết</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={addBlogPost}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Thêm bài viết
          </Button>
        </div>
        <div className="space-y-4">
          {(themeParams?.content?.blog?.posts || []).map((post, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Bài viết {index + 1}</h4>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeBlogPost(index)}
                  className="flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Xóa
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tiêu đề</label>
                  <Input
                    value={post.title || ''}
                    onChange={(e) => updateBlogPost(index, 'title', e.target.value)}
                    placeholder="Tiêu đề bài viết"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Danh mục</label>
                  <Input
                    value={post.category || ''}
                    onChange={(e) => updateBlogPost(index, 'category', e.target.value)}
                    placeholder="Phân Tích Thị Trường"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tác giả</label>
                  <Input
                    value={post.author || ''}
                    onChange={(e) => updateBlogPost(index, 'author', e.target.value)}
                    placeholder="Tên tác giả"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ngày đăng</label>
                  <Input
                    value={post.date || ''}
                    onChange={(e) => updateBlogPost(index, 'date', e.target.value)}
                    placeholder="10 Tháng 1, 2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Thời gian đọc</label>
                  <Input
                    value={post.readTime || ''}
                    onChange={(e) => updateBlogPost(index, 'readTime', e.target.value)}
                    placeholder="6 phút đọc"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hình ảnh</label>
                  <Input
                    value={post.image || ''}
                    onChange={(e) => updateBlogPost(index, 'image', e.target.value)}
                    placeholder="URL hình ảnh (600x400px)"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Tóm tắt</label>
                  <Textarea
                    value={post.excerpt || ''}
                    onChange={(e) => updateBlogPost(index, 'excerpt', e.target.value)}
                    placeholder="Tóm tắt nội dung bài viết"
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`featured-${index}`}
                      checked={post.featured || false}
                      onChange={(e) => updateBlogPost(index, 'featured', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor={`featured-${index}`} className="text-sm font-medium">
                      Bài viết nổi bật
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Categories List */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Danh mục bài viết</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={addCategory}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Thêm danh mục
          </Button>
        </div>
        <div className="space-y-4">
          {(themeParams?.content?.blog?.categories || []).map((category, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Danh mục {index + 1}</h4>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeCategory(index)}
                  className="flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Xóa
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tên danh mục</label>
                  <Input
                    value={category.name || ''}
                    onChange={(e) => updateCategory(index, 'name', e.target.value)}
                    placeholder="Phân Tích Thị Trường"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Số bài viết</label>
                  <Input
                    type="number"
                    value={category.count || 0}
                    onChange={(e) => updateCategory(index, 'count', parseInt(e.target.value))}
                    placeholder="12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Màu sắc</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={category.color || '#8B4513'}
                      onChange={(e) => updateCategory(index, 'color', e.target.value)}
                      className="w-12 h-10 rounded border border-gray-300"
                    />
                    <Input
                      value={category.color || '#8B4513'}
                      onChange={(e) => updateCategory(index, 'color', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Newsletter Settings */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Cài đặt Newsletter</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tiêu đề newsletter</label>
            <Input
              value={themeParams?.content?.blog?.newsletter?.title || ''}
              onChange={(e) => updateThemeParam(['content', 'blog', 'newsletter', 'title'], e.target.value)}
              placeholder="Cập Nhật Thông Tin Thị Trường"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Mô tả newsletter</label>
            <Textarea
              value={themeParams?.content?.blog?.newsletter?.description || ''}
              onChange={(e) => updateThemeParam(['content', 'blog', 'newsletter', 'description'], e.target.value)}
              placeholder="Đăng ký nhận bản tin hàng tuần để có thông tin mới nhất về xu hướng thị trường cà phê, mẹo nhập khẩu và cập nhật ngành."
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Placeholder email</label>
              <Input
                value={themeParams?.content?.blog?.newsletter?.placeholder || ''}
                onChange={(e) => updateThemeParam(['content', 'blog', 'newsletter', 'placeholder'], e.target.value)}
                placeholder="Nhập địa chỉ email của bạn"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Text nút đăng ký</label>
              <Input
                value={themeParams?.content?.blog?.newsletter?.buttonText || ''}
                onChange={(e) => updateThemeParam(['content', 'blog', 'newsletter', 'buttonText'], e.target.value)}
                placeholder="Đăng Ký"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Text footer</label>
            <Textarea
              value={themeParams?.content?.blog?.newsletter?.footerText || ''}
              onChange={(e) => updateThemeParam(['content', 'blog', 'newsletter', 'footerText'], e.target.value)}
              placeholder="Tham gia cùng 2,000+ nhà nhập khẩu nhận thông tin thị trường hàng tuần. Hủy đăng ký bất cứ lúc nào."
              rows={2}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}

export default BlogTab
