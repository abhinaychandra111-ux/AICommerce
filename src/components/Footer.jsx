function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-brand">
          <div className="logo">
            <span className="logo-mark">A</span>
            <span>AI<span>Commerce</span></span>
          </div>

          <p>
            A modern e-commerce experience built with
            React, Node.js and MongoDB.
          </p>
        </div>

        <div className="footer-column">
          <h4>Shop</h4>
          <a href="#products">Products</a>
          <a href="#categories">Categories</a>
          <a href="#deals">Deals</a>
        </div>

        <div className="footer-column">
          <h4>Account</h4>
          <a href="#login">Login</a>
          <a href="#register">Register</a>
          <a href="#orders">Orders</a>
        </div>

        <div className="footer-column">
          <h4>Support</h4>
          <a href="#contact">Contact</a>
          <a href="#shipping">Shipping</a>
          <a href="#returns">Returns</a>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © 2026 AICommerce. Built for CodSoft Web Development Internship.
        </p>
      </div>

    </footer>
  );
}

export default Footer;