import { useEffect, useState } from "react";

import {
  MapPin,
  CreditCard,
  Truck,
  ShieldCheck,
  ArrowLeft,
  LockKeyhole,
  Home,
  Briefcase,
  MapPinned,
  Plus,
  Check,
  Pencil,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";


function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const checkoutData = location.state;

  /* =========================================================
     AUTH
     ========================================================= */

  const token = localStorage.getItem(
    "aicommerce-token"
  );


  /* =========================================================
     ADDRESS STATE
     ========================================================= */

  const [addresses, setAddresses] =
    useState([]);

  const [selectedAddressId, setSelectedAddressId] =
    useState(null);

  const [loadingAddresses, setLoadingAddresses] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  /* =========================================================
     AUTH CHECK + LOAD ADDRESSES
     ========================================================= */

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!checkoutData) {
      return;
    }

    loadAddresses();
  }, [token]);


  /* =========================================================
     LOAD SAVED ADDRESSES
     ========================================================= */

  const loadAddresses = async () => {
    setLoadingAddresses(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/addresses",
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to load saved addresses"
        );
      }

      const savedAddresses =
        data.addresses || [];

      setAddresses(savedAddresses);


      /* =====================================================
         AUTOMATICALLY SELECT DEFAULT ADDRESS
         ===================================================== */

      const defaultAddress =
        savedAddresses.find(
          (address) =>
            address.isDefault
        );

      if (defaultAddress) {
        setSelectedAddressId(
          defaultAddress._id
        );
      } else if (
        savedAddresses.length > 0
      ) {
        setSelectedAddressId(
          savedAddresses[0]._id
        );
      }

    } catch (error) {
      setMessage(
        error.message ||
        "Unable to load addresses"
      );
    } finally {
      setLoadingAddresses(false);
    }
  };


  /* =========================================================
     CHECKOUT DATA
     ========================================================= */

  if (!token) {
    return null;
  }


  if (!checkoutData) {
    return (
      <main className="checkout-page">

        <div className="checkout-empty">

          <h1>
            Checkout information not found
          </h1>

          <p>
            Please return to your cart
            and try again.
          </p>

          <Link
            to="/cart"
            className="checkout-back-button"
          >
            <ArrowLeft size={16} />
            Back to Cart
          </Link>

        </div>

      </main>
    );
  }


  const {
    cart = [],
    subtotal = 0,
    couponDiscount = 0,
    deliveryFee = 0,
    platformFee = 20,
    handlingFee = 5,
    total = 0,
    coupon = null,
  } = checkoutData;


  /* =========================================================
     SELECTED ADDRESS
     ========================================================= */

  const selectedAddress =
    addresses.find(
      (address) =>
        address._id ===
        selectedAddressId
    );


  /* =========================================================
     ADDRESS ICON
     ========================================================= */

  const getAddressIcon = (label) => {
    if (label === "Home") {
      return <Home size={18} />;
    }

    if (label === "Work") {
      return (
        <Briefcase size={18} />
      );
    }

    return (
      <MapPinned size={18} />
    );
  };


  /* =========================================================
     CONTINUE TO PAYMENT
     ========================================================= */

  const handleContinue = () => {
    setMessage("");

    if (!selectedAddress) {
      setMessage(
        "Please select a delivery address."
      );

      return;
    }

    setLoading(true);


    /* =====================================================
       MOVE TO PAYMENT
       ===================================================== */

    setTimeout(() => {

      navigate("/payment", {
        state: {
          cart,

          address: {
            name:
              selectedAddress.name,

            phone:
              selectedAddress.phone,

            address:
              selectedAddress.address,

            city:
              selectedAddress.city,

            state:
              selectedAddress.state,

            pincode:
              selectedAddress.pincode,

            label:
              selectedAddress.label,

            addressId:
              selectedAddress._id,
          },

          subtotal,

          couponDiscount,

          deliveryFee,

          platformFee,

          handlingFee,

          total,

          coupon,
        },
      });

      setLoading(false);

    }, 300);
  };


  /* =========================================================
     UI
     ========================================================= */

  return (
    <main className="checkout-page">

      <div className="checkout-container">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="checkout-header">

          <div>

            <h1>
              Checkout
            </h1>

            <p>
              Complete your order securely
            </p>

          </div>


          <div className="checkout-secure">

            <ShieldCheck size={17} />

            Secure Checkout

          </div>

        </div>


        {/* =================================================
            PROGRESS
        ================================================= */}

        <div className="checkout-progress">

          <div className="checkout-step active">

            <span>
              1
            </span>

            <strong>
              Address
            </strong>

          </div>


          <div className="checkout-line" />


          <div className="checkout-step">

            <span>
              2
            </span>

            <strong>
              Payment
            </strong>

          </div>


          <div className="checkout-line" />


          <div className="checkout-step">

            <span>
              3
            </span>

            <strong>
              Confirmation
            </strong>

          </div>

        </div>


        {/* =================================================
            MAIN LAYOUT
        ================================================= */}

        <div className="checkout-layout">


          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <section className="checkout-left">


            {/* =================================================
                SAVED ADDRESSES
            ================================================= */}

            <div className="checkout-card">


              {/* HEADER */}

              <div className="checkout-card-heading">

                <div className="checkout-heading-icon">

                  <MapPin size={19} />

                </div>


                <div>

                  <h2>
                    Delivery Address
                  </h2>

                  <p>
                    Select where you want
                    your order delivered
                  </p>

                </div>

              </div>


              {/* =================================================
                  LOADING
              ================================================= */}

              {loadingAddresses ? (

                <div className="checkout-address-loading">

                  Loading your saved
                  addresses...

                </div>

              ) : addresses.length === 0 ? (

                /* =================================================
                   NO ADDRESSES
                ================================================= */

                <div className="checkout-no-address">

                  <div className="checkout-no-address-icon">

                    <MapPin size={25} />

                  </div>


                  <h3>
                    No saved addresses
                  </h3>


                  <p>
                    You don't have any saved
                    delivery addresses yet.
                  </p>


                  <Link
                    to="/profile"
                    className="checkout-add-address-button"
                  >

                    <Plus size={16} />

                    Add Address

                  </Link>

                </div>

              ) : (

                /* =================================================
                   ADDRESS LIST
                ================================================= */

                <div className="checkout-address-list">

                  {addresses.map(
                    (address) => {

                      const isSelected =
                        selectedAddressId ===
                        address._id;


                      return (

                        <button
                          type="button"
                          key={
                            address._id
                          }
                          className={
                            isSelected
                              ? "checkout-address-card selected"
                              : "checkout-address-card"
                          }
                          onClick={() =>
                            setSelectedAddressId(
                              address._id
                            )
                          }
                        >


                          {/* ADDRESS TOP */}

                          <div className="checkout-address-top">


                            <div className="checkout-address-type">

                              <div className="checkout-address-icon">

                                {getAddressIcon(
                                  address.label
                                )}

                              </div>


                              <strong>

                                {address.label}

                              </strong>


                              {address.isDefault && (

                                <span className="checkout-default-badge">

                                  DEFAULT

                                </span>

                              )}

                            </div>


                            {/* CHECK */}

                            <div
                              className={
                                isSelected
                                  ? "checkout-address-check checked"
                                  : "checkout-address-check"
                              }
                            >

                              {isSelected && (
                                <Check
                                  size={15}
                                />
                              )}

                            </div>

                          </div>


                          {/* ADDRESS DETAILS */}

                          <div className="checkout-address-details">

                            <strong>
                              {address.name}
                            </strong>


                            <span>
                              {address.phone}
                            </span>


                            <p>
                              {address.address}
                            </p>


                            <p>
                              {address.city},{" "}
                              {address.state} -{" "}
                              {address.pincode}
                            </p>

                          </div>


                        </button>

                      );

                    }
                  )}


                  {/* =================================================
                     MANAGE ADDRESSES
                  ================================================= */}

                  <Link
                    to="/profile"
                    className="checkout-manage-addresses"
                  >

                    <Pencil size={15} />

                    Manage Saved Addresses

                  </Link>

                </div>

              )}


              {/* =================================================
                  MESSAGE
              ================================================= */}

              {message && (

                <div className="checkout-error">

                  {message}

                </div>

              )}


              {/* =================================================
                  CONTINUE
              ================================================= */}

              {addresses.length > 0 && (

                <button
                  type="button"
                  className="continue-payment-button"
                  onClick={
                    handleContinue
                  }
                  disabled={loading}
                >

                  <CreditCard
                    size={17}
                  />

                  {loading
                    ? "Continuing..."
                    : "Continue to Payment"}

                </button>

              )}

            </div>


            {/* =================================================
                DELIVERY INFO
            ================================================= */}

            <div className="checkout-info-card">

              <Truck size={20} />

              <div>

                <strong>
                  Estimated Delivery
                </strong>

                <p>
                  Your order will usually
                  arrive within 3–7 business
                  days.
                </p>

              </div>

            </div>


            {/* =================================================
                SECURITY
            ================================================= */}

            <div className="checkout-security">

              <LockKeyhole size={17} />

              <span>
                Your personal information is
                encrypted and securely handled.
              </span>

            </div>


            {/* =================================================
                BACK TO CART
            ================================================= */}

            <Link
              to="/cart"
              className="checkout-back-link"
            >

              <ArrowLeft size={15} />

              Return to Cart

            </Link>

          </section>


          {/* =================================================
              RIGHT — ORDER SUMMARY
          ================================================= */}

          <aside className="checkout-summary">


            <h2>
              Order Summary
            </h2>


            {/* =================================================
                PRODUCTS
            ================================================= */}

            <div className="checkout-products">

              {cart.map(
                (product, index) => (

                  <div
                    className="checkout-product"
                    key={
                      product.id ||
                      product._id ||
                      index
                    }
                  >

                    <img
                      src={
                        product.image
                      }
                      alt={
                        product.name
                      }
                    />


                    <div>

                      <strong>
                        {product.name}
                      </strong>

                      <span>
                        Qty:{" "}
                        {product.quantity ||
                          1}
                      </span>

                    </div>


                    <b>
                      ₹
                      {(
                        Number(
                          product.price ||
                            0
                        ) *
                        Number(
                          product.quantity ||
                            1
                        )
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </b>

                  </div>

                )
              )}

            </div>


            <div className="checkout-divider" />


            {/* =================================================
                ITEM TOTAL
            ================================================= */}

            <div className="checkout-price-row">

              <span>
                Item Total
              </span>

              <strong>
                ₹
                {Number(
                  subtotal
                ).toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>


            {/* =================================================
                DISCOUNT
            ================================================= */}

            {couponDiscount > 0 && (

              <div className="checkout-price-row discount">

                <span>
                  Discount
                </span>

                <strong>
                  - ₹
                  {Number(
                    couponDiscount
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

            )}


            {/* =================================================
                COUPON
            ================================================= */}

            {coupon && (

              <div className="checkout-coupon">

                🏷️

                <span>
                  {coupon} applied
                </span>

              </div>

            )}


            {/* =================================================
                DELIVERY FEE
            ================================================= */}

            <div className="checkout-price-row">

              <span>
                Delivery Fee
              </span>

              <strong>

                {deliveryFee === 0
                  ? "FREE"
                  : `₹${Number(
                      deliveryFee
                    ).toLocaleString(
                      "en-IN"
                    )}`}

              </strong>

            </div>


            {/* =================================================
                PLATFORM FEE
            ================================================= */}

            <div className="checkout-price-row">

              <span>
                Platform Fee
              </span>

              <strong>
                ₹
                {Number(
                  platformFee
                ).toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>


            {/* =================================================
                HANDLING FEE
            ================================================= */}

            <div className="checkout-price-row">

              <span>
                Handling Fee
              </span>

              <strong>
                ₹
                {Number(
                  handlingFee
                ).toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>


            <div className="checkout-divider" />


            {/* =================================================
                TOTAL
            ================================================= */}

            <div className="checkout-total">

              <span>
                Total Amount
              </span>

              <strong>
                ₹
                {Number(
                  total
                ).toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>


            {/* =================================================
                PROTECTION
            ================================================= */}

            <div className="checkout-protection">

              <ShieldCheck size={16} />

              <span>
                Safe & secure shopping
              </span>

            </div>

          </aside>

        </div>

      </div>

    </main>
  );
}


export default Checkout;