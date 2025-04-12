import clsx from "clsx";

type PaginationProps = {
  productCount: number;
  currentPage: number;
  onSetPage: (page: number) => void;
};
export const Pagination = ({
  productCount,
  currentPage,
  onSetPage,
}: PaginationProps) => {
  const totalPages = Math.ceil(productCount / 10);
  return (
    <div className="flex justify-end items-center gap-2 mt-5 ">
      {PaginationButton("First", currentPage, totalPages, onSetPage)}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={clsx(
              " px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 hover:text-white",
              {
                "bg-[#C8A846]": currentPage === index + 1,
              }
            )}
            onClick={() => {
              onSetPage(index + 1);
              window.scrollTo({ top: 50, behavior: "smooth" });
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
      {PaginationButton("Last", currentPage, totalPages, onSetPage)}
    </div>
  );
};

export const PaginationButton = (
  name: string,
  currentPage: number,
  totalPages: number,
  onSetPage: (page: number) => void
) => {
  return (
    <button
      disabled={currentPage === totalPages}
      onClick={() => {
        onSetPage(name === "First" ? 1 : totalPages);
        window.scrollTo({ top: 50, behavior: "smooth" });
      }}
      className=" px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 active:bg-[#C8A846] hover:text-white"
    >
      {name}
    </button>
  );
};
