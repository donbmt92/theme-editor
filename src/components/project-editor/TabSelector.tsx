import { FileText, Palette, Type, Layout } from "lucide-react";

export type TabType =
  | "header"
  | "about"
  | "hero"
  | "problems"
  | "solutions"
  | "leadMagnet"
  | "products"
  | "whyChooseUs"
  | "testimonials"
  | "footer"
  | "colors"
  | "typography"
  | "layout";

interface TabSelectorProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabSelector = ({ activeTab, onTabChange }: TabSelectorProps) => {
  const tabs = [
    { id: "header" as TabType, label: "Header", icon: FileText },
    { id: "about" as TabType, label: "Giới thiệu", icon: FileText },
    { id: "hero" as TabType, label: "Hero", icon: FileText },
    { id: "problems" as TabType, label: "Vấn đề", icon: FileText },
    { id: "solutions" as TabType, label: "Giải pháp", icon: FileText },
    { id: "leadMagnet" as TabType, label: "Lead Magnet", icon: FileText },
    { id: "products" as TabType, label: "Sản phẩm", icon: FileText },
    { id: "whyChooseUs" as TabType, label: "Tại sao chọn", icon: FileText },
    { id: "testimonials" as TabType, label: "Đánh giá", icon: FileText },
    { id: "footer" as TabType, label: "Footer", icon: FileText },
    { id: "colors" as TabType, label: "Màu sắc", icon: Palette },
    { id: "typography" as TabType, label: "Chữ", icon: Type },
    { id: "layout" as TabType, label: "Bố cục", icon: Layout },
  ];

  return (
    <div className="flex flex-wrap gap-1 mb-6 p-1 bg-gray-100 rounded-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Icon size={16} className="mr-2" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default TabSelector;
