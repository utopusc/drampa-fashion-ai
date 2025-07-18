# DRAMPA - AI Fashion Model Platform

DRAMPA is a cutting-edge AI-powered platform that transforms your product images into stunning fashion visualizations using virtual models powered by Stable Diffusion AI.

## 🚀 Features

- **AI-Powered Virtual Models**: Create realistic fashion models wearing your products
- **User Authentication**: Secure registration and login system
- **Professional Dashboard**: Manage your products, models, and collections
- **File Upload System**: Easy drag-and-drop image upload
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Theme Support**: Light and dark mode support
- **Real-time Processing**: See your transformations instantly

## 🛠 Tech Stack

### Frontend
- **Next.js 15+** - React framework with App Router
- **React 19** - Latest React features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Modern utility-first CSS
- **Framer Motion** - Smooth animations
- **Tanstack Query** - Data fetching and caching
- **MagicUI Components** - Beautiful UI components

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Secure authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or cloud)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd drampa
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd backend
npm install
```

### 4. Environment Setup

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

#### Backend (.env)
```bash
PORT=5001
MONGODB_URI=mongodb://localhost:27017/drampa
JWT_SECRET=your-super-secret-jwt-key-here
```

### 5. Start the Servers

#### Start Backend (Terminal 1)
```bash
cd backend
npm start
```

#### Start Frontend (Terminal 2)
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

## 🎯 Usage

### Getting Started
1. Visit http://localhost:3000
2. Click "Kayıt Ol" (Sign Up) to create an account
3. Or click "Giriş Yap" (Sign In) if you already have an account

### Creating Fashion Models
1. After logging in, you'll see the file upload area
2. Drag and drop your product image
3. Click "Transform & Visualize"
4. View your results in the dashboard

### Dashboard Features
- **Overview**: See your statistics and recent activity
- **Products**: Manage your uploaded product images
- **Models**: View and organize your AI-generated models
- **Collections**: Group your work into collections
- **Settings**: Update your profile and preferences

## 🔧 Development

### Project Structure
```
drampa/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # Dashboard pages
│   │   └── layout.tsx      # Root layout
│   ├── components/         # React components
│   │   ├── sections/       # Page sections
│   │   └── ui/            # Reusable UI components
│   ├── contexts/          # React contexts (Auth)
│   ├── lib/               # Utilities and configurations
│   └── types/             # TypeScript type definitions
└── backend/               # Express.js backend
    ├── controllers/       # Route controllers
    ├── middleware/        # Express middleware
    ├── models/           # Mongoose models
    ├── routes/           # Express routes
    └── utils/            # Backend utilities
```

### Key Components

#### Authentication System
- **AuthContext**: Global authentication state management
- **AuthService**: API communication for auth operations
- **Protected Routes**: Automatic redirection for unauthenticated users

#### UI Components
- **Navbar**: Responsive navigation with auth integration
- **FileUpload**: Drag-and-drop file upload with preview
- **Settings**: Comprehensive user settings management
- **Dashboard**: Analytics and overview interface

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password

### Password Requirements
- Minimum 6 characters
- At least one lowercase letter
- At least one uppercase letter
- At least one number

## 🎨 Theming

The application supports both light and dark themes:
- **Primary Color**: #FF7722 (Orange)
- **Theme Toggle**: Available in navbar
- **Responsive**: All components adapt to theme changes

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: express-validator for API security
- **Protected Routes**: Frontend route protection
- **CORS Configuration**: Secure cross-origin requests

## 📱 Responsive Design

The application is fully responsive and tested on:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Push your code to GitHub
2. Connect your repository to Vercel/Netlify
3. Set environment variables
4. Deploy

### Backend (Railway/Heroku)
1. Create a new app on Railway/Heroku
2. Connect your repository
3. Set environment variables
4. Deploy

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Get your connection string
3. Update MONGODB_URI in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **AI Integration**: Stable Diffusion API (planned)
- **Design**: Modern, responsive, accessible UI

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify your environment variables
3. Ensure MongoDB is running
4. Check that both frontend and backend servers are running

For more help, please open an issue on GitHub.

---

Made with ❤️ using modern web technologies and AI.
