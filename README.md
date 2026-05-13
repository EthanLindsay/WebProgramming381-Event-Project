Initial ReadME file
# EventHub — Smart Event Management & Ticketing Platform

A full-stack web application built for Advanced Events (Pty) Ltd as part of the WPR381 module at Belgium Campus iTversity.

<span style="background-color: #0074D9; color: white; padding: 0.2em 0.4em; border-radius: 3px;">***GITHUB LINK: *** https://github.com/EthanLindsay/WebProgramming381-Event-Project </span>  

---

## Project Overview

EventHub allows users to browse, search and book tickets for events. Administrators can manage events, view analytics and handle customer enquiries — all through a clean, professional web interface.

---

## Technologies Used

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Runtime   | Node.js                           |
| Framework | Express.js                        |
| Templating| EJS (Embedded JavaScript)         |
| Database  | MongoDB + Mongoose ODM            |
| Auth      | express-session + bcrypt          |
| Styling   | Plain CSS (custom, no frameworks) |
| Dev tool  | nodemon                           |

---

## Team Members and Roles

| Name | Role |
|------|------|
| Katlego | Team Lead / Project Coordinator |
| Ethan | Backend Developer |
| Aiden | Frontend Developer |
| Ryno | Database Engineer |
| Tsholofelo | Security / DevOps Engineer |

---

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB running a MongoDB Atlas connection string (Running fulltime on student account.. free plan so limited to 50mb of data but works for the proof of concept)

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
The `.env` file is already included with default values. Edit it if needed:
```
PORT=3000
MONGO_URI=mongodb:mongodb+srv://602233_db_user:AJI3x0RVAOL2Ozrv@wpr381-eventhub.895tdso.mongodb.net/?appName=WPR381-EventHub
```

### 3. Seed the database (creates admin + test user + sample events)
```bash
npm run seed #(Just populates the database with sample data)
```

This creates:
- **Admin account:** admin@eventhub.co.za / Admin@123
- **Test user account:** user@eventhub.co.za / User@1234
- 6 sample events across different categories

### 4. Start the development server
```bash
npm run dev
```

Open your browser at **http://localhost:3000**

---

## Portal Pages

| Page | URL | Access |
|------|-----|--------|
| Home / Event Listing | `/events` | Public |
| Event Detail | `/events/:id` | Public |
| Register | `/auth/register` | Guest only |
| Login | `/auth/login` | Guest only |
| My Bookings Dashboard | `/bookings/dashboard` | Logged-in users |
| Admin Dashboard | `/admin/dashboard` | Admin only |
| Manage Events | `/admin/events` | Admin only |
| Manage Enquiries | `/admin/enquiries` | Admin only |
| Contact / Enquiry Form | `/contact` | Public |

---

## REST API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/events` | Public | List all events |
| GET | `/api/events/:id` | Public | Single event |
| POST | `/api/events` | Admin | Create event |
| PUT | `/api/events/:id` | Admin | Update event |
| DELETE | `/api/events/:id` | Admin | Delete event |
| GET | `/api/bookings` | User/Admin | List bookings |
| GET | `/api/contacts` | Admin | List enquiries |

See `requests.rest` for sample requests (VS Code REST Client extension).

---

## Project Structure

```
eventhub/
├── controllers/        # Business logic (MVC controllers)
│   ├── authController.js
│   ├── eventController.js
│   ├── bookingController.js
│   ├── contactController.js
│   └── adminController.js
├── middleware/
│   └── auth.js         # isLoggedIn + isAdmin middleware
├── models/             # Mongoose schemas
│   ├── User.js
│   ├── Event.js
│   ├── Booking.js
│   └── Contact.js
├── routes/             # Express routers
│   ├── authRoutes.js
│   ├── eventRoutes.js
│   ├── bookingRoutes.js
│   ├── contactRoutes.js
│   ├── adminRoutes.js
│   └── apiRoutes.js
├── views/              # EJS templates
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── index.ejs       # Home / event listing
│   ├── error.ejs
│   ├── auth/
│   │   ├── login.ejs
│   │   └── register.ejs
│   ├── events/
│   │   └── detail.ejs
│   ├── admin/
│   │   ├── dashboard.ejs
│   │   ├── events.ejs
│   │   ├── editEvent.ejs
│   │   └── enquiries.ejs
│   ├── bookings/
│   │   └── dashboard.ejs
│   └── contact/
│       └── index.ejs
├── public/
│   ├── css/style.css
│   └── images/         # Place placeholder.jpg here
├── app.js              # Application entry point
├── seed.js             # Database seeder
├── requests.rest       # REST Client test requests
├── package.json
└── .env
```

---

## Key Features

- **Role-Based Access Control** — Admin and User roles enforced via session middleware
- **Password Hashing** — bcrypt with 12 salt rounds
- **Capacity Validation** — Real-time ticket availability checked before every booking
- **Search & Filter** — Events filterable by keyword, category, date and availability
- **Admin Analytics** — Total events, users, bookings and revenue displayed on dashboard
- **PRG Pattern** — All POST actions redirect to prevent duplicate submissions on refresh
