# GigFlow - Smart Leads Dashboard

GigFlow is a complete production-quality full-stack MERN application for managing and tracking leads with Role-Based Access Control (RBAC).

## Features

- **Authentication System:** JWT-based auth with bcrypt hashing.
- **Role-Based Access Control (RBAC):** Admin and Sales User roles.
- **Leads Management:** Complete CRUD operations.
- **Advanced Filtering & Search:** Filter by status, source, and search by name/email simultaneously.
- **Pagination:** Backend-driven pagination for performance.
- **Debounced Search:** Optimized frontend search to reduce API calls.
- **CSV Export:** Admins can export filtered leads data.
- **Modern Dashboard:** Built with React, Tailwind CSS, and Lucide Icons.

## Tech Stack

**Frontend:** React, TypeScript, Tailwind CSS, React Router, Axios, React Hook Form, Zod.
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt.

## Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or Atlas)
- Docker (optional, for containerized setup)

### Local Setup

1. **Clone the repository** (if applicable)
2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create .env based on .env.example
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   # Create .env based on .env.example
   npm run dev
   ```

### Docker Setup

You can run the entire application using Docker Compose:
```bash
docker-compose up --build
```
- Frontend will run on `http://localhost:5173`
- Backend will run on `http://localhost:5000`
- MongoDB will run on `localhost:27017`

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Leads
- `GET /api/leads` - Get all leads (with pagination, filtering, search)
- `POST /api/leads` - Create a new lead
- `GET /api/leads/:id` - Get a lead by ID
- `PUT /api/leads/:id` - Update a lead
- `DELETE /api/leads/:id` - Delete a lead
- `GET /api/leads/export` - Export leads to CSV (Admin only)

## Deployment

- **Frontend:** Suitable for Vercel/Netlify. Ensure to set `VITE_API_URL` to your production backend URL.
- **Backend:** Suitable for Render/Railway/Heroku. Ensure to set `MONGO_URI`, `JWT_SECRET`, and `NODE_ENV`.
- **Database:** MongoDB Atlas is recommended for production.

## Screenshots
*(Add screenshots of your modern SaaS dashboard here)*
