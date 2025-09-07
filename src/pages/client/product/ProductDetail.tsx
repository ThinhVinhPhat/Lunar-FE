import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRotateLeft,
  faShieldHalved,
  faCheck,
  faMinus,
  faPlus,
  faTruck,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { RelatedProduct } from "@/components/product/RelatedProduct";
import { Profit } from "@/components/product/Profit";
import { Tabs } from "@/components/product/Tabs";
import { useProduct } from "@/lib/hooks/queryClient/query/product/product.query";
import { useProducts } from "@/lib/hooks/queryClient/query/product/product.query";
import { useContextProvider } from "@/shared/hooks/useContextProvider";
import { useOrderDetail } from "@/lib/hooks/queryClient/mutator/order/order-detail";
import { enqueueSnackbar } from "notistack";
import { features, fitDetails, included } from "@/database/product/feature";
import { useGetOrderDetail } from "@/lib/hooks/queryClient/query/order/order.query";
import { calculateStar } from "@/lib/ultis/calculateStar";
import ReviewList from "@/components/product/Review/ReviewList";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { useGetUser } from "@/lib/hooks/queryClient/query/user/user.query";
import { useFavoriteProduct } from "@/lib/hooks/queryClient/mutator/product/product.mutator";
import IsLoadingWrapper from "@/shared/components/wrapper/isLoading";
import { ProductColorInterface } from "@/shared/types/product";
import { Category } from "@/shared/types/category";

type ProductCategory = {
  id: string;
  quantity: number;
  categoryDetails: Category;
};


const ProductDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { data: user } = useGetUser();
  const { product, isLoading } = useProduct(id, user?.id);
  const { mutateAsync: favoriteProduct } = useFavoriteProduct();
  const [selectedCategory, setSelectedCategory] = useState(
    product?.productCategories[0]?.categoryDetails.name
  );
  const { data: categoryProducts, isLoading: isLoadingCategoryProducts } =
    useProducts(selectedCategory);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(t("product_detail.description"));
  const { cart, setCart } = useContextProvider();
  const { mutateAsync: createOrderDetail } = useOrderDetail();
  const [isOpen, setIsOpen] = useState(false);
  const { refetch } = useGetOrderDetail(cart?.id || "");
  const navigate = useNavigate();

  const handleQuantityChange = (value: number) => {
    const newQuantity = quantity + value;
    if (newQuantity > 0 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async (id: string) => {
    if (!user?.id) {
      enqueueSnackbar("Please login to add to cart", { variant: "error" });
      navigate("/login");
      return;
    }
    if (cart) {
      await createOrderDetail({
        orderId: cart.id,
        productId: id,
        quantity: quantity,
      });

      const { data: updatedOrder } = await refetch();
      setCart(updatedOrder?.data);
      enqueueSnackbar("Product added to cart", { variant: "success" });
    } else {
      enqueueSnackbar("Error Cart", { variant: "error" });
    }
  };

  const handleCategoryChange = (id: string) => {
    setSelectedCategory(id);
  };

  const handleSetActiveTab = (tab: string) => {
    setActiveTab(tab);
  };

  const handleFavoriteProduct = async (id: string) => {
    if (user?.id) {
      await favoriteProduct(id);
    } else {
      enqueueSnackbar("Please login to favorite product", { variant: "error" });
      navigate("/login");
    }
  };

  return (
    <IsLoadingWrapper isLoading={isLoading}>
      <div className="pt-36 pb-16">
        <div className="max-w-7xl mx-auto px-4 mb-6">
          <div className="text-md font-medium text-gray-500">
            <span
              onClick={() => navigate("/")}
              className="hover:text-[#C8A846] cursor-pointer"
            >
              {t("product_detail.home")}
            </span>{" "}
            /
            <span
              onClick={() => navigate("/products/men")}
              className="hover:text-[#C8A846] cursor-pointer"
            >
              {" "}
              {t("product_detail.collections")}
            </span>{" "}
            /
            <span className="hover:text-[#C8A846] cursor-pointer">
              {" "}
              {product?.productCategories[0]?.categoryDetails?.name}
            </span>{" "}
            /<span className="text-gray-700"> {product?.name}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="mb-4 relative group">
                <img
                  src={product?.images[selectedImage]}
                  alt={product?.name}
                  className="w-full aspect-[1080/614] object-cover rounded-lg"
                />
                {product?.isNew && (
                  <span className="absolute top-4 left-4 bg-[#C8A846] text-white px-3 py-1 text-sm rounded">
                    {t("product_detail.new_arrival")}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-5 gap-2">
                {product?.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index
                        ? "border-[#C8A846] scale-95"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {product?.name}
                  </h1>
                  <button
                    onClick={() => handleFavoriteProduct(product?.id)}
                    className="p-2 rounded-full transition-all duration-300 shadow-md"
                    aria-label={
                      product?.isFavorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    <FontAwesomeIcon
                      icon={faHeart}
                      className={clsx("text-lg", {
                        "text-red-500": product?.isFavorite,
                        "text-gray-400": !product?.isFavorite,
                      })}
                    />
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {calculateStar({ reviews: product?.comments }).starRender}
                  </div>
                  <span className="text-sm text-gray-500">
                    {product?.comments?.length} {t("product_detail.reviews")}
                  </span>
                </div>

                <div className="flex items-baseline gap-4 mb-4">
                  {product?.discount_percentage > 0 ? (
                    <>
                      <span className="text-2xl font-medium text-red-600">
                        $
                        {(
                          Number(product?.price) *
                          (1 - product?.discount_percentage / 100)
                        ).toFixed(2)}
                      </span>
                      <span className="text-xl text-gray-400 line-through">
                        ${product?.price}
                      </span>
                      <span className="text-red-600 font-medium">
                        {t("product_detail.save")}{" "}
                        {product?.discount_percentage}%
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-medium text-gray-900">
                      ${product?.price}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-medium text-gray-900 mb-3">
                  {t("product_detail.color")}
                </h2>
                <div className="flex justify-start ">
                  {product?.allColors && (
                    <div className="flex justify-center gap-2 bg-white bg-opacity-90 px-4 py-2 rounded-full shadow">
                      {product.allColors.map((variant: ProductColorInterface ) => (
                        <button
                          key={variant.id}
                          onClick={() => navigate(`/product/${variant.slug}`)}
                          className={clsx(
                            "w-6 h-6 rounded-full border-2 transition-all",
                            variant.id === product.id
                              ? "border-[#C8A846] scale-110"
                              : "border-gray-300 hover:scale-110"
                          )}
                          style={{
                            backgroundColor:
                              variant.color?.toLowerCase() || "#ccc",
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-medium text-gray-900 mb-3">
                  {t("product_detail.category")}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {product?.productCategories?.map((category: ProductCategory) => (
                    <button
                      disabled
                      key={category?.categoryDetails?.id}
                      onClick={() => handleCategoryChange(category?.id)}
                      className={`px-4 py-2 border rounded-md transition-all ${
                        category?.id === selectedCategory
                          ? "border-[#C8A846] bg-[#C8A846] bg-opacity-10"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {category?.categoryDetails?.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faCheck}
                  className={
                    product?.stock > 0 ? "text-green-500" : "text-red-500"
                  }
                />
                <span
                  className={
                    product?.stock > 0 ? "text-green-500" : "text-red-500"
                  }
                >
                  {product?.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  {t("product_detail.quantity")}
                </h3>
                <div className="flex items-center border border-gray-300 rounded-md w-32">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="px-3 py-2 hover:text-[#C8A846]"
                    disabled={quantity <= 1}
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                  <span className="flex-1 text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="px-3 py-2 hover:text-[#C8A846]"
                    disabled={quantity >= product?.stock}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              </div>

              <button
                onClick={() => handleAddToCart(product?.id)}
                className="w-full bg-[#C8A846] text-white py-4 text-lg font-medium rounded-md hover:bg-[#b69339] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={product?.stock === 0}
              >
                {product?.stock === 0
                  ? t("product_detail.out_of_stock")
                  : t("product_detail.add_to_cart")}
              </button>

              <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-200">
                <Profit
                  icon={faTruck}
                  title={t("product_detail.free_shipping")}
                  description={t("product_detail.on_orders_over")}
                />
                <Profit
                  icon={faRotateLeft}
                  title={t("product_detail.free_returns")}
                  description={t("product_detail.within_30_days")}
                />
                <Profit
                  icon={faShieldHalved}
                  title={t("product_detail.1_year_warranty")}
                  description={t("product_detail.for_all_products")}
                />
              </div>
            </div>
          </div>

          <div className="mt-16">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                <Tabs
                  text={t("product_detail.description")}
                  activeTab={activeTab}
                  setActiveTab={handleSetActiveTab}
                />
                <Tabs
                  text={t("product_detail.fit")}
                  activeTab={activeTab}
                  setActiveTab={handleSetActiveTab}
                />
                <Tabs
                  text={t("product_detail.reviews")}
                  activeTab={activeTab}
                  setActiveTab={handleSetActiveTab}
                />
              </nav>
            </div>

            <div className="py-6">
              {activeTab === t("product_detail.description") && (
                <div className="prose prose-sm max-w-none">
                  <h3 className="text-lg font-medium mb-4">
                    {t("product_detail.description")}
                  </h3>
                  <p className="text-gray-600 mb-6">{product?.description}</p>

                  <div className="grid md:grid-cols-2 gap-8 mt-8">
                    <div>
                      <h4 className="font-medium mb-4">
                        {t("product_detail.features")}
                      </h4>
                      <ul className="space-y-3 text-gray-600">
                        {features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2">
                            <FontAwesomeIcon
                              icon={faCheck}
                              className="text-[#C8A846]"
                            />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-4">
                        {t("product_detail.included")}
                      </h4>
                      <ul className="space-y-3 text-gray-600">
                        {included.map((item) => (
                          <li
                            key={item.text}
                            className="flex items-center gap-2"
                          >
                            <FontAwesomeIcon
                              icon={item.icon}
                              className="text-[#C8A846]"
                            />
                            {item.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === t("product_detail.fit") && (
                <div className="prose prose-sm max-w-none">
                  <h3 className="text-lg font-medium mb-4">
                    {t("product_detail.fit_details")}
                  </h3>

                  <div className="grid md:grid-cols-2 gap-2">
                    <div>
                      {fitDetails.map((item) => (
                        <p key={item.label} className="mb-2">
                          <span className="font-medium">{item.label}:</span>{" "}
                          {item.value}
                        </p>
                      ))}
                    </div>
                    <div className="flex flex-row gap-2 ml-[-300px]">
                      <img
                        src="https://shwoodshop.com/cdn/shop/files/example-frame01.png?v=1623219416&width=420"
                        alt="Fit diagram"
                        className="rounded-lg w-[300px]"
                      />
                      <img
                        src="https://shwoodshop.com/cdn/shop/files/frame_width-01.png?v=1667433549&width=420"
                        alt="Fit diagram"
                        className="rounded-lg  w-[300px] "
                      />
                      <img
                        src="https://shwoodshop.com/cdn/shop/files/example-frame03.png?v=1623219416&width=420"
                        alt="Fit diagram"
                        className="rounded-lg  w-[300px]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === t("product_detail.reviews") && (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-medium">
                        {t("product_detail.customer_reviews")}
                      </h3>
                      <button
                        onClick={() => setIsOpen(true)}
                        className="px-4 py-2 bg-[#C8A846] text-white rounded-md hover:bg-[#b69339] transition-colors"
                      >
                        {t("product_detail.write_a_review")}
                      </button>
                    </div>
                  </div>
                  <ReviewList
                    isOpen={isOpen}
                    productId={product?.id}
                    setIsOpen={setIsOpen}
                  />
                </>
              )}
            </div>
          </div>
          <RelatedProduct
            categoryProducts={categoryProducts?.data}
            isLoading={isLoadingCategoryProducts}
          />
        </div>
      </div>
    </IsLoadingWrapper>
  );
};

export default ProductDetail;
