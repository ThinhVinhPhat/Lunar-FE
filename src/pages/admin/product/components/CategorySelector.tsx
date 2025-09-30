import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { CategoryDetail } from "@/shared/types/category";

interface CategorySelectorProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  value: string[];
  categories: CategoryDetail[] | undefined;
  label?: string;
  className?: string;
  multiple?: boolean;
}

export function CategorySelector<T extends FieldValues>({
  control,
  name,
  value,
  categories,
  label = "Categories",
  className = "",
  multiple = true,
}: CategorySelectorProps<T>) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-3">
        {categories?.map((category: CategoryDetail) => (

          <div key={category.name} className="flex items-center">
            <Controller
              control={control}
              name={name}
              render={({ field }) => {                
                const values = field.value as string[];
                // Prefer current form field value; fall back to provided `value` prop for initial state
                const currentValues = (Array.isArray(values) && values.length > 0)
                  ? values
                  : (value || []);
                return (
                  <input
                    type="checkbox"
                    id={`category-${category.name}`}
                    value={category.name}
                    checked={currentValues.includes(category.name)}
                    onChange={(e) => {
                      if (!multiple) {
                        field.onChange(e.target.checked ? [category.name] : []);
                      } else {
                        const baseValues = Array.isArray(values) ? values : [];
                        const newValue = e.target.checked
                          ? [...baseValues, category.name]
                          : baseValues.filter((name) => name !== category.name);
                        field.onChange(newValue);
                      }
                    }}
                    className="mr-2 h-4 w-4 text-[#C8A846] focus:ring-[#C8A846] border-gray-300 rounded"
                  />
                );
              }}
            />
            <label 
              htmlFor={`category-${category.name}`}
              className="text-sm text-gray-900 cursor-pointer select-none"
            >
              {category.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
