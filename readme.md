MentorConnect - Mentorship Booking Platform
MentorConnect is a full-stack web application that connects students with experienced mentors for personalized one-on-one sessions. The platform provides an intuitive interface for discovering mentors, booking sessions, and managing appointments.

🌟 Live Demo
Frontend (Vercel): https://mentor-connect-weld.vercel.app/

Backend (Render): https://mentor-connect-u7yx.onrender.com/

Demo Video: Watch on Google Drive

✨ Features
Frontend
Responsive Design: Fully responsive UI that works on desktop, tablet, and mobile devices

Dark/Light Mode: Toggle between dark and light themes

Advanced Filtering: Filter mentors by specialization, location, experience, and availability

Real-time Search: Search mentors by name, specialization, or location

Interactive Booking: Intuitive booking modal with date and time slot selection

Booking Management: View booking confirmations and status

Loading States: Smooth loading animations and error handling

Backend
RESTful API: Clean and well-structured API endpoints

MongoDB Integration: Efficient data storage with Mongoose ODM

Cloudinary Integration: Image upload and management for mentor profiles

Rate Limiting: Protection against abuse with request rate limiting

Error Handling: Comprehensive error handling and validation

CORS Enabled: Cross-origin resource sharing for frontend-backend communication

🛠️ Tech Stack
Frontend
React 18 - Frontend framework

React Router DOM - Client-side routing

React Query - Server state management

Tailwind CSS - Utility-first CSS framework

Lucide React - Beautiful icons

React Hot Toast - Toast notifications

Date-fns - Date manipulation library

Axios - HTTP client

Backend
Node.js - Runtime environment

Express.js - Web framework

MongoDB - NoSQL database

Mongoose - MongoDB object modeling

Cloudinary - Image and video management

Multer - File upload middleware

Helmet - Security middleware

Express Rate Limit - Rate limiting middleware

CORS - Cross-origin resource sharing

🚀 Installation
Prerequisites
Node.js (v16 or higher)

MongoDB Atlas account or local MongoDB installation

Cloudinary account for image storage

Frontend Setup
Navigate to the client directory:

bash
cd client
Install dependencies:

bash
npm install
Create a .env file in the client directory:

env
VITE_API_URL=http://localhost:5000/api
Start the development server:

bash
npm run dev
Backend Setup
Navigate to the server directory:

bash
cd server
Install dependencies:

bash
npm install
Create a .env file in the server directory:

env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
Start the development server:

bash
npm run dev
Seed the database with sample data:

bash
npm run seed
🔧 Environment Variables
Frontend (.env)
env
VITE_API_URL=your_backend_api_url
Backend (.env)
env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
📡 API Endpoints
Mentors
GET /api/mentors - Get all mentors with filtering

GET /api/mentors/filters - Get filter options

GET /api/mentors/:id - Get single mentor by ID

POST /api/mentors - Create new mentor

PUT /api/mentors/:id - Update mentor

DELETE /api/mentors/:id - Delete mentor

Bookings
GET /api/bookings - Get all bookings

GET /api/bookings/available-slots - Get available time slots

GET /api/bookings/:id - Get single booking by ID

POST /api/bookings - Create new booking

PATCH /api/bookings/:id/status - Update booking status

