import { useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import ProductCard from "./ProductCard";

const categories = [
  "All",
  "Electronics",
  "Audio",
  "Wearables",
  "Computers",
  "Accessories",
];

function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) {
        params.append("search", search.trim());
      }

      if (category !== "All") {
        params.append("category", category);
      }

      if (sort) {
        params.append("sort", sort);
      }

      const response = await fetch(
        `http://localhost:5000/api/products?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      setProducts(data.products);
    } catch (error) {
      console.error("Product fetch error:", error);
      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, category, sort]);

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setSort("newest");
  };

  return (
    <section className="products-section" id="products">

      {/* Heading */}
      <div className="section-heading">
        <div>
          <span className="eyebrow">
            OUR COLLECTION
          </span>

          <h2>Featured Products</h2>
        </div>

        <button
          className="filter-btn"
          onClick={clearFilters}
        >
          <SlidersHorizontal size={18} />
          Clear Filters
        </button>
      </div>

      {/* Filters */}
      <div className="product-filters">

        {/* Search */}
        <div className="product-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="clear-search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">
            Newest
          </option>

          <option value="price-low">
            Price: Low to High
          </option>

          <option value="price-high">
            Price: High to Low
          </option>

          <option value="rating">
            Highest Rated
          </option>
        </select>

      </div>

      {/* Result count */}
      {!loading && !error && (
        <div className="result-count">
          {products.length} product
          {products.length !== 1 ? "s" : ""} found
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="products-status">
          Loading products...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="products-status error">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        products.length === 0 && (
          <div className="empty-products">
            <h3>No products found</h3>

            <p>
              Try a different search or category.
            </p>

            <button onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        )}

      {/* Products */}
      {!loading &&
        !error &&
        products.length > 0 && (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}

    </section>
  );
}

export default ProductGrid;