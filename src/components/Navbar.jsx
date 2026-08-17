import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { cartCount } = useCart();

  return (
    <header className="navbar">
      <div className="nav-container">

        <a href="/" className="logo">
          <span className="logo-mark">A</span>

          <span>
            AI<span>Commerce</span>
          </span>
        </a>

        <div className="search-box">
          <Search size={19} />

          <input
            type="text"
            placeholder="Search products..."
          />
        </div>

        <nav
          className={
            mobileOpen
              ? "nav-links active"
              : "nav-links"
          }
        >
          <a href="/">Home</a>
          <a href="/#products">Products</a>
          <a href="/#categories">Categories</a>
          <a href="/#deals">Deals</a>
        </nav>

        <div className="nav-actions">

          <button className="icon-btn">
            <Heart size={21} />
          </button>

          <a
            href="/cart"
            className="icon-btn cart-btn"
            aria-label="Shopping cart"
          >
            <ShoppingCart size={21} />

            {cartCount > 0 && (
              <span className="cart-count">
                {cartCount}
              </span>
            )}
          </a>

          <button className="login-btn">
            <User size={18} />
            Login
          </button>

          <button
            className="mobile-menu"
            onClick={() =>
              setMobileOpen(!mobileOpen)
            }
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>

        </div>

      </div>
    </header>
  );
}

export default Navbar;