import { FC } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";

interface SocialLoginProps {
  onGoogleLogin?: () => void;
  onFacebookLogin?: () => void;
  className?: string;
}

const SocialLogin: FC<SocialLoginProps> = ({
  onGoogleLogin,
  onFacebookLogin,
  className = "",
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#C8A846]"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-[#C8A846]">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onGoogleLogin}
          className="flex items-center justify-center w-full px-4 py-2 border border-[#C8A846] rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-[#F5EFD9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C8A846]"
        >
          <FaGoogle className="h-5 w-5 mr-2 text-red-600" />
          Google
        </button>
        <button
          type="button"
          onClick={onFacebookLogin}
          className="flex items-center justify-center w-full px-4 py-2 border border-[#C8A846] rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-[#F5EFD9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C8A846]"
        >
          <FaFacebook className="h-5 w-5 mr-2 text-blue-600" />
          Facebook
        </button>
      </div>
    </div>
  );
};

export default SocialLogin;
