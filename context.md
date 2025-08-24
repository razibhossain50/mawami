# Finder - Matrimony Platform Context

## Project Overview

**Finder** is a comprehensive matrimony/biodata platform built with Next.js and NestJS, designed to help people find their perfect life partners. The platform features a complete biodata management system with advanced search capabilities, admin panel for user management, role-based authentication system, and profile picture upload functionality.

## Technology Stack

### Frontend (Version 2.0.2)
- **Framework**: Next.js 15.2.3 with App Router
- **Language**: TypeScript 5.x
- **Runtime**: React 19.0.0
- **Styling**: Tailwind CSS V4.1.8 with PostCSS
- **UI Components**: HeroUI 2.8.2 (NextUI-based)
- **State Management**: TanStack React Query 5.80.2
- **Forms**: React Hook Form 7.56.4 with Zod 3.25.45 validation
- **Icons**: Lucide React 0.511.0
- **Animations**: Framer Motion 12.23.12
- **Charts**: ApexCharts 4.3.0 with React ApexCharts
- **Calendar**: FullCalendar 6.1.15
- **Maps**: React JVectorMap
- **File Upload**: React Dropzone 14.3.5
- **Drag & Drop**: React DND 16.0.1
- **Utilities**: Class Variance Authority, clsx, Tailwind Merge

### Backend
- **Framework**: NestJS 11.0.1
- **Language**: TypeScript 5.7.3
- **Database**: PostgreSQL with TypeORM 0.3.25
- **Authentication**: JWT 11.0.0 with Passport 0.7.0 + Google OAuth 2.0
- **Password Hashing**: bcryptjs 3.0.2
- **File Upload**: Multer with @nestjs/platform-express
- **Validation**: Class Validator 0.14.2 & Class Transformer 0.5.1
- **Configuration**: NestJS Config 4.0.2
- **OAuth**: passport-google-oauth20 for Google SSO

## Project Structure

```
finder_frontend/
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── (client)/                  # Client-facing application
│   │   │   ├── (protected)/           # Protected user routes
│   │   │   │   ├── dashboard/         # User dashboard
│   │   │   │   ├── profile/           # User profile management
│   │   │   │   └── settings/          # User settings
│   │   │   ├── auth/                  # Client authentication
│   │   │   │   ├── login/             # User login page
│   │   │   │   └── signup/            # User registration page
│   │   │   ├── profile/               # Public profile views
│   │   │   │   └── biodatas/          # Biodata search & display
│   │   │   ├── layout.tsx             # Client layout wrapper
│   │   │   └── page.tsx               # Client homepage
│   │   ├── admin/                     # Admin dashboard
│   │   │   ├── (pages)/               # Admin pages
│   │   │   │   ├── biodatas/          # Biodata management
│   │   │   │   ├── users/             # User management
│   │   │   │   ├── table/             # Data tables
│   │   │   │   └── blank/             # Blank page template
│   │   │   ├── videos/                # Video management
│   │   │   ├── layout.tsx             # Admin layout
│   │   │   └── page.tsx               # Admin dashboard
│   │   ├── auth/                      # Authentication routes
│   │   │   └── admin/                 # Admin authentication
│   │   │       └── login/             # Admin login page
│   │   └── profile/                   # Profile API routes
│   │       └── [id]/                  # Dynamic profile routes
│   ├── components/                    # Reusable components
│   │   ├── auth/                      # Authentication components
│   │   │   ├── AuthRedirect.tsx       # Auth redirect logic
│   │   │   ├── LoginFormRegular.tsx   # User login form
│   │   │   ├── SignUpFormRegular.tsx  # User signup form
│   │   │   └── ProtectedRoute.tsx     # Route protection
│   │   ├── biodata/                   # Biodata components
│   │   │   └── BiodataSearch.tsx      # Search & filter component
│   │   ├── common/                    # Common utilities
│   │   │   ├── GridShape.tsx          # Grid background
│   │   │   ├── PageBreadCrumb.tsx     # Breadcrumb navigation
│   │   │   ├── QueryProvider.tsx      # React Query provider
│   │   │   └── ThemeToggleButton.tsx  # Theme switcher
│   │   ├── dashboard/                 # Dashboard components
│   │   │   ├── EcommerceMetrics.tsx   # Metrics display
│   │   │   ├── MonthlySalesChart.tsx  # Sales charts
│   │   │   └── MonthlyTarget.tsx      # Target tracking
│   │   ├── form/                      # Form components
│   │   │   ├── Label.tsx              # Form labels
│   │   │   └── LocationSelector.tsx   # Location picker
│   │   ├── layout/                    # Layout components
│   │   │   ├── AppHeader.tsx          # Main header
│   │   │   ├── AppSidebar.tsx         # Sidebar navigation
│   │   │   ├── Footer.tsx             # Site footer
│   │   │   ├── UserDropdown.tsx       # User menu
│   │   │   └── NotificationDropdown.tsx # Notifications
│   │   ├── profile/                   # Profile components
│   │   │   └── marriage/              # Marriage-related forms
│   │   └── ui/                        # Base UI components
│   │       ├── dropdown/              # Dropdown components
│   │       └── LocationSelector.tsx   # Unified location selector
│   ├── context/                       # React contexts
│   │   └── RegularAuthContext.tsx     # User authentication context
│   ├── hooks/                         # Custom hooks
│   ├── lib/                           # Utility functions
│   ├── api/                           # API client functions
│   └── icons/                         # SVG icons
├── backend/                           # NestJS backend
│   └── src/
│       ├── auth/                      # Authentication module
│       │   ├── decorators/            # Custom decorators
│       │   ├── dto/                   # Data transfer objects
│       │   ├── guards/                # Auth guards
│       │   ├── interfaces/            # Auth interfaces
│       │   ├── strategies/            # Passport strategies
│       │   ├── auth.controller.ts     # Auth endpoints
│       │   ├── auth.service.ts        # Auth business logic
│       │   └── auth.module.ts         # Auth module config
│       ├── biodata/                   # Biodata module
│       │   ├── dto/                   # Biodata DTOs
│       │   ├── entities/              # Database entities
│       │   ├── biodata.controller.ts  # Biodata endpoints
│       │   ├── biodata.service.ts     # Biodata business logic
│       │   ├── biodata.entity.ts      # Biodata entity
│       │   └── biodata.module.ts      # Biodata module config
│       ├── user/                      # User module
│       │   ├── user.controller.ts     # User endpoints
│       │   ├── user.service.ts        # User business logic
│       │   ├── user.entity.ts         # User entity
│       │   └── *.dto.ts               # User DTOs
│       ├── app.module.ts              # Main app module
│       └── main.ts                    # Application entry point
└── public/                            # Static assets
    ├── icons/                         # Icon assets
    └── images/                        # Image assets
```

