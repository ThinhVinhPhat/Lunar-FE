import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Product } from "@/shared/types/product";

interface ProductSelectorProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  products: { data: Product[] } | undefined;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export function ProductSelector<T extends FieldValues>({
  control,
  name,
  products,
  disabled = false,
  label = "Product",
  className = "",
}: ProductSelectorProps<T>) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <select
            {...field}
            disabled={disabled}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846] disabled:bg-gray-100"
          >
            <option value="">Select a product</option>
            {products?.data?.map((product: Product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        )}
      />
    </div>
  );
}
