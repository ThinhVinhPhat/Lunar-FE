import { useParams } from "react-router-dom";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRotateLeft,
  faShieldHalved,
  faCheck,
  faMinus,
  faPlus,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import { reviews } from "../../../database/reviews";
import { useState } from "react";
import { renderStars } from "../../../ultis/renderStar";
import { ProductReviews } from "../../../components/product/Reviews";
import { RelatedProduct } from "../../../components/product/RelatedProduct";
import { Profit } from "../../../components/product/Profit";
import { Tabs } from "../../../components/product/Tabs";
import { useProduct } from "../../../hooks/queryClient/query/product/product";
import { useProducts } from "../../../hooks/queryClient/query/product/products";
import { useContextProvider } from "../../../hooks/useContextProvider";
import { useOrderDetail } from "../../../hooks/queryClient/mutator/order/order-detail";
import { enqueueSnackbar } from "notistack";
const ProductDetail = () => {
  const { id } = useParams();

  const { product, isLoading } = useProduct(id);

  const [selectedCategory, setSelectedCategory] = useState(
    product?.productCategories[0]?.categoryDetails.id
  );
  const { data: categoryProducts, isLoading: isLoadingCategoryProducts } =
    useProducts(selectedCategory);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Description");
  const { cart, setShouldFetchCart } = useContextProvider();
  const { mutate: createOrderDetail } = useOrderDetail();

  const handleQuantityChange = (value: number) => {
    const newQuantity = quantity + value;
    if (newQuantity > 0 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async (id: string) => {
    if (cart) {
      await createOrderDetail({
        orderId: cart.id,
        productId: id,
        quantity: quantity,
      });
      setTimeout(() => {
        window.location.reload();
      }, 2500);
      enqueueSnackbar("Product added to cart", { variant: "success" });
    } else {
      enqueueSnackbar("Error Cart", { variant: "error" });
    }
    setShouldFetchCart(true);
  };

  const handleCategoryChange = (id: string) => {
    setSelectedCategory(id);
  };

  const features = [
    "Premium-grade hardwood",
    "14-ply carbon fiber and wood laminate construction",
    "German spring hinges",
    "Split frame with rim lock for easy lensing",
  ];

  const included = [
    { text: "Premium CR-39 lens", icon: faCheck },
    { text: "100% UVA/UVB protection", icon: faCheck },
    { text: "Custom travel case", icon: faCheck },
    { text: "Microfiber cleaning cloth", icon: faCheck },
    { text: "1-year warranty", icon: faShieldHalved },
  ];

  const fitDetails = [
    { label: "Overall Width", value: "Wide" },
    { label: "Gender", value: "Unisex" },
    { label: "Lens", value: "54mm" },
    { label: "Bridge", value: "19mm" },
    { label: "Overall Width", value: "144mm" },
    { label: "Temple", value: "145mm" },
  ];

  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  const starRender = renderStars(averageRating);

  const handleSetActiveTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        product && (
          <div className="pt-36 pb-16">
            <div className="max-w-7xl mx-auto px-4 mb-6">
              <div className="text-md font-medium text-gray-500">
                <span className="hover:text-[#C8A846] cursor-pointer">
                  Home
                </span>{" "}
                /
                <span className="hover:text-[#C8A846] cursor-pointer">
                  {" "}
                  Collections
                </span>{" "}
                /
                <span className="hover:text-[#C8A846] cursor-pointer">
                  {" "}
                  {product?.productCategories[0]?.categoryDetails.name}
                </span>{" "}
                /<span className="text-gray-700"> {product.name}</span>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <div className="mb-4 relative group">
                    <img
                      src={product.images[selectedImage]}
                      alt={product.name}
                      className="w-full aspect-[1080/614] object-cover rounded-lg"
                    />
                    {product.isNew && (
                      <span className="absolute top-4 left-4 bg-[#C8A846] text-white px-3 py-1 text-sm rounded">
                        New Arrival
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {product.images.map((image: string, index: number) => (
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {product.name}
                    </h1>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">{starRender}</div>
                      <span className="text-sm text-gray-500">
                        {reviews.length} reviews
                      </span>
                    </div>

                    <div className="flex items-baseline gap-4 mb-4">
                      {product.discount_percentage > 0 ? (
                        <>
                          <span className="text-2xl font-medium text-red-600">
                            $
                            {(
                              Number(product.price) *
                              (1 - product.discount_percentage / 100)
                            ).toFixed(2)}
                          </span>
                          <span className="text-xl text-gray-400 line-through">
                            ${product.price}
                          </span>
                          <span className="text-red-600 font-medium">
                            Save {product.discount_percentage}%
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-medium text-gray-900">
                          ${product.price}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-sm font-medium text-gray-900 mb-3">
                      Category{" "}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {product?.productCategories?.map((category: any) => (
                        <button
                          disabled
                          key={category.categoryDetails?.id}
                          onClick={() => handleCategoryChange(category.id)}
                          className={`px-4 py-2 border rounded-md transition-all ${
                            category.id === selectedCategory
                              ? "border-[#C8A846] bg-[#C8A846] bg-opacity-10"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {category.categoryDetails?.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faCheck}
                      className={
                        product.stock > 0 ? "text-green-500" : "text-red-500"
                      }
                    />
                    <span
                      className={
                        product.stock > 0 ? "text-green-500" : "text-red-500"
                      }
                    >
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      Quantity
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
                        disabled={quantity >= product.stock}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className="w-full bg-[#C8A846] text-white py-4 text-lg font-medium rounded-md hover:bg-[#b69339] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>

                  <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-200">
                    <Profit
                      icon={faTruck}
                      title="Free Shipping"
                      description="On orders over $99"
                    />
                    <Profit
                      icon={faRotateLeft}
                      title="Free Returns"
                      description="Within 30 days"
                    />
                    <Profit
                      icon={faShieldHalved}
                      title="1-year warranty"
                      description="For all products"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-16">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8">
                    <Tabs
                      text="Description"
                      activeTab={activeTab}
                      setActiveTab={handleSetActiveTab}
                    />
                    <Tabs
                      text="Fit"
                      activeTab={activeTab}
                      setActiveTab={handleSetActiveTab}
                    />
                    <Tabs
                      text="Reviews"
                      activeTab={activeTab}
                      setActiveTab={handleSetActiveTab}
                    />
                  </nav>
                </div>

                <div className="py-6">
                  {activeTab === "Description" && (
                    <div className="prose prose-sm max-w-none">
                      <h3 className="text-lg font-medium mb-4">Description</h3>
                      <p className="text-gray-600 mb-6">
                        {product.description}
                      </p>

                      <div className="grid md:grid-cols-2 gap-8 mt-8">
                        <div>
                          <h4 className="font-medium mb-4">Features</h4>
                          <ul className="space-y-3 text-gray-600">
                            {features.map((feature) => (
                              <li
                                key={feature}
                                className="flex items-center gap-2"
                              >
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
                          <h4 className="font-medium mb-4">Included</h4>
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

                  {activeTab === "Fit" && (
                    <div className="prose prose-sm max-w-none">
                      <h3 className="text-lg font-medium mb-4">Fit Details</h3>

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

                  {activeTab === "Reviews" && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-medium">
                          Customer Reviews
                        </h3>
                        <button className="px-4 py-2 bg-[#C8A846] text-white rounded-md hover:bg-[#b69339] transition-colors">
                          Write a Review
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex text-2xl">
                              {renderStars(averageRating)}
                            </div>
                            <span className="text-lg">
                              {averageRating.toFixed(1)} out of 5
                            </span>
                          </div>

                          <div className="space-y-2">
                            <ProductReviews star={5} />
                            <ProductReviews star={4} />
                            <ProductReviews star={3} />
                            <ProductReviews star={2} />
                            <ProductReviews star={1} />
                          </div>
                        </div>
                        <div>
                          <div className="mb-4">
                            <label
                              htmlFor="sort-reviews"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Sort by
                            </label>
                            <select
                              id="sort-reviews"
                              className="w-full border border-gray-300 rounded-md py-2 px-3"
                            >
                              <option>Most Recent</option>
                              <option>Highest Rating</option>
                              <option>Lowest Rating</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {reviews.map((review) => (
                          <div
                            key={review.id}
                            className="border-b border-gray-200 pb-6"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex">
                                {renderStars(review.rating)}
                              </div>
                              <h4 className="font-medium">{review.title}</h4>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {review.content}
                            </p>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">
                                {review.author}
                              </span>{" "}
                              - Verified Buyer
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <RelatedProduct
                categoryProducts={categoryProducts}
                isLoading={isLoadingCategoryProducts}
              />
            </div>
          </div>
        )
      )}
    </>
  );
};

export default ProductDetail;