## Key Features

### 1. Comprehensive Authentication System
- **Email Authentication**: Primary authentication using email addresses with proper validation
- **Google OAuth 2.0 SSO**: One-click signup/login with Google accounts (uses email addresses)
- **Dual Authentication**: Separate login systems for users and admins
- **Role-based Access Control**: User, Admin, and Superadmin roles
- **JWT Token Management**: Secure token-based authentication with automatic role detection
- **Smart Redirects**: Automatic redirection based on user roles (users → dashboard, admins → admin panel)
- **Protected Routes**: Route protection for both user and admin areas
- **Auto-created Test Accounts**: 
  - Superadmin: `razibmahmud50@gmail.com` / `superadmin`
  - Test Admin: `testadmin@example.com` / `aaaaa`
  - Test User: `testuser1` / `12345`

### 2. Advanced Admin Panel
- **User Management**: Complete CRUD operations for user accounts
  - View all users with dynamic data from database
  - Delete users with confirmation dialogs
  - Role-based filtering (User/Admin/Superadmin)
  - Search by name or email
  - Pagination and sorting capabilities
- **Biodata Management**: Full biodata administration
  - View all biodatas (Active/Inactive/Pending)
  - Status management with approval workflow
  - Real-time status updates
  - Individual biodata review and editing
- **Dashboard Analytics**: Comprehensive admin dashboard with metrics
- **Data Tables**: Professional data tables with sorting, filtering, and pagination

### 3. Biodata Management System
- **Multi-step Biodata Creation**: Comprehensive profile building process
- **Status Workflow**: Inactive → Pending → Active status management
- **Admin Approval System**: Admins can approve/reject biodata submissions
- **Profile Picture Management**: Image upload and display
- **Comprehensive Data Fields**: 50+ fields covering personal, family, education, and preferences
- **Privacy Controls**: Controlled access to sensitive information

### 4. Advanced Search & Discovery
- **BiodataSearch Component**: Self-contained search with real-time filtering
- **Multi-criteria Filtering**: Gender, marital status, location, age, profession, education
- **Location-based Search**: Hierarchical filtering (Country → Division → District → Upazilla → Area)
- **Real-time Results**: Instant filtering without page reloads
- **Pagination**: Efficient handling of large datasets
- **Responsive Grid**: Mobile-optimized biodata cards

### 5. Modern UI/UX Design
- **HeroUI Components**: Professional UI component library
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Theme**: Theme switching capability
- **Loading States**: Smooth loading indicators and skeleton screens
- **Error Handling**: User-friendly error messages and fallbacks
- **Accessibility**: WCAG-compliant components and interactions

## Component Architecture

### BiodataSearch Component
A self-contained component that handles:
- API calls to fetch biodata
- Search and filtering logic
- Pagination
- Results display
- Favorites management
- Loading and error states

**Key Props**: None (fully self-contained)
**Features**:
- Real-time search filtering
- Responsive grid layout
- Integrated pagination
- Favorite/unfavorite functionality

### Form Components
- **LocationSelector**: Unified hierarchical location selection (supports both geoLocation and addressData sources)
- **MultiSelect**: Multiple option selection
- **Custom Input Components**: Styled form inputs with validation

### Layout Components
- **AppHeader**: Main navigation header
- **AppSidebar**: Collapsible sidebar navigation
- **Footer**: Site footer with links and information

## API Integration

### Authentication Endpoints
- `POST /auth/login` - User/Admin authentication with role-based redirects
- `POST /auth/signup` - User registration with automatic login
- `POST /auth/logout` - Secure logout with token cleanup

### User Management Endpoints
- `GET /api/users` - Fetch all users (Admin only)
- `GET /api/users/:id` - Fetch specific user
- `PUT /api/users/:id` - Update user information
- `PUT /api/users/:id/password` - Update user password
- `DELETE /api/users/:id` - Delete user (Admin only, with superadmin protection)

### Biodata Management Endpoints
- `GET /api/biodatas` - Fetch all public biodatas
- `GET /api/biodatas/search` - Advanced biodata search with filters
- `GET /api/biodatas/admin/all` - Fetch all biodatas for admin (includes inactive)
- `GET /api/biodatas/current` - Get current user's biodata
- `GET /api/biodatas/:id` - Fetch specific biodata
- `POST /api/biodatas` - Create new biodata
- `PUT /api/biodatas/current` - Update current user's biodata
- `PUT /api/biodatas/:id/status` - Update biodata status (Admin only)
- `PUT /api/biodatas/:id/step/:step` - Update biodata step in multi-step form

### Data Models

#### User Interface
```typescript
interface User {
  id: number;
  email: string;
  fullName: string | null;
  role: 'user' | 'admin' | 'superadmin';
  createdAt: string;
  updatedAt: string;
}
```

