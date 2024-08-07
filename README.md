# StudioSeeker

StudioSeeker is a MERN stack application developed as a graduation project. The application is designed to resolve manual booking issues by collecting studios and individuals looking to rent their studios or instruments.

## Features

- **Studio and Instrument Listings**: Users can list their studios or instruments for rent.
- **Booking System**: Allows users to book studios or instruments directly through the application.
- **JWT Authentication**: Middleware for generating and validating JWT tokens.
- **RBAC Middleware**: Role-Based Access Control for different user permissions.
- **User Validation**: Ensures that user inputs are validated for security and correctness.
- **Image Upload**: Functionality for uploading images of studios or instruments.

## Technologies Used

- **Frontend**: React Native
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Middleware**: Custom middleware for authentication, validation, and error handling.

## Note

This project is a graduation project and is not intended for public use.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Elkady-Code/StudioSeeker.git
   cd StudioSeeker ```
   ```
2. Install dependencies for both client and server:
    ```bash
   npm install
    ```
3. Create a .env file in the server directory and add the following:
    ```bash
    MONGO_URI=<your-mongodb-uri>
    JWT_TOKEN=<your-jwt-token>
    JWT_SECRET=<your-jwt-secret>
    SENDGRID_API_KEY=<your-sendgrid-api-key>
    CLOUDINARY_USER_NAME=<your-cloudinary-user-name>
    CLOUDINARY_API_KEY=<your-cloudinary-api-key>
    CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
4. Start the backend development server: 
    ```bash
    npm start / nodemon server
5. Start the frontend: 
    ```bash
    npx expo start
    ```

## Project Structure

### Client

- src/
- components/ - React components
- contexts/ - Context providers (e.g., AuthContext)
- hooks/ - Custom hooks
- pages/ - React pages
- utils/ - Utility functions

### Server

- controllers/ - Express controllers
- middleware/ - Custom middleware (e.g., JWT validation, RBAC)
- models/ - Mongoose models
- routes/ - Express routes
- utils/ - Utility functions (e.g., asyncErrorHandler, customError)
- validators/ - Validation logic

### Middleware

- JWT Middleware: Generates and validates JWT tokens for authentication.
- RBAC Middleware: Role-Based Access Control to restrict access based on user roles.
- User Validation: Validates user input to ensure security and correctness.

### Utils

- asyncErrorHandler: Handles asynchronous errors in Express routes.
- AuthContext: Provides authentication context for React components.
- customError: Custom error handling for better error management.

### Contact
- [LinkedIn](https://linkedin.com/in/ibrahim-ahmed-elkady)
- [GitHub](https://github.com/Elkady-Code)
- Email: ibrahimallie905@gmail.com
