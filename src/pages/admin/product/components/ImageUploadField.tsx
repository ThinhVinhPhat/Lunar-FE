import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface ImageUploadFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  multiple?: boolean;
  maxImages?: number;
  className?: string;
}

export function ImageUploadField<T extends FieldValues>({
  control,
  name,
  label = "Images",
  multiple = true,
  maxImages,
  className = "",
}: ImageUploadFieldProps<T>) {
  const handleRemoveImage = (
    currentImages: (string | File)[],
    index: number,
    onChange: (value: (string | File)[]) => void
  ) => {
    const updatedImages = currentImages.filter((_, i) => i !== index);
    onChange(updatedImages);
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const images = field.value as (string | File)[] || [];
          
          return (
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                multiple={multiple}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const newFiles = Array.from(e.target.files).filter(file => file.size > 0); // Filter out empty files
                    const currentImages = (images || []).filter(img => img !== null && img !== undefined); // Filter out invalid images
                    
                    // Check max images limit
                    if (maxImages && currentImages.length + newFiles.length > maxImages) {
                      alert(`Maximum ${maxImages} images allowed`);
                      return;
                    }
                    
                    if (newFiles.length > 0) {
                      field.onChange([...currentImages, ...newFiles]);
                    }
                  }
                  // Reset the input value to allow selecting the same file again
                  e.target.value = '';
                }}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#C8A846] focus:border-[#C8A846]"
              />
              
              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {images
                    .filter((image: string | File) => {
                      // Filter out invalid images
                      if (image instanceof File) {
                        return image.size > 0;
                      } else if (typeof image === 'string') {
                        return image.trim() !== '';
                      }
                      return false;
                    })
                    .map((image: string | File, index: number) => (
                      <div key={index} className="relative group">
                        <img
                          src={image instanceof File ? URL.createObjectURL(image) : image}
                          className="w-full h-20 object-cover rounded-md"
                          alt={`Image ${index + 1}`}
                          onError={(e) => {
                            // Handle broken images
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA5VjEzTTE1IDEySDlNMjEgMTJDMjEgMTYuOTcwNiAxNi45NzA2IDIxIDEyIDIxQzcuMDI5NDQgMjEgMyAxNi45NzA2IDMgMTJDMyA3LjAyOTQ0IDcuMDI5NDQgMyAxMiAzQzE2Ljk3MDYgMyAyMSA3LjAyOTQ0IDIxIDEyWiIgc3Ryb2tlPSIjOTQ5NEE0IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(images, index, field.onChange)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
