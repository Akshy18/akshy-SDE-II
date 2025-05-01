# ✅ Todo List Application - Fullstack Project

**🔗 Live Demo:** [https://fullstack-task-akshy-1.onrender.com/](https://fullstack-task-akshy-1.onrender.com/)    

## ⚠️ Initial Load Notice

### Due to Render's free tier, the backend sleeps after inactivity. First requests may time out (~10s) while the instance wakes up (takes ~50s).

### Solution:

- Refresh after 1 minute if the first attempt fails
- Subsequent requests will be fast (instance stays awake for ~15 minutes)

**(This only affects the free-tier deployment.)**

A full-featured, responsive Todo List application with user authentication, complete CRUD operations for todos, and secure JWT authentication including token revocation. 

## 🚀 Features

### Authentication
- User registration with email and password
- Secure login system
- JWT-based authentication with access and refresh tokens
- Token revocation on logout (blacklisting)
- Protected routes requiring authentication

### Todo Management
- Create new todos with title, description, due date, and status
- View a list of all your todos
- Update existing todos
- Delete todos
- Mark todos as completed
- Filter todos by status (pending/completed)

### User Interface
- Clean, responsive design using Tailwind CSS
- Intuitive dashboard layout
- Loading states for better user experience
- Error handling and feedback
- User-friendly form validations

## 🔧 Tech Stack

### Frontend
- React.js
- Tailwind CSS for styling
- React Router for navigation
- Redux for state management
- Axios for API calls

### Backend
- Express.js
- MongoDB for database
- JWT for authentication
- bcrypt for password hashing
- Middleware for route protection and token verification

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14 or later)
- npm or yarn
- MongoDB (local instance or MongoDB Atlas account)

## 🔌 Installation & Setup

### Clone the Repository

```bash
git clone https://github.com/Akshy18/fullstack_task_Akshy.git
cd fullstack_task_Akshy
```

### Environment Variables

1. Create `.env` file in the root directory for the backend:

```
PORT=5000
MONGODB_URI=mongodb+srv://<name>:<password>@cluster0.1hl9j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_jwt_secret_key
REFRESH_TOKEN_SECRET=your_refresh_token_secret
NODE_ENV=production
FRONTEND_URL=your_Url
```

2. Create `.env` file in the frontend directory:

```
VITE_API_BASE_URL=your_Url/api
```

### Backend Setup

```bash
# Navigate to the backend directory
cd server

# Install dependencies
npm install

# Start the server
node server.js

# For development with auto-reload
nodemon server.js
```

### Frontend Setup

```bash
# Navigate to the frontend directory
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🌐 API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login and receive tokens
- `POST /api/users/refresh-token` - Get new access token using refresh token
- `POST /api/users/logout` - Logout and revoke tokens
- `GET /api/users/getCurrentUser/:id` - Get current user data
- `GET /api/users/protected` - Test protected route


### Todos
- `GET /api/todos` - Get all todos for logged-in user
- `GET /api/todos/:id` - Get a specific todo
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## 🔐 Authentication Flow

This application implements a secure authentication flow:

1. **Registration**: Users register with email and password
2. **Login**: On successful login, the server issues:
   - An access token (short-lived, 15 minutes)
   - A refresh token (long-lived, 7 days) stored in HttpOnly cookie
3. **Protected Routes**: Access token is sent in Authorization header
4. **Token Refresh**: When access token expires, client uses refresh token to get a new one
5. **Logout**: On logout, refresh token is blacklisted in the database
6. **Security**: All tokens are verified on protected routes, blacklisted tokens are rejected

## 💡 Implementation Details

### Token Revocation Strategy
- When a user logs out, their refresh token is added to a blacklist collection in MongoDB
- A middleware checks every request against this blacklist

### Password Security
- Passwords are hashed using bcrypt before storage
- Passwords are never returned in API responses

### Error Handling
- Comprehensive error handling on both frontend and backend
- User-friendly error messages
- Consistent error response format from API

## 🚀 Deployment

**How to Deploy Your Own Instance**:
 - Sign up for a Render account.
 - Connect your GitHub repository.
 -  Configure environment variables (same as .env setup).

 **Deploy!**


## 🛠️ Future Improvements

Potential enhancements for the application:
- Dark mode toggle
- Pagination for todos
- Drag and drop for reordering todos
- Search functionality
- Shared todos between users

## 📄 License

This project is licensed under the MIT License.
