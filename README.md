# Pratika - E-Commerce Website

A modern Nigerian e-commerce store built with Next.js + Firebase.

## Features

- Beautiful dark-green Jumia-inspired design
- Customer registration (Username + Phone + Email + Password)
- Persistent cart (saved even after logout / different device)
- Categories (Admin can add/edit/delete)
- Products with image upload, price, stock quantity
- Automatic Out of Stock when quantity reaches 0
- Admin dashboard (Products, Categories, Orders)
- WhatsApp order button
- Ready for Paystack later

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Environment variables
Your Firebase keys are already in `.env.local`.  
You do **not** need to change anything.

### 3. Run the website
```bash
npm run dev
```
Open http://localhost:3000

### 4. Make yourself Admin
1. Register a new account on the website
2. Go to Firebase Console → Firestore Database → `users` collection
3. Open your user document
4. Change `role` from `"customer"` to `"admin"`
5. Refresh the website → you will see the Admin button

### 5. Important: Set Security Rules

#### Firestore Rules
1. Go to Firebase Console → Firestore → Rules
2. Delete everything and paste the content from `firestore.rules` file
3. Click Publish

#### Storage Rules
1. Go to Firebase Console → Storage → Rules
2. Delete everything and paste the content from `storage.rules` file
3. Click Publish

### 6. Deploy to Vercel
1. Push this folder to GitHub
2. Go to vercel.com → New Project → Import
3. Add the same environment variables from `.env.local`
4. Deploy

## Change WhatsApp Number
Open these two files and change the number:
- `src/components/Footer.tsx`
- `src/app/checkout/page.tsx`

Replace `2340000000000` with your real WhatsApp number (with country code).

## Collections created automatically
- users
- categories
- products
- carts
- orders