#### Biodata Interface
```typescript
interface Biodata {
  id: number;
  step: number;
  userId: number | null;
  completedSteps: number | null;
  
  // Partner Preferences
  partnerAgeMin: number;
  partnerAgeMax: number;
  partnerComplexion: string;
  partnerHeight: string;
  partnerEducation: string;
  partnerProfession: string;
  partnerLocation: string;
  partnerDetails: string;
  
  // Basic Information
  sameAsPermanent: boolean;
  religion: string;
  biodataType: string; // 'Male' | 'Female'
  maritalStatus: string;
  dateOfBirth: string;
  age: number;
  height: string;
  weight: number;
  complexion: string;
  profession: string;
  bloodGroup: string;
  
  // Location Information
  permanentCountry: string;
  permanentDivision: string;
  permanentZilla: string;
  permanentUpazilla: string;
  permanentArea: string;
  presentCountry: string;
  presentDivision: string;
  presentZilla: string;
  presentUpazilla: string;
  presentArea: string;
  
  // Health & Education
  healthIssues: string;
  educationMedium: string;
  highestEducation: string;
  instituteName: string;
  subject: string;
  passingYear: number;
  result: string;
  economicCondition: string;
  
  // Family Information
  fatherName: string;
  fatherProfession: string;
  fatherAlive: string;
  motherName: string;
  motherProfession: string;
  motherAlive: string;
  brothersCount: number;
  sistersCount: number;
  familyDetails: string;
  
  // Contact Information
  fullName: string;
  profilePicture: string | null;
  email: string;
  guardianMobile: string;
  ownMobile: string;
  
  // Status Management
  status: 'Active' | 'Inactive' | 'Pending' | null;
}
```

#### Search Filters Interface
```typescript
interface BiodataFilters {
  gender?: string;
  maritalStatus?: string;
  location?: string;
  biodataNumber?: string;
  ageMin?: number;
  ageMax?: number;
  page?: number;
  limit?: number;
}
```

## Development Guidelines

### Code Style
- **TypeScript**: Strict typing throughout the application
- **Component Structure**: Functional components with hooks
- **File Naming**: PascalCase for components, camelCase for utilities
- **Import Organization**: Absolute imports using `@/` alias

### State Management
- **React Query**: For server state management
- **React Context**: For global client state (auth, theme, sidebar)
- **Local State**: useState for component-specific state

### Styling Approach
- **Tailwind CSS**: Utility-first CSS framework
- **Component Variants**: Using class-variance-authority for component variants
- **Responsive Design**: Mobile-first approach with responsive utilities

## Environment Setup

### Prerequisites
- Node.js 18.x or later (recommended: Node.js 20.x+)
- PostgreSQL database
- npm or yarn package manager

### Installation
```bash
# Clone repository
git clone git@github.com:razibhossain50/Finder.git

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Start development servers
npm run dev        # Frontend
cd backend && npm run dev  # Backend
```

### Environment Variables
- `NEXT_PUBLIC_API_BASE_URL`: Backend API URL
- Database connection strings for backend
- JWT secrets for authentication

## Role-Based Access Control System

### User Roles & Permissions

| Feature | User | Admin | Superadmin |
|---------|------|-------|------------|
| **Authentication** |
| Login to user dashboard | ✅ | ❌ | ❌ |
| Login to admin dashboard | ❌ | ✅ | ✅ |
| **Biodata Management** |
| Create own biodata | ✅ | ✅ | ✅ |
| View own biodata | ✅ | ✅ | ✅ |
| Edit own biodata | ✅ | ✅ | ✅ |
| Delete own biodata | ✅ | ✅ | ✅ |
| View all biodatas (admin) | ❌ | ✅ | ✅ |
| Approve/reject biodatas | ❌ | ✅ | ✅ |
| Delete any biodata | ❌ | ❌ | ✅ |
| **User Management** |
| View all users | ❌ | ✅ | ✅ |
| Edit user information | ❌ | ✅ | ✅ |
| Delete users | ❌ | ❌ | ✅ |
| Create admin accounts | ❌ | ❌ | ✅ |

### Test Accounts

The system automatically creates these test accounts on startup:

#### Regular User
- **Email**: `user@example.com`
- **Password**: `12345`
- **Role**: `user`
- **Access**: User dashboard only

#### Admin User
- **Email**: `admin@example.com`
- **Password**: `aaaaa`
- **Role**: `admin`
- **Access**: Admin dashboard with limited permissions

#### Superadmin User
- **Email**: `razibmahmud50@gmail.com`
- **Password**: `superadmin`
- **Role**: `superadmin`
- **Access**: Full admin dashboard access

## Profile Picture Upload System

### Implementation Overview
The profile picture upload functionality allows users to upload JPEG/PNG images during biodata creation. Images are stored in the `public/uploads/profile-pictures/` directory and URLs are saved in the database.

### Backend Implementation

#### Upload Service (`backend/src/upload/upload.service.ts`)
- **File Storage**: Uses multer with disk storage
- **Directory**: `public/uploads/profile-pictures/`
- **File Naming**: `profile-{timestamp}-{random}.{ext}`
- **Validation**: Only JPEG/PNG files, max 5MB
- **URL Generation**: Returns `/uploads/profile-pictures/{filename}`

#### Upload Controller (`backend/src/upload/upload.controller.ts`)
- **Endpoint**: `POST /api/upload/profile-picture`
- **Authentication**: Requires JWT token
- **File Field**: `profilePicture`
- **Response**: Returns filename, original name, URL, and size

#### Static File Serving
- **Configuration**: Added to `main.ts` using `useStaticAssets`
- **Path**: Serves files from `public/` directory
- **Access**: Files accessible via `http://localhost:2000/uploads/profile-pictures/{filename}`

### Frontend Implementation

#### Contact Info Step Component (`src/components/profile/marriage/contact-info-step.tsx`)
- **File Upload**: Drag & drop or click to upload
- **Validation**: Client-side validation for file type and size
- **Loading States**: Shows upload progress with spinner
- **Success Feedback**: Displays uploaded file name with success message
- **Error Handling**: Shows user-friendly error messages

