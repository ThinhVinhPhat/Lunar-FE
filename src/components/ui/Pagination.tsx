import clsx from "clsx";
import { useTranslation } from "react-i18next";

type PaginationProps = {
  productCount: number;
  currentPage: number;
  onSetPage: (page: any) => void;
};
export const Pagination = ({
  productCount,
  currentPage,
  onSetPage,
}: PaginationProps) => {
  const totalPages = Math.ceil(productCount / 10);
  const { t } = useTranslation();
  return (
    <div className="flex justify-end items-center gap-2 mt-5 ">
      {PaginationButton(t("product_list.first"), totalPages, onSetPage)}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={clsx(
              " px-4 py-2  rounded-md hover:bg-gray-300 hover:text-white",
              {
                "bg-[#C8A846] text-white hover:bg-[#ebc962]":
                  currentPage === index + 1,
                "bg-gray-200": currentPage !== index + 1,
              }
            )}
            onClick={() => {
              onSetPage(() => index + 1);
              window.scrollTo({ top: 50, behavior: "smooth" });
              console.log(index + 1);
              console.log(currentPage);
              console.log(currentPage === index + 1);
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
      {PaginationButton(t("product_list.last"), totalPages, onSetPage)}
    </div>
  );
};

export const PaginationButton = (
  name: string,
  totalPages: number,
  onSetPage: (page: number) => void
) => {
  const { t } = useTranslation();
  const labelFirst = t("product_list.first");

  return (
    <button
      onClick={() => {
        onSetPage(name === labelFirst ? 1 : totalPages);
        window.scrollTo({ top: 10, behavior: "smooth" });
      }}
      className=" px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 active:bg-[#C8A846] hover:text-white"
    >
      {name}
    </button>
  );
};
