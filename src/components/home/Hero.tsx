import { Button } from "../ui/Button";
import Text from "../wrapper/Text";
const Hero = () => {
  return (
    <section className="relative h-screen">
      <div className="absolute inset-0">
        <img
          src="https://shwoodshop.com/cdn/shop/files/DT-Web-Hero.jpg?v=1736449181&width=1920"
          alt="Hero"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4">
            <Text id="home.originalWoodSunglasses" />
          </h1>
          <p className="text-xl mb-8">
            <Text id="home.handcraftedInPortlandOregon" />
          </p>
          <Button href="/products/men" type="button" variant="secondary">
            <Text id="home.shopNow" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
