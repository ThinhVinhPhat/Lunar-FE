type ButtonProps = {
  children: React.ReactNode;
  href: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  icon?: React.ReactNode;
};

export const Button = ({
  children,
  href,
  className,
  onClick,
  type,
  disabled,
  loading,
  variant,
  size,
  icon,
}: ButtonProps) => {
  const baseClasses =
    "relative px-4 py-3 rounded-full border-2 border-[#C8A846] text-[#C8A846] " +
    "bg-[var(--primary-color)] overflow-hidden " +
    "before:absolute before:top-0 before:left-0 before:w-full before:h-full " + 
    "before:bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.4)_50%,transparent_75%)] " +
    "before:translate-x-[-30%] hover:before:translate-x-[20%] " +
    "before:transition-transform before:duration-500";
  const variantClasses =
    variant === "primary"
      ? "bg-[#C8A846] text-white"
      : "bg-[linear-gradient(to_right,_#C3B247,_#7B684F)] text-[#fff]";
  const sizeClasses =
    size === "small"
      ? "px-4 py-2"
      : size === "medium"
      ? "px-6 py-3"
      : "px-8 py-3";
  const iconClasses = icon ? "mr-2" : "";
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";
  const loadingClasses = loading ? "opacity-50 cursor-wait" : "";
  return href ? (
    <a
      className={
        className ||
        `${baseClasses} ${variantClasses} ${sizeClasses} ${iconClasses} ${disabledClasses} ${loadingClasses}`
      }
      href={href}
      onClick={onClick}
    >
      {children}
    </a>
  ) : (
    <button
      className={
        className ||
        `${baseClasses} ${variantClasses} ${sizeClasses} ${iconClasses} ${disabledClasses} ${loadingClasses}`
      }
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