#### Profile Picture Display
Updated all components to use correct URLs:
- **BiodataSearch**: `${process.env.NEXT_PUBLIC_API_BASE_URL}${biodata.profilePicture}`
- **Profile Detail Page**: Same URL pattern
- **Favorites Page**: Same URL pattern
- **Admin Biodata Page**: Same URL pattern

### Upload API Endpoint

```http
POST /api/upload/profile-picture
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data

Body:
- profilePicture: File (JPEG/PNG, max 5MB)
```

**Response:**
```json
{
  "message": "File uploaded successfully",
  "filename": "profile-1704123456789-123456789.jpg",
  "originalName": "my-photo.jpg",
  "url": "/uploads/profile-pictures/profile-1704123456789-123456789.jpg",
  "size": 1234567
}
```

### Security Features
- **File Type Validation**: Only JPEG and PNG images allowed
- **File Size Limit**: Maximum 5MB
- **Unique Filenames**: Prevents conflicts with timestamp and random suffix
- **Authentication Required**: JWT token required for uploads
- **Isolated Storage**: Files stored in dedicated uploads folder

## Route Protection System

### Route Structure
```
src/app/(client)/
├── auth/                    # 🔓 Public auth routes
│   ├── login/
│   └── signup/
├── search/                  # 🔓 Public search routes
│   ├── partner/
│   └── doctor/
├── (protected)/            # 🔒 Protected route group
│   ├── layout.tsx          # ProtectedRoute wrapper
│   ├── dashboard/
│   ├── profile/
│   ├── messages/
│   └── settings/
├── layout.tsx              # RegularAuthProvider wrapper
└── page.tsx                # 🔓 Public home page
```

### Protection Implementation

#### Route Group Protection
```typescript
// src/app/(client)/(protected)/layout.tsx
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function ProtectedLayout({ children }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}
```

#### ProtectedRoute Component
```typescript
// src/components/auth/ProtectedRoute.tsx
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useRegularAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return null;
  
  return <>{children}</>;
}
```

### Authentication Context Features
- **Separate Storage**: Uses `regular_user_access_token` and `regular_user`
- **Role Validation**: Only allows users with `role: 'user'`
- **Auto Redirect**: Redirects to `/dashboard` on successful auth
- **Token Management**: Handles JWT token storage and cleanup

## Google OAuth 2.0 Single Sign-On Implementation

### Overview
The Finder platform includes a complete Google OAuth 2.0 implementation that allows users to sign up and log in using their Google accounts. This provides a seamless authentication experience and reduces friction in the user registration process.

### Backend Implementation

#### Google OAuth Strategy (`backend/src/auth/strategies/google.strategy.ts`)
- **Passport Google OAuth 2.0 strategy** for handling Google authentication
- **Profile validation** and user information extraction (email, name, profile picture)
- **Automatic user creation/update** from Google profiles

#### Enhanced Auth Service (`backend/src/auth/auth.service.ts`)
- `validateGoogleUser()` - Creates or updates users from Google profiles
- `googleLogin()` - Generates JWT tokens for Google users
- **Seamless integration** with existing authentication system

#### API Endpoints (`backend/src/auth/auth.controller.ts`)
- `GET /auth/google` - Initiates Google OAuth flow
- `GET /auth/google/callback` - Handles Google OAuth callback with redirect to frontend

#### Database Schema Updates (`backend/src/user/user.entity.ts`)
- Added `googleId` field for Google user identification
- Added `profilePicture` field for Google profile images
- Made `password` nullable for Google users (no password required)

### Frontend Implementation

#### Google OAuth Button (`src/components/auth/GoogleOAuthButton.tsx`)
- **Reusable component** for both login and signup forms
- **Google-branded styling** with official colors and logo
- **Loading states** and error handling
- **One-click authentication** flow

#### OAuth Callback Handler (`src/app/(client)/auth/google/callback/page.tsx`)
- **Processes Google OAuth callback** with token and user data
- **Handles token storage** in localStorage
- **User feedback** with loading/success/error states
- **Proper Suspense boundary** for Next.js 15 compatibility
- **Infinite loop prevention** with processed flag

#### Enhanced Auth Context (`src/context/RegularAuthContext.tsx`)
- Added `setUserFromGoogle()` function for Google user authentication
- **Seamless integration** with existing authentication flow
- **Same JWT token system** and user permissions

### Google Cloud Console Setup

#### Prerequisites
- Google account with access to Google Cloud Console
- Finder project running locally (frontend on :3000, backend on :2000)

#### Step-by-Step Configuration

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project: "Finder Matrimony"

2. **Enable Required APIs**
   - Enable "Google+ API" in APIs & Services → Library
   - Enable "People API" for profile information

3. **Configure OAuth Consent Screen**
   - Go to APIs & Services → OAuth consent screen
   - Choose "External" for testing
   - App name: "Finder - Matrimony Platform"
   - Add scopes: `../auth/userinfo.email`, `../auth/userinfo.profile`
   - Add test users for development

4. **Create OAuth Credentials**
   - Go to APIs & Services → Credentials
   - Create OAuth client ID → Web application
   - Name: "Finder Web Client"
   - Authorized JavaScript origins:
     ```
     http://localhost:3000
     http://localhost:2000
     ```
   - Authorized redirect URIs:
     ```
     http://localhost:2000/auth/google/callback
     ```

### Environment Configuration

#### Backend Environment Variables (`backend/.env`)
```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_actual_google_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:2000/auth/google/callback
```

**Note**: Replace with actual credentials from Google Cloud Console

### Database Migration

