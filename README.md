# Full-Stack Todo Application

A comprehensive task management application built with Next.js, Node.js, Express, and PostgreSQL.

## Project Overview

This project is a full-stack todo application with user authentication, task management capabilities, and a clean, responsive UI. It implements modern web development practices including JWT authentication, RESTful API design, and a component-based frontend architecture.

## Technology Stack

### Frontend
- **Next.js 13+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Shadcn UI** for UI components
- **Context API** for state management

### Backend
- **Node.js** runtime environment
- **Express.js** web framework
- **PostgreSQL** database
- **Prisma ORM** for database access
- **JWT** for authentication
- **bcrypt** for password hashing

## Project Structure

```
todo-app/
├── frontend/                  # Next.js application
│   ├── src/
│   │   ├── app/               # Next.js App Router
│   │   │   ├── api/           # Client-side API routes (optional)
│   │   │   ├── dashboard/     # Dashboard page
│   │   │   ├── login/         # Login page
│   │   │   ├── register/      # Registration page
│   │   │   ├── layout.tsx     # Root layout
│   │   │   └── page.tsx       # Home page
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ui/            # Shadcn UI components
│   │   │   ├── AddTodoForm.tsx
│   │   │   ├── CategorySelector.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── TodoItem.tsx
│   │   │   └── TodoList.tsx
│   │   ├── context/           # React Context providers
│   │   │   ├── AuthContext.tsx  
│   │   │   └── TodoContext.tsx
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility functions
│   │   │   ├── api.ts         # API client
│   │   │   └── utils.ts       # Helper functions
│   │   └── middleware.ts      # Next.js middleware for route protection
│   ├── public/                # Static assets
│   └── ...                    # Next.js configuration files
│
├── backend/                   # Node.js backend
│   ├── prisma/                # Prisma configuration
│   │   ├── schema.prisma      # Database schema
│   │   └── migrations/        # Database migrations
│   ├── src/
│   │   ├── controllers/       # Route handlers
│   │   │   ├── auth.js        # Authentication controllers
│   │   │   └── todos.js       # Todo controllers
│   │   ├── middleware/        # Express middleware
│   │   │   ├── auth.js        # Authentication middleware
│   │   │   ├── error.js       # Error handling middleware
│   │   │   └── validate.js    # Request validation middleware
│   │   ├── routes/            # API routes
│   │   │   ├── auth.js        # Authentication routes
│   │   │   └── todos.js       # Todo routes
│   │   ├── utils/             # Utility functions
│   │   │   └── jwt.js         # JWT utilities
│   │   ├── config/            # Configuration files
│   │   │   └── index.js       # Environment variables
│   │   └── app.js            # Express app setup
│   ├── server.js             # Server entry point
│   └── ...                    # Backend configuration files
│
├── package.json              # Root package.json for scripts
└── README.md                 # Project documentation
```

## Features

### User Authentication
- User registration with name, email, and password
- Secure login with JWT authentication
- Protected routes via Next.js middleware
- Automatic token refresh
- User profile management

### Todo Management
- Create, read, update, and delete todos
- Set priority levels (low, medium, high)
- Categorize todos (personal, work, health, education, social)
- Set due dates for tasks
- Mark todos as completed
- Filter by status (all, active, completed)
- Filter by category

### UI/UX
- Responsive design for all screen sizes
- Animated transitions using Framer Motion
- Toast notifications for user feedback
- Category color-coding for visual organization
- Clean, minimalist design
- Dark/light mode support

## Authentication Flow

The application uses JWT (JSON Web Tokens) for authentication with token storage in localStorage:

1. **Registration**: User registers, credentials are validated, password is hashed, and a JWT token is generated and returned.
2. **Login**: User logs in, credentials are verified, and a JWT token is generated and returned.
3. **Token Storage**: The JWT token is stored in localStorage.
4. **API Requests**: All authenticated API requests include the token in the Authorization header.
5. **Token Verification**: Backend middleware verifies the token for protected routes.
6. **Route Protection**: Next.js middleware protects client-side routes based on authentication status.
7. **Logout**: Token is removed from localStorage.

## Data Models

### User
```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  todos     Todo[]

  @@map("users")
}
```

### Todo
```prisma
model Todo {
  id        String    @id @default(uuid())
  text      String
  completed Boolean   @default(false)
  priority  String    @default("medium") // 'low', 'medium', 'high'
  category  String    @default("personal") // 'personal', 'work', 'health', 'education', 'social'
  dueDate   DateTime? @map("due_date")
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")
  userId    String    @map("user_id")
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("todos")
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/logout` - Logout a user
- `GET /api/auth/me` - Get current user profile

### Todos
- `GET /api/todos` - Get all todos for current user
- `GET /api/todos/:id` - Get a specific todo
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## State Management

The application uses React Context API for state management, with two main contexts:

### AuthContext
Manages authentication state including:
- Current user information
- Authentication status
- Login, register, and logout functions
- Loading states

### TodoContext
Manages todo state including:
- Todo items list
- Filter states
- CRUD operations
- Computed filtered lists

## Setting Up the Project

### Prerequisites
- Node.js (v14+)
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/todo-app.git
cd todo-app
```

2. Install root dependencies
```bash
npm install
```

3. Install frontend dependencies
```bash
cd frontend
npm install
```

4. Install backend dependencies
```bash
cd ../backend
npm install
```

5. Set up environment variables
   - Create a `.env` file in the backend directory with database connection string and JWT secret
   - Create a `.env.local` file in the frontend directory with API URL

6. Set up the database
```bash
cd backend
npx prisma migrate dev
```

7. Start the development servers
```bash
# From the root directory
npm run dev
```

## Deployment

### Backend
1. Set up a PostgreSQL database
2. Deploy the Node.js application to a hosting service (Heroku, Render, Digital Ocean)
3. Set environment variables for production

### Frontend
1. Build the Next.js application
```bash
cd frontend
npm run build
```
2. Deploy to Vercel, Netlify, or similar platform
3. Set environment variables for production

## Security Considerations

- Passwords are hashed using bcrypt
- Authentication uses HTTP-only cookies or localStorage based on configuration
- Input validation on both client and server
- CORS configuration to restrict API access
- Rate limiting for auth endpoints
- Secure headers using Helmet.js
- Environment variables for sensitive information

## Future Enhancements

- Email verification
- Password reset functionality
- OAuth authentication
- Todo sharing
- Recurring todos
- Sub-tasks
- Tags and advanced filtering
- Notifications
- Mobile app version with React Native

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Shadcn UI](https://ui.shadcn.com/)