import Hero from "../../components/home/Hero";
import FeaturedProducts from "../../components/home/FeaturedProducts";
import Collections from "../../components/home/Collections";
import Reviews from "../../components/home/Reviews";

const Home = () => {
  return (
    <main>
      <Hero />
      <FeaturedProducts />
      <Collections />
      <Reviews />
    </main>
  );
};

export default Home;
