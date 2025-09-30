import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";

type Props = {
  isLoading: boolean;
  children: React.ReactNode;
};

export const IsLoadingWrapper = ({ isLoading, children }: Props) => {
  // Disable scrolling when loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLoading]);

  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
          <div className="bg-white rounded-lg p-6 shadow-xl flex flex-col items-center">
            <FontAwesomeIcon 
              icon={faSpinner} 
              className="animate-spin text-[#C8A846] text-3xl mb-2" 
            />
            <span className="text-gray-700 font-medium">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default IsLoadingWrapper;
