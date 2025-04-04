import { FiUser } from "react-icons/fi";

type FormFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
};

function FormField({ label, name, value, onChange, disabled }: FormFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiUser className="text-gray-400" />
        </div>
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`pl-10 w-full py-3 border ${
            disabled ? "border-gray-300" : "border-gray-200 bg-gray-50"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent`}
        />
      </div>
    </div>
  );
}

export default FormField;
