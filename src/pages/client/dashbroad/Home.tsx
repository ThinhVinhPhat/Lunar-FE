import Hero from "../../../components/home/Hero";
import FeaturedProducts from "../../../components/home/FeaturedProducts";
import Collections from "../../../components/home/Collections";
import Reviews from "../../../components/home/Reviews";
import { Button } from "../../../components/ui/Button";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import Text from "../../../components/wrapper/Text";

const Home = () => {
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
              <Text id="home.explore" />
            </span>
            <h2 className="text-4xl font-bold mb-4 text-[#2c2c2c]">
              <Text id="home.ourCollections" />
            </h2>
            <p className="text-[#6b6b6b]">
              <Text id="home.exploreMaterials" />
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
              <Text id="home.experimentingEveryday" />
            </h1>
            <div className="flex flex-col justify-center items-center w-1/2 mx-auto">
              <p className="text-[#fff] mb-10 text-2xl text-left ml-10 flex flex-col justify-center items-center">
                <Text id="home.boundariesPushed" />
              </p>
            </div>
            <Button href="/explore" variant="secondary" size="medium">
              <Text id="home.exploreProcess" />
            </Button>
          </div>
        </div>
      </section>

      <section className="mb-10 bg-[var(--primary-color)] text-white">
        <div className="w-full  mx-auto px-4">
          <FeaturedProducts />
        </div>
      </section>

      <section className="py-24 bg-[#f7f7f7]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-[#C8A846] text-sm uppercase tracking-wider mb-2 block">
              <Text id="home.testimonials" />
            </span>
            <h2 className="text-4xl font-bold mb-4 text-[#2c2c2c]">
              <Text id="home.whatCustomersSay" />
            </h2>
            <p className="text-[#6b6b6b]">
              <Text id="home.realReviews" />{" "}
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
