import { useEffect, useState } from "react";

import {
  Package,
  ArrowLeft,
  ChevronRight,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";


function MyOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    fetchOrders();
  }, []);


  const fetchOrders = async () => {
    const token = localStorage.getItem(
      "aicommerce-token"
    );

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/orders/my-orders",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch orders"
        );
      }

      setOrders(
        Array.isArray(data.orders)
          ? data.orders
          : []
      );

    } catch (err) {
      console.error(
        "Orders Error:",
        err
      );

      setError(
        err.message ||
          "Failed to load orders"
      );

    } finally {
      setLoading(false);
    }
  };


  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };


  const getStatusLabel = (status) => {
    switch (status) {
      case "confirmed":
        return "Confirmed";

      case "processing":
        return "Processing";

      case "shipped":
        return "Shipped";

      case "out_for_delivery":
        return "Out for Delivery";

      case "delivered":
        return "Delivered";

      case "cancelled":
        return "Cancelled";

      default:
        return status || "Confirmed";
    }
  };


  const getPaymentLabel = (method) => {
    switch (method) {
      case "upi":
        return "UPI";

      case "card":
        return "Credit / Debit Card";

      case "netbanking":
        return "Net Banking";

      case "cod":
        return "Cash on Delivery";

      default:
        return method || "Unknown";
    }
  };


  if (loading) {
    return (
      <main className="orders-page">
        <div className="orders-container">

          <div className="orders-loading">

            <RefreshCw
              size={25}
              className="orders-spin"
            />

            <p>
              Loading your orders...
            </p>

          </div>

        </div>
      </main>
    );
  }


  return (
    <main className="orders-page">

      <div className="orders-container">

        {/* HEADER */}

        <div className="orders-header">

          <div>

            <Link
              to="/profile"
              className="orders-back"
            >
              <ArrowLeft size={15} />
              My Account
            </Link>

            <span className="orders-eyebrow">
              MY SHOPPING
            </span>

            <h1>
              My Orders
            </h1>

            <p>
              View and track your
              previous orders.
            </p>

          </div>


          <div className="orders-count">

            <Package size={18} />

            <span>
              {orders.length}{" "}
              {orders.length === 1
                ? "Order"
                : "Orders"}
            </span>

          </div>

        </div>


        {/* ERROR */}

        {error && (
          <div className="orders-error">

            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={fetchOrders}
            >
              Try Again
            </button>

          </div>
        )}


        {/* EMPTY */}

        {!error &&
          orders.length === 0 && (
            <div className="orders-empty">

              <div className="orders-empty-icon">

                <ShoppingBag size={30} />

              </div>

              <h2>
                No orders yet
              </h2>

              <p>
                You haven't placed
                any orders yet.
                Start shopping and
                your orders will
                appear here.
              </p>

              <Link
                to="/"
                className="orders-shop-button"
              >

                <ShoppingBag size={16} />

                Start Shopping

              </Link>

            </div>
          )}


        {/* ORDERS */}

        {!error &&
          orders.length > 0 && (

            <div className="orders-list">

              {orders.map((order) => (

                <article
                  className="order-card"
                  key={order._id}
                >

                  {/* ORDER HEADER */}

                  <div className="order-card-header">

                    <div>

                      <span>
                        ORDER ID
                      </span>

                      <strong>
                        #
                        {order.orderId ||
                          order._id}
                      </strong>

                    </div>


                    <div className="order-status">

                      <span
                        className={`order-status-dot ${
                          order.orderStatus ||
                          "confirmed"
                        }`}
                      />

                      {getStatusLabel(
                        order.orderStatus
                      )}

                    </div>

                  </div>


                  {/* PRODUCTS */}

                  <div className="order-products">

                    {order.items?.map(
                      (item, index) => (

                        <div
                          className="order-product"
                          key={
                            item.productId ||
                            index
                          }
                        >

                          <div className="order-product-image">

                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                              />
                            ) : (
                              <Package
                                size={21}
                              />
                            )}

                          </div>


                          <div className="order-product-info">

                            <strong>
                              {item.name}
                            </strong>

                            <span>
                              Qty:{" "}
                              {item.quantity}
                            </span>

                          </div>


                          <strong className="order-product-price">

                            ₹
                            {Number(
                              item.price *
                                item.quantity
                            ).toLocaleString(
                              "en-IN"
                            )}

                          </strong>

                        </div>

                      )
                    )}

                  </div>


                  {/* FOOTER */}

                  <div className="order-card-footer">

                    <div className="order-meta">

                      <div>

                        <span>
                          ORDERED
                        </span>

                        <strong>
                          {formatDate(
                            order.createdAt
                          )}
                        </strong>

                      </div>


                      <div>

                        <span>
                          PAYMENT
                        </span>

                        <strong>
                          {getPaymentLabel(
                            order.paymentMethod
                          )}
                        </strong>

                      </div>


                      <div>

                        <span>
                          TOTAL
                        </span>

                        <strong>
                          ₹
                          {Number(
                            order.total || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </div>

                    </div>


                    <Link
                      to={`/orders/${order._id}`}
                      className="order-view-button"
                    >
                      View Details

                      <ChevronRight
                        size={15}
                      />

                    </Link>

                  </div>

                </article>

              ))}

            </div>

          )}

      </div>

    </main>
  );
}


export default MyOrders;