# Ecommerce App - Complete Setup

## Project Structure
```
ecommerce-app/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── database.sql
└── frontend/
    ├── package.json
    ├── src/
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    └── public/
        └── index.html
```

## Step 1: Database Setup

**Requirements:** PostgreSQL installed locally

1. Create the database:
   ```bash
   createdb ecommerce
   ```

2. Load the schema:
   ```bash
   psql ecommerce < backend/database.sql
   ```

3. Verify:
   ```bash
   psql ecommerce
   ```
   Then in the psql prompt:
   ```sql
   \dt  -- should show 4 tables: users, products, orders, order_items
   SELECT * FROM products;  -- should show 5 products
   ```

## Step 2: Backend Setup

1. Open a terminal in the `backend/` folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

   You should see:
   ```
   Server running on http://localhost:3001
   ```

**Leave this terminal running.**

## Step 3: Frontend Setup

1. Open a **new terminal** in the `frontend/` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React app:
   ```bash
   npm start
   ```

   The app should automatically open at `http://localhost:3000`

## What You Can Do

1. **Register**: Create a new account with email/password
2. **Browse**: See 5 products (Laptop, Mouse, Cable, Stand, Keyboard)
3. **Add to Cart**: Click "Add to Cart" on any product
4. **Checkout**: Enter quantities and click "Checkout"
5. **Order History**: Click "Orders" tab to see your past orders

## Test Account (Optional)

If you want to skip registration, the database includes nothing pre-made. Just register a new account.

## Troubleshooting

**Error: "database does not exist"**
- Run `createdb ecommerce` first
- Make sure you're in the right directory when running `psql ecommerce < backend/database.sql`

**Error: "ECONNREFUSED 127.0.0.1:3001"**
- Backend server isn't running
- Make sure you ran `npm start` in the backend folder and it says "Server running"

**Error: "CORS error"**
- Backend is on localhost:3001, frontend on localhost:3000
- The server.js already has CORS enabled, so this shouldn't happen
- Check that backend is running

**Error: "Invalid token" when checking orders**
- Try logging out and back in
- If it persists, the database connection might be broken

**Frontend won't load**
- Make sure you're in the frontend folder before `npm start`
- Try `npm install` again if dependencies are missing

## What To Study For Interviews

1. **JWT tokens** - Look at how login creates a token and how it's sent with requests
2. **Password hashing** - See bcrypt in the register endpoint
3. **Database transactions** - See the checkout endpoint (BEGIN/COMMIT/ROLLBACK)
4. **Protected routes** - See authMiddleware in the backend
5. **React Context** - How the auth state flows through the app
6. **CORS** - Why frontend and backend need it on different ports

## Extensions (Pick ONE if you want)

- Add inventory checking (prevent buying more than in stock)
- Add product detail page with images
- Add "remove from cart" button
- Add order status tracking (pending, shipped, delivered)
- Add email validation on registration
- Add password strength requirements
- Add admin page to add/edit products

Don't do all of them. One thing, done well, is better than five things halfway.
