import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/orders"
          element={<MyOrders />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/payment"
          element={<Payment />}
        />

        <Route
          path="/order-success"
          element={<OrderSuccess />}
        />

      </Routes>

    </BrowserRouter>
  );
}


export default App;