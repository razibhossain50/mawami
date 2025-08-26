# Mawami - Matrimony Platform

A comprehensive matrimony/biodata platform built with Next.js and NestJS, designed to help people find their perfect life partners.

## 🚀 Technology Stack

### Frontend
- **Framework**: Next.js 15.2.3 with App Router
- **Language**: TypeScript 5.x
- **Runtime**: React 19.0.0
- **Styling**: Tailwind CSS V4.1.8 with PostCSS
- **UI Components**: HeroUI 2.8.2 (NextUI-based)
- **State Management**: TanStack React Query 5.80.2
- **Forms**: React Hook Form 7.56.4 with Zod 3.25.45 validation
- **Icons**: Lucide React 0.511.0
- **File Upload**: React Dropzone 14.3.5

### Backend
- **Framework**: NestJS 11.0.1
- **Language**: TypeScript 5.7.3
- **Database**: PostgreSQL with TypeORM 0.3.25
- **Authentication**: JWT 11.0.0 with Passport 0.7.0
- **Password Hashing**: bcryptjs 3.0.2
- **File Upload**: Multer with @nestjs/platform-express
- **Validation**: Class Validator 0.14.2 & Class Transformer 0.5.1

## 📋 Prerequisites

- Node.js 18.x or later (recommended: Node.js 20.x+)
- PostgreSQL database
- npm or yarn package manager

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone git@github.com:razibhossain50/mawami.git
cd mawami
```

> **Windows Users**: Place the repository near the root of your drive if you face issues while cloning.

### 2. Install Dependencies

#### Frontend Dependencies
```bash
npm install
# or
yarn install
```

#### Backend Dependencies
```bash
cd backend
npm install
# or
yarn install
```

> Use `--legacy-peer-deps` flag if you face peer-dependency errors during installation.

### 3. Environment Configuration

#### Frontend Environment (.env)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:2000
NEXT_PUBLIC_BUILDER_API_KEY=your_builder_api_key
```

#### Backend Environment (backend/.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=mawami_db
JWT_SECRET=your_jwt_secret
```

### 4. Database Setup
1. Create a PostgreSQL database named `mawami_db`
2. The application will automatically create tables on first run using TypeORM synchronization

### 5. Start Development Servers

#### Start Backend (Port 2000)
```bash
cd backend
npm run start:dev
# or
yarn start:dev
```

#### Start Frontend (Port 3000)
```bash
npm run dev
# or
yarn dev
```

## 🎯 Default Test Accounts

The system automatically creates these test accounts on startup:

### Regular User
- **Email**: `user@example.com`
- **Password**: `Testpass@50`
- **Access**: User dashboard and biodata creation

### Admin User
- **Email**: `admin@example.com`
- **Password**: `Testpass@50`
- **Access**: Admin dashboard with biodata and user management

### Superadmin User
- **Email**: `razibmahmud50@gmail.com`
- **Password**: `Testpass@50`
- **Access**: Full admin access including user deletion

## 🔧 Development Commands

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Backend
```bash
npm run start:dev    # Start development server with hot reload
npm run build        # Build for production
npm run start:prod   # Start production server
```

## 🧪 Testing

### Test Scripts Available
```bash
node tests/test-admin-auth.js      # Test admin authentication and permissions
node tests/test-profile-upload.js  # Test profile picture upload functionality
node tests/test-biodata-api.js     # Test biodata API endpoints
```

## 🌐 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:2000
- **Admin Panel**: http://localhost:3000/admin
- **User Dashboard**: http://localhost:3000/dashboard

## 📁 Project Structure

```
Mawami/
├── src/                     # Frontend source code
├── public/                  # Static assets
│   └── uploads/            # User uploaded files
├── README.md               # This file
├── context.md              # Detailed project documentation
└── package.json            # Frontend dependencies
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Git Workflow

### Branch Naming Convention
- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/critical-fix` - Critical production fixes
- `docs/documentation-update` - Documentation updates

### Commit Message Format
```
type(scope): description

Examples:
feat(auth): add user registration functionality
fix(biodata): resolve profile picture upload issue
docs(readme): update installation instructions
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For detailed project documentation, architecture, and feature information, see [context.md](context.md).

For issues and questions:
1. Check the [context.md](context.md) for detailed documentation
2. Run the test scripts to verify your setup
3. Check the console logs for error messages
4. Create an issue in the repository