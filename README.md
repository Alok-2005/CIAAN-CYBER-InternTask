# CommunityHub - Mini LinkedIn-like Platform

A modern, full-stack community platform built with React, Express.js, and MongoDB. This application provides a professional networking experience similar to LinkedIn with a beautiful, responsive design.

## 🚀 Live Demo

**Frontend**: Deployed on  Vercel
**Backend**: Deployed on  Railway
**Database**: MongoDB Atlas
**Image hosting** :Cloudinary

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API requests
- **Lucide React** for icons
- **Vite** for build tooling

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests
- **Cloudinary** for image upload management

## ✨ Features

### Core Features
- **User Authentication**: Register/Login with email & password
- **User Profiles**: Complete profile pages with bio, stats, and posts
- **Post Feed**: Create, read, and display text posts with timestamps
- **Social Features**: Like posts, comment, and follow/unfollow users
- **Search & Discovery**: Find users by name or email
- **Responsive Design**: Works perfectly on all device sizes

### Additional Features
- **Real-time Interactions**: Like/unlike posts with instant feedback
- **Comment System**: Engage in conversations on posts
- **Follow System**: Build your professional network
- **User Statistics**: Track posts, followers, and following counts
- **Modern UI/UX**: Glass-morphism design with smooth animations
- **Profile Management**: Edit your profile information
- **Search Functionality**: Discover new professionals
- **Post Management**: Delete your own posts
- **Responsive Navigation**: Mobile-friendly navigation

## 🎨 Design Features

- **Modern Aesthetics**: Professional gradient backgrounds and glass-morphism effects
- **Color System**: Consistent blue (#3B82F6), purple (#7C3AED), and teal (#14B8A6) palette
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Typography**: Clean, readable fonts with proper hierarchy
- **Mobile-First**: Responsive design that works on all screen sizes
- **Accessibility**: Proper contrast ratios and keyboard navigation

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB installation)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd community-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI="your_mongodb_connection_string"
   JWT_SECRET="your_super_secret_jwt_key_here"
   PORT=5000
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_cloud_secret
   ```

4. **Start the application**
   ```bash
   npm run dev
   cd server npm run server
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

## 📱 Demo Accounts

For testing purposes, you can create new accounts or use these demo credentials:

**Demo User 1:**
- Email: test@gamil.com
- Password: 123456

## 🏗️ Project Structure

```
community-hub/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── contexts/          # React contexts (Auth)
│   ├── pages/             # Page components
│   └── main.tsx           # Application entry point
├── server/                # Backend Express application
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── index.js           # Server entry point
├── public/                # Static assets
└── package.json           # Dependencies and scripts
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (with search)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/:id/follow` - Follow/unfollow user
- `GET /api/users/:id/posts` - Get user's posts

### Posts
- `GET /api/posts` - Get all posts (feed)
- `POST /api/posts` - Create new post
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comment` - Add comment to post
- `DELETE /api/posts/:id` - Delete post

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Route Protection**: Protected routes requiring authentication

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Mobile devices** (320px+)
- **Tablets** (768px+)
- **Desktop** (1024px+)
- **Large screens** (1440px+)

## 🚀 Deployment

### Frontend ( Vercel)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your preferred hosting service

### Backend (Render )
1. Create a new service on your hosting platform
2. Connect your GitHub repository
3. Set environment variables
4. Deploy with automatic builds

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Configure network access
3. Get your connection string
4. Update the `MONGODB_URI` environment variable

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For any questions or issues, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for the professional community by Alok Chaturvedi**
