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
import { useState, useEffect, useCallback } from "react";
import { Profit } from "@/components/product/Profit";
import { Tabs } from "@/components/product/Tabs";
import { useProductVariantByProductId, useProductVariantBySlug } from "@/lib/hooks/queryClient/query/product-variant/product-variant.query";
import { useContextProvider } from "@/shared/hooks/useContextProvider";
import { useOrderDetail } from "@/lib/hooks/queryClient/mutator/order/order-detail";
import { enqueueSnackbar } from "notistack";
import { features, included } from "@/database/product/feature";
import { useGetOrderDetail } from "@/lib/hooks/queryClient/query/order/order.query";
import { calculateStar } from "@/lib/ultis/calculateStar";
import ReviewList from "@/components/product/Review/ReviewList";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { useGetUser } from "@/lib/hooks/queryClient/query/user/user.query";
import { useFavoriteProductVariant } from "@/lib/hooks/queryClient/mutator/product-variant/product-variant.mutator";
import IsLoadingWrapper from "@/shared/components/wrapper/isLoading";
import { ProductVariantResponse } from "@/shared/types/product-varitant";
import { useGetCommentProduct } from "@/lib/hooks/queryClient/query/comment/comment.query";
import { CommentSort } from "@/shared/types/review";
import { useQueryState } from "nuqs";
import { parseGlassesSize } from "@/lib/ultis/parseGlassesSize";


