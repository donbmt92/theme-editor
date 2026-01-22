import { ThemeParams } from "@/types";
import { TabType } from "./TabSelector";
import VietnamCoffeeTheme from "../themes/VietnamCoffeeTheme";
import { useEffect } from "react";

interface PreviewPanelProps {
  themeParams: ThemeParams;
  activeTab: TabType;
}

const PreviewPanel = ({ themeParams, activeTab }: PreviewPanelProps) => {

  // Auto-scroll to section on tab change
  useEffect(() => {
    if (activeTab && activeTab !== 'productPage' && activeTab !== 'colors' && activeTab !== 'typography' && activeTab !== 'layout' && activeTab !== 'json') {
      const elementId = activeTab; // Tab IDs match section IDs
      const element = document.getElementById(elementId);

      if (element) {
        // Add a small delay to ensure DOM is ready and layout is stable
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [activeTab]);

  return (
    <div className="w-full h-full bg-white overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="min-h-full">
          <VietnamCoffeeTheme
            theme={themeParams}
          />
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;
