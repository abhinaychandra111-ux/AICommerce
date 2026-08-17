import {
  CheckCircle2,
  Package,
  ShoppingBag,
  ArrowRight,
  MapPin,
  CreditCard,
} from "lucide-react";

import {
  Link,
  useLocation,
} from "react-router-dom";


function OrderSuccess() {
  const location = useLocation();

  const orderData =
    location.state || {};

  const {
    address,
    total = 0,
    paymentMethod = "cod",
  } = orderData;


  /* =========================================================
     ORDER ID
     ========================================================= */

  const orderId =
    orderData.orderId ||
    `AIC${Date.now()
      .toString()
      .slice(-8)}`;


  /* =========================================================
     PAYMENT LABEL
     ========================================================= */

  const getPaymentMethod = () => {

    if (paymentMethod === "upi") {
      return "UPI";
    }

    if (paymentMethod === "card") {
      return "Credit / Debit Card";
    }

    if (
      paymentMethod ===
      "netbanking"
    ) {
      return "Net Banking";
    }

    return "Cash on Delivery";
  };


  /* =========================================================
     UI
     ========================================================= */

  return (
    <main className="order-success-page">

      <div className="order-success-container">


        {/* =================================================
            SUCCESS ICON
        ================================================= */}

        <div className="order-success-icon">

          <CheckCircle2
            size={55}
          />

        </div>


        {/* =================================================
            TITLE
        ================================================= */}

        <span className="order-success-eyebrow">
          ORDER CONFIRMED
        </span>

        <h1>
          Thank You for Your Order!
        </h1>

        <p className="order-success-description">
          Your order has been placed
          successfully. We'll get it
          ready for delivery.
        </p>


        {/* =================================================
            ORDER ID
        ================================================= */}

        <div className="order-number-card">

          <div>

            <span>
              ORDER ID
            </span>

            <strong>
              #{orderId}
            </strong>

          </div>


          <Package
            size={25}
          />

        </div>


        {/* =================================================
            ORDER INFORMATION
        ================================================= */}

        <div className="order-success-grid">


          {/* DELIVERY */}

          {address && (

            <div className="order-success-card">

              <div className="order-success-card-icon">

                <MapPin
                  size={19}
                />

              </div>

              <div>

                <span>
                  DELIVERY ADDRESS
                </span>

                <strong>
                  {address.name}
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
                  {address.phone}
                </p>

              </div>

            </div>

          )}


          {/* PAYMENT */}

          <div className="order-success-card">

            <div className="order-success-card-icon">

              <CreditCard
                size={19}
              />

            </div>

            <div>

              <span>
                PAYMENT METHOD
              </span>

              <strong>
                {getPaymentMethod()}
              </strong>

              <p>
                Payment method selected
                successfully.
              </p>

            </div>

          </div>

        </div>


        {/* =================================================
            TOTAL
        ================================================= */}

        <div className="order-success-total">

          <span>
            Order Total
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
            DELIVERY MESSAGE
        ================================================= */}

        <div className="order-delivery-message">

          <Package
            size={19}
          />

          <div>

            <strong>
              Your order is being prepared
            </strong>

            <p>
              Estimated delivery:
              3–7 business days
            </p>

          </div>

        </div>


        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="order-success-actions">

          <Link
            to="/"
            className="order-shop-button"
          >

            <ShoppingBag
              size={17}
            />

            Continue Shopping

          </Link>


          <Link
            to="/profile"
            className="order-profile-button"
          >

            View Profile

            <ArrowRight
              size={16}
            />

          </Link>

        </div>


        {/* =================================================
            FOOTER
        ================================================= */}

        <p className="order-success-footer">
          Thank you for shopping with
          <strong> AICommerce</strong>.
        </p>

      </div>

    </main>
  );
}


export default OrderSuccess;