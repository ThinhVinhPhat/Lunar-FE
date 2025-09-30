import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface CheckboxFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  className?: string;
}

export function CheckboxField<T extends FieldValues>({
  control,
  name,
  label,
  className = "",
}: CheckboxFieldProps<T>) {
  return (
    <div className={`flex items-center ${className}`}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <input
            type="checkbox"
            checked={field.value as boolean}
            onChange={field.onChange}
            className="mr-2 h-4 w-4 text-[#C8A846] focus:ring-[#C8A846] border-gray-300 rounded"
          />
        )}
      />
      <label className="text-sm text-gray-700">{label}</label>
    </div>
  );
}
