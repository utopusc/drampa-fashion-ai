# DRAMPA Fashion AI 🎨👗

An advanced AI-powered fashion photography platform that enables users to create professional product photos using virtual models and AI technology.

![DRAMPA Fashion AI](https://img.shields.io/badge/Next.js-15.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green?style=for-the-badge&logo=mongodb)
![Fal.ai](https://img.shields.io/badge/Fal.ai-Integrated-purple?style=for-the-badge)

## 🚀 Features

### Core Features
- **Visual Node-Based Editor**: Intuitive drag-and-drop interface for creating fashion photography workflows
- **AI Model Integration**: 22+ diverse virtual models with unique LoRA URLs
- **Multiple Generation Types**: 
  - On-Model Photography
  - Flat Lay
  - Mannequin/Ghost Effect
- **Fast Fashion Mode**: Optimized for AI clothing replacement with solid color garments
- **Custom Image Sizes**: Support for custom dimensions and fashion-specific presets
- **Real-time Preview**: See your designs come to life instantly

### Recent Updates
- ✨ Fast Fashion Mode for AI-ready images
- 📐 Custom image size inputs with width/height controls
- 📱 Fashion-specific size presets (Instagram, E-commerce, Product Page)
- 👑 Admin privileges system
- 🖼️ Improved image modal with proper aspect ratio
- 🎯 Fixed authentication persistence
- 🎨 Redesigned UI/UX components

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.2** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Flow** for visual pipeline editor
- **Zustand** for state management
- **Framer Motion** for animations

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- **Bcrypt** for password security

### AI Integration
- **Fal.ai** for image generation
- **Custom LoRA** support for fashion models

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/utopusc/drampa-fashion-ai-2.git
cd drampa-fashion-ai-2
```

2. Install dependencies:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

3. Set up environment variables:

Create `.env.local` in the root directory:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
FAL_KEY=your_fal_api_key
```

Create `.env` in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/drampa-fashion
JWT_SECRET=your_jwt_secret
PORT=5001
```

4. Run the development server:
```bash
# From the root directory
npm run dev
```

This will start both frontend (http://localhost:3000) and backend (http://localhost:5001) servers.

## 🎯 Usage

1. **Sign Up/Login**: Create an account or login with existing credentials
2. **Create Project**: Start a new fashion photography project
3. **Drag & Drop**: Add models, backgrounds, and poses to your canvas
4. **Customize**: Adjust prompts, select image sizes, enable Fast Fashion mode
5. **Generate**: Click generate to create AI-powered fashion images
6. **Download**: Save your generated images

### Fast Fashion Mode
Enable Fast Fashion Mode for:
- Solid color clothing perfect for AI replacement
- Professional studio-quality photos
- E-commerce ready images
- Clean, minimalist aesthetic

## 🔑 Admin Features

Admin users (bruceoz@gmail.com) have:
- Unlimited credits
- Access to all features
- No generation limits

## 📸 Image Size Options

### Predefined Sizes
- Square (1:1) - 1024x1024
- Portrait 3:4 - 768x1024
- Portrait 9:16 - 576x1024
- Landscape 4:3 - 1024x768
- Landscape 16:9 - 1024x576

### Fashion-Specific Presets
- Instagram Post - 1080x1350
- E-commerce - 1200x1800
- Product Page - 800x1200

### Custom Sizes
Set any dimension between 256-2048 pixels

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Powered by [Fal.ai](https://fal.ai) for AI image generation
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Heroicons](https://heroicons.com) and [Lucide](https://lucide.dev)

---

Built with ❤️ by Burak Can Ozturk