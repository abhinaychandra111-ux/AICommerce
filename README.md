# AICommerce – Full-Stack E-Commerce Web Application

AICommerce is a full-stack e-commerce web application that provides users with a complete online shopping experience.

Users can create accounts, browse and search products, manage their shopping cart, save delivery addresses, complete checkout, select a simulated payment method, place orders, and view their order history.

## Features

### Authentication
- User registration
- User login
- JWT authentication
- Protected routes
- Logout

### Products
- Product listing
- Product search
- Category filtering
- Price sorting
- Rating-based sorting
- Product stock management

### Shopping Cart
- Add products to cart
- Update product quantity
- Remove products
- Cart total calculation
- User-specific cart

### Checkout
- Delivery address management
- Saved addresses
- Order summary
- Delivery fee
- Platform fee
- Handling fee
- Coupon discount support

### Payment
- Cash on Delivery
- UPI payment simulation
- Credit/Debit Card simulation
- Net Banking simulation

> Payment methods are simulated and no real payment gateway is connected.

### Orders
- Place orders
- Unique order ID
- Order calculation
- Stock management
- Order success page
- Order history
- View previous orders

### Profile
- View profile
- Edit profile
- Saved addresses
- Add address
- Edit address
- Delete address
- Set default address

## Technologies Used

### Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- React Router
- Vite
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- CORS
- dotenv

## Project Structure

```text
AICommerce/
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed.js
│   ├── server.js
│   └── package.json
│
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
│
├── public/
├── package.json
├── vite.config.js
├── .gitignore
└── README.md