import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

const materials = [
  {
    title: "Wood",
    description:
      "Premium hardwoods merged with ultra-thin aluminum stringers for industry-leading durability.",
  },
  {
    title: "Acetate",
    description:
      "Italian-crafted Mazzucchelli acetate known for beautiful designs and supple textures.",
  },
  {
    title: "Innovations",
    description:
      "Pioneering new materials including stone, newspaper, oxidized copper, and more.",
  },
];

const Explore = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Our Story - Explore Our Journey</title>
      </Helmet>

      <section className="relative h-[60vh] bg-neutral-900">
        <div className="absolute inset-0">
          <img
            src="https://shwoodshop.com/cdn/shop/files/Our-Story-Hero.jpg?v=1623219417&width=1920"
            alt="Our Story"
            className="w-full h-full object-cover opacity-70"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white">Our Story</h1>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16 space-y-24">
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-6">
              It all began as a simple experiment
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Founded in 2009, our journey started with a vision to create
              products that embrace the uniqueness found only in natural
              surroundings. What began with simple materials has evolved into a
              commitment to craftsmanship and innovation.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="https://shwoodshop.com/cdn/shop/files/Our-Story-Pioneering_a91c14f5-9526-47bd-8e89-296940f30388.jpg?v=1623219417&width=1080"
              alt="Our beginnings"
              className="rounded-lg shadow-xl"
            />
          </motion.div>
        </section>

        <section className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="order-2 md:order-1"
          >
            <img
              src="https://shwoodshop.com/cdn/shop/files/Our-Story-Quality-D.jpg?v=1634066754&width=1080"
              alt="Our process"
              className="rounded-lg shadow-xl"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="order-1 md:order-2"
          >
            <h2 className="text-3xl font-bold mb-6">Pioneering the Process</h2>
            <p className="text-gray-600 leading-relaxed">
              Our manufacturing process was engineered from the ground up,
              driven by constant experimentation with tools, materials, and
              design. Each day brings new innovations and techniques that push
              the boundaries of what's possible.
            </p>
            <button className="mt-6 px-8 py-3 bg-[#C8A846] text-white rounded hover:bg-[#B69735] transition">
              Discover Our Process
            </button>
          </motion.div>
        </section>

        {/* Quality Section */}
        <section className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-6">Committed to Quality</h2>
            <p className="text-gray-600 leading-relaxed">
              Every piece passing through our workshop is handled with
              meticulous care, ensuring its unique character. In an industry of
              uniformity, we strive to create products that reflect the
              individuality of their wearers.
            </p>
          </motion.div>
        </section>

        {/* Materials Section */}
        <section className="bg-gray-50 -mx-4 px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Materials that Matter
            </h2>
            <img
              src={
                "https://shwoodshop.com/cdn/shop/files/Our-Story-Materials.jpg?v=1634068174&width=1920"
              }
              alt={"Materials that Matter"}
              className="w-full h-full object-cover rounded mb-4"
            />
            <div className="grid md:grid-cols-3 gap-8">
              {materials.map((material) => (
                <motion.div
                  key={material.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <h3 className="text-xl font-bold mb-2">{material.title}</h3>
                  <p className="text-gray-600">{material.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Explore;
