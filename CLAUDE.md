# DRAMPA Fashion AI - Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Key Features](#key-features)
5. [API Endpoints](#api-endpoints)
6. [Database Schema](#database-schema)
7. [Authentication & Security](#authentication--security)
8. [UI/UX Components](#uiux-components)
9. [Environment Configuration](#environment-configuration)
10. [Running the Project](#running-the-project)
11. [Recent Updates](#recent-updates-and-changes)
12. [Known Issues](#known-issues-and-fixes)
13. [Deployment Guide](#deployment-guide)

## Quick Start
```bash
# Clone the repository
git clone https://github.com/utopusc/drampa-fashion-ai.git
cd drampa-fashion-ai

# Install dependencies
npm run install:all

# Set up environment variables
cp .env.example .env.local
cp Backend/.env.example Backend/.env

# Run development server
npm run dev

# Access the application
# Frontend: http://localhost:3001
# Backend: http://localhost:5001
```

## Project Overview

DRAMPA Fashion AI is an advanced AI-powered fashion photography platform that enables users to create professional product photos using virtual models and AI technology. The platform provides a visual node-based editor for creating fashion photography workflows, supporting multiple generation types including on-model photography, flat lay, and mannequin shots.

### Key Highlights
- 🎨 **Visual Editor**: Intuitive drag-and-drop interface with React Flow
- 👗 **22 AI Models**: Diverse virtual models with custom LoRA training
- 🖼️ **Multiple Modes**: On-model, flat lay, and mannequin photography
- ⚡ **Fast Fashion Mode**: Optimized for AI clothing replacement
- 💾 **Project Management**: Auto-save, version control, and collaboration
- 🎯 **Smart Generation**: AI-powered prompts with style combinations
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔐 **Secure**: JWT authentication with role-based access

## Tech Stack

### Frontend
- **Framework**: Next.js 15.2.2 with App Router
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4.0 with custom design system
- **State Management**: Zustand 5.0.4
- **UI Components**: 
  - React Flow (@xyflow/react 12.8.1) for visual pipeline editor
  - Framer Motion 12.23.9 for animations
  - Heroicons & Lucide React for icons
  - Magic UI components (custom implementations)
  - Radix UI components for accessibility
- **Authentication**: Supabase Auth (2.49.4)
- **HTTP Client**: Axios 1.10.0
- **Utilities**: 
  - React Hot Toast & Sonner for notifications
  - clsx & tailwind-merge for className utilities
  - date-fns 4.1.0 for date formatting
  - immer 10.1.1 for immutable state updates
  - lodash 4.17.21 for utility functions

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 4.19.2
- **Database**: MongoDB with Mongoose ODM 8.4.5
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Security**: 
  - bcryptjs 2.4.3 for password hashing
  - CORS enabled
  - Input validation with express-validator
- **File Upload**: Multer 1.4.5-lts.1 (configured)
- **Development**: 
  - Nodemon 3.1.4 for auto-reload
  - Concurrently 8.2.2 for parallel processes

### AI Integration
- **Primary AI Service**: Fal.ai (@fal-ai/client 1.5.0)
- **Fashion AI API**: Custom integration at api.fashion-ai.com
- **Image Generation Models**: FLUX with custom LoRA models
- **Supported Features**: 
  - Custom model training via LoRA URLs
  - Multiple image sizes and orientations
  - Style transfer and pose generation

## Architecture

### Directory Structure

```
drampa-fashion-ai/
├── src/                      # Frontend source code
│   ├── app/                  # Next.js app router pages
│   │   ├── (auth)/          # Authentication pages (sign-in, sign-up)
│   │   ├── auth/            # Auth redirect pages
│   │   ├── api/             # API routes
│   │   ├── create/          # Fashion design studio
│   │   │   ├── components/  # Editor components
│   │   │   │   ├── nodes/   # React Flow nodes
│   │   │   │   ├── PortraitEditor.tsx (Main editor)
│   │   │   │   └── GenerateButton.tsx
│   │   │   ├── flat-lay/    # Flat lay mode
│   │   │   ├── mannequin/   # Mannequin mode
│   │   │   ├── on-model/    # On-model mode
│   │   │   └── page.tsx     # Main create page
│   │   ├── dashboard/       # User dashboard
│   │   │   ├── gallery/     # Generated images gallery
│   │   │   ├── profile/     # User profile
│   │   │   ├── settings/    # App settings
│   │   │   └── layout.tsx   # Dashboard layout
│   │   ├── page.tsx         # Landing page
│   │   ├── layout.tsx       # Root layout
│   │   └── providers.tsx    # App providers
│   ├── components/          # Shared components
│   │   ├── magicui/         # Magic UI components
│   │   ├── sections/        # Landing page sections
│   │   ├── ui/              # UI components library
│   │   └── theme-*.tsx      # Theme components
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx  # Authentication context
│   ├── data/               # Static data
│   │   ├── models.ts        # 22 AI models data
│   │   ├── backgrounds.ts   # Background options
│   │   ├── poses.ts         # Pose configurations
│   │   └── fashionStyles.ts # Fashion style tags
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and configurations
│   │   ├── ai/             # AI service integrations
│   │   ├── supabase/       # Supabase client
│   │   ├── config.tsx      # App configuration
│   │   ├── format.ts       # Formatting utilities
│   │   ├── site.ts         # Site metadata
│   │   └── utils.ts        # Helper functions
│   ├── services/           # API service layers
│   │   ├── api.ts          # Base API client
│   │   ├── authService.ts  # Authentication
│   │   ├── generationService.ts # AI generation
│   │   ├── imageService.ts # Image management
│   │   └── projectService.ts # Project management
│   ├── store/              # Zustand stores
│   │   ├── modelStore.ts   # Model selection
│   │   ├── pipelineStore.ts # Pipeline editor
│   │   ├── productStore.ts # Product management
│   │   └── projectStore.ts # Project state
│   ├── styles/             # Global styles
│   │   └── globals.css     # Tailwind imports
│   └── types/              # TypeScript types
│       ├── index.ts        # Common types
│       └── ui-components.d.ts # UI types
├── Backend/                 # Backend server
│   ├── controllers/        # Route controllers
│   │   ├── authController.js
│   │   ├── imageController.js
│   │   ├── projectController.js
│   │   └── userController.js
│   ├── middleware/         # Express middleware
│   │   └── auth.js         # JWT authentication
│   ├── models/             # MongoDB models
│   │   ├── Image.js        # Generated images
│   │   ├── Project.js      # User projects
│   │   └── User.js         # User accounts
│   ├── routes/             # API routes
│   │   ├── auth.js         # /api/auth/*
│   │   ├── images.js       # /api/images/*
│   │   ├── projects.js     # /api/projects/*
│   │   └── users.js        # /api/users/*
│   ├── utils/              # Utility functions
│   └── server.js           # Express server entry
├── public/                 # Static assets
│   ├── assets/            # Images
│   │   ├── Background/    # Background images
│   │   ├── Models/        # Model photos
│   │   └── gallery/       # Sample gallery
│   └── fonts/             # Custom fonts
├── .env.local             # Frontend environment
├── .env                   # Backend environment
├── package.json           # Frontend dependencies
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json          # TypeScript config
└── README.md              # Project documentation
```

### Key Features

#### 1. AI Fashion Generation
- **On-Model Photography**: Place products on virtual models
- **Flat Lay**: Product-only photography
- **Mannequin/Ghost**: Invisible mannequin effect
- **Portrait Generation**: Create custom AI portraits with detailed facial features

#### 2. Visual Pipeline Editor
- Node-based interface using React Flow
- Drag-and-drop workflow creation
- Real-time preview capabilities
- Tag-based styling system (no connection lines)
- Auto-save functionality
- Undo/Redo support

#### 3. Model Selection
- 22 virtual models (male and female)
- Diverse representation
- Each model has unique LoRA URL for AI generation
- Model filtering by gender and style

#### 4. Background Library
- 20+ professional backgrounds
- Categories: Studio, Urban, Nature, Gradient, Abstract, Texture
- Customizable background modes (Keep, Remove, Replace)
- New backgrounds added:
  - Geometric patterns
  - Gradient variations
  - Artistic textures
  - Professional studio setups

#### 5. Pose & Style Management
- Predefined poses (standing, sitting, walking, dynamic, reclining)
- Fashion style tags (casual, formal, streetwear, athletic, luxury, etc.)
- Expression and angle adjustments
- Enhanced pose library with 15+ poses
- Style combinations for unique looks

#### 6. Portrait Customization
- **Facial Features**: Eyes, nose, lips, face shape adjustments
- **Skin & Complexion**: Tone, texture, clarity controls
- **Hair Styling**: Style, color, length options
- **Makeup**: Natural to dramatic options
- **Accessories**: Glasses, jewelry, headwear
- **Expressions**: Happy, serious, confident, etc.

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

#### Projects
- `GET /api/projects` - List user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `PATCH /api/projects/:id/autosave` - Auto-save project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/duplicate` - Duplicate project

#### Images
- `GET /api/images` - Get user's generated images
- `POST /api/images` - Save generated image
- `GET /api/images/:id` - Get image details
- `DELETE /api/images/:id` - Delete image

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

#### Project Model
```javascript
{
  user: ObjectId (ref: 'User'),
  name: String (required),
  description: String,
  status: String (enum: ['draft', 'published', 'archived']),
  nodes: [{
    id: String,
    type: String,
    position: { x: Number, y: Number },
    data: Object
  }],
  edges: Array,
  viewport: {
    x: Number,
    y: Number,
    zoom: Number
  },
  uiState: Object,
  thumbnail: String,
  lastModified: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### Image Model
```javascript
{
  user: ObjectId (ref: 'User'),
  project: ObjectId (ref: 'Project'),
  url: String (required),
  prompt: String (required),
  model: {
    id: String,
    name: String
  },
  styleItems: [{
    type: String,
    name: String,
    tag: String
  }],
  metadata: {
    width: Number,
    height: Number,
    imageSize: String,
    generationTime: Number
  },
  credits: Number,
  createdAt: Date
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
- **Animations**: Framer Motion for smooth transitions
- **Interactive Elements**: Hover states, focus indicators

#### Key Components
1. **PipelineEditorV3**: Main visual editor
2. **CleanModelNode**: Draggable model nodes
3. **UnifiedSidebar**: Tabbed sidebar (Models, Backgrounds, Pose, Fashion)
4. **GenerateButton**: AI generation trigger with cost calculation
5. **PortraitEditor**: Advanced portrait customization interface (v1.2.0)
   - Vertical pill-shaped menu navigation
   - Phone-sized sliding panels
   - Mini visual tags for selections
   - Body type selector (replaces clothing sizes)
   - Fast Fashion mode toggle
   - Integrated gallery with modal view
   - Auto-save UI state to project
6. **PlaceholdersAndVanishInput**: Advanced input component with vanishing animation
   - Multiple placeholder cycling
   - Smooth fade transitions
   - Submit on Enter functionality
   - Used for prompts and descriptions
7. **VerticalMenuBar**: Custom vertical navigation component
   - Pill-shaped design (rounded-full)
   - Orange color scheme for active states
   - Smooth animations and transitions
   - Icon-based navigation

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
FAL_API_KEY=your_fal_api_key
FRONTEND_URL=http://localhost:3001
```

### Running the Project

#### Development
```bash
# Install all dependencies (frontend + backend)
npm run install:all

# Run both frontend and backend concurrently
npm run dev

# Or run separately:
# Backend only (port 5001)
npm run dev:backend

# Frontend only (port 3001)
npm run dev:frontend
```

#### Production Build
```bash
# Frontend
npm run build
npm start  # Runs on port 3001

# Backend
cd Backend
npm start  # Runs on port 5001
```

#### Port Configuration
- **Frontend**: http://localhost:3001 (configured in package.json)
- **Backend**: http://localhost:5001 (configured in .env)

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
- Memoized components to prevent unnecessary re-renders
- Virtual scrolling for large lists
- Progressive image loading with blur placeholders
- Optimized bundle splitting for faster initial load

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

### Known Issues and Fixes

#### Fixed Issues
1. ✅ Authentication persistence on page refresh (Fixed in c91de12)
2. ✅ Project creation bug - was opening old projects (Fixed in Version 1.2.0)
3. ✅ UI state persistence in projects (Fixed with auto-save)
4. ✅ Gallery integration with proper image persistence

#### Current Issues
1. ReactFlow read-only property errors (workaround implemented with custom hooks)
2. Image loading errors need better fallback handling
3. Credit deduction happens before generation confirmation
4. No recovery mechanism for failed generations
5. Portrait Editor needs optimization for mobile devices
6. Some background images may not load on slow connections
7. Backend file upload (Multer) configured but not fully implemented

### Support & Resources

- **Documentation**: This file and inline code comments
- **Issues**: GitHub Issues for bug tracking
- **Updates**: Check package.json for dependency updates
- **Community**: Discord server (planned)

### Scripts and Commands

#### Package.json Scripts
```json
{
  "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
  "dev:backend": "cd Backend && npm run dev",
  "dev:frontend": "next dev --turbopack -p 3001",
  "build": "next build",
  "start": "next start -p 3001",
  "lint": "next lint",
  "install:all": "npm install && cd Backend && npm install"
}
```

### Component Specifications

#### PortraitEditor Component
- **Location**: `/src/app/create/components/PortraitEditor.tsx`
- **Size**: 1304 lines of code
- **Features**:
  - Vertical menu navigation with 7 tabs
  - Model selection with gender and size filters
  - Background, pose, and style selection
  - Real-time preview and generation
  - Gallery sidebar with modal view
  - Auto-save to project state
  - Fast Fashion Mode toggle

#### Key UI Components
1. **PlaceholdersAndVanishInput**:
   - Animated placeholder cycling
   - Canvas-based text vanishing effect
   - Submit on Enter functionality
   - Orange gradient submit button

2. **VerticalMenuBar**:
   - Pill-shaped vertical navigation
   - Orange active state indicators
   - Smooth spring animations
   - Tooltip on hover

3. **Gallery Modal**:
   - Full-screen overlay
   - Grid and detail views
   - Metadata display
   - Responsive design

### Security and Authentication

- **JWT Token**: 7-day expiry, stored in localStorage
- **Admin Users**: Special privileges for bruceoz@gmail.com
- **Password Security**: Bcrypt with salt rounds
- **CORS Configuration**: Enabled for cross-origin requests
- **Protected Routes**: Middleware-based authentication
- **Supabase Integration**: For additional auth features

### Performance Features

1. **Next.js Turbopack**: Faster development builds
2. **Image Optimization**: 
   - Next.js Image component
   - Blur placeholders
   - Progressive loading
3. **State Management**:
   - Zustand for global state
   - Immer for immutable updates
   - Debounced auto-save
4. **Code Splitting**: Automatic with Next.js
5. **Memoization**: React.memo for expensive components

### Deployment Guide

1. **Frontend (Vercel)**:
   ```bash
   vercel --prod
   ```
   - Set environment variables in Vercel dashboard
   - Configure custom domain if needed

2. **Backend (Railway/Render)**:
   - Connect GitHub repository
   - Set start command: `cd Backend && npm start`
   - Configure environment variables

3. **Database (MongoDB Atlas)**:
   - Create cluster
   - Whitelist IP addresses
   - Update connection string

4. **File Storage**:
   - Configure AWS S3 or Cloudinary
   - Update image upload endpoints

### Developer Notes

#### Code Style Guidelines
- **TypeScript**: Strict mode enabled, use proper typing
- **Components**: Functional components with hooks
- **Styling**: Tailwind utility classes, avoid inline styles
- **State**: Zustand for global, useState for local
- **Naming**: CamelCase for components, kebab-case for files
- **Imports**: Absolute imports using @ alias

#### Common Development Tasks

1. **Adding a New Model**:
   - Update `/src/data/models.ts`
   - Add model photo to `/public/assets/Models/`
   - Include LoRA URL for AI training

2. **Creating New UI Components**:
   - Place in `/src/components/ui/`
   - Follow existing component patterns
   - Include TypeScript definitions

3. **Adding API Endpoints**:
   - Create controller in `/Backend/controllers/`
   - Add route in `/Backend/routes/`
   - Update service layer in `/src/services/`

4. **Debugging Tips**:
   - Check browser console for frontend errors
   - Monitor backend logs with `npm run dev:backend`
   - Use React DevTools for component inspection
   - Check network tab for API calls

#### Testing (To Be Implemented)
- Unit tests with Jest
- Component tests with React Testing Library
- E2E tests with Cypress
- API tests with Supertest

### Contributing Guidelines

1. **Branch Naming**: `feature/description` or `fix/description`
2. **Commit Messages**: Use conventional commits
3. **Pull Requests**: Include description and screenshots
4. **Code Review**: Required before merging
5. **Documentation**: Update CLAUDE.md for major changes

### Resources and Links

- **Repository**: https://github.com/utopusc/drampa-fashion-ai
- **Fal.ai Docs**: https://fal.ai/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Flow**: https://reactflow.dev/docs
- **Zustand**: https://github.com/pmndrs/zustand

---

# Important Development Reminders
- Frontend runs on port 3001 (not 3000)
- Backend runs on port 5001
- Always use `npm run install:all` for fresh setup
- Check `.env.local` and `Backend/.env` for required variables
- Use auto-save feature for better UX
- Test on multiple screen sizes
- Optimize images before adding to public folder

---

Last Updated: July 26, 2025
Version: 1.2.0
Maintainer: Burak Can Ozturk

### Recent Updates and Changes

#### Latest Changes (July 2025)
- **Port Configuration**: Frontend now runs on port 3001 (was 3000)
- **New UI Components**:
  - PlaceholdersAndVanishInput: Advanced input with vanishing animation
  - VerticalMenuBar: Custom vertical navigation with orange theme
  - BottomMenu: Bottom navigation component
- **Enhanced Data Libraries**:
  - 8 professional backgrounds with tags
  - 8 pose configurations with descriptions
  - 10 fashion style categories
- **Project Management**:
  - Real-time auto-save functionality
  - Project renaming in header
  - Save status indicators
  - Proper project loading from URL parameters
- **Gallery Improvements**:
  - Full-screen image modal with metadata
  - Pagination support
  - Filter by style
  - Integration with dashboard pattern

### Version History

#### Version 1.2.0 (Current)
- **Major UI Overhaul**:
  - Complete redesign of create/editor page
  - Removed traditional sidebar, replaced with vertical pill-shaped menu
  - Added mini visual tags above input field
  - Implemented phone-sized sliding panel with animations
  - Used PipelineEditor UI patterns as design reference
  
- **Body Type System**:
  - Changed from clothing sizes to body types
  - Options: Çok Zayıf (Very Thin), Zayıf (Thin), Orta (Normal), Kilolu (Overweight), Aşırı Kilolu (Very Overweight)
  - Body type descriptions integrated into AI prompts
  
- **Project Management Fixes**:
  - Fixed project creation bug (was opening old projects)
  - Implemented proper UI state persistence
  - Auto-save functionality with debouncing
  - Project state includes all UI selections and generated images
  
- **Gallery Improvements**:
  - Full functional gallery on right side
  - Modal view for image details
  - Integration with dashboard/gallery pattern
  - Proper image persistence in projects

#### Version 1.1.0

#### New Features
1. **Portrait Editor Component**
   - Complete facial customization interface
   - Real-time AI preview generation
   - Save and load portrait presets
   - Integration with main generation pipeline

2. **Enhanced UI Components**
   - PlaceholdersAndVanishInput for better UX
   - Improved animation system with Framer Motion
   - Better responsive design for all screen sizes

3. **Expanded Data Libraries**
   - Added new backgrounds (geometric, gradient, texture)
   - Enhanced pose library with 15+ options
   - More fashion style combinations
   - Portrait-specific prompts and settings

#### Improvements
- Better error handling with user-friendly messages
- Optimized image loading with progressive enhancement
- Enhanced state management for complex workflows
- Improved TypeScript type definitions

#### Bug Fixes
- Fixed model node dragging issues
- Resolved background loading errors
- Corrected credit calculation logic
- Fixed authentication state persistence