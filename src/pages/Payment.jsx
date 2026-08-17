import { useState } from "react";

import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Landmark,
  Banknote,
  LockKeyhole,
  CheckCircle2,
  MapPin,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  clearUserCart,
} from "../utils/cartStorage";


function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const orderData = location.state;

  const token = localStorage.getItem(
    "aicommerce-token"
  );


  /* =========================================================
     PAYMENT STATE
     ========================================================= */

  const [paymentMethod, setPaymentMethod] =
    useState("cod");

  const [upiId, setUpiId] =
    useState("");

  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  const [bank, setBank] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  /* =========================================================
     AUTH CHECK
     ========================================================= */

  if (!token) {
    return null;
  }


  /* =========================================================
     ORDER DATA CHECK
     ========================================================= */

  if (!orderData) {
    return (
      <main className="payment-page">

        <div className="payment-empty">

          <h1>
            Payment information not found
          </h1>

          <p>
            Please return to checkout
            and try again.
          </p>

          <Link
            to="/cart"
            className="payment-back-button"
          >
            <ArrowLeft size={16} />
            Back to Cart
          </Link>

        </div>

      </main>
    );
  }


  /* =========================================================
     ORDER DATA
     ========================================================= */

  const {
    cart = [],
    address = null,
    subtotal = 0,
    couponDiscount = 0,
    deliveryFee = 0,
    platformFee = 0,
    handlingFee = 0,
    total = 0,
    coupon = null,
  } = orderData;


  /* =========================================================
     CARD CHANGE
     ========================================================= */

  const handleCardChange = (event) => {

    setCard({
      ...card,
      [event.target.name]:
        event.target.value,
    });

  };


  /* =========================================================
     PLACE ORDER
     ========================================================= */

  const handlePlaceOrder = async () => {

    setError("");


    /* =======================================================
       ADDRESS VALIDATION
       ======================================================= */

    if (!address) {

      setError(
        "Delivery address is missing. Please go back to checkout."
      );

      return;
    }


    const fullName =
      address.name ||
      address.fullName ||
      "";

    const phone =
      address.phone || "";

    const deliveryAddress =
      address.address || "";

    const city =
      address.city || "";

    const state =
      address.state || "";

    const pincode =
      address.pincode || "";


    if (!fullName.trim()) {

      setError(
        "Delivery name is required."
      );

      return;
    }


    if (!phone.trim()) {

      setError(
        "Delivery phone number is required."
      );

      return;
    }


    if (!deliveryAddress.trim()) {

      setError(
        "Delivery address is required."
      );

      return;
    }


    if (!city.trim()) {

      setError(
        "Delivery city is required."
      );

      return;
    }


    if (!state.trim()) {

      setError(
        "Delivery state is required."
      );

      return;
    }


    if (!pincode.trim()) {

      setError(
        "Delivery pincode is required."
      );

      return;
    }


    /* =======================================================
       UPI VALIDATION
       ======================================================= */

    if (
      paymentMethod === "upi"
    ) {

      if (!upiId.trim()) {

        setError(
          "Please enter your UPI ID."
        );

        return;
      }


      const upiPattern =
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+$/;


      if (
        !upiPattern.test(
          upiId.trim()
        )
      ) {

        setError(
          "Please enter a valid UPI ID."
        );

        return;
      }

    }


    /* =======================================================
       CARD VALIDATION
       ======================================================= */

    if (
      paymentMethod === "card"
    ) {

      if (
        !card.number.trim() ||
        !card.name.trim() ||
        !card.expiry.trim() ||
        !card.cvv.trim()
      ) {

        setError(
          "Please enter all card details."
        );

        return;
      }


      const cardNumber =
        card.number.replace(
          /\s/g,
          ""
        );


      if (
        !/^\d{16}$/.test(
          cardNumber
        )
      ) {

        setError(
          "Please enter a valid 16-digit card number."
        );

        return;
      }


      if (
        !/^\d{2}\/\d{2}$/.test(
          card.expiry
        )
      ) {

        setError(
          "Enter expiry date in MM/YY format."
        );

        return;
      }


      if (
        !/^\d{3,4}$/.test(
          card.cvv
        )
      ) {

        setError(
          "Please enter a valid CVV."
        );

        return;
      }

    }


    /* =======================================================
       NET BANKING VALIDATION
       ======================================================= */

    if (
      paymentMethod === "netbanking"
    ) {

      if (!bank) {

        setError(
          "Please select your bank."
        );

        return;
      }

    }


    /* =======================================================
       TOKEN CHECK
       ======================================================= */

    const authToken =
      localStorage.getItem(
        "aicommerce-token"
      );


    if (!authToken) {

      setError(
        "Your session has expired. Please login again."
      );

      navigate("/login");

      return;
    }


    /* =======================================================
       CART CHECK
       ======================================================= */

    if (
      !cart ||
      cart.length === 0
    ) {

      setError(
        "Your cart is empty. Please add products first."
      );

      return;
    }


    /* =======================================================
       PREPARE ORDER ITEMS
       
       IMPORTANT:
       Backend expects:
       
       {
         product: MongoDB ObjectId,
         quantity: Number
       }
       ======================================================= */

    const items =
      cart.map((product) => {

        const productId =
          product._id ||
          product.productId;


        if (!productId) {

          console.error(
            "Invalid cart product:",
            product
          );

          return null;
        }


        return {
          product: productId,
          quantity:
            Number(
              product.quantity
            ) || 1,
        };

      });


    /* =======================================================
       CHECK PRODUCT IDs
       ======================================================= */

    if (
      items.some(
        (item) => item === null
      )
    ) {

      setError(
        "A product in your cart is missing its database ID. Please remove it and add it again."
      );

      return;
    }


    console.log(
      "ORDER ITEMS SENT TO BACKEND:",
      items
    );


    console.log(
      "ADDRESS BEING SENT:",
      {
        fullName,
        phone,
        address:
          deliveryAddress,
        city,
        state,
        pincode,
      }
    );


    /* =======================================================
       START LOADING
       ======================================================= */

    setLoading(true);


    try {

      /* =====================================================
         CREATE ORDER
         ===================================================== */

      const response =
        await fetch(
          "http://localhost:5000/api/orders",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${authToken}`,
            },


            /* ===============================================
               IMPORTANT FIX #1

               Backend expects shippingAddress
               NOT address
               =============================================== */

            body: JSON.stringify({

              /* =============================================
                 IMPORTANT FIX #2

                 Backend expects:
                 product

                 NOT:
                 productId
                 ============================================= */

              items,


              address: {
  name: fullName,
  phone,
  address: deliveryAddress,
  city,
  state,
  pincode,
},


              paymentMethod,


              coupon:
                coupon || null,


              couponDiscount:
                Number(
                  couponDiscount
                ) || 0,


              deliveryFee:
                Number(
                  deliveryFee
                ) || 0,


              platformFee:
                Number(
                  platformFee
                ) || 0,


              handlingFee:
                Number(
                  handlingFee
                ) || 0,

            }),

          }
        );


      /* =====================================================
         READ BACKEND RESPONSE
         ===================================================== */

      const data =
        await response.json();


      console.log(
        "ORDER API RESPONSE:",
        data
      );


      /* =====================================================
         BACKEND ERROR
         ===================================================== */

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to place order"
        );

      }


      /* =====================================================
         CHECK ORDER
         ===================================================== */

      if (
        !data.success ||
        !data.order
      ) {

        throw new Error(
          "Order could not be created."
        );

      }


      /* =====================================================
         CLEAR CART

         Only clear after MongoDB successfully
         creates the order.
         ===================================================== */

     clearUserCart();


      /* =====================================================
         ORDER SUCCESS

         MongoDB uses _id.
         Don't use data.order.orderId
         unless your schema actually has orderId.
         ===================================================== */

      navigate(
        "/order-success",
        {
          state: {

            ...orderData,

            paymentMethod,

            orderId:
              data.order._id,

            order:
              data.order,

          },

        }
      );


    } catch (error) {

      console.error(
        "Place Order Error:",
        error
      );


      setError(
        error.message ||
        "Failed to place order. Please try again."
      );


    } finally {

      setLoading(false);

    }

  };


  /* =========================================================
     PAYMENT METHODS
     ========================================================= */

  const paymentMethods = [

    {
      id: "upi",
      title: "UPI",
      description:
        "Google Pay, PhonePe, Paytm & more",
      icon: Smartphone,
    },

    {
      id: "card",
      title:
        "Credit / Debit Card",
      description:
        "Visa, Mastercard, RuPay",
      icon: CreditCard,
    },

    {
      id: "netbanking",
      title:
        "Net Banking",
      description:
        "Pay using your bank account",
      icon: Landmark,
    },

    {
      id: "cod",
      title:
        "Cash on Delivery",
      description:
        "Pay when your order arrives",
      icon: Banknote,
    },

  ];


  /* =========================================================
     UI
     ========================================================= */

  return (

    <main className="payment-page">

      <div className="payment-container">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="payment-header">

          <div>

            <span className="payment-eyebrow">
              SECURE CHECKOUT
            </span>

            <h1>
              Choose Payment Method
            </h1>

            <p>
              Select your preferred way
              to pay
            </p>

          </div>


          <div className="payment-secure">

            <ShieldCheck
              size={18}
            />

            <span>
              Secure Payment
            </span>

          </div>

        </div>


        {/* =================================================
            PROGRESS
        ================================================= */}

        <div className="payment-progress">

          <div className="payment-progress-step completed">

            <CheckCircle2
              size={17}
            />

            <span>
              Address
            </span>

          </div>


          <div className="payment-progress-line active" />


          <div className="payment-progress-step active">

            <span className="payment-step-number">
              2
            </span>

            <span>
              Payment
            </span>

          </div>


          <div className="payment-progress-line" />


          <div className="payment-progress-step">

            <span className="payment-step-number">
              3
            </span>

            <span>
              Confirmation
            </span>

          </div>

        </div>


        {/* =================================================
            MAIN LAYOUT
        ================================================= */}

        <div className="payment-layout">


          {/* =================================================
              LEFT
          ================================================= */}

          <section className="payment-left">


            {/* =================================================
                DELIVERY ADDRESS
            ================================================= */}

            <div className="payment-card">

              <div className="payment-card-header">

                <div className="payment-card-icon">

                  <MapPin
                    size={18}
                  />

                </div>


                <div>

                  <h2>
                    Delivering To
                  </h2>

                  <p>
                    Your selected delivery
                    address
                  </p>

                </div>

              </div>


              {address && (

                <div className="payment-address">

                  <div className="payment-address-top">

                    <strong>
                      {address.label ||
                        "Home"}
                    </strong>

                    <span>
                      Selected
                    </span>

                  </div>


                  <strong>
                    {address.name ||
                      address.fullName}
                  </strong>


                  <p>
                    {address.address}
                  </p>


                  <p>
                    {address.city},{" "}
                    {address.state} -{" "}
                    {address.pincode}
                  </p>


                  <p>
                    Mobile:{" "}
                    {address.phone}
                  </p>

                </div>

              )}

            </div>


            {/* =================================================
                PAYMENT METHODS
            ================================================= */}

            <div className="payment-card">

              <div className="payment-card-header">

                <div className="payment-card-icon">

                  <CreditCard
                    size={18}
                  />

                </div>


                <div>

                  <h2>
                    Payment Method
                  </h2>

                  <p>
                    Choose how you want
                    to pay
                  </p>

                </div>

              </div>


              <div className="payment-methods">

                {paymentMethods.map(
                  (method) => {

                    const Icon =
                      method.icon;

                    const selected =
                      paymentMethod ===
                      method.id;


                    return (

                      <button
                        type="button"
                        key={
                          method.id
                        }
                        className={
                          selected
                            ? "payment-method selected"
                            : "payment-method"
                        }
                        onClick={() => {

                          setPaymentMethod(
                            method.id
                          );

                          setError("");

                        }}
                      >

                        <div className="payment-method-icon">

                          <Icon
                            size={20}
                          />

                        </div>


                        <div className="payment-method-content">

                          <strong>
                            {method.title}
                          </strong>

                          <span>
                            {method.description}
                          </span>

                        </div>


                        <div
                          className={
                            selected
                              ? "payment-radio checked"
                              : "payment-radio"
                          }
                        />

                      </button>

                    );

                  }
                )}

              </div>


              {/* =================================================
                  UPI
              ================================================= */}

              {paymentMethod ===
                "upi" && (

                <div className="payment-method-form">

                  <label>

                    UPI ID

                    <input
                      type="text"
                      value={upiId}
                      onChange={(event) =>
                        setUpiId(
                          event.target.value
                        )
                      }
                      placeholder="example@upi"
                    />

                  </label>


                  <p className="payment-hint">

                    Demo payment only.
                    No real payment gateway
                    is connected.

                  </p>

                </div>

              )}


              {/* =================================================
                  CARD
              ================================================= */}

              {paymentMethod ===
                "card" && (

                <div className="payment-method-form">

                  <label>

                    Card Number

                    <input
                      type="text"
                      name="number"
                      value={
                        card.number
                      }
                      onChange={
                        handleCardChange
                      }
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      inputMode="numeric"
                    />

                  </label>


                  <label>

                    Name on Card

                    <input
                      type="text"
                      name="name"
                      value={
                        card.name
                      }
                      onChange={
                        handleCardChange
                      }
                      placeholder="Cardholder name"
                    />

                  </label>


                  <div className="payment-input-grid">

                    <label>

                      Expiry

                      <input
                        type="text"
                        name="expiry"
                        value={
                          card.expiry
                        }
                        onChange={
                          handleCardChange
                        }
                        placeholder="MM/YY"
                        maxLength="5"
                      />

                    </label>


                    <label>

                      CVV

                      <input
                        type="password"
                        name="cvv"
                        value={
                          card.cvv
                        }
                        onChange={
                          handleCardChange
                        }
                        placeholder="CVV"
                        maxLength="4"
                        inputMode="numeric"
                      />

                    </label>

                  </div>


                  <p className="payment-hint">

                    Demo payment only.
                    No real payment gateway
                    is connected.

                  </p>

                </div>

              )}


              {/* =================================================
                  NET BANKING
              ================================================= */}

              {paymentMethod ===
                "netbanking" && (

                <div className="payment-method-form">

                  <label>

                    Select Bank

                    <select
                      value={bank}
                      onChange={(event) =>
                        setBank(
                          event.target.value
                        )
                      }
                    >

                      <option value="">
                        Select your bank
                      </option>

                      <option value="sbi">
                        State Bank of India
                      </option>

                      <option value="hdfc">
                        HDFC Bank
                      </option>

                      <option value="icici">
                        ICICI Bank
                      </option>

                      <option value="axis">
                        Axis Bank
                      </option>

                      <option value="kotak">
                        Kotak Mahindra Bank
                      </option>

                    </select>

                  </label>


                  <p className="payment-hint">

                    Demo payment only.
                    No real banking gateway
                    is connected.

                  </p>

                </div>

              )}


              {/* =================================================
                  COD
              ================================================= */}

              {paymentMethod ===
                "cod" && (

                <div className="cod-info">

                  <Banknote
                    size={22}
                  />

                  <div>

                    <strong>
                      Cash on Delivery
                    </strong>

                    <p>
                      Pay in cash when your
                      order is delivered.
                    </p>

                  </div>

                </div>

              )}

            </div>


            {/* =================================================
                SECURITY
            ================================================= */}

            <div className="payment-security">

              <LockKeyhole
                size={17}
              />

              <div>

                <strong>
                  Your payment is secure
                </strong>

                <p>
                  Your payment information
                  is handled securely.
                </p>

              </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

              <div className="payment-error">

                {error}

              </div>

            )}


            {/* =================================================
                BACK
            ================================================= */}

            <Link
              to="/checkout"
              state={orderData}
              className="payment-back-link"
            >

              <ArrowLeft
                size={15}
              />

              Back to Checkout

            </Link>


          </section>


          {/* =================================================
              RIGHT — ORDER SUMMARY
          ================================================= */}

          <aside className="payment-summary">

            <h2>
              Order Summary
            </h2>


            {/* =================================================
                PRODUCTS
            ================================================= */}

            <div className="payment-products">

              {cart.map(
                (product, index) => (

                  <div
                    className="payment-product"
                    key={
                      product._id ||
                      product.productId ||
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


            <div className="payment-divider" />


            {/* =================================================
                ITEM TOTAL
            ================================================= */}

            <div className="payment-price-row">

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

            {Number(
              couponDiscount
            ) > 0 && (

              <div className="payment-price-row discount">

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

              <div className="payment-coupon">

                🏷️

                <span>
                  {coupon} applied
                </span>

              </div>

            )}


            {/* =================================================
                DELIVERY
            ================================================= */}

            <div className="payment-price-row">

              <span>
                Delivery Fee
              </span>

              <strong>

                {Number(
                  deliveryFee
                ) === 0
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

            <div className="payment-price-row">

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

            <div className="payment-price-row">

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


            <div className="payment-divider" />


            {/* =================================================
                TOTAL
            ================================================= */}

            <div className="payment-total">

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
                PLACE ORDER
            ================================================= */}

            <button
              type="button"
              className="place-order-button"
              onClick={
                handlePlaceOrder
              }
              disabled={loading}
            >

              {loading
                ? "Placing Order..."
                : "Place Order"}

            </button>


            {/* =================================================
                TRUST
            ================================================= */}

            <div className="payment-trust">

              <ShieldCheck
                size={15}
              />

              <span>
                Safe & secure checkout
              </span>

            </div>

          </aside>

        </div>

      </div>

    </main>

  );
}


export default Payment;