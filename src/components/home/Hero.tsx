const Hero = () => {
  return (
    <section className="relative h-screen">
      <div className="absolute inset-0">
        <img 
          src="/images/hero.jpg" 
          alt="Hero" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4">The Original Wood Sunglasses</h1>
          <p className="text-xl mb-8">Handcrafted in Portland, Oregon</p>
          <button className="bg-white text-black px-8 py-3 rounded-md hover:bg-gray-100">
            Shop Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero; 