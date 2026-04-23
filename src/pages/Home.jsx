import Hero from "../components/Hero";
import Stats from "../components/Stats";
import ProductCard from "../components/ProductCard";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home">
      <Hero />
      <Stats />
      <section className="products-section">
        <h2>Nuevos Lanzamientos</h2>
        <div className="product-grid">
          <ProductCard
            image="/product1.jpg"
            name="Adidas Ultraboost"
            price="S/180"
          />
          <ProductCard
            image="/product1.jpg"
            name="Adidas NMD R1"
            price="S/150"
          />
          <ProductCard
            image="/product1.jpg"
            name="Adidas Superstar"
            price="S/120"
          />
        </div>
      </section>
    </div>
  );
}

export default Home;
