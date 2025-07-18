# DRAMPA Fashion AI - Project Documentation

## Project Overview

DRAMPA Fashion AI is an advanced AI-powered fashion photography platform that enables users to create professional product photos using virtual models and AI technology. The platform provides a visual node-based editor for creating fashion photography workflows, supporting multiple generation types including on-model photography, flat lay, and mannequin shots.

## Tech Stack

### Frontend
- **Framework**: Next.js 15.2.2 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0 with custom design system
- **State Management**: Zustand
- **UI Components**: 
  - React Flow (@xyflow/react) for visual pipeline editor
  - Framer Motion for animations
  - Heroicons & Lucide React for icons
- **Authentication**: Supabase Auth
- **HTTP Client**: Axios
- **Utilities**: 
  - React Hot Toast for notifications
  - clsx & tailwind-merge for className utilities
  - date-fns for date formatting

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Security**: 
  - bcryptjs for password hashing
  - CORS enabled
  - Input validation
- **File Upload**: Multer (configured but not implemented)
- **Development**: Nodemon

### AI Integration
- **Primary AI Service**: Fal.ai (for image generation)
- **Fashion AI API**: Custom integration at api.fashion-ai.com
- **Planned**: Hugging Face integration

## Architecture

### Directory Structure

```
drampa-fashion-ai/
├── src/                      # Frontend source code
│   ├── app/                  # Next.js app router pages
│   │   ├── (auth)/          # Authentication pages
│   │   ├── api/             # API routes
│   │   ├── create/          # Fashion design studio
│   │   ├── dashboard/       # User dashboard
│   │   └── layout.tsx       # Root layout
│   ├── components/          # Shared components
│   ├── contexts/            # React contexts (Auth)
│   ├── data/               # Static data (models, backgrounds)
│   ├── lib/                # Utilities and configurations
│   ├── store/              # Zustand stores
│   └── styles/             # Global styles
├── backend/                 # Backend server
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Express middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   └── server.js          # Express server entry
├── public/                 # Static assets
│   └── assets/            # Images (models, backgrounds, gallery)
└── package.json           # Dependencies
```

### Key Features

#### 1. AI Fashion Generation
- **On-Model Photography**: Place products on virtual models
- **Flat Lay**: Product-only photography
- **Mannequin/Ghost**: Invisible mannequin effect

#### 2. Visual Pipeline Editor
- Node-based interface using React Flow
- Drag-and-drop workflow creation
- Real-time preview capabilities
- Tag-based styling system (no connection lines)

#### 3. Model Selection
- 22 virtual models (male and female)
- Diverse representation
- Each model has unique LoRA URL for AI generation

#### 4. Background Library
- 20+ professional backgrounds
- Categories: Studio, Urban, Nature, Gradient, etc.
- Customizable background modes (Keep, Remove, Replace)

#### 5. Pose & Style Management
- Predefined poses (standing, sitting, walking, etc.)
- Fashion style tags (casual, formal, streetwear, etc.)
- Expression and angle adjustments

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

#### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/credits` - Get credit balance
- `POST /api/users/credits/add` - Add credits

### Database Schema

#### User Model
```javascript
{
  email: String (required, unique),
  password: String (required, hashed),
  name: String,
  credits: Number (default: 1000),
  profileImage: String,
  preferences: {
    defaultImageSize: String,
    favoriteModels: [String],
    theme: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Authentication & Security

- **JWT-based authentication** with 7-day token expiry
- **Password requirements**: Minimum 6 characters
- **Bcrypt hashing** with salt rounds
- **Protected routes** using authentication middleware
- **CORS enabled** for cross-origin requests

### UI/UX Components

#### Design System
- **Colors**: Primary (Indigo), Gray scale, Success/Error states
- **Typography**: Inter font family
- **Spacing**: 4px base unit system
- **Borders**: Rounded corners (2xl for nodes)

#### Key Components
1. **PipelineEditorV3**: Main visual editor
2. **CleanModelNode**: Draggable model nodes
3. **UnifiedSidebar**: Tabbed sidebar (Models, Backgrounds, Pose, Fashion)
4. **GenerateButton**: AI generation trigger with cost calculation

### Third-Party Integrations

#### Current
- **Fal.ai**: Primary AI image generation service
- **Supabase**: Authentication and user management
- **Fashion AI API**: Custom fashion-specific AI endpoints

#### Planned
- **Stripe/PayPal**: Payment processing
- **SendGrid**: Email notifications
- **Cloudinary**: Image CDN and optimization

### Environment Configuration

#### Frontend (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
FAL_KEY=your_fal_api_key
```

#### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/drampa-fashion
JWT_SECRET=your_jwt_secret
PORT=5001
```

### Running the Project

#### Development
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd ..
npm install
npm run dev
```

#### Production Build
```bash
# Frontend
npm run build
npm start

# Backend
cd backend
npm start
```

### Deployment Considerations

1. **Frontend**: Vercel (recommended) or any Node.js hosting
2. **Backend**: Railway, Render, or AWS EC2
3. **Database**: MongoDB Atlas for production
4. **File Storage**: AWS S3 or Cloudinary for generated images
5. **Environment**: Ensure all env variables are properly set

### Performance Optimizations

- Next.js Turbopack for faster development builds
- Image optimization with Next.js Image component
- Lazy loading for model and background galleries
- Debounced search and filter operations
- React Flow optimization with custom node handlers

### Future Roadmap

1. **Batch Processing**: Generate multiple variations simultaneously
2. **Custom Model Training**: Allow users to train custom LoRA models
3. **API Access**: Provide REST API for third-party integrations
4. **Mobile App**: React Native application
5. **Advanced Editing**: Post-generation image editing tools
6. **Collaboration**: Team workspaces and sharing features

### Technical Debt & Improvements

1. Implement proper error boundaries
2. Add comprehensive test coverage (Jest, React Testing Library)
3. Implement Redis for session management
4. Add request rate limiting
5. Implement webhook support for async operations
6. Migrate to GraphQL for more efficient data fetching
7. Add WebSocket support for real-time updates
8. Implement proper logging (Winston/Morgan)
9. Add monitoring and analytics (Sentry, Google Analytics)
10. Implement CI/CD pipeline

### Development Guidelines

1. **Code Style**: ESLint + Prettier configuration
2. **Git Flow**: Feature branches → develop → main
3. **Commit Convention**: Conventional commits
4. **Testing**: Unit tests for utilities, integration tests for API
5. **Documentation**: JSDoc for complex functions
6. **Type Safety**: Strict TypeScript configuration

### Known Issues

1. ReactFlow read-only property errors (workaround implemented with custom hooks)
2. Image loading errors need better fallback handling
3. Credit deduction happens before generation confirmation
4. No recovery mechanism for failed generations

### Support & Resources

- **Documentation**: This file and inline code comments
- **Issues**: GitHub Issues for bug tracking
- **Updates**: Check package.json for dependency updates
- **Community**: Discord server (planned)

---

Last Updated: July 2025
Version: 1.0.0