#### Migration Script (`backend/migrations/005_add_google_auth_fields.sql`)
```sql
-- Add Google authentication fields to User table
ALTER TABLE "user" 
ADD COLUMN IF NOT EXISTS "googleId" VARCHAR(255),
ADD COLUMN IF NOT EXISTS "profilePicture" VARCHAR(500);

-- Make password nullable for Google users
ALTER TABLE "user" 
ALTER COLUMN "password" DROP NOT NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_google_id ON "user"("googleId");
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_google_id_unique 
ON "user"("googleId") 
WHERE "googleId" IS NOT NULL;
```

### OAuth Flow Process

1. **User clicks "Continue with Google"** on login/signup page
2. **Redirect to Google OAuth** (`/auth/google` endpoint)
3. **User grants permissions** on Google consent screen
4. **Google redirects back** to `/auth/google/callback`
5. **Backend processes user data** (create/update user in database)
6. **Generate JWT token** (same system as regular login)
7. **Redirect to frontend callback** with token and user data
8. **Frontend processes token** and stores in localStorage
9. **User authenticated** and redirected to dashboard

### Key Features

#### Seamless Integration
- **Works alongside existing email/password authentication**
- **Same JWT token system** and user roles
- **Same dashboard and features** for all users
- **No separate user management** required

#### User Experience
- **One-click authentication** - no forms to fill
- **No password required** for Google users
- **Profile picture imported** automatically from Google
- **Automatic account creation** for new users

#### Security Features
- **Secure OAuth 2.0 flow** with proper token validation
- **JWT token authentication** consistent with existing system
- **Google profile validation** and user verification
- **Proper error handling** and user feedback

#### Database Design
- **Supports both Google and regular users** in same table
- **Nullable password field** for Google users
- **Unique Google ID constraints** prevent duplicate accounts
- **Profile picture storage** with URL validation

### Error Handling & Troubleshooting

#### Common Issues and Solutions

1. **"OAuth client was not found"**
   - Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
   - Ensure no extra spaces in `.env` file
   - Restart backend server after updating credentials

2. **"redirect_uri_mismatch"**
   - Check redirect URI exactly matches: `http://localhost:2000/auth/google/callback`
   - Verify no trailing slashes or typos in Google Console

3. **JSON parsing errors for new Google users**
   - Fixed in `useBiodataStatus.ts` and `Header.tsx` components
   - Proper handling of empty responses when users don't have biodata yet

4. **Infinite loop in callback page**
   - Fixed with `processed` flag to prevent multiple executions
   - Proper dependency management in useEffect

### Testing Google OAuth

#### Test Flow
1. **Start applications**: Backend on :2000, Frontend on :3000
2. **Go to login page**: `http://localhost:3000/auth/login`
3. **Click "Continue with Google"** button
4. **Complete Google OAuth flow** on consent screen
5. **Verify redirect to dashboard** with successful authentication

#### Expected Behavior for New Google Users
- **User account created automatically** with Google profile information
- **Dashboard access** without needing to create biodata first
- **No JSON parsing errors** - all components handle new users gracefully
- **Profile picture imported** from Google account
- **Same permissions and features** as regular users

### Production Considerations

#### Security
- **Use HTTPS** in production environment
- **Secure environment variables** with proper secret management
- **Update OAuth URLs** to production domains in Google Console

#### Monitoring
- **Track OAuth success/failure rates** for user experience insights
- **Monitor authentication errors** and user feedback
- **Log OAuth flow events** for debugging and analytics

## Recent Updates & Implementations

### Authentication System Overhaul
- **Fixed Circular Dependencies**: Resolved RegularAuthContext initialization issues
- **Smart Role-based Routing**: Automatic redirection based on user roles
- **Dual Token System**: Separate token management for users and admins (`regular_user_access_token` vs `admin_user_access_token`)
- **Auto-created Test Accounts**: Superadmin and test user accounts for development

### Admin Panel Implementation
- **Dynamic Users Table**: Real-time user management with database integration
- **User Deletion System**: Confirmation dialogs with superadmin protection
- **Biodata Status Management**: Complete approval workflow for biodata submissions
- **Professional Data Tables**: Sorting, filtering, pagination, and search capabilities
- **Role-based UI**: Delete options only visible to superadmin users

### BiodataSearch Component Refactor
- **Complete Self-containment**: Moved all search logic, API calls, and pagination into the component
- **Removed Dependencies**: Component no longer requires props or external state management
- **Enhanced UX**: Real-time filtering without manual search button clicks
- **Improved Loading States**: Skeleton cards with proper background handling
- **Simplified Integration**: Can be dropped into any page with `<BiodataSearch />`

### Backend API Enhancements
- **User Management Endpoints**: Complete CRUD operations for user accounts
- **Biodata Admin Endpoints**: Admin-specific biodata management APIs
- **Status Update System**: Real-time biodata status management
- **File Upload System**: Complete profile picture upload with multer
- **Security Improvements**: Role-based access control and input validation

### Frontend Improvements
- **Profile Picture Upload**: Functional upload with drag & drop interface
- **Loading States**: Improved skeleton screens and loading indicators
- **Error Handling**: Better user feedback and error messages
- **Responsive Design**: Mobile-optimized biodata cards and forms
- **Image Configuration**: Next.js image optimization for uploaded files

## Future Enhancements

### Planned Features
- **Advanced Matching Algorithm**: AI-powered compatibility matching
- **Chat System**: In-app messaging between matched users
- **Video Profiles**: Video introduction support
- **Mobile App**: React Native mobile application
- **Payment Integration**: Premium membership features

### Technical Improvements
- **Performance Optimization**: Image optimization, lazy loading
- **SEO Enhancement**: Better meta tags and structured data
- **Testing**: Comprehensive unit and integration tests
- **Monitoring**: Error tracking and performance monitoring

## Support & Documentation

### Key Files
- `README.md`: Installation and setup instructions
- `README_AUTH_IMPLEMENTATION.md`: Authentication implementation details
- `ROUTE_PROTECTION_GUIDE.md`: Route protection guidelines
- `context.md`: This comprehensive project context

### Development Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

