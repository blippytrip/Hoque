HOQUE – Hospital Queue Management System
-----------------------------------------

------------------------------------------------
SETUP INSTRUCTIONS
------------------------------------------------

1. Extract the ZIP file.

2. Open terminal inside:
   hoque/hoque-backend

3. Install dependencies:
   npm install

4. Start backend server:
   npm run dev

5. You should see:
   MongoDB Connected
   Server running on port 5000

6. Open frontend:
   Navigate to:
   hoque/hoque-frontend

   Open index.html in browser
   (Right click → Open with Chrome)

------------------------------------------------
DATABASE CONNECTION
------------------------------------------------

This project uses MongoDB Atlas (cloud database).

Connection is configured via the .env file
inside hoque-backend.

Required environment variables:

MONGO_URI=<provided>
JWT_SECRET=<provided>

If MongoDB connection fails:

- Ensure internet connection is active.
- Ensure MongoDB Atlas Network Access allows:
  0.0.0.0/0 (Allow access from anywhere)

------------------------------------------------
FEATURES
------------------------------------------------

- Role-based login (Receptionist, Doctor, Patient)
- JWT authentication
- Queue prioritization system
- Doctor queue management
- Patient position tracking
- Consultation completion logic
- Dark themed UI

------------------------------------------------
DEMO FLOW
------------------------------------------------

1. Login as Receptionist
2. Create patient and assign doctor
3. Login as Doctor
4. View queue and complete consultation
5. Login as Patient
6. Check queue position

------------------------------------------------
TECH STACK
------------------------------------------------

Backend:
- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication

Frontend:
- HTML
- CSS
- JavaScript

