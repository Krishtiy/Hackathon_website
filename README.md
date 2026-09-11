# **Hackathon 2026 – Full Stack Web Application**

### **Assignment Submission Report**

**Submitted by:** *Gaurav Ghosh, CSE, NIT Silchar*


**Backend Development & API Implementation:** *Arghojit Dewanji, CSE, NIT Silchar*


**Live Website:** [https://hackathon-frontend1-iy6j.onrender.com](https://hackathon-frontend1-iy6j.onrender.com)


**Tech Stack:** MERN (MongoDB, Express.js, React.js, Node.js)

---

## **1. Project Overview**

This project is a fully functional **Hackathon Management System** designed for **Hackathon 2026**, a national-level event.
The system supports:

* User registration and authentication
* Team creation and management
* Online quiz rounds
* Payment upload and verification
* Admin dashboard
* Certificate template upload
* Live leaderboard system
* MongoDB Atlas cloud database integration

The application is built using the MERN stack and deployed on Render.

While the project is a full-stack system, **my primary contribution was designing and implementing the backend architecture, APIs, authentication system, and database integration.**

---

## **2. Objectives**

✔ Create a scalable, real-world event management system


✔ Implement a secure authentication mechanism


✔ Manage teams, members, payments, and quiz submissions


✔ Provide an admin-only panel with full event control


✔ Deploy both frontend and backend on cloud platforms


✔ Integrate MongoDB Atlas for cloud database access

---

## **3. System Architecture**

The project follows a **client–server architecture**:

### **Frontend (Client) – React**

* User Interface
* Routing (React Router)
* Axios for API communication
* Components for forms, dashboards, quizzes, etc.
* TailwindCSS + custom design

### **Backend (Server) – Node + Express**  *(Developed by Arghojit Dewanji)*

The backend layer was implemented to handle the core business logic and system security.

* Authentication routes (JWT-based login system)
* Team creation and verification APIs
* Payment proof upload system using Multer
* Quiz management APIs
* Certificate management routes
* Admin-only routes with role-based access control
* Middleware for security, authentication, and centralized error handling

### **Database – MongoDB Atlas**

* Users
* Teams
* Questions
* Submissions
* Certificates
* Payments

All database collections are connected via **Mongoose schemas and models implemented in the backend layer.**

---

## **4. Features Implemented**

### **User Features**

* Register & Login
* Join/Create team
* Attempt quiz
* View results & team status
* Download certificates (when uploaded)

### **Admin Features**

* View all users
* Manage and delete teams
* Verify team payments
* Upload certificate templates (Round 1 & 2)
* Manage quiz questions
* Access round results & leaderboard

### **Technical Features**

* JWT-based secure login *(backend implementation)*
* Password hashing using bcrypt *(backend security layer)*
* File upload using Multer *(backend file handling)*
* Centralized error handling *(Express middleware)*
* Role-based access control *(admin vs user)*
* Cloud deployment using Render

---

## **5. Deployment Links**

| Component       | URL                                                                                            |
| --------------- | ---------------------------------------------------------------------------------------------- |
| **Frontend**    | [https://hackathon-frontend1-iy6j.onrender.com](https://hackathon-frontend1-iy6j.onrender.com) |
| **Backend API** | [https://hackathon-backend1-akuo.onrender.com](https://hackathon-backend1-akuo.onrender.com)   |

Both components are hosted on **Render**.
Database is hosted on **MongoDB Atlas**.

---

## **6. How to Run the Project Locally**

### **Step 1: Clone the project**

```
git clone https://github.com/gauravghosh24/hackathon-2026-website.git
```

### **Step 2: Install dependencies**

**Frontend:**

```
cd client
npm install
npm run dev
```

**Backend:**

```
cd server
npm install
npm start
```

### **Step 3: Create `.env` file (Backend)**

```
PORT=5000
MONGODB_URI=<MongoDB Atlas URL>
JWT_SECRET=your_secret
```

---

## **7. Testing Performed**

✔ Login/Signup tested with real MongoDB Atlas


✔ Team creation & deletion tested


✔ Quiz submission tested


✔ Payment proof upload tested


✔ Certificate upload tested


✔ Leaderboard auto-ranking verified


✔ Admin and user roles validated

---

## **8. Conclusion**

The Hackathon 2026 website is a complete production-level MERN application that demonstrates:

* Cloud deployment
* Database management
* Secure authentication
* Event workflow design
* Real-world problem solving
* Frontend + Backend integration

The **backend system, API layer, authentication flow, and database integration were implemented as part of my contribution to the project**, enabling secure user management, quiz submissions, team handling, and admin control over the platform.
