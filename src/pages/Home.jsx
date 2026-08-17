import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CategoryBar from "../components/CategoryBar";
import ProductGrid from "../components/ProductGrid";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CategoryBar />
        <ProductGrid />
      </main>
      <Footer />
    </>
  );
}

export default Home;