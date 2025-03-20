type TabsProps = {
  text: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
};
export const Tabs = ({ text, activeTab, setActiveTab }: TabsProps) => {
  return (
    <button
      onClick={() => setActiveTab(text)}
      className={`py-4 text-sm font-medium border-b-2 ${
        activeTab === text
          ? "border-[#C8A846] text-[#C8A846]"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
      }`}
    >
      {text}
    </button>
  );
};
