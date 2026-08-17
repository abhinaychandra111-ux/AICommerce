import {
  Heart,
  ShoppingCart,
  Star,
} from "lucide-react";

import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  return (
    <article className="product-card">

      <div className="product-image">

        {product.badge && (
          <span className="product-badge">
            {product.badge}
          </span>
        )}

        <button className="wishlist-btn">
          <Heart size={19} />
        </button>

        <img
          src={product.image}
          alt={product.name}
        />
      </div>

      <div className="product-info">

        <span className="product-category">
          {product.category}
        </span>

        <h3>{product.name}</h3>

        <div className="rating">
          <Star size={15} fill="currentColor" />
          <strong>{product.rating}</strong>
          <span>({product.reviews})</span>
        </div>

        <div className="product-bottom">

          <div className="price">
            <strong>₹{product.price.toLocaleString("en-IN")}</strong>
            <del>
              ₹{product.oldPrice.toLocaleString("en-IN")}
            </del>
          </div>

          <button className="add-cart-btn"
          onClick={() => addToCart(product)}
          >
            <ShoppingCart size={18} />
          </button>

        </div>

      </div>

    </article>
  );
}

export default ProductCard;