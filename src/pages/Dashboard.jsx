import { useEffect, useMemo, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Heart,
  Search,
  ShoppingCart,
  User,
  Zap,
  Star,
  Tag,
  Truck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  getUserCart,
  saveUserCart,
} from "../utils/cartStorage";


/* =========================================================
   CATEGORIES
   ========================================================= */

const categories = [
  { name: "All", icon: "🏠" },
  { name: "Mobiles", icon: "📱" },
  { name: "Electronics", icon: "💻" },
  { name: "Fashion", icon: "👕" },
  { name: "Home", icon: "🏠" },
  { name: "Appliances", icon: "📺" },
  { name: "Beauty", icon: "💄" },
  { name: "Gaming", icon: "🎮" },
  { name: "Accessories", icon: "🎧" },
  { name: "Grocery", icon: "🛒" },
];


/* =========================================================
   PRODUCT CARD
   ========================================================= */

function ProductCard({
  product,
  wishlist,
  onWishlist,
  onAddToCart,
}) {
  const productId = product._id;

  const isWishlisted =
    wishlist.includes(productId);

  const price = Number(product.price || 0);

  const oldPrice = Number(
    product.oldPrice || 0
  );

  const hasDiscount =
    oldPrice > price;

  const discount = hasDiscount
    ? Math.round(
        ((oldPrice - price) /
          oldPrice) *
          100
      )
    : 0;

  const rating =
    Number(product.rating || 0);

  const reviews =
    Number(product.reviews || 0);


  return (
    <div className="flip-product-card">

      {/* =====================================================
          WISHLIST
          ===================================================== */}

      <button
        type="button"
        className="product-wishlist"
        aria-label={
          isWishlisted
            ? "Remove from wishlist"
            : "Add to wishlist"
        }
        onClick={() =>
          onWishlist(productId)
        }
      >
        <Heart
          size={18}
          fill={
            isWishlisted
              ? "currentColor"
              : "none"
          }
        />
      </button>


      {/* =====================================================
          PRODUCT IMAGE
          ===================================================== */}

      <div className="flip-product-image">

        <img
          src={product.image}
          alt={product.name}
        />

      </div>


      {/* =====================================================
          PRODUCT INFORMATION
          ===================================================== */}

      <div className="flip-product-info">

        <h3>
          {product.name}
        </h3>


        {/* =================================================
            RATING
            ================================================= */}

        <div className="flip-rating">

          <span>

            <Star
              size={12}
              fill="currentColor"
            />

            {rating.toFixed(1)}

          </span>


          <small>
            {reviews.toLocaleString(
              "en-IN"
            )} Ratings
          </small>

        </div>


        {/* =================================================
            PRICE
            ================================================= */}

        <div className="flip-price">

          <strong>
            ₹
            {price.toLocaleString(
              "en-IN"
            )}
          </strong>


          {hasDiscount && (
            <>
              <del>
                ₹
                {oldPrice.toLocaleString(
                  "en-IN"
                )}
              </del>

              <b>
                {discount}% off
              </b>
            </>
          )}

        </div>


        <p className="delivery">
          Free delivery
        </p>


        {/* =================================================
            STOCK
            ================================================= */}

        {Number(product.stock || 0) <= 0 ? (

          <p
            style={{
              color: "#dc2626",
              fontSize: "12px",
              fontWeight: "700",
              margin: "6px 0",
            }}
          >
            Out of Stock
          </p>

        ) : (

          <p
            style={{
              color: "#16a34a",
              fontSize: "12px",
              fontWeight: "600",
              margin: "6px 0",
            }}
          >
            {product.stock} in stock
          </p>

        )}


        {/* =================================================
            ADD TO CART
            ================================================= */}

        <button
          type="button"
          className="add-cart-button"
          disabled={
            Number(product.stock || 0) <= 0
          }
          onClick={() =>
            onAddToCart(product)
          }
        >
          {Number(product.stock || 0) <= 0
            ? "Out of Stock"
            : "Add to Cart"}
        </button>

      </div>

    </div>
  );
}


/* =========================================================
   DASHBOARD
   ========================================================= */

