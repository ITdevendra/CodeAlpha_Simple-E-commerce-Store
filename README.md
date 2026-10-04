# 🛒 E-Commerce Store

A full-stack e-commerce web application built using **HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB**.

The project provides a complete shopping experience with user authentication, product browsing, cart management, checkout, order tracking, and an admin panel for managing products and orders.

---

## 🚀 Features

### 👤 User Features

- User registration and login
- Secure password hashing using bcrypt
- JWT-based authentication
- HTTP-only authentication cookies
- User-specific shopping cart
- Browse all products
- Product details page
- Search products
- Filter products by category
- Sort products by price and name
- Add products to cart
- Update cart quantities
- Remove products from cart
- Checkout with shipping address
- Place orders
- View order history
- View individual order details
- Order status tracking

### 🛠️ Admin Features

- Secure admin authentication
- Admin dashboard
- Add new products
- Edit products
- Delete products
- View all products
- View customer orders
- Update order status
- Stock management
- Product validation
- Order management

### 📦 Order Management

Orders support the following statuses:

- Processing
- Shipped
- Delivered
- Cancelled

The backend validates product availability and calculates the order total using the database price instead of trusting the frontend.

---

## 🧑‍💻 Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript
- Fetch API
- LocalStorage

### Backend

- Node.js
- Express.js
- REST API

### Database

- MongoDB
- Mongoose

### Authentication & Security

- JSON Web Token (JWT)
- bcryptjs
- HTTP-only cookies
- Authentication middleware
- Admin authorization middleware
- Input validation

### Development Tools

- Visual Studio Code
- Git
- GitHub
- MongoDB Compass
- Postman

---

## 📁 Project Structure

```text
ecommerce-store/
│
├── middleware/
│   ├── authMiddleware.js
│   └── adminMiddleware.js
│
├── models/
│   ├── User.js
│   ├── Product.js
│   └── Order.js
│
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   └── adminRoutes.js
│
├── public/
│   │
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── product.js
│   │   ├── cart.js
│   │   ├── checkout.js
│   │   ├── orders.js
│   │   ├── admin-auth.js
│   │   ├── admin-products.js
│   │   ├── admin-orders.js
│   │   └── admin-dashboard.js
│   │
│   ├── index.html
│   ├── product.html
│   ├── cart.html
│   ├── checkout.html
│   ├── orders.html
│   ├── login.html
│   ├── register.html
│   ├── admin-dashboard.html
│   ├── admin-products.html
│   ├── admin-add-product.html
│   ├── admin-edit-product.html
│   └── admin-orders.html
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

Move into the project directory:

```bash
cd ecommerce-store
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Create `.env`

Create a `.env` file in the project root:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=3000
NODE_ENV=development
```

⚠️ **Never upload your `.env` file to GitHub.**

---

### 4. Start the server

```bash
npm start
```

If your project uses nodemon:

```bash
npm run dev
```

The application will run at:

```text
http://localhost:3000
```

---

## 🗄️ MongoDB Setup

The application uses MongoDB to store:

- Users
- Products
- Orders

You can run MongoDB locally using MongoDB Compass or connect to MongoDB Atlas.

Example local connection:

```env
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce
```

---

## 🔐 Authentication Flow

The application uses JWT authentication.

### Registration

```text
User
 ↓
Register
 ↓
Password hashed using bcrypt
 ↓
User stored in MongoDB
```

### Login

```text
User
 ↓
Login
 ↓
Password verification
 ↓
JWT generated
 ↓
JWT stored in HTTP-only cookie
```

Protected routes verify the authentication cookie before allowing access.

---

## 👨‍💼 Admin Access

Admin users have additional permissions such as:

- Managing products
- Viewing customer orders
- Updating order status
- Managing inventory

Admin-only routes are protected using authentication and admin authorization middleware.

---

## 🛒 Order Flow

```text
Browse Products
      ↓
Add to Cart
      ↓
View Cart
      ↓
Checkout
      ↓
Enter Shipping Address
      ↓
Place Order
      ↓
Server Validates Stock
      ↓
Order Created
      ↓
Stock Reduced
      ↓
Order History
```

---

## 📊 Order Status

```text
Processing
     ↓
Shipped
     ↓
Delivered
```

An order can also be marked as:

```text
Cancelled
```

---

## 🔒 Security

The project includes several security practices:

- Password hashing with bcrypt
- JWT authentication
- HTTP-only cookies
- Protected routes
- Admin authorization
- Server-side price calculation
- Server-side stock validation
- MongoDB ObjectId validation
- Quantity validation
- `.env` protection using `.gitignore`

---

## 🧪 API Testing

The backend APIs can be tested using **Postman**.

Example endpoints:

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

### Products

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Orders

```text
POST /api/orders
GET  /api/orders
GET  /api/orders/:id
```

### Admin

```text
GET /api/admin/dashboard
```

---

## 🎯 Future Improvements

Possible future improvements include:

- Online payment integration
- Product reviews and ratings
- Wishlist
- Product image upload using Cloudinary
- Email order confirmation
- Pagination
- Advanced product filtering
- Sales analytics
- Coupon and discount system
- Responsive UI improvements
- Deployment using Render/Vercel
- MongoDB Atlas integration

---

## 👨‍💻 Author

**Devendra Choudhary**

B.Tech Information Technology Student

Interested in:

- Full Stack Web Development
- Java
- DSA
- Backend Development
- AI & Web Development

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