This context provides a comprehensive overview of the Finder matrimony platform, its architecture, components, and development guidelines for efficient collaboration and maintenance.

---

# Biodata Status Management System

## Overview
The biodata status management system implements a comprehensive two-column approach that separates admin approval from user visibility control, ensuring proper authority hierarchy while giving users appropriate control over their profiles.

## Final Implementation: Two-Column Status System

### Database Schema
```sql
-- Admin controls approval (primary authority)
biodataApprovalStatus: ENUM('pending', 'approved', 'rejected', 'inactive') DEFAULT 'pending'

-- User controls visibility (only works if approved)
biodataVisibilityStatus: ENUM('active', 'inactive') DEFAULT 'active'
```

### Core Logic
- **Public Visibility**: Only show biodatas where `biodataApprovalStatus = 'approved' AND biodataVisibilityStatus = 'active'`
- **User Toggle**: Users can only toggle `biodataVisibilityStatus` if `biodataApprovalStatus = 'approved'`
- **Admin Authority**: Admin approval status always takes precedence over user preferences

## Backend Implementation

### Entity Structure (`backend/src/biodata/biodata.entity.ts`)
```typescript
@Entity('biodata')
export class Biodata {
  // Admin's approval decision - only admin can change this
  @Column({
    type: 'enum',
    enum: BiodataApprovalStatus,
    default: BiodataApprovalStatus.PENDING
  })
  biodataApprovalStatus: BiodataApprovalStatus;

  // User's visibility preference - user can toggle this if approved
  @Column({
    type: 'enum',
    enum: BiodataVisibilityStatus,
    default: BiodataVisibilityStatus.ACTIVE
  })
  biodataVisibilityStatus: BiodataVisibilityStatus;

  // Check if biodata should be visible to public
  isVisibleToPublic(): boolean {
    return this.biodataApprovalStatus === BiodataApprovalStatus.APPROVED && 
           this.biodataVisibilityStatus === BiodataVisibilityStatus.ACTIVE;
  }

  // Check if user can toggle their visibility
  canUserToggle(): boolean {
    return this.biodataApprovalStatus === BiodataApprovalStatus.APPROVED;
  }

  // Get effective status for display
  getEffectiveStatus(): string {
    if (this.biodataApprovalStatus !== BiodataApprovalStatus.APPROVED) {
      return this.biodataApprovalStatus; // pending, rejected, inactive
    }
    return this.biodataVisibilityStatus; // active, inactive
  }
}
```

### Status Enums (`backend/src/biodata/enums/`)

#### Admin Approval Status
```typescript
export enum BiodataApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved', 
  REJECTED = 'rejected',
  INACTIVE = 'inactive'
}

export const BIODATA_APPROVAL_STATUS_DESCRIPTIONS = {
  [BiodataApprovalStatus.PENDING]: 'Waiting for admin review',
  [BiodataApprovalStatus.APPROVED]: 'Approved by admin - ready to go live',
  [BiodataApprovalStatus.REJECTED]: 'Rejected by admin - needs corrections',
  [BiodataApprovalStatus.INACTIVE]: 'Deactivated by admin'
};
```

#### User Visibility Status
```typescript
export enum BiodataVisibilityStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export const BIODATA_VISIBILITY_STATUS_DESCRIPTIONS = {
  [BiodataVisibilityStatus.ACTIVE]: 'Visible to other users',
  [BiodataVisibilityStatus.INACTIVE]: 'Hidden from other users'
};
```

### Service Layer (`backend/src/biodata/biodata.service.ts`)

#### Public Queries (Only Approved + Active)
```typescript
async findAll() {
  const allBiodatas = await this.biodataRepository.find({
    relations: ['user']
  });
  
  // Only show biodatas that are approved and active (visible to public)
  return allBiodatas.filter(biodata => biodata.isVisibleToPublic());
}
```

#### Admin Queries (All Biodatas)
```typescript
async findAllForAdmin() {
  // Show all completed biodatas regardless of status
  const allBiodatas = await this.biodataRepository.find({
    relations: ['user'],
    order: { id: 'DESC' }
  });

  // Filter to only show completed biodatas (all 5 steps completed)
  return allBiodatas.filter(biodata => {
    const completedSteps = biodata.completedSteps || [];
    const hasAllSteps = completedSteps.length >= 5 && 
                       completedSteps.includes(1) && completedSteps.includes(2) && 
                       completedSteps.includes(3) && completedSteps.includes(4) && 
                       completedSteps.includes(5);
    
    const hasEssentialFields = biodata.fullName && biodata.email && 
                              biodata.biodataType && biodata.religion;
    
    return hasAllSteps || hasEssentialFields;
  });
}
```

#### User Toggle Functionality
```typescript
async toggleUserVisibility(userId: number): Promise<{ success: boolean; message: string; newStatus?: string }> {
  const biodata = await this.findByUserId(userId);
  
  if (!biodata) {
    return { success: false, message: 'Biodata not found' };
  }

  if (!biodata.canUserToggle()) {
    return { 
      success: false, 
      message: 'You cannot toggle your biodata visibility. Your biodata must be approved by admin first.' 
    };
  }

  // Toggle user visibility
  const newVisibilityStatus = biodata.biodataVisibilityStatus === BiodataVisibilityStatus.ACTIVE 
    ? BiodataVisibilityStatus.INACTIVE 
    : BiodataVisibilityStatus.ACTIVE;
  
  await this.biodataRepository.update(biodata.id, { biodataVisibilityStatus: newVisibilityStatus });

  return {
    success: true,
    message: newVisibilityStatus === BiodataVisibilityStatus.ACTIVE 
      ? 'Biodata is now visible to others' 
      : 'Biodata is now hidden from others',
    newStatus: biodata.getEffectiveStatus()
  };
}
```

### API Endpoints (`backend/src/biodata/biodata.controller.ts`)

