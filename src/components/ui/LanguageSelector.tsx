import { useState } from "react";
import { useContextProvider } from "../../hooks/useContextProvider";
import i18n from "../../i18n";

const LanguageSelector = () => {
  const { currentLanguage, setCurrentLanguage } = useContextProvider();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleDropdown = () => setIsOpen(!isOpen);

  const handleSelectLanguage = (language: string) => {
    setCurrentLanguage(language);
    setIsOpen(false);
    i18n.changeLanguage(language);
  };

  return (
    <div className="bg-white mt-2 shadow-md rounded-lg flex justify-center items-center relative">
      <button
        onClick={handleToggleDropdown}
        className="flex items-center px-3 py-2 bg-gradient-to-r from-[#C8A846] to-[#897334] text-white rounded-lg hover:from-[#897334] hover:to-[#C8A846] transition duration-300 ease-in-out"
      >
        <img
          src={currentLanguage === "en" ? "/img/eng.jpg" : "/img/vi.jpg"}
          alt="Language Flag"
          className="w-5 h-5 rounded-full "
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-40 left-[-100px] bg-white shadow-lg rounded-lg z-10">
          <div
            onClick={() => handleSelectLanguage("en")}
            className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-200"
          >
            <img
              src="/img/eng.jpg"
              alt="English Flag"
              className="w-5 h-5 rounded-full mr-2"
            />
            English
          </div>
          <div
            onClick={() => handleSelectLanguage("vi")}
            className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-200"
          >
            <img
              src="/img/vi.jpg"
              alt="Vietnamese Flag"
              className="w-5 h-5 rounded-full mr-2"
            />
            Vietnamese
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
