https://real-estate-platform-frontend-mu.vercel.app/ 🏠 RealEstate — Property Management Platform

A full-stack, multi-user real estate platform where buyers can browse and inquire about properties, sellers can list and manage their own listings, and admins can oversee the entire platform — built with the MERN stack.

🔗 Live Demo: https://real-estate-platform-frontend-mu.vercel.app/

✨ Features

🔐 Multi-role authentication — Buyer, Seller, and Admin accounts with email verification and password reset 🏡 Property listings — search, filter by city/type/BHK/price, sort, grid & list views ❤️ Wishlist — buyers can save favorite properties 💬 Inquiries & Real-time Chat — buyers can message sellers directly about a listing 📊 Seller Dashboard — manage listings, track views/leads, export data 🛡️ Admin Dashboard — manage users, approve sellers, oversee properties & inquiries 🖼️ Image uploads via Cloudinary 📱 Fully responsive UI with Tailwind CSS

🛠️ Tech Stack

Frontend: React, Vite, React Router, Tailwind CSS, Axios, Socket.io Client Backend: Node.js, Express, Socket.io Database: MongoDB (Mongoose) Auth: JWT Media Storage: Cloudinary Email: Brevo (Sendinblue) Deployment: Vercel

📁 Project Structure

frontend/ └── src/ │ App.jsx │ config.js │ index.css │ main.jsx │ ├── assets/ │ bannerimage.png │ dummyStyles.js │ hexagonlogo1.png │ ├── components/ │ │ AdminLayout.jsx │ │
│ │ SellerSidebar.jsx │ │ │ └── common/ │ Logo.jsx │ Navbar.jsx │ PropertyCard.jsx │ ProtectedRoute.jsx │ ├── context/ │ AuthContext.jsx │ ChatContext.jsx │ └── pages/ │ PropertyDetails.jsx │ ├── admin/ │ AdminContact.jsx │ AdminDashboard.jsx │
│ SellerRequest.jsx │ ├── auth/ │ ForgotPassword.jsx │ login.jsx │ Register.jsx │ ResetPassword.jsx │ VerifyEmail.jsx │ ├── buyer/ │ Myinquiries.jsx │ Wishlist.jsx │ ├── seller/ │ AddProperties.jsx │
│ SellerDashboard.jsx │ └── shared/ ChatMessages.jsx

👤 User Roles

RoleCapabilitiesBuyerBrowse properties, save wishlist, send inquiries, chat with sellersSellerList & manage properties, view leads, respond to inquiries via chatAdminManage all users, approve new sellers, oversee listings & inquiries Built by Princy Singh