#### Admin Approval Management
```typescript
@Put(':id/approval-status')
@UseGuards(JwtAuthGuard)
async updateApprovalStatus(@Param('id') id: string, @Body() statusData: { status: BiodataApprovalStatus }, @CurrentUser() user: any) {
  // Only admin and superadmin can update approval status
  if (user.role !== 'admin' && user.role !== 'superadmin') {
    throw new Error('Access denied: Only admin and superadmin can update biodata approval status');
  }

  const biodataId = +id;
  return this.biodataService.updateApprovalStatus(biodataId, statusData.status);
}
```

#### User Visibility Toggle
```typescript
@Put('current/toggle-visibility')
@UseGuards(JwtAuthGuard)
async toggleUserVisibility(@CurrentUser() user: any) {
  if (!user?.id) {
    throw new Error('User authentication required');
  }

  return this.biodataService.toggleUserVisibility(user.id);
}
```

## Frontend Implementation

### Type Definitions (`src/types/biodata.ts`)
```typescript
export enum BiodataApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  INACTIVE = 'inactive'
}

export enum BiodataVisibilityStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export const BIODATA_STATUS_COLORS = {
  [BiodataApprovalStatus.PENDING]: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    dot: 'bg-amber-500'
  },
  [BiodataApprovalStatus.APPROVED]: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    dot: 'bg-green-500'
  },
  [BiodataApprovalStatus.REJECTED]: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    dot: 'bg-red-500'
  },
  [BiodataApprovalStatus.INACTIVE]: {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-800',
    dot: 'bg-gray-500'
  }
};

export interface BiodataProfile {
  // ... existing fields ...
  biodataApprovalStatus: BiodataApprovalStatus;
  biodataVisibilityStatus: BiodataVisibilityStatus;
}
```

### Dashboard Toggle Component (`src/components/dashboard/BiodataStatusToggle.tsx`)
```typescript
export const BiodataStatusToggle: React.FC<BiodataStatusToggleProps> = ({
  biodataId,
  biodataApprovalStatus = BiodataApprovalStatus.PENDING,
  biodataVisibilityStatus = BiodataVisibilityStatus.ACTIVE,
  canUserToggle = false,
  onStatusChange
}) => {
  const handleToggle = async () => {
    if (!canUserToggle || isToggling) return;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/biodatas/current/toggle-visibility`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    const result = await response.json();
    
    if (result.success) {
      const newVisibilityStatus = localVisibilityStatus === BiodataVisibilityStatus.ACTIVE 
        ? BiodataVisibilityStatus.INACTIVE 
        : BiodataVisibilityStatus.ACTIVE;
      setLocalVisibilityStatus(newVisibilityStatus);
      
      if (onStatusChange && result.newStatus) {
        onStatusChange(result.newStatus);
      }
    }
  };

  // Component renders toggle switch with proper state management
  return (
    <Card className="w-full">
      <CardBody className="p-6">
        {/* Status display and toggle interface */}
        <Switch
          isSelected={localVisibilityStatus === BiodataVisibilityStatus.ACTIVE}
          onValueChange={handleToggle}
          isDisabled={!canUserToggle || isToggling}
          color="success"
          size="sm"
        />
      </CardBody>
    </Card>
  );
};
```

### Admin Interface Updates (`src/app/admin/(pages)/biodatas/page.tsx`)

#### Streamlined Columns
```typescript
const columns = [
  { name: "ID", uid: "id", sortable: false },
  { name: "USER ID", uid: "userId", sortable: false },
  { name: "APPROVAL STATUS", uid: "biodataApprovalStatus", sortable: true },
  { name: "BIODATA TYPE", uid: "biodataType", sortable: false },
  { name: "MARITAL STATUS", uid: "maritalStatus", sortable: true },
  { name: "FULL NAME", uid: "fullName", sortable: false },
  { name: "PROFILE PICTURE", uid: "profilePicture", sortable: false },
  { name: "OWN MOBILE", uid: "ownMobile", sortable: false },
  { name: "GUARDIAN MOBILE", uid: "guardianMobile", sortable: false },
  { name: "EMAIL", uid: "email", sortable: false },
  { name: "RELIGION", uid: "religion", sortable: false },
  { name: "ACTIONS", uid: "actions", sortable: false },
];
```

#### Color-Coded Status Badges
```typescript
const statusColorMap: Record<string, ChipProps["color"]> = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
  inactive: "default",
};

