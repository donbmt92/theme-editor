import { BlogParams } from "../../types";
import { renderLucideIcon } from "../icons";

interface BlogPost {
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

interface Category {
  name: string;
  count: number;
  color?: string;
}

interface BlogContentExtended {
  [key: string]: string | number | boolean | undefined | Array<BlogPost> | Array<Category>;
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  textColor?: string;
  colorMode?: 'theme' | 'custom';
  primaryColor?: string;
  titleSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  titleWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  titleFont?: 'inter' | 'poppins' | 'roboto' | 'open-sans' | 'montserrat' | 'lato' | 'nunito' | 'raleway' | 'playfair-display' | 'merriweather';
  subtitleSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  subtitleWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  subtitleFont?: 'inter' | 'poppins' | 'roboto' | 'open-sans' | 'montserrat' | 'lato' | 'nunito' | 'raleway' | 'playfair-display' | 'merriweather';
  blogPosts?: BlogPost[];
  featuredPost?: Partial<BlogPost>;
  posts?: Array<Partial<BlogPost>>;
  categories?: Category[];
  newsletter?: {
    title: string;
    description: string;
    placeholder: string;
    buttonText: string;
    footerText?: string;
  };
}

/**
 * Generate static blog section HTML with enhanced customization support
 */
export function generateStaticBlogSection({
  content,
  themeParams,
}: BlogParams): string {
  const getTypographyStyles = () => {
    return {
      fontFamily:
        themeParams?.typography?.fontFamily ||
        'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      fontSize: themeParams?.typography?.fontSize || "16px",
      lineHeight: themeParams?.typography?.lineHeight || "1.6",
      fontWeight: themeParams?.typography?.fontWeight || "400",
    };
  };

  // Get font family based on blog content settings
  const getFontFamily = (fontType: string) => {
    const blogContent = content as BlogContentExtended;
    const fontName = blogContent?.[fontType] || "inter";

    switch (fontName) {
      case "inter":
        return '"Inter", ui-sans-serif, system-ui, sans-serif';
      case "poppins":
        return '"Poppins", ui-sans-serif, system-ui, sans-serif';
      case "roboto":
        return '"Roboto", ui-sans-serif, system-ui, sans-serif';
      case "open-sans":
        return '"Open Sans", ui-sans-serif, system-ui, sans-serif';
      case "montserrat":
        return '"Montserrat", ui-sans-serif, system-ui, sans-serif';
      case "lato":
        return '"Lato", ui-sans-serif, system-ui, sans-serif';
      case "nunito":
        return '"Nunito", ui-sans-serif, system-ui, sans-serif';
      case "raleway":
        return '"Raleway", ui-sans-serif, system-ui, sans-serif';
      case "playfair-display":
        return '"Playfair Display", ui-serif, Georgia, serif';
      case "merriweather":
        return '"Merriweather", ui-serif, Georgia, serif';
      default:
        return '"Inter", ui-sans-serif, system-ui, sans-serif';
    }
  };

  // Get font size based on blog content settings
  const getFontSize = (sizeType: string, defaultSize: string) => {
    const blogContent = content as BlogContentExtended;
    const size = blogContent?.[sizeType];

    switch (size) {
      case "xs":
        return "0.75rem";    // text-xs
      case "sm":
        return "0.875rem";   // text-sm
      case "base":
        return "1rem";       // text-base
      case "lg":
        return "1.125rem";   // text-lg
      case "xl":
        return "1.25rem";    // text-xl
      case "2xl":
        return "1.5rem";     // text-2xl
      case "3xl":
        return "1.875rem";   // text-3xl
      default:
        return defaultSize;
    }
  };

  // Get title size - matches BlogSection.tsx getTitleSize function
  const getTitleSize = () => {
    const blogContent = content as BlogContentExtended;
    const size = blogContent?.titleSize || themeParams?.typography?.headingSize || '2xl';
    
    switch (size) {
      case "sm":
        return "1.5rem";     // text-2xl
      case "base":
        return "1.875rem";   // text-3xl
      case "lg":
        return "2.25rem";    // text-4xl
      case "xl":
        return "3rem";       // text-5xl
      case "2xl":
        return "3.75rem";    // text-6xl
      case "3xl":
        return "4.5rem";     // text-7xl
      default:
        return "2.25rem";    // default text-4xl
    }
  };

  // Get subtitle size - matches BlogSection.tsx getSubtitleSize function
  const getSubtitleSize = () => {
    const blogContent = content as BlogContentExtended;
    const size = blogContent?.subtitleSize || themeParams?.typography?.bodySize || 'base';
    
    switch (size) {
      case "xs":
        return "1rem";       // text-base
      case "sm":
        return "1.125rem";   // text-lg
      case "lg":
        return "1.25rem";    // text-xl
      case "xl":
        return "1.5rem";     // text-2xl
      case "base":
      default:
        return "1.25rem";    // default text-xl
    }
  };

  // Get font weight based on blog content settings
  const getFontWeight = (weightType: string, defaultWeight: string) => {
    const blogContent = content as BlogContentExtended;
    const weight = blogContent?.[weightType];

    switch (weight) {
      case "light":
        return "300";
      case "normal":
        return "400";
      case "medium":
        return "500";
      case "semibold":
        return "600";
      case "bold":
        return "700";
      case "extrabold":
        return "800";
      case "black":
        return "900";
      default:
        return defaultWeight;
    }
  };

  const getBorderRadiusClass = () => {
    switch (themeParams?.layout?.borderRadius) {
      case "none":
        return "0";
      case "small":
        return "0.125rem";
      case "large":
        return "0.5rem";
      case "medium":
      default:
        return "0.375rem";
    }
  };

  const typographyStyles = getTypographyStyles();
  const borderRadius = getBorderRadiusClass();

  // Default blog posts data
  const defaultBlogPosts: BlogPost[] = [
    {
      title: "Triển Vọng Thị Trường Cà Phê 2024: Xu Hướng Nhập Khẩu Mỹ & Dự Báo Giá",
      excerpt: "Phân tích toàn diện thị trường cà phê Mỹ bao gồm dự báo nhu cầu, xu hướng giá cả và các yếu tố chính ảnh hưởng đến nhập khẩu từ Việt Nam.",
      category: "Phân Tích Thị Trường",
      author: "Sarah Johnson",
      date: "15 Tháng 1, 2024",
      readTime: "8 phút đọc",
      image: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=600&h=400&fit=crop",
      featured: true
    },
    {
      title: "Quy Định FDA Mới Cho Nhập Khẩu Cà Phê: Những Điều Bạn Cần Biết",
      excerpt: "Cập nhật yêu cầu FDA cho nhập khẩu cà phê có hiệu lực 2024, bao gồm thay đổi tài liệu và hướng dẫn tuân thủ cho nhà nhập khẩu Mỹ.",
      category: "Quy Định",
      author: "Michael Chen",
      date: "10 Tháng 1, 2024",
      readTime: "6 phút đọc",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop"
    },
    {
      title: "Cập Nhật Thu Hoạch Cà Phê Việt Nam: Đánh Giá Chất Lượng & Dự Báo Sản Lượng",
      excerpt: "Cập nhật mới nhất từ các vùng trồng cà phê Việt Nam bao gồm đánh giá chất lượng thu hoạch và dự báo sản lượng cho năm 2024.",
      category: "Chuỗi Cung Ứng",
      author: "Nguyễn Trần",
      date: "8 Tháng 1, 2024",
      readTime: "5 phút đọc",
      image: "https://images.unsplash.com/photo-1588155487507-a5e9ce8b1987?w=600&h=400&fit=crop"
    },
    {
      title: "Canh Tác Cà Phê Bền Vững: Hỗ Trợ Cộng Đồng Việt Nam",
      excerpt: "Cách đối tác của chúng tôi với nông dân Việt Nam thúc đẩy thực hành bền vững trong khi đảm bảo cà phê chất lượng cao cho thị trường Mỹ.",
      category: "Bền Vững",
      author: "David Park",
      date: "5 Tháng 1, 2024",
      readTime: "7 phút đọc",
      image: "https://images.unsplash.com/photo-1594736797933-d0c3659ad253?w=600&h=400&fit=crop"
    }
  ];

  const defaultCategories: Category[] = [
    { name: "Phân Tích Thị Trường", count: 12, color: "#8B4513" },
    { name: "Quy Định", count: 8, color: "#3B82F6" },
    { name: "Chuỗi Cung Ứng", count: 15, color: "#10B981" },
    { name: "Bền Vững", count: 6, color: "#F59E0B" }
  ];

  const defaultNewsletter = {
    title: "Cập Nhật Thông Tin Thị Trường",
    description: "Đăng ký nhận bản tin hàng tuần để có thông tin mới nhất về xu hướng thị trường cà phê, mẹo nhập khẩu và cập nhật ngành.",
    placeholder: "Nhập địa chỉ email của bạn",
    buttonText: "Đăng Ký",
    footerText: "Tham gia cùng 2,000+ nhà nhập khẩu nhận thông tin thị trường hàng tuần. Hủy đăng ký bất cứ lúc nào."
  };

  // Build blog posts from content
  const toBlogPost = (p: Partial<BlogPost>): BlogPost => ({
    title: p.title || '',
    excerpt: p.excerpt || '',
    category: p.category || '',
    author: p.author || '',
    date: p.date || '',
    readTime: p.readTime || '',
    image: p.image || '',
    featured: p.featured,
  });

  const blogContent = content as BlogContentExtended;
  const composed: BlogPost[] = [];
  if (blogContent.featuredPost && (blogContent.featuredPost.title || blogContent.featuredPost.image)) {
    composed.push({ ...toBlogPost(blogContent.featuredPost), featured: true });
  }
  if (Array.isArray(blogContent.posts)) {
    composed.push(...blogContent.posts.map((p) => toBlogPost(p)));
  }

  const blogPosts = composed.length > 0 ? composed : (blogContent.blogPosts || defaultBlogPosts);
  const categories = blogContent.categories || defaultCategories;
  const newsletter = blogContent.newsletter || defaultNewsletter;

  return `<section id="blog" style="
    padding: 5rem 0;
    background-color: ${
      blogContent?.colorMode === 'custom' && blogContent?.backgroundColor
        ? blogContent.backgroundColor
        : themeParams?.sections?.blog?.backgroundColor || themeParams?.colors?.background || "#F8F9FA"
    };
    color: ${
      blogContent?.colorMode === 'custom' && blogContent?.textColor
        ? blogContent.textColor
        : themeParams?.colors?.text || "#2D3748"
    };
    font-family: ${typographyStyles.fontFamily};
    font-size: ${typographyStyles.fontSize};
    line-height: ${typographyStyles.lineHeight};
    font-weight: ${typographyStyles.fontWeight};
  ">
    <div style="
      max-width: ${themeParams?.layout?.containerWidth || "1200px"}; 
      margin: 0 auto; 
      padding: 0 1rem;
    ">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 4rem;">
        <h2 style="
          color: ${blogContent?.colorMode === 'custom' && blogContent?.textColor ? blogContent.textColor : themeParams?.colors?.text || "#2D3748"};
          font-family: ${getFontFamily("titleFont").replace(/"/g, "'")};
          font-size: ${getTitleSize()};
          font-weight: ${getFontWeight("titleWeight", themeParams?.typography?.fontWeight || "700")};
          line-height: 1.2;
          margin: 0 0 1rem 0;
        ">
          ${blogContent?.title || "Thông Tin Ngành Mới Nhất"}
        </h2>
        <p style="
          color: ${blogContent?.colorMode === 'custom' && blogContent?.textColor ? `${blogContent.textColor}E6` : `${themeParams?.colors?.text || "#2D3748"}E6`};
          font-family: ${getFontFamily("subtitleFont").replace(/"/g, "'")};
          font-size: ${getSubtitleSize()};
          font-weight: ${getFontWeight("subtitleWeight", "400")};
          line-height: 1.6;
          margin: 0;
          max-width: 48rem;
          margin: 0 auto;
        ">
          ${blogContent?.subtitle || "Cập nhật thông tin với tin tức mới nhất, xu hướng thị trường và chuyên môn về xuất khẩu cà phê Việt Nam và thị trường nhập khẩu Mỹ."}
        </p>
      </div>

      <!-- Categories -->
      <div style="
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 3rem;
      ">
        ${categories.map((category, index) => `
          <div style="
            background-color: ${category.color || themeParams?.colors?.primary || "#8B4513"}20;
            color: ${category.color || themeParams?.colors?.primary || "#8B4513"};
            padding: 0.5rem 1rem;
            border-radius: ${borderRadius};
            font-size: 0.875rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          ">
            <div style="
              width: 0.5rem;
              height: 0.5rem;
              border-radius: 50%;
              background-color: ${category.color || themeParams?.colors?.primary || "#8B4513"};
            "></div>
            ${category.name} (${category.count})
          </div>
        `).join("")}
      </div>

      <!-- Featured Post -->
      <div style="
        margin-bottom: 3rem;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        border-radius: ${borderRadius};
        overflow: hidden;
        border: 1px solid ${themeParams?.colors?.primary || "#8B4513"}20;
      ">
        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
        ">
          <div style="position: relative;">
            <img
              src="${blogPosts[0].image && blogPosts[0].image.startsWith('/uploads/') 
                ? 'assets/images/blog-featured.jpg' 
                : blogPosts[0].image}"
              alt="${blogPosts[0].title}"
              style="
                width: 100%;
                height: 20rem;
                object-fit: cover;
              "
            />
            <div style="
              position: absolute;
              top: 1rem;
              left: 1rem;
              background-color: ${blogContent?.primaryColor || themeParams?.colors?.primary || "#8B4513"};
              color: #FFFFFF;
              padding: 0.25rem 0.75rem;
              border-radius: ${borderRadius};
              font-size: 0.875rem;
              font-weight: 500;
              display: flex;
              align-items: center;
              gap: 0.25rem;
            ">
              ${renderLucideIcon("trending-up", 12)}
              Nổi Bật
            </div>
          </div>
          <div style="
            padding: 2rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
          ">
            <div style="
              background-color: ${blogContent?.primaryColor || themeParams?.colors?.primary || "#8B4513"}10;
              color: ${blogContent?.primaryColor || themeParams?.colors?.primary || "#8B4513"};
              padding: 0.25rem 0.75rem;
              border-radius: ${borderRadius};
              font-size: 0.875rem;
              width: fit-content;
              margin-bottom: 1rem;
            ">
              ${blogPosts[0].category}
            </div>
            <h3 style="
              color: ${blogContent?.textColor || themeParams?.colors?.text || "#2D3748"};
              font-family: ${getFontFamily("titleFont").replace(/"/g, "'")};
              font-size: 1.5rem;
              font-weight: ${getFontWeight("titleWeight", "700")};
              line-height: 1.3;
              margin: 0 0 1rem 0;
            ">
              ${blogPosts[0].title}
            </h3>
            <p style="
              color: ${blogContent?.textColor ? `${blogContent.textColor}CC` : `${themeParams?.colors?.text || "#2D3748"}CC`};
              line-height: 1.6;
              margin: 0 0 1.5rem 0;
            ">
              ${blogPosts[0].excerpt}
            </p>
            <div style="
              display: flex;
              align-items: center;
              font-size: 0.875rem;
              color: ${blogContent?.textColor ? `${blogContent.textColor}CC` : `${themeParams?.colors?.text || "#2D3748"}CC`};
              margin-bottom: 1.5rem;
            ">
              ${renderLucideIcon("user", 16)}
              <span style="margin-right: 1rem;">${blogPosts[0].author}</span>
              ${renderLucideIcon("calendar", 16)}
              <span style="margin-right: 1rem;">${blogPosts[0].date}</span>
              <span>${blogPosts[0].readTime}</span>
            </div>
            <button style="
              background: ${blogContent?.primaryColor ? `linear-gradient(135deg, ${blogContent.primaryColor}, ${blogContent.primaryColor}80)` : `linear-gradient(135deg, ${themeParams?.colors?.primary || "#8B4513"}, ${themeParams?.colors?.accent || "#CD853F"})`};
              color: #FFFFFF;
              border: none;
              padding: 0.75rem 1.5rem;
              border-radius: ${themeParams?.components?.button?.rounded ? "9999px" : borderRadius};
              font-family: ${getFontFamily("titleFont")};
              font-size: 1rem;
              font-weight: ${getFontWeight("titleWeight", "600")};
              cursor: pointer;
              display: flex;
              align-items: center;
              gap: 0.5rem;
              width: fit-content;
              transition: all 0.3s ease;
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            " onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 20px 40px -10px rgba(0, 0, 0, 0.2)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'">
              Đọc Bài Viết Đầy Đủ
              ${renderLucideIcon("arrow-right", 16)}
            </button>
          </div>
        </div>
      </div>

      <!-- Other Posts -->
      <div style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
      ">
        ${blogPosts.slice(1).map((post, index) => `
          <div style="
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            border-radius: ${borderRadius};
            overflow: hidden;
            transition: all 0.3s ease;
          " onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 25px 50px -12px rgba(0, 0, 0, 0.25)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'">
            <div style="position: relative;">
              <img
                src="${post.image && post.image.startsWith('/uploads/') 
                  ? 'assets/images/blog-' + (index + 1) + '.jpg' 
                  : post.image}"
                alt="${post.title}"
                style="
                  width: 100%;
                  height: 12rem;
                  object-fit: cover;
                "
              />
              <div style="
                position: absolute;
                top: 0.75rem;
                left: 0.75rem;
                background-color: ${blogContent?.primaryColor || themeParams?.colors?.primary || "#8B4513"}10;
                color: ${blogContent?.primaryColor || themeParams?.colors?.primary || "#8B4513"};
                padding: 0.25rem 0.75rem;
                border-radius: ${borderRadius};
                font-size: 0.875rem;
              ">
                ${post.category}
              </div>
            </div>
            <div style="padding: 1.5rem;">
              <h4 style="
                color: ${blogContent?.textColor || themeParams?.colors?.text || "#2D3748"};
                font-family: ${getFontFamily("titleFont").replace(/"/g, "'")};
                font-size: 1.125rem;
                font-weight: ${getFontWeight("titleWeight", "700")};
                line-height: 1.4;
                margin: 0 0 0.75rem 0;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
              ">
                ${post.title}
              </h4>
              <p style="
                color: ${blogContent?.textColor ? `${blogContent.textColor}CC` : `${themeParams?.colors?.text || "#2D3748"}CC`};
                font-size: 0.875rem;
                line-height: 1.5;
                margin: 0 0 1rem 0;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
              ">
                ${post.excerpt}
              </p>
              <div style="
                display: flex;
                align-items: center;
                font-size: 0.75rem;
                color: ${blogContent?.textColor ? `${blogContent.textColor}CC` : `${themeParams?.colors?.text || "#2D3748"}CC`};
                margin-bottom: 1rem;
              ">
                ${renderLucideIcon("user", 12)}
                <span style="margin-right: 0.75rem;">${post.author}</span>
                ${renderLucideIcon("calendar", 12)}
                <span style="margin-right: 0.75rem;">${post.date}</span>
                <span>${post.readTime}</span>
              </div>
              <button style="
                background: transparent;
                border: 2px solid ${blogContent?.primaryColor || themeParams?.colors?.primary || "#8B4513"};
                color: ${blogContent?.primaryColor || themeParams?.colors?.primary || "#8B4513"};
                padding: 0.5rem 1rem;
                border-radius: ${themeParams?.components?.button?.rounded ? "9999px" : borderRadius};
                font-family: ${getFontFamily("titleFont")};
                font-size: 0.875rem;
                font-weight: ${getFontWeight("titleWeight", "600")};
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.25rem;
                width: 100%;
                justify-content: center;
                transition: all 0.3s ease;
              " onmouseover="this.style.backgroundColor='${blogContent?.primaryColor || themeParams?.colors?.primary || "#8B4513"}'; this.style.color='#FFFFFF'" onmouseout="this.style.backgroundColor='transparent'; this.style.color='${blogContent?.primaryColor || themeParams?.colors?.primary || "#8B4513"}'">
                Đọc Thêm
                ${renderLucideIcon("arrow-right", 12)}
              </button>
            </div>
          </div>
        `).join("")}
      </div>

      <!-- Newsletter Signup -->
      <div style="
        background: ${blogContent?.primaryColor ? `linear-gradient(135deg, ${blogContent.primaryColor}, ${blogContent.primaryColor}80)` : `linear-gradient(135deg, ${themeParams?.colors?.primary || "#8B4513"}, ${themeParams?.colors?.accent || "#CD853F"})`};
        color: #FFFFFF;
        border-radius: ${borderRadius};
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        padding: 3rem;
        text-align: center;
      ">
        <h3 style="
          color: #FFFFFF;
          font-family: ${getFontFamily("titleFont").replace(/"/g, "'")};
          font-size: 1.875rem;
          font-weight: ${getFontWeight("titleWeight", "700")};
          margin: 0 0 1rem 0;
        ">
          ${newsletter.title}
        </h3>
        <p style="
          color: #FFFFFF;
          font-size: 1.25rem;
          margin: 0 0 2rem 0;
          opacity: 0.9;
          max-width: 48rem;
          margin: 0 auto 2rem auto;
        ">
          ${newsletter.description}
        </p>
        <div style="
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 24rem;
          margin: 0 auto;
        ">
          <input
            type="email"
            placeholder="${newsletter.placeholder}"
            style="
              flex: 1;
              padding: 0.75rem 1rem;
              border-radius: ${borderRadius};
              border: none;
              font-size: 1rem;
              color: ${themeParams?.colors?.text || "#2D3748"};
              outline: none;
            "
          />
          <button style="
            background: #FFFFFF;
            color: ${blogContent?.primaryColor || themeParams?.colors?.primary || "#8B4513"};
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: ${themeParams?.components?.button?.rounded ? "9999px" : borderRadius};
            font-family: ${getFontFamily("titleFont")};
            font-size: 1rem;
            font-weight: ${getFontWeight("titleWeight", "600")};
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            justify-content: center;
            transition: all 0.3s ease;
          " onmouseover="this.style.backgroundColor='#F8F9FA'" onmouseout="this.style.backgroundColor='#FFFFFF'">
            ${newsletter.buttonText}
            ${renderLucideIcon("arrow-right", 16)}
          </button>
        </div>
        <p style="
          color: #FFFFFF;
          font-size: 0.875rem;
          margin: 1rem 0 0 0;
          opacity: 0.75;
        ">
          ${newsletter.footerText}
        </p>
      </div>
    </div>
    
    <style>
      /* Responsive design */
      @media (max-width: 1024px) {
        #blog > div > div:nth-child(3) {
          grid-template-columns: 1fr !important;
        }
        
        #blog > div > div:nth-child(3) > div:first-child {
          order: 2;
        }
        
        #blog > div > div:nth-child(3) > div:last-child {
          order: 1;
        }
      }
      
      @media (max-width: 768px) {
        #blog {
          padding: 3rem 0;
        }
        
        #blog > div {
          padding: 0 0.5rem;
        }
        
        #blog h2 {
          font-size: 1.875rem !important;
        }
        
        #blog > div > div:nth-child(4) {
          grid-template-columns: 1fr !important;
        }
        
        #blog > div > div:nth-child(5) {
          padding: 2rem 1rem;
        }
        
        #blog > div > div:nth-child(5) > div {
          flex-direction: column;
        }
      }
      
      @media (max-width: 480px) {
        #blog {
          padding: 2rem 0;
        }
        
        #blog h2 {
          font-size: 1.5rem !important;
        }
        
        #blog > div > div:nth-child(5) {
          padding: 1.5rem 0.5rem;
        }
      }
    </style>
  </section>`;
}
