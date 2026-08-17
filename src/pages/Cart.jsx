import { useMemo, useState } from "react";

import {
  ShoppingCart,
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  Tag,
  Truck,
  ShieldCheck,
  CreditCard,
  LockKeyhole,
  X,
  CheckCircle2,
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
   COUPONS
   ========================================================= */

const COUPONS = {
  AICOMMERCE10: {
    type: "percentage",
    value: 10,
    label: "10% OFF",
    description: "10% discount on your order",
  },

  SAVE200: {
    type: "flat",
    value: 200,
    label: "₹200 OFF",
    description: "Flat ₹200 discount",
  },

  FREESHIP: {
    type: "delivery",
    value: 0,
    label: "FREE DELIVERY",
    description: "Delivery charges waived",
  },
};


/* =========================================================
   CONSTANTS
   ========================================================= */

const PLATFORM_FEE = 20;

const HANDLING_FEE = 5;

const FREE_DELIVERY_LIMIT = 499;

const DELIVERY_FEE = 40;


/* =========================================================
   CART PAGE
   ========================================================= */

function Cart() {
  const navigate = useNavigate();


  /* =======================================================
     AUTH
     ======================================================= */

  const token = localStorage.getItem(
    "aicommerce-token"
  );


  /* =======================================================
     CART STATE
     ======================================================= */

  const [cart, setCart] = useState(() => {
  return getUserCart();
});


  /* =======================================================
     COUPON STATE
     ======================================================= */

  const [couponInput, setCouponInput] =
    useState("");

  const [appliedCoupon, setAppliedCoupon] =
    useState(null);

  const [couponMessage, setCouponMessage] =
    useState("");

  const [couponError, setCouponError] =
    useState("");


  /* =======================================================
     UPDATE CART
     ======================================================= */

 const saveCart = (
  updatedCart
) => {

  setCart(updatedCart);

  saveUserCart(
    updatedCart
  );

};


  /* =======================================================
     QUANTITY
     ======================================================= */

  const increaseQuantity = (index) => {
    const updatedCart = cart.map(
      (item, itemIndex) => {

        if (itemIndex !== index) {
          return item;
        }

        return {
          ...item,
          quantity:
            Number(item.quantity || 1) + 1,
        };
      }
    );

    saveCart(updatedCart);
  };


  const decreaseQuantity = (index) => {
    const updatedCart = cart
      .map((item, itemIndex) => {

        if (itemIndex !== index) {
          return item;
        }

        const quantity =
          Number(item.quantity || 1);

        return {
          ...item,
          quantity:
            Math.max(1, quantity - 1),
        };
      });

    saveCart(updatedCart);
  };


  /* =======================================================
     REMOVE PRODUCT
     ======================================================= */

  const removeProduct = (index) => {
    const updatedCart = cart.filter(
      (_, itemIndex) =>
        itemIndex !== index
    );

    saveCart(updatedCart);

    /*
     * If all products are removed,
     * remove coupon as well.
     */

    if (updatedCart.length === 0) {
      setAppliedCoupon(null);
      setCouponMessage("");
    }
  };


  /* =======================================================
     CLEAR CART
     ======================================================= */

  const clearCart = () => {
    saveCart([]);

    setAppliedCoupon(null);

    setCouponInput("");

    setCouponMessage("");
  };


  /* =======================================================
     ITEM COUNT
     ======================================================= */

  const itemCount = cart.reduce(
    (total, product) =>
      total +
      Number(product.quantity || 1),
    0
  );


  /* =======================================================
     SUBTOTAL
     ======================================================= */

  const subtotal = useMemo(() => {
    return cart.reduce(
      (total, product) => {

        const price =
          Number(product.price || 0);

        const quantity =
          Number(product.quantity || 1);

        return total + price * quantity;
      },
      0
    );
  }, [cart]);


  /* =======================================================
     COUPON DISCOUNT
     ======================================================= */

  const couponDiscount = useMemo(() => {

    if (!appliedCoupon) {
      return 0;
    }

    const coupon =
      COUPONS[appliedCoupon];

    if (!coupon) {
      return 0;
    }

    if (
      coupon.type ===
      "percentage"
    ) {
      return Math.round(
        subtotal *
        (coupon.value / 100)
      );
    }

    if (
      coupon.type ===
      "flat"
    ) {
      return Math.min(
        coupon.value,
        subtotal
      );
    }

    return 0;

  }, [
    subtotal,
    appliedCoupon,
  ]);


  /* =======================================================
     DELIVERY
     ======================================================= */

  const deliveryFee = useMemo(() => {

    /*
     * FREESHIP coupon
     */

    if (
      appliedCoupon ===
      "FREESHIP"
    ) {
      return 0;
    }


    /*
     * Orders above ₹499
     * get free delivery.
     */

    if (
      subtotal >=
      FREE_DELIVERY_LIMIT
    ) {
      return 0;
    }


    /*
     * Empty cart
     */

    if (subtotal === 0) {
      return 0;
    }


    return DELIVERY_FEE;

  }, [
    subtotal,
    appliedCoupon,
  ]);


  /* =======================================================
     TOTAL
     ======================================================= */

  const finalAmount =
    Math.max(
      0,
      subtotal -
        couponDiscount +
        deliveryFee +
        PLATFORM_FEE +
        HANDLING_FEE
    );


  /* =======================================================
     APPLY COUPON
     ======================================================= */

  const applyCoupon = () => {

    setCouponMessage("");

    setCouponError("");


    const code =
      couponInput
        .trim()
        .toUpperCase();


    if (!code) {
      setCouponError(
        "Enter a coupon code."
      );

      return;
    }


    const coupon =
      COUPONS[code];


    if (!coupon) {

      setCouponError(
        "Invalid coupon code."
      );

      return;
    }


    /*
     * Minimum order for discounts
     */

    if (
      code === "SAVE200" &&
      subtotal < 1000
    ) {

      setCouponError(
        "SAVE200 requires a minimum order of ₹1,000."
      );

      return;
    }


    if (
      code === "AICOMMERCE10" &&
      subtotal < 500
    ) {

      setCouponError(
        "AICOMMERCE10 requires a minimum order of ₹500."
      );

      return;
    }


    setAppliedCoupon(code);

    setCouponMessage(
      `${coupon.label} applied successfully.`
    );

  };


  /* =======================================================
     REMOVE COUPON
     ======================================================= */

  const removeCoupon = () => {

    setAppliedCoupon(null);

    setCouponInput("");

    setCouponMessage("");

    setCouponError("");
  };


  /* =======================================================
     CHECKOUT
     ======================================================= */

  const handleCheckout = () => {

    /*
     * Authentication is already required
     * for this cart page.
     */

    navigate("/checkout", {
      state: {
        cart,
        subtotal,
        couponDiscount,
        deliveryFee,
        platformFee:
          PLATFORM_FEE,
        handlingFee:
          HANDLING_FEE,
        total: finalAmount,
        coupon:
          appliedCoupon,
      },
    });
  };


  /* =======================================================
     NOT LOGGED IN
     ======================================================= */

  if (!token) {
    return (
      <main className="cart-page">

        <div className="cart-login-card">

          <div className="cart-big-icon">
            <ShoppingCart size={42} />
          </div>


          <h1>
            Your Cart is Waiting
          </h1>


          <p>
            Login to view your cart,
            save products, and complete
            your purchase.
          </p>


          <Link
            to="/login"
            className="cart-login-button"
          >
            Login to Continue
          </Link>


          <Link
            to="/"
            className="cart-back"
          >
            <ArrowLeft size={15} />
            Continue Shopping
          </Link>

        </div>

      </main>
    );
  }


  /* =======================================================
     EMPTY CART
     ======================================================= */

  if (cart.length === 0) {
    return (
      <main className="cart-page">

        <div className="cart-login-card">

          <div className="cart-big-icon">
            <ShoppingCart size={42} />
          </div>


          <h1>
            Your Cart is Empty
          </h1>


          <p>
            You haven't added anything
            to your cart yet.
          </p>


          <Link
            to="/"
            className="cart-login-button"
          >
            Start Shopping
          </Link>

        </div>

      </main>
    );
  }


  /* =======================================================
     CART UI
     ======================================================= */

  return (
    <main className="cart-page">

      <div className="proper-cart-container">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="proper-cart-header">

          <div>

            <h1>
              Shopping Cart
            </h1>

            <p>
              {itemCount}{" "}
              {itemCount === 1
                ? "item"
                : "items"}{" "}
              in your cart
            </p>

          </div>


          <button
            type="button"
            className="clear-cart-button"
            onClick={clearCart}
          >
            <Trash2 size={15} />

            Clear Cart
          </button>

        </div>


        {/* =================================================
            CART LAYOUT
        ================================================= */}

        <div className="proper-cart-layout">


          {/* ===============================================
              LEFT SIDE
          =============================================== */}

          <section className="cart-left">


            {/* =============================================
                PRODUCTS
            ============================================= */}

            <div className="proper-cart-card">

              <div className="cart-card-title">

                <div>

                  <h2>
                    Your Items
                  </h2>

                  <span>
                    {itemCount} items
                  </span>

                </div>

              </div>


              <div className="proper-cart-products">

                {cart.map(
                  (product, index) => {

                    const quantity =
                      Number(
                        product.quantity ||
                        1
                      );

                    const itemTotal =
                      Number(
                        product.price ||
                        0
                      ) * quantity;


                    return (
                      <div
                        className="proper-cart-product"
                        key={
                          product.id ||
                          product._id ||
                          index
                        }
                      >


                        {/* PRODUCT IMAGE */}

                        <div className="proper-product-image">

                          <img
                            src={
                              product.image
                            }
                            alt={
                              product.name
                            }
                          />

                        </div>


                        {/* PRODUCT DETAILS */}

                        <div className="proper-product-details">

                          <h3>
                            {product.name}
                          </h3>


                          <span className="product-category">

                            {product.category ||
                              "Product"}

                          </span>


                          <div className="cart-product-rating">

                            <span>
                              ★{" "}
                              {product.rating ||
                                "4.5"}
                            </span>

                            <small>
                              {product.reviews ||
                                "1,000"}{" "}
                              ratings
                            </small>

                          </div>


                          <div className="proper-product-price">

                            <strong>
                              ₹
                              {Number(
                                product.price ||
                                0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </strong>

                            {product.oldPrice && (

                              <del>
                                ₹
                                {Number(
                                  product.oldPrice
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </del>

                            )}

                          </div>

                        </div>


                        {/* QUANTITY */}

                        <div className="cart-quantity-area">

                          <span>
                            Quantity
                          </span>


                          <div className="quantity-control">

                            <button
                              type="button"
                              onClick={() =>
                                decreaseQuantity(
                                  index
                                )
                              }
                              disabled={
                                quantity <=
                                1
                              }
                            >
                              <Minus
                                size={14}
                              />
                            </button>


                            <strong>
                              {quantity}
                            </strong>


                            <button
                              type="button"
                              onClick={() =>
                                increaseQuantity(
                                  index
                                )
                              }
                            >
                              <Plus
                                size={14}
                              />
                            </button>

                          </div>

                        </div>


                        {/* ITEM TOTAL */}

                        <div className="cart-item-total">

                          <strong>
                            ₹
                            {itemTotal.toLocaleString(
                              "en-IN"
                            )}
                          </strong>


                          <button
                            type="button"
                            onClick={() =>
                              removeProduct(
                                index
                              )
                            }
                          >
                            <Trash2
                              size={15}
                            />

                            Remove
                          </button>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </div>


            {/* =============================================
                DELIVERY INFORMATION
            ============================================= */}

            <div className="cart-service-card">

              <div className="service-box">

                <Truck size={20} />

                <div>

                  <strong>
                    Delivery
                  </strong>

                  <p>
                    {deliveryFee === 0
                      ? "Free delivery on this order"
                      : `Delivery charge ₹${DELIVERY_FEE}`}
                  </p>

                </div>

              </div>


              <div className="service-box">

                <ShieldCheck
                  size={20}
                />

                <div>

                  <strong>
                    Secure Payment
                  </strong>

                  <p>
                    Your payment information
                    is protected.
                  </p>

                </div>

              </div>

            </div>


            {/* =============================================
                COUPON
            ============================================= */}

            <div className="proper-cart-card coupon-card">

              <div className="coupon-title">

                <div className="coupon-icon">

                  <Tag size={19} />

                </div>


                <div>

                  <h2>
                    Apply Coupon
                  </h2>

                  <p>
                    Save more on your order
                  </p>

                </div>

              </div>


              {appliedCoupon ? (

                <div className="applied-coupon">

                  <div>

                    <CheckCircle2
                      size={18}
                    />

                    <div>

                      <strong>
                        {appliedCoupon}
                      </strong>

                      <span>
                        {
                          COUPONS[
                            appliedCoupon
                          ].description
                        }
                      </span>

                    </div>

                  </div>


                  <button
                    type="button"
                    onClick={
                      removeCoupon
                    }
                  >
                    <X size={16} />
                    Remove
                  </button>

                </div>

              ) : (

                <div className="coupon-input-row">

                  <div className="coupon-input-wrapper">

                    <Tag size={16} />

                    <input
                      type="text"
                      value={
                        couponInput
                      }
                      onChange={(
                        event
                      ) =>
                        setCouponInput(
                          event.target
                            .value
                        )
                      }
                      onKeyDown={(
                        event
                      ) => {

                        if (
                          event.key ===
                          "Enter"
                        ) {
                          applyCoupon();
                        }

                      }}
                      placeholder="Enter coupon code"
                    />

                  </div>


                  <button
                    type="button"
                    onClick={
                      applyCoupon
                    }
                  >
                    Apply
                  </button>

                </div>

              )}


              {couponMessage && (

                <p className="coupon-success">

                  <CheckCircle2
                    size={14}
                  />

                  {couponMessage}

                </p>

              )}


              {couponError && (

                <p className="coupon-error">

                  {couponError}

                </p>

              )}


              {!appliedCoupon && (

                <div className="available-coupons">

                  <span>
                    Available coupons:
                  </span>


                  <button
                    type="button"
                    onClick={() =>
                      setCouponInput(
                        "AICOMMERCE10"
                      )
                    }
                  >
                    AICOMMERCE10
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      setCouponInput(
                        "SAVE200"
                      )
                    }
                  >
                    SAVE200
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      setCouponInput(
                        "FREESHIP"
                      )
                    }
                  >
                    FREESHIP
                  </button>

                </div>

              )}

            </div>

          </section>


          {/* ===============================================
              RIGHT SIDE — PRICE DETAILS
          =============================================== */}

          <aside className="proper-price-card">

            <div className="price-card-heading">

              <h2>
                Price Details
              </h2>

              <span>
                {itemCount} items
              </span>

            </div>


            {/* ITEM TOTAL */}

            <div className="price-row">

              <span>
                Item Total
              </span>

              <strong>
                ₹
                {subtotal.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>


            {/* COUPON */}

            <div className="price-row discount-row">

              <span>
                Discount
              </span>

              <strong>
                - ₹
                {couponDiscount.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>


            {/* DELIVERY */}

            <div className="price-row">

              <span>
                <span className="price-label-with-icon">

                  Delivery Fee

                  <Truck
                    size={13}
                  />

                </span>
              </span>


              <strong
                className={
                  deliveryFee === 0
                    ? "free-price"
                    : ""
                }
              >
                {deliveryFee === 0
                  ? "FREE"
                  : `₹${deliveryFee}`}
              </strong>

            </div>


            {/* PLATFORM */}

            <div className="price-row">

              <span>
                Platform Fee
              </span>

              <strong>
                ₹
                {PLATFORM_FEE}
              </strong>

            </div>


            {/* HANDLING */}

            <div className="price-row">

              <span>
                Handling Fee
              </span>

              <strong>
                ₹
                {HANDLING_FEE}
              </strong>

            </div>


            {/* FREE DELIVERY MESSAGE */}

            {deliveryFee === 0 &&
              appliedCoupon !==
                "FREESHIP" && (

                <div className="free-delivery-message">

                  🎉

                  <span>
                    You got FREE delivery
                    because your order is
                    above ₹499.
                  </span>

                </div>

              )}


            {/* DIVIDER */}

            <div className="price-divider" />


            {/* TOTAL */}

            <div className="final-price-row">

              <span>
                Total Amount
              </span>

              <strong>
                ₹
                {finalAmount.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>


            {/* SAVINGS */}

            {(couponDiscount > 0 ||
              deliveryFee === 0) && (

              <div className="total-savings">

                🎉

                <span>

                  You are saving{" "}

                  <strong>
                    ₹
                    {(
                      couponDiscount +
                      (deliveryFee ===
                      0
                        ? DELIVERY_FEE
                        : 0)
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                  {" "}on this order.

                </span>

              </div>

            )}


            {/* CHECKOUT */}

            <button
              type="button"
              className="proceed-checkout-button"
              onClick={
                handleCheckout
              }
            >

              <LockKeyhole
                size={17}
              />

              Proceed to Checkout

            </button>


            {/* PAYMENT SECURITY */}

            <div className="payment-security">

              <ShieldCheck
                size={17}
              />

              <span>
                Safe and secure payments
              </span>

            </div>


            {/* PAYMENT METHODS */}

            <div className="payment-methods">

              <span>
                <CreditCard
                  size={15}
                />
                Cards
              </span>

              <span>
                UPI
              </span>

              <span>
                COD
              </span>

            </div>

          </aside>

        </div>


        {/* =================================================
            CONTINUE SHOPPING
        ================================================= */}

        <Link
          to="/"
          className="proper-continue-shopping"
        >

          <ArrowLeft size={16} />

          Continue Shopping

        </Link>

      </div>

    </main>
  );
}


export default Cart;