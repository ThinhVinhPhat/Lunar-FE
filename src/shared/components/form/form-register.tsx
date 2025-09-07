import { EyeIcon } from "lucide-react";
import { forwardRef } from "react";
import { FieldError } from "react-hook-form";

type FormFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: FieldError | string | undefined;
  isPassword?: boolean;
  onClick?: () => void;
  options?: string[];
};

export const FormField = forwardRef(
  (props: FormFieldProps, ref: React.Ref<HTMLInputElement>) => {
    const {
      type = props.type === "password" ? "password" : "text",
      className = "",
      label,
      error,
      onClick,
      isPassword,
      options,
      ...other
    } = props;
    return (
      <div className="form-group relative">
        {isPassword && (
          <EyeIcon
            onClick={() => onClick?.()}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
          />
        )}
        {type === "select" ? (
          <select
            className={`form-control ${className}`}
            title={label} // Using title instead of placeholder as placeholder is not valid for select elements
            ref={ref as React.Ref<HTMLSelectElement>}
            {...(other as React.SelectHTMLAttributes<HTMLSelectElement>)}
          >
            {options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            className={`form-control ${className}`}
            name={label}
            autoComplete={label}
            placeholder={label}
            ref={ref}
            {...other}
          />
        )}
        {error && (
          <div className="error-feedback text-red-600">
            {typeof error === "string" ? error : error?.message}
          </div>
        )}
      </div>
    );
  }
);