function Dashboard() {
  const navigate = useNavigate();


  /* =======================================================
     PRODUCTS
     ======================================================= */

  const [products, setProducts] =
    useState([]);

  const [productsLoading, setProductsLoading] =
    useState(true);

  const [productsError, setProductsError] =
    useState("");


  /* =======================================================
     SEARCH
     ======================================================= */

  const [search, setSearch] =
    useState("");


  /* =======================================================
     CATEGORY
     ======================================================= */

  const [selectedCategory, setSelectedCategory] =
    useState("All");


  /* =======================================================
     WISHLIST
     ======================================================= */

  const [wishlist, setWishlist] =
    useState(() => {

      try {
        return JSON.parse(
          localStorage.getItem(
            "aicommerce-wishlist"
          ) || "[]"
        );
      } catch {
        return [];
      }

    });


  /* =======================================================
     CART
     ======================================================= */

  const [cart, setCart] =
  useState(() => {
    return getUserCart();
  });


  /* =======================================================
     AUTH
     ======================================================= */

  const [isLoggedIn, setIsLoggedIn] =
    useState(
      Boolean(
        localStorage.getItem(
          "aicommerce-token"
        )
      )
    );


  const [user, setUser] =
    useState(() => {

      try {
        return JSON.parse(
          localStorage.getItem(
            "aicommerce-user"
          ) || "null"
        );
      } catch {
        return null;
      }

    });


  /* =======================================================
     FETCH PRODUCTS FROM MONGODB
     ======================================================= */

  useEffect(() => {

    const fetchProducts = async () => {

      try {

        setProductsLoading(true);
        setProductsError("");

        const response = await fetch(
          "http://localhost:5000/api/products"
        );

        const data =
          await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
            "Failed to fetch products"
          );
        }

        setProducts(
          Array.isArray(data.products)
            ? data.products
            : []
        );

      } catch (error) {

        console.error(
          "Products Error:",
          error
        );

        setProductsError(
          error.message ||
          "Failed to load products"
        );

      } finally {

        setProductsLoading(false);

      }

    };


    fetchProducts();

  }, []);


  /* =======================================================
     UPDATE AUTH WHEN PAGE RETURNS TO FOCUS
     ======================================================= */

  useEffect(() => {

    const checkAuth = () => {

      const token =
        localStorage.getItem(
          "aicommerce-token"
        );

      const storedUser =
        localStorage.getItem(
          "aicommerce-user"
        );


      setIsLoggedIn(
        Boolean(token)
      );


      try {

        setUser(
          storedUser
            ? JSON.parse(storedUser)
            : null
        );

      } catch {

        setUser(null);

      }

    };


    window.addEventListener(
      "focus",
      checkAuth
    );


    return () => {

      window.removeEventListener(
        "focus",
        checkAuth
      );

    };

  }, []);


  /* =======================================================
     SAVE CART
     ======================================================= */

  useEffect(() => {

  saveUserCart(cart);

}, [cart]);


  /* =======================================================
     SAVE WISHLIST
     ======================================================= */

  useEffect(() => {

    localStorage.setItem(
      "aicommerce-wishlist",
      JSON.stringify(wishlist)
    );

  }, [wishlist]);


  /* =======================================================
     CART COUNT
     ======================================================= */

  const cartCount =
    cart.length;


  /* =======================================================
     WISHLIST
     ======================================================= */

  const handleWishlist = (
    productId
  ) => {

    setWishlist((current) => {

      if (
        current.includes(productId)
      ) {

        return current.filter(
          (id) =>
            id !== productId
        );

      }


      return [
        ...current,
        productId,
      ];

    });

  };


  /* =======================================================
     ADD TO CART
     ======================================================= */

  const handleAddToCart = (
    product
  ) => {

    /* -----------------------------------------------------
       LOGIN REQUIRED
       ----------------------------------------------------- */

    if (!isLoggedIn) {

      navigate("/login");

      return;

    }


    /* -----------------------------------------------------
       MONGODB ID REQUIRED
       ----------------------------------------------------- */

    if (!product._id) {

      console.error(
        "Product missing MongoDB _id:",
        product
      );

      alert(
        "This product does not have a valid database ID."
      );

      return;

    }


    /* -----------------------------------------------------
       STOCK CHECK
       ----------------------------------------------------- */

    if (
      Number(product.stock || 0) <= 0
    ) {

      alert(
        "This product is currently out of stock."
      );

      return;

    }


    /* -----------------------------------------------------
       ADD PRODUCT
       ----------------------------------------------------- */

    setCart((current) => {

      const alreadyAdded =
        current.some(
          (item) =>
            item._id ===
            product._id
        );


      if (alreadyAdded) {

        navigate("/cart");

        return current;

      }


      return [
        ...current,

        {
          ...product,

          /*
           * IMPORTANT:
           * Preserve MongoDB ObjectId.
           */
          _id: product._id,

          quantity: 1,
        },

      ];

    });

  };


  /* =======================================================
     FILTER PRODUCTS
     ======================================================= */

  const filteredProducts =
    useMemo(() => {

      const searchText =
        search
          .trim()
          .toLowerCase();


      return products.filter(
        (product) => {

          const matchesSearch =
            !searchText ||
            product.name
              ?.toLowerCase()
              .includes(searchText) ||
            product.category
              ?.toLowerCase()
              .includes(searchText);


          const matchesCategory =
            selectedCategory ===
              "All" ||
            product.category ===
              selectedCategory;


          return (
            matchesSearch &&
            matchesCategory
          );

        }
      );

    }, [
      products,
      search,
      selectedCategory,
    ]);


  /* =======================================================
     BEST DEALS
     ======================================================= */

  const deals =
    useMemo(() => {

      return products
        .filter(
          (product) =>
            Number(
              product.oldPrice || 0
            ) >
            Number(
              product.price || 0
            )
        )
        .slice(0, 4);

    }, [products]);


  /* =======================================================
     POPULAR PRODUCTS
     ======================================================= */

  const popularProducts =
    useMemo(() => {

      return [
        ...products,
      ]
        .sort(
          (a, b) =>
            Number(
              b.rating || 0
            ) -
            Number(
              a.rating || 0
            )
        )
        .slice(0, 4);

    }, [products]);


  /* =======================================================
     FILTER DEALS
     ======================================================= */

  const filteredDeals =
    filteredProducts.filter(
      (product) =>
        deals.some(
          (deal) =>
            deal._id ===
            product._id
        )
    );


  /* =======================================================
     FILTER POPULAR
     ======================================================= */

  const filteredPopular =
    filteredProducts.filter(
      (product) =>
        popularProducts.some(
          (popular) =>
            popular._id ===
            product._id
        )
    );


  /* =======================================================
     SEARCH RESULT MODE
     ======================================================= */

  const isSearching =
    search.trim() !== "" ||
    selectedCategory !== "All";


  /* =======================================================
     RENDER
     ======================================================= */

  return (

    <div className="flip-dashboard">


      {/* ===================================================
          NAVBAR
          =================================================== */}

      <header className="flip-navbar">

        <div className="flip-navbar-inner">


          {/* LOGO */}

          <Link
            to="/"
            className="flip-logo"
          >
            AI<span>Commerce</span>

            <small>
              Explore <b>Plus</b>
            </small>

          </Link>


          {/* SEARCH */}

          <div className="flip-search">

            <Search size={20} />

            <input
              type="text"
              placeholder="Search for products, brands and more"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />


            {search && (

              <button
                type="button"
                className="search-clear"
                onClick={() =>
                  setSearch("")
                }
              >
                ×
              </button>

            )}

          </div>


          {/* LOGIN / PROFILE */}

          {isLoggedIn && user ? (

            <Link
              to="/profile"
              className="flip-login"
            >

              <User size={18} />

              <span>
                {user.name}
              </span>

              <ChevronDown
                size={14}
              />

            </Link>

          ) : (

            <Link
              to="/login"
              className="flip-login"
            >

              <User size={18} />

              Login

              <ChevronDown
                size={14}
              />

            </Link>

          )}


          {/* REGISTER */}

          {!isLoggedIn && (

            <Link
              to="/register"
              className="flip-nav-link"
            >
              Register
            </Link>

          )}


          {/* CART */}

          <Link
            to="/cart"
            className="flip-cart"
          >

            <span className="cart-icon-wrapper">

              <ShoppingCart
                size={21}
              />

              {cartCount > 0 && (

                <span className="cart-count">
                  {cartCount}
                </span>

              )}

            </span>

            Cart

          </Link>


        </div>

      </header>


      {/* ===================================================
          CATEGORY BAR
          =================================================== */}

      <section className="flip-category-bar">

        <div className="flip-category-inner">

          {categories.map(
            (category) => (

              <button
                type="button"
                className={`flip-category ${
                  selectedCategory ===
                  category.name
                    ? "active"
                    : ""
                }`}
                key={category.name}
                onClick={() => {

                  setSelectedCategory(
                    category.name
                  );

                  setSearch("");

                }}
              >

                <div className="category-icon">
                  {category.icon}
                </div>

                <span>
                  {category.name}
                </span>

              </button>

            )
          )}


          {/* OFFERS */}

          <button
            type="button"
            className="flip-category"
            onClick={() => {

              setSelectedCategory(
                "All"
              );

              setSearch("");

              document
                .getElementById(
                  "deals"
                )
                ?.scrollIntoView({
                  behavior:
                    "smooth",
                });

            }}
          >

            <div className="category-icon">
              🏷️
            </div>

            <span>
              Offers
            </span>

          </button>

        </div>

      </section>


      {/* ===================================================
          MAIN
          =================================================== */}

      <main className="flip-main">


        {/* =================================================
            LOADING
            ================================================= */}

        {productsLoading && (

          <div className="no-products">

            <p>
              Loading products...
            </p>

          </div>

        )}


        {/* =================================================
            ERROR
            ================================================= */}

        {!productsLoading &&
          productsError && (

            <div className="no-products">

              <Search size={40} />

              <h3>
                Failed to load products
              </h3>

              <p>
                {productsError}
              </p>

              <button
                type="button"
                className="results-clear"
                onClick={() =>
                  window.location.reload()
                }
              >
                Retry
              </button>

            </div>

          )}


        {/* =================================================
            PRODUCTS LOADED
            ================================================= */}

        {!productsLoading &&
          !productsError && (

            <>


              {/* =============================================
                  SEARCH / CATEGORY RESULTS
                  ============================================= */}

              {isSearching ? (

                <section className="flip-section">

                  <div className="flip-section-header">

                    <div>

                      <div className="section-title-row">

                        <Search
                          size={21}
                        />

                        <h2>
                          {search
                            ? `Results for "${search}"`
                            : selectedCategory}
                        </h2>

                      </div>

                      <p>
                        {
                          filteredProducts.length
                        }{" "}
                        products found
                      </p>

                    </div>


                    <button
                      type="button"
                      className="results-clear"
                      onClick={() => {

                        setSearch("");

                        setSelectedCategory(
                          "All"
                        );

                      }}
                    >
                      Clear
                    </button>

                  </div>


                  {filteredProducts.length >
                  0 ? (

                    <div className="flip-products-grid">

                      {filteredProducts.map(
                        (product) => (

                          <ProductCard
                            product={
                              product
                            }
                            wishlist={
                              wishlist
                            }
                            onWishlist={
                              handleWishlist
                            }
                            onAddToCart={
                              handleAddToCart
                            }
                            key={
                              product._id
                            }
                          />

                        )
                      )}

                    </div>

                  ) : (

                    <div className="no-products">

                      <Search
                        size={40}
                      />

                      <h3>
                        No products found
                      </h3>

                      <p>
                        Try another search
                        or choose a
                        different category.
                      </p>

                    </div>

                  )}

                </section>

              ) : (

                <>


                  {/* =============================================
                      HERO
                      ============================================= */}

                  <section className="flip-hero">

                    <button
                      type="button"
                      className="hero-arrow hero-left"
                      aria-label="Previous banner"
                    >
                      <ChevronLeft />
                    </button>


                    <div className="hero-content">

                      <div className="hero-text">

                        <span className="hero-tag">
                          LIMITED TIME OFFER
                        </span>

                        <h1>
                          Mega Sale
                          <br />
                          Up to{" "}
                          <strong>
                            60% OFF
                          </strong>
                        </h1>

                        <p>
                          Upgrade your
                          everyday life
                          with premium
                          products at
                          incredible prices.
                        </p>


                        <button
                          type="button"
                          className="hero-shop-button"
                          onClick={() => {

                            document
                              .getElementById(
                                "deals"
                              )
                              ?.scrollIntoView({
                                behavior:
                                  "smooth",
                              });

                          }}
                        >

                          Shop Now

                          <ChevronRight
                            size={18}
                          />

                        </button>

                      </div>


                      <div className="hero-product">

                        <div className="hero-discount">

                          UP TO

                          <strong>
                            60%
                          </strong>

                          OFF

                        </div>


                        <div className="hero-product-circle">

                          <img
                            src={
                              products[0]
                                ?.image ||
                              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900"
                            }
                            alt="Featured product"
                          />

                        </div>

                      </div>

                    </div>


                    <button
                      type="button"
                      className="hero-arrow hero-right"
                      aria-label="Next banner"
                    >
                      <ChevronRight />
                    </button>


                    <div className="hero-dots">

                      <span className="active"></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>

                    </div>

                  </section>


                  {/* =============================================
                      BENEFITS
                      ============================================= */}

                  <section className="flip-benefits">

                    <div className="benefit-item">

                      <Truck size={25} />

                      <div>

                        <strong>
                          Fast Delivery
                        </strong>

                        <span>
                          Quick & reliable
                          shipping
                        </span>

                      </div>

                    </div>


                    <div className="benefit-item">

                      <ShieldCheck
                        size={25}
                      />

                      <div>

                        <strong>
                          Secure Payments
                        </strong>

                        <span>
                          100% secure
                          checkout
                        </span>

                      </div>

                    </div>


                    <div className="benefit-item">

                      <RotateCcw
                        size={25}
                      />

                      <div>

                        <strong>
                          Easy Returns
                        </strong>

                        <span>
                          Simple return
                          process
                        </span>

                      </div>

                    </div>


                    <div className="benefit-item">

                      <Tag size={25} />

                      <div>

                        <strong>
                          Best Prices
                        </strong>

                        <span>
                          Great deals every
                          day
                        </span>

                      </div>

                    </div>

                  </section>


                  {/* =============================================
                      BEST DEALS
                      ============================================= */}

                  <section
                    className="flip-section"
                    id="deals"
                  >

                    <div className="flip-section-header">

                      <div>

                        <div className="section-title-row">

                          <Zap size={21} />

                          <h2>
                            Best Deals
                          </h2>

                        </div>

                        <p>
                          Grab these offers
                          before they're gone
                        </p>

                      </div>


                      <button
                        type="button"
                        className="section-view-button"
                        onClick={() => {

                          setSearch("");

                          setSelectedCategory(
                            "All"
                          );

                        }}
                      >

                        View All

                        <ChevronRight
                          size={17}
                        />

                      </button>

                    </div>


                    <div className="flip-products-grid">

                      {deals.length > 0 ? (

                        (
                          isSearching
                            ? filteredDeals
                            : deals
                        ).map(
                          (product) => (

                            <ProductCard
                              product={
                                product
                              }
                              wishlist={
                                wishlist
                              }
                              onWishlist={
                                handleWishlist
                              }
                              onAddToCart={
                                handleAddToCart
                              }
                              key={
                                product._id
                              }
                            />

                          )
                        )

                      ) : (

                        <div className="no-products">

                          <p>
                            No deals available
                            right now.
                          </p>

                        </div>

                      )}

                    </div>

                  </section>


                  {/* =============================================
                      ADVERTISEMENT
                      ============================================= */}

                  <section className="flip-ad-banner">

                    <div className="ad-banner-content">

                      <span>
                        EXCLUSIVE MEMBER OFFER
                      </span>

                      <h2>
                        Extra 10% OFF
                        <br />
                        on your first order
                      </h2>

                      <p>
                        Join AICommerce and
                        unlock exclusive
                        member benefits.
                      </p>


                      {isLoggedIn ? (

                        <Link to="/profile">

                          My Profile

                          <ChevronRight
                            size={17}
                          />

                        </Link>

                      ) : (

                        <Link to="/register">

                          Join Now

                          <ChevronRight
                            size={17}
                          />

                        </Link>

                      )}

                    </div>


                    <div className="ad-banner-decoration">
                      🎁
                    </div>

                  </section>


                  {/* =============================================
                      POPULAR
                      ============================================= */}

                  <section className="flip-section">

                    <div className="flip-section-header">

                      <div>

                        <div className="section-title-row">

                          <Star size={21} />

                          <h2>
                            Popular Products
                          </h2>

                        </div>

                        <p>
                          Loved by thousands
                          of shoppers
                        </p>

                      </div>


                      <button
                        type="button"
                        className="section-view-button"
                        onClick={() => {

                          setSearch("");

                          setSelectedCategory(
                            "All"
                          );

                          window.scrollTo({
                            top: document
                              .body
                              .scrollHeight,
                            behavior:
                              "smooth",
                          });

                        }}
                      >

                        View All

                        <ChevronRight
                          size={17}
                        />

                      </button>

                    </div>


                    <div className="flip-products-grid">

                      {popularProducts.length >
                      0 ? (

                        (
                          isSearching
                            ? filteredPopular
                            : popularProducts
                        ).map(
                          (product) => (

                            <ProductCard
                              product={
                                product
                              }
                              wishlist={
                                wishlist
                              }
                              onWishlist={
                                handleWishlist
                              }
                              onAddToCart={
                                handleAddToCart
                              }
                              key={
                                product._id
                              }
                            />

                          )
                        )

                      ) : (

                        <div className="no-products">

                          <p>
                            No products available.
                          </p>

                        </div>

                      )}

                    </div>

                  </section>


                  {/* =============================================
                      WHY AICOMMERCE
                      ============================================= */}

                  <section className="flip-reasons">

                    <div className="flip-reasons-title">

                      <h2>
                        Why shop with AICommerce?
                      </h2>

                      <p>
                        Everything you need for
                        a better shopping
                        experience.
                      </p>

                    </div>


                    <div className="reason-grid">

                      <div className="reason-card">

                        <span>
                          💰
                        </span>

                        <h3>
                          Great Prices
                        </h3>

                        <p>
                          Competitive prices
                          and exclusive
                          deals every day.
                        </p>

                      </div>


                      <div className="reason-card">

                        <span>
                          🚚
                        </span>

                        <h3>
                          Fast Delivery
                        </h3>

                        <p>
                          Get your products
                          delivered quickly
                          and safely.
                        </p>

                      </div>


                      <div className="reason-card">

                        <span>
                          🔐
                        </span>

                        <h3>
                          Secure Shopping
                        </h3>

                        <p>
                          Your account and
                          payments are
                          protected.
                        </p>

                      </div>


                      <div className="reason-card">

                        <span>
                          ⭐
                        </span>

                        <h3>
                          Trusted Products
                        </h3>

                        <p>
                          Shop products rated
                          and reviewed by
                          real customers.
                        </p>

                      </div>

                    </div>

                  </section>

                </>

              )}

            </>

          )}

      </main>


      {/* ===================================================
          FOOTER
          =================================================== */}

      <footer className="flip-footer">

        <div className="flip-footer-inner">


          <div className="footer-brand">

            <div className="flip-logo">

              AI<span>
                Commerce
              </span>

            </div>

            <p>
              Your smarter destination
              for online shopping.
            </p>

          </div>


          <div className="footer-column">

            <h3>
              About
            </h3>

            <Link to="/">
              About Us
            </Link>

            <Link to="/">
              Contact
            </Link>

            <Link to="/">
              Careers
            </Link>

          </div>


          <div className="footer-column">

            <h3>
              Help
            </h3>

            <Link to="/cart">
              Payments
            </Link>

            <Link to="/">
              Shipping
            </Link>

            <Link to="/">
              Returns
            </Link>

          </div>


          <div className="footer-column">

            <h3>
              Policy
            </h3>

            <Link to="/">
              Privacy
            </Link>

            <Link to="/">
              Terms
            </Link>

            <Link to="/">
              Security
            </Link>

          </div>

        </div>


        <div className="footer-bottom">

          <span>
            © 2026 AICommerce.
            All rights reserved.
          </span>

          <span>
            Made for smarter shopping.
          </span>

        </div>

      </footer>

    </div>
  );
}


export default Dashboard;