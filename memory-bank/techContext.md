# DRAMPA Technical Context

## Technology Stack

### Frontend
- **Next.js 15+**: React framework with App Router
- **React 19**: Component library
- **Tailwind CSS 4**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **React Dropzone**: File upload management
- **Tabler Icons**: Icon library

### Backend & Data
- **Supabase**: Backend-as-a-Service platform
  - Authentication
  - PostgreSQL database
  - Storage for files and images
  - Edge Functions (serverless)

### AI & Image Processing
- **Hugging Face**: AI model hosting
- **Stable Diffusion XL**: Image generation model

## Development Environment
- **Node.js**: JavaScript runtime
- **TypeScript**: Type-safe JavaScript
- **ESLint**: Code linting
- **Turbopack**: Fast bundling via Next.js

## Key Dependencies
From package.json:
```json
{
  "dependencies": {
    "@radix-ui/react-accordion": "^1.2.3",
    "@radix-ui/react-label": "^2.1.6",
    "@radix-ui/react-navigation-menu": "^1.2.5",
    "@radix-ui/react-slot": "^1.2.2",
    "@supabase/supabase-js": "^2.49.4",
    "@tabler/icons-react": "^3.31.0",
    "@tanstack/react-query": "^5.75.7",
    "class-variance-authority": "^0.7.1",
    "framer-motion": "^12.10.5",
    "motion": "^12.10.5",
    "next": "15.2.2",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-dropzone": "^14.3.8",
    "zustand": "^5.0.4"
  }
}
```

## Component Libraries
- **Radix UI**: Unstyled, accessible components
- **MagicUI**: Specialized UI components for animations and effects

## API Integration

### Supabase API
- Authentication
- Database CRUD operations
- Storage operations

### Hugging Face API
- Model inference endpoints
- Image generation with prompts

## Deployment Strategy
- **Vercel**: Frontend deployment
- **Supabase**: Backend services

## Performance Considerations
- Image optimization for fast loading
- Client-side caching where appropriate
- Lazy loading of components
- Optimized animations for smooth experience

## Security Approach
- Supabase authentication
- Server-side validation
- Environment variables for sensitive data
- CORS policies 