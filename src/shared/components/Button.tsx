import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "danger" | "success" | "outline" | "ghost" | "gradient" | "outlined-gold" | "overlay-primary" | "overlay-secondary" | "profile";
  size?: "xs" | "small" | "medium" | "large" | "xl";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  rounded?: boolean;
  shadow?: boolean;
  animate?: boolean;
  id?: string;
  "data-testid"?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
};

export const Button = ({
  children,
  href,
  className,
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  variant = "primary",
  size = "medium",
  icon,
  iconPosition = "left",
  fullWidth = false,
  rounded = false,
  shadow = false,
  animate = true,
  id,
  "data-testid": dataTestId,
  ariaLabel,
  ariaDescribedBy,
}: ButtonProps) => {
  // Base classes with improved styling
  const baseClasses = [
    "relative inline-flex items-center justify-center",
    "font-medium transition-all duration-200 ease-in-out",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "select-none",
    rounded ? "rounded-full" : "rounded-md",
    fullWidth ? "w-full" : "",
    shadow ? "shadow-lg hover:shadow-xl" : "",
    animate ? "transform hover:scale-105 active:scale-95" : "",
    "overflow-hidden",
  ].filter(Boolean).join(" ");

  // Variant classes with comprehensive styling
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-[#C8A846] hover:bg-[#ae923e] rounded-full text-white border-2 border-[#C8A846] hover:border-[#ae923e] focus:ring-[#C8A846] rounded-full";
      case "secondary":
        return "bg-[linear-gradient(to_right,_#C3B247,_#7B684F)] hover:bg-[linear-gradient(to_right,_#ae923e,_#6b5a42)] rounded-full text-white border-2 border-transparent focus:ring-[#C3B247] rounded-full";
      case "danger":
        return "bg-red-500 hover:bg-red-600 rounded-full text-white border-2 border-red-500 hover:border-red-600 focus:ring-red-500 rounded-full";
      case "success":
        return "bg-green-500 hover:bg-green-600 rounded-full text-white border-2 border-green-500 hover:border-green-600 focus:ring-green-500 rounded-full";
      case "outline":
        return "bg-transparent hover:bg-[#C8A846] text-[#C8A846] hover:text-white border-2 border-[#C8A846] focus:ring-[#C8A846] rounded-full";
      case "ghost":
        return "bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900 border-2 border-transparent focus:ring-gray-500 rounded-full";
      case "gradient":
        return "bg-gradient-to-r from-[#C8A846] to-[#d4b852] hover:from-[#b8983d] hover:to-[#c4a849] text-white border-0 focus:ring-[#C8A846] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5";
      case "outlined-gold":
        return "bg-white/95 hover:bg-[#C8A846] text-[#C8A846] hover:text-white border-2 border-[#C8A846] focus:ring-[#C8A846] transform hover:-translate-y-0.5 shadow-md hover:shadow-lg";
      case "overlay-primary":
        return "bg-gradient-to-r from-[#C8A846] to-[#d4b852] hover:from-[#b8983d] hover:to-[#c4a849] text-white border-0 focus:ring-[#C8A846] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 rounded-lg";
      case "overlay-secondary":
        return "bg-white/95 backdrop-blur-sm hover:bg-[#C8A846] text-[#C8A846] hover:text-white border-2 border-[#C8A846] focus:ring-[#C8A846] transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl rounded-lg";
      case "profile":
        return "bg-transparent hover:bg-gray-100 text-gray-700 hover:text-[#C8A846] border-0 focus:ring-[#C8A846] rounded-lg normal-case";
      default:
        return "bg-[#C8A846] hover:bg-[#ae923e] rounded-full text-white border-2 border-[#C8A846] hover:border-[#ae923e] focus:ring-[#C8A846] rounded-full";
    }
  };

  // Size classes with better spacing
  const getSizeClasses = () => {
    switch (size) {
      case "xs":
        return "px-2 py-1 text-xs min-h-[24px]";
      case "small":
        return "px-3 py-2 text-sm min-h-[32px]";
      case "medium":
        return "px-4 py-2.5 text-base min-h-[40px]";
      case "large":
        return "px-6 py-3 text-lg min-h-[48px]";
      case "xl":
        return "px-8 py-4 text-xl min-h-[56px]";
      default:
        return "px-4 py-2.5 text-base min-h-[40px]";
    }
  };

  // State classes
  const stateClasses = [
    disabled || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
    loading ? "pointer-events-none" : "",
  ].filter(Boolean).join(" ");

  // Shimmer effect for animation
  const shimmerClasses = animate && !disabled && !loading ? 
    "before:absolute before:top-0 before:left-0 before:w-full before:h-full " +
    "before:bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.4)_50%,transparent_75%)] " +
    "before:translate-x-[-30%] hover:before:translate-x-[20%] " +
    "before:transition-transform before:duration-500" : "";

  // Combine all classes
  const buttonClasses = className || [
    baseClasses,
    getVariantClasses(),
    getSizeClasses(),
    stateClasses,
    shimmerClasses,
  ].filter(Boolean).join(" ");

  // Icon rendering with position support
  const renderIcon = () => {
    if (!icon) return null;
    const iconClasses = `${size === 'xs' ? 'w-3 h-3' : size === 'small' ? 'w-4 h-4' : size === 'large' ? 'w-6 h-6' : size === 'xl' ? 'w-7 h-7' : 'w-5 h-5'}`;
    return (
      <span className={`${iconClasses} ${iconPosition === 'right' ? 'ml-2' : 'mr-2'}`}>
        {icon}
      </span>
    );
  };

  // Inline loading spinner component
  const InlineSpinner = ({ size: spinnerSize }: { size: string }) => {
    const spinnerClasses = spinnerSize === 'xs' || spinnerSize === 'small' 
      ? 'w-4 h-4' 
      : spinnerSize === 'large' || spinnerSize === 'xl' 
      ? 'w-6 h-6' 
      : 'w-5 h-5';
    
    return (
      <div className={`${spinnerClasses} animate-spin rounded-full border-2 border-current border-t-transparent`}>
        <span className="sr-only">Loading...</span>
      </div>
    );
  };

  // Content rendering with loading state
  const renderContent = () => {
    if (loading) {
      return (
        <>
          <InlineSpinner size={size} />
          {children && <span className="ml-2">{children}</span>}
        </>
      );
    }

    return (
      <>
        {iconPosition === 'left' && renderIcon()}
        {children}
        {iconPosition === 'right' && renderIcon()}
      </>
    );
  };

  // Common props for both button and anchor
  const commonProps = {
    className: buttonClasses,
    onClick: disabled || loading ? undefined : onClick,
    id,
    'data-testid': dataTestId,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'aria-disabled': disabled || loading,
  };
  // Render as link if href is provided
  if (href && !disabled && !loading) {
    return (
      <a
        {...commonProps}
        href={href}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.();
          }
        }}
      >
        {renderContent()}
      </a>
    );
  }

  // Render as button
  return (
    <button
      {...commonProps}
      type={type}
      disabled={disabled || loading}
    >
      {renderContent()}
    </button>
  );
};
