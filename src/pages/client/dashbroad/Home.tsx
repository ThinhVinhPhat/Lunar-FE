import Hero from "../../../components/home/Hero";
import FeaturedProducts from "../../../components/home/FeaturedProducts";
import Collections from "../../../components/home/Collections";
import Reviews from "../../../components/home/Reviews";
import { Button } from "../../../components/ui/Button";
import { useProductAction } from "../../../hooks/useProductAction";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";

const Home = () => {
  const { products, isLoading } = useProductAction();
  const [query] = useSearchParams();

  useEffect(() => {
    try {
      if (query.get("token")) {
        Cookies.set("accessToken", query.get("token") || "");
        if (query.get("refreshToken")) {
          Cookies.set("refreshToken", query.get("refreshToken") || "");
        }
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
    }
  }, [query]);

  return (
    <main className="bg-white">
      <Hero />

      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-[#C8A846] text-sm uppercase tracking-wider mb-2 block">
              Explore
            </span>
            <h2 className="text-4xl font-bold mb-4 text-[#2c2c2c]">
              Our Collections
            </h2>
            <p className="text-[#6b6b6b]">
              Explore our unique materials and styles
            </p>
          </div>
          <Collections />
        </div>
      </section>

      <section className="relative py-10 bg-[var(--primary-color)] text-white">
        <div className="text-center mb-16">
          <div className="flex justify-center m-1 align-middle w-100">
            <img
              className="w-[100rem] h-[40rem] object-cover"
              src="https://shwoodshop.com/cdn/shop/files/Experiment-Desktop.jpg?v=1736452704&width=1920"
            ></img>
          </div>
          <div className="absolute top-64 left-0 w-full h-full">
            <h1 className="text-6xl font-bold mb-4 text-[#f1efef]">
              Experimenting Everday
            </h1>
            <div className="flex flex-col justify-center items-center w-1/2 mx-auto">
              <p className="text-[#fff] text-2xl text-left ml-10 flex flex-col justify-center items-center">
                Boundaries are pushed and failures are celebrated. The drive to
                experiment is what fuels our passion and transforms our work
                into a labor of love.
                {/* <span className="text-[#C8A846]">★★★★★</span> */}
              </p>
            </div>
            <Button href="/explore" variant="secondary" size="medium">
              Explore Our Process
            </Button>
          </div>
        </div>
      </section>

      <section className="mb-10 bg-[var(--primary-color)] text-white">
        <div className="w-full  mx-auto px-4">
          <FeaturedProducts products={products} isLoading={isLoading} />
        </div>
      </section>

      <section className="py-24 bg-[#f7f7f7]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-[#C8A846] text-sm uppercase tracking-wider mb-2 block">
              Testimonials
            </span>
            <h2 className="text-4xl font-bold mb-4 text-[#2c2c2c]">
              What Our Customers Say
            </h2>
            <p className="text-[#6b6b6b]">
              Real reviews from real customers{" "}
              <span className="text-[#C8A846]">★★★★★</span>
            </p>
          </div>
          <Reviews />
        </div>
      </section>
    </main>
  );
};

export default Home;