const ProductDetail = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { data: user } = useGetUser();
  const { data: mainVariant, isLoading: isLoadingMainVariant } = useProductVariantBySlug(slug || "");
  const { data: allVariants, isLoading: isLoadingAllVariants } = useProductVariantByProductId(
    mainVariant?.product?.id
  );
  const [selectedVariantId, setSelectedVariantId] = useQueryState("variant", {
    defaultValue: mainVariant?.id || "",
    shallow: false
  });
  const { data: comments } = useGetCommentProduct(mainVariant?.product?.slug || "", { 
    page: 1, 
    limit: 10, 
    sort: CommentSort.NEWEST 
  });
  const { mutateAsync: favoriteProductVariant } = useFavoriteProductVariant();
  const selectedVariant = allVariants?.find(variant => variant.id === selectedVariantId) || mainVariant;
  const product = mainVariant?.product;
  // const { data: categoryProducts, isLoading: isLoadingCategoryProducts } =
  //   useProducts({ category: [selectedCategory] });
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(t("product_detail.description"));
  const { cart, setCart } = useContextProvider();
  const { mutateAsync: createOrderDetail } = useOrderDetail();
  const [isOpen, setIsOpen] = useState(false);
  const { refetch } = useGetOrderDetail(cart?.id || "");
  const navigate = useNavigate();  
  const size = parseGlassesSize(selectedVariant?.size);

  useEffect(() => {
    if (mainVariant && !selectedVariantId) {
      setSelectedVariantId(mainVariant.id);
    }
   
  }, [mainVariant, selectedVariantId, setSelectedVariantId]);

  const handleQuantityChange = useCallback((value: number) => {
    const newQuantity = quantity + value;
    if (newQuantity > 0 && newQuantity <= (selectedVariant?.stock || 0)) {
      setQuantity(newQuantity);
    }
  }, [quantity, selectedVariant?.stock]);

  const handleAddToCart = useCallback(async () => {
    if (!user?.id) {
      enqueueSnackbar("Please login to add to cart", { variant: "error" });
      navigate("/login");
      return;
    }
    if (!selectedVariant) {
      enqueueSnackbar("Please select a variant", { variant: "error" });
      return;
    }
    if (cart) {
      await createOrderDetail({
        orderId: cart.id,
        productVariantId: selectedVariant.id,
        quantity: quantity,
      });

      const { data: updatedOrder } = await refetch();
      setCart(updatedOrder?.data);
      enqueueSnackbar("Product added to cart", { variant: "success" });
    } else {
      enqueueSnackbar("Error Cart", { variant: "error" });
    }
  }, [user?.id, selectedVariant, cart, createOrderDetail, quantity, refetch, setCart, navigate]);

  const handleVariantChange = useCallback((variant: ProductVariantResponse) => {
    setSelectedVariantId(variant.id);
    setSelectedImage(0);
    setQuantity(1); // Reset quantity when changing variants
  }, [setSelectedVariantId]);

  const handleSetActiveTab = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const handleFavoriteProduct = useCallback(async () => {
    if (user?.id) {
      if (selectedVariant?.id) {
        await favoriteProductVariant(selectedVariant.id);
      }
    } else {
      enqueueSnackbar("Please login to favorite product", { variant: "error" });
      navigate("/login");
    }
  }, [user?.id, favoriteProductVariant, selectedVariant?.id, navigate]);


  return (
    <IsLoadingWrapper isLoading={isLoadingMainVariant || isLoadingAllVariants}>
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
            {/* <span className="hover:text-[#C8A846] cursor-pointer">
              {" "}
              {selectedVariant?.productCategories[0]?.categoryDetail?.name}
            </span>{" "} */}
            /<span className="text-gray-700"> {product?.name}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="mb-4 relative group">
                <img
                  src={selectedVariant?.images[selectedImage] || product?.images[selectedImage]}
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
                {(selectedVariant?.images || product?.images || []).map((image: string, index: number) => (
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
                    onClick={() => handleFavoriteProduct()}
                    className="p-2 rounded-full transition-all duration-300 shadow-md"
                    aria-label={
                      selectedVariant?.isFavorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    <FontAwesomeIcon
                      icon={faHeart}
                      className={clsx("text-lg", {
                        "text-red-500": selectedVariant?.isFavorite,
                        "text-gray-400": !selectedVariant?.isFavorite,
                      })}
                    />
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {calculateStar({ reviews: comments || [] }).starRender}
                  </div>
                  <span className="text-sm text-gray-500">
                    {comments?.length || 0} {t("product_detail.reviews")}
                  </span>
                </div>

                <div className="flex items-baseline gap-4 mb-4">
                  {selectedVariant?.discount_percentage && selectedVariant.discount_percentage > 0 ? (
                    <>
                      <span className="text-2xl font-medium text-red-600">
                        $
                        {(
                          Number(selectedVariant?.price) *
                          (1 - selectedVariant?.discount_percentage / 100)
                        ).toFixed(2)}
                      </span>
                      <span className="text-xl text-gray-400 line-through">
                        ${selectedVariant?.price}
                      </span>
                      <span className="text-red-600 font-medium">
                        {t("product_detail.save")}{" "}
                        {selectedVariant?.discount_percentage}%
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-medium text-gray-900">
                      ${selectedVariant?.price || 0}
                    </span>
                  )}
                </div>
              </div>

              {/* Variant Selection Section */}
              <div>
                <h2 className="text-sm font-medium text-gray-900 mb-3">
                  {t("product_detail.variants")}
                </h2>
                
                {allVariants && allVariants.length > 0 && (
                  <div className="flex gap-3">
                    {allVariants.map((variant: ProductVariantResponse) => (
                      <div
                        key={variant.id}
                        onClick={() => handleVariantChange(variant)}
                        className={clsx(
                          "relative cursor-pointer transition-all duration-200 group",
                          selectedVariant?.id === variant.id ? "scale-105" : "hover:scale-105"
                        )}
                      >
                        <div className={clsx(
                          "w-20 h-16 rounded-lg overflow-hidden border-2 transition-all",
                          selectedVariant?.id === variant.id 
                            ? "border-[#C8A846] shadow-md" 
                            : "border-gray-200 group-hover:border-gray-300"
                        )}>
                          <img
                            src={variant.images[0] || product?.images[0]}
                            alt={`${variant.color} variant`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {selectedVariant?.id === variant.id && (
                          <div className="absolute -top-1 -right-1">
                            <div className="w-5 h-5 bg-[#C8A846] rounded-full flex items-center justify-center border-2 border-white">
                              <FontAwesomeIcon icon={faCheck} className="text-white text-xs" />
                            </div>
                          </div>
                        )}
                        
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            {variant.color}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faCheck}
                  className={
                    (selectedVariant?.stock || 0) > 0 ? "text-green-500" : "text-red-500"
                  }
                />
                <span
                  className={
                    (selectedVariant?.stock || 0) > 0 ? "text-green-500" : "text-red-500"
                  }
                >
                  {(selectedVariant?.stock || 0) > 0 ? "In Stock" : "Out of Stock"}
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
                    disabled={quantity >= (selectedVariant?.stock || 0)}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleAddToCart()}
                  className="flex-1 bg-[#C8A846] text-white py-3 px-6 rounded-md hover:bg-[#b69339] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={(selectedVariant?.stock || 0) === 0}
                >
                  {t("product_detail.add_to_cart")}
                </button>
              </div>

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

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="mb-2">
                            <span className="font-medium">Overall Width:</span> Medium
                          </p>
                          <p className="mb-2">
                            <span className="font-medium">Gender:</span> Unisex
                          </p>
                        </div>
                      </div>
                      
                      {selectedVariant?.size && (
                        <div className="mt-6">
                          <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="text-2xl font-bold text-gray-800">
                                {size.lens}mm
                              </div>
                              <div className="text-sm text-gray-600 mt-1">Lens</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="text-2xl font-bold text-gray-800">
                                {size.bridge}mm
                              </div>
                              <div className="text-sm text-gray-600 mt-1">Bridge</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="text-2xl font-bold text-gray-800">
                                {size.temple}mm
                              </div>
                              <div className="text-sm text-gray-600 mt-1">Temple</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="text-2xl font-bold text-gray-800">
                                {size.overallWidth}mm
                              </div>
                              <div className="text-sm text-gray-600 mt-1">Overall Width</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 gap-4">
                        <img
                          src="https://shwoodshop.com/cdn/shop/files/example-frame01.png?v=1623219416&width=420"
                          alt="Lens measurement diagram"
                          className="rounded-lg w-full max-w-[300px] mx-auto"
                        />
                        <img
                          src="https://shwoodshop.com/cdn/shop/files/frame_width-01.png?v=1667433549&width=420"
                          alt="Bridge measurement diagram"
                          className="rounded-lg w-full max-w-[300px] mx-auto"
                        />
                        <img
                          src="https://shwoodshop.com/cdn/shop/files/example-frame03.png?v=1623219416&width=420"
                          alt="Temple measurement diagram"
                          className="rounded-lg w-full max-w-[300px] mx-auto"
                        />
                      </div>
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
                    productId={selectedVariant?.id || ""}
                    setIsOpen={setIsOpen}
                  />
                </>
              )}
            </div>
          </div>
          {/* <RelatedProduct
            categoryProducts={categoryProducts?.data}
            isLoading={isLoadingCategoryProducts}
          /> */}
        </div>
      </div>
    </IsLoadingWrapper>
  );
};

export default ProductDetail;