const biodataTypeColorMap: Record<string, ChipProps["color"]> = {
  "Male": "primary",
  "Female": "danger",
  "Groom": "primary", 
  "Bride": "danger",
  "Boy": "primary",
  "Girl": "danger",
  "Man": "primary",
  "Woman": "danger",
};
```

#### Profile Picture with Placeholder
```typescript
case "profilePicture":
  return (
    <div className="flex items-center justify-center">
      {biodata.profilePicture ? (
        <img
          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${biodata.profilePicture}`}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
      ) : null}
      <div className={`w-10 h-10 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center ${biodata.profilePicture ? 'hidden' : ''}`}>
        <User className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
```

## User Experience Flow

### 1. Biodata Creation & Submission
```
User completes biodata form (5 steps)
↓
biodataApprovalStatus: 'pending'
biodataVisibilityStatus: 'active' (default)
↓
User sees: Status badge "pending" on their profile
Public sees: Nothing (not visible until approved)
Admin sees: Biodata in admin panel for review
```

### 2. Admin Review Process
```
Admin reviews biodata in admin panel
↓
Admin can set status to: 'approved', 'rejected', or 'inactive'
↓
If approved: biodataApprovalStatus: 'approved'
↓
User sees: Status badge "approved" + toggle switch enabled
Public sees: Biodata becomes visible (if user visibility = active)
```

### 3. User Visibility Control (Post-Approval)
```
User has approved biodata
↓
User can toggle visibility in dashboard
↓
Toggle OFF: biodataVisibilityStatus: 'inactive'
  → Public sees: Nothing (hidden by user choice)
  → User sees: "Approved but Hidden" with toggle to show
↓
Toggle ON: biodataVisibilityStatus: 'active'  
  → Public sees: Biodata visible again
  → User sees: "Approved & Visible" with toggle to hide
```

### 4. Admin Override Scenarios
```
Admin sets biodataApprovalStatus: 'inactive' (policy violation)
↓
User sees: "Deactivated by Admin" (toggle disabled)
Public sees: Nothing (admin override)
User cannot: Toggle visibility (admin authority)

OR

Admin sets biodataApprovalStatus: 'rejected' (needs fixes)
↓
User sees: "Rejected" status with edit option
Public sees: Nothing (not approved)
User cannot: Toggle visibility (must fix and resubmit)
```

## Status Scenarios Matrix

| Approval Status | Visibility Status | Public Visible | User Can Toggle | Display Status | User Action |
|----------------|------------------|----------------|-----------------|----------------|-------------|
| pending        | active           | ❌ No          | ❌ No           | "pending"      | Wait for review |
| pending        | inactive         | ❌ No          | ❌ No           | "pending"      | Wait for review |
| approved       | active           | ✅ Yes         | ✅ Yes          | "active"       | Can hide profile |
| approved       | inactive         | ❌ No          | ✅ Yes          | "inactive"     | Can show profile |
| rejected       | active           | ❌ No          | ❌ No           | "rejected"     | Fix & resubmit |
| rejected       | inactive         | ❌ No          | ❌ No           | "rejected"     | Fix & resubmit |
| inactive       | active           | ❌ No          | ❌ No           | "inactive"     | Contact admin |
| inactive       | inactive         | ❌ No          | ❌ No           | "inactive"     | Contact admin |

## Database Migration

### Migration Script (`backend/migrations/004_add_biodata_approval_visibility_columns.sql`)
```sql
-- Create new enum types for the cleaner two-column approach
CREATE TYPE biodata_approval_status_enum AS ENUM ('pending', 'approved', 'rejected', 'inactive');
CREATE TYPE biodata_visibility_status_enum AS ENUM ('active', 'inactive');

-- Add new columns with proper defaults
ALTER TABLE biodata 
ADD COLUMN IF NOT EXISTS "biodataApprovalStatus" biodata_approval_status_enum DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS "biodataVisibilityStatus" biodata_visibility_status_enum DEFAULT 'active';

-- Migrate existing data from old status system to new two-column system
UPDATE biodata 
SET "biodataApprovalStatus" = CASE 
    WHEN status = 'Pending' THEN 'pending'::biodata_approval_status_enum
    WHEN status = 'Active' THEN 'approved'::biodata_approval_status_enum
    WHEN status = 'Rejected' THEN 'rejected'::biodata_approval_status_enum
    WHEN status = 'Inactive' THEN 'inactive'::biodata_approval_status_enum
    ELSE 'pending'::biodata_approval_status_enum
END;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_biodata_approval_status ON biodata("biodataApprovalStatus");
CREATE INDEX IF NOT EXISTS idx_biodata_visibility_status ON biodata("biodataVisibilityStatus");

-- Create composite index for public queries (approved + active)
CREATE INDEX IF NOT EXISTS idx_biodata_public_visibility 
ON biodata("biodataApprovalStatus", "biodataVisibilityStatus") 
WHERE "biodataApprovalStatus" = 'approved' AND "biodataVisibilityStatus" = 'active';
```

## Key Benefits

### ✅ **Clean Separation of Concerns**
- **Admin Approval**: Controls quality and policy compliance
- **User Visibility**: Controls personal preference for showing/hiding
- **No Conflicts**: Clear hierarchy prevents permission issues

### ✅ **Optimal User Experience**
- **Users always see their own biodata** (regardless of status)
- **Status-specific messaging** with clear next steps
- **Toggle only works when appropriate** (after approval)
- **No confusing "not found" messages** for owners

### ✅ **Efficient Admin Management**
- **Streamlined admin table** with only essential columns
- **Color-coded status badges** for quick identification
- **Profile picture thumbnails** with User icon placeholders
- **Only completed biodatas** appear in admin panel

### ✅ **Database Performance**
- **Composite indexes** for efficient public queries
- **Enum constraints** ensure data integrity
- **Optimized filtering** with `isVisibleToPublic()` method

### ✅ **Security & Authority**
- **Admin decisions cannot be overridden** by users
- **Role-based API endpoints** with proper authentication
- **Clear audit trail** of all status changes

## Testing Checklist

### Backend Tests
- [ ] Public API only returns approved + active biodatas
- [ ] User toggle only works if approved
- [ ] Admin can update approval status
- [ ] Completed biodatas filter works correctly
- [ ] Status validation prevents invalid transitions

### Frontend Tests
- [ ] Toggle switch shows correct state
- [ ] Toggle disabled when not approved
- [ ] Status colors display correctly
- [ ] Admin interface updates status properly
- [ ] Profile pictures show with proper fallbacks

### Integration Tests
- [ ] Complete user flow: submit → approve → toggle
- [ ] Admin override prevents user toggle
- [ ] Status changes reflect immediately in UI
- [ ] Users always see their own biodata
- [ ] Public queries only show approved + active

## Monitoring & Analytics

### Key Metrics
- **Approval Rate**: approved / total submissions
- **User Toggle Frequency**: how often users hide/show profiles
- **Time to Approval**: average admin review time
- **Admin Override Frequency**: how often admins force inactive

### Performance Monitoring
- **Query Performance**: monitor public biodata queries
- **Database Load**: track index usage and query efficiency
- **API Response Times**: monitor status update endpoints

This comprehensive biodata status management system provides a robust, scalable solution that maintains clear authority hierarchy while giving users appropriate control over their profiles, ensuring optimal user experience and efficient admin management.