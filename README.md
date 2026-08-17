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


Installation
Clone the repository
git clone https://github.com/abhinaychandra111-ux/AICommerce.git
Install frontend dependencies
npm install
Install backend dependencies
cd server
npm install
Environment Variables

Create a .env file inside the server directory.

Example:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Do not commit the .env file to GitHub.

Running the Application
Start Backend

From the server directory:

npm run dev

The backend runs on:

http://localhost:5000
Start Frontend

From the project root:

npm run dev

The frontend normally runs on:

http://localhost:5173
API Endpoints
Authentication
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
PUT  /api/auth/profile
Addresses
GET    /api/auth/addresses
POST   /api/auth/addresses
PUT    /api/auth/addresses/:addressId
DELETE /api/auth/addresses/:addressId
PUT    /api/auth/addresses/:addressId/default
Products
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
Orders
POST /api/orders
GET  /api/orders/my-orders
GET  /api/orders/:id
Application Flow
Register / Login
       ↓
   Dashboard
       ↓
 Browse Products
       ↓
    Add Cart
       ↓
    Checkout
       ↓
 Select Address
       ↓
 Select Payment
       ↓
   Place Order
       ↓
 Order Success
       ↓
   My Orders
Security
JWT-based authentication
Password hashing
Protected API routes
User-specific order access
User-specific cart management
Environment variables for sensitive configuration
Future Enhancements
Real payment gateway integration
Admin dashboard
Product reviews and comments
Wishlist
AI-based product recommendations
Order tracking
Email notifications
Product image upload
Advanced analytics
Author

Abhinay Chandra

GitHub:

https://github.com/abhinaychandra111-ux



### Step 2 — Save and push README


After saving `README.md`:


```powershell
git add README.md
git commit -m "Improve project documentation"
git push
