import { ArrowRight, Sparkles } from "lucide-react";

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <div className="hero-badge">
          <Sparkles size={16} />
          Smart Shopping Experience
        </div>

        <h1>
          Shop smarter.
          <br />
          <span>Live better.</span>
        </h1>

        <p>
          Discover premium products, exclusive deals and personalized
          recommendations — all in one place.
        </p>

        <div className="hero-buttons">
          <a href="#products" className="primary-btn">
            Explore Products
            <ArrowRight size={18} />
          </a>

          <a href="#deals" className="secondary-btn">
            View Deals
          </a>
        </div>

        <div className="hero-stats">
          <div>
            <strong>10K+</strong>
            <span>Products</span>
          </div>

          <div>
            <strong>50K+</strong>
            <span>Customers</span>
          </div>

          <div>
            <strong>4.8/5</strong>
            <span>Rating</span>
          </div>
        </div>
      </div>

      <div className="hero-image">
        <div className="hero-circle"></div>

        <img
          src="https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1000&q=80"
          alt="Shopping products"
        />

        <div className="floating-card">
          <span className="floating-icon">✓</span>

          <div>
            <strong>Free Delivery</strong>
            <small>On orders above ₹999</small>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;