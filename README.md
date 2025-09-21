# MovieHub - Movie Recommendation Board

A full-stack web application for movie recommendations with voting and commenting features. Built with Node.js/Express backend and React/Vite frontend.

## 🎬 Features

### Core Functionality
- **Movie Recommendations**: Users can add and browse movie recommendations
- **Voting System**: Upvote/downvote movies with real-time score updates
- **Comments**: Add, edit, and delete comments on movies
- **User Authentication**: JWT-based login and registration
- **Admin Panel**: Dashboard with analytics and management tools

### User Roles
- **Regular Users**: Can add movies, vote, and comment
- **Admins**: Full access including delete permissions and analytics dashboard

### Technical Features
- RESTful API with comprehensive error handling
- Real-time updates and optimistic UI
- Responsive design for all devices
- Input validation and security measures
- Rate limiting and CORS protection

## 🏗️ Project Structure

```
moviehub/
├── moviehub-backend/          # Node.js/Express API
│   ├── config/               # Database configuration
│   ├── database/             # SQL schema files
│   ├── middleware/           # Authentication & error handling
│   ├── routes/              # API endpoints
│   ├── server.js            # Main server file
│   ├── seed.js              # Database seeding script
│   └── package.json         # Backend dependencies
├── moviehub-frontend/        # React/Vite application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── contexts/        # React Context providers
│   │   ├── pages/           # Page components
│   │   ├── utils/           # API client and utilities
│   │   └── App.jsx          # Main app component
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd moviehub
```

### 2. Backend Setup
```bash
cd moviehub-backend

# Install dependencies
npm install

# Create PostgreSQL database
createdb moviehub

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database schema
psql -d moviehub -f database/schema.sql

# Seed with sample data (optional)
npm run seed

# Start development server
npm run dev
```

### 3. Frontend Setup
```bash
cd ../moviehub-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API URL

# Start development server
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🔧 Configuration

### Backend Environment Variables (.env)
```env
DATABASE_URL=postgresql://username:password@localhost:5432/moviehub
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
```

### Frontend Environment Variables (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📊 Database Schema

For detailed Entity Relationship Diagram, see [database-erd.md](database-erd.md)

### Tables
- **users**: User accounts with roles (user/admin)
- **movies**: Movie recommendations with metadata
- **votes**: User votes on movies (upvote/downvote)
- **comments**: User comments on movies

### Key Relationships
- Movies belong to users (added_by)
- Votes link users to movies (unique constraint)
- Comments link users to movies

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Movies
- `GET /api/movies` - Get all movies (sorted by score)
- `POST /api/movies` - Add new movie (authenticated)
- `DELETE /api/movies/:id` - Delete movie (admin only)
- `GET /api/movies/top` - Get top movies (admin only)

### Votes
- `POST /api/votes` - Vote on movie (authenticated)
- `GET /api/movies/:id/votes` - Get vote counts

### Comments
- `GET /api/comments/movie/:movieId` - Get movie comments
- `POST /api/comments` - Add comment (authenticated)
- `PUT /api/comments/:id` - Edit comment (owner only)
- `DELETE /api/comments/:id` - Delete comment (owner/admin)

## 🎨 UI Components

### Pages
- **Home**: Movie list with voting and comments
- **Login/Register**: Authentication forms
- **Admin Dashboard**: Analytics and management

### Key Components
- **MovieCard**: Individual movie display with voting
- **CommentSection**: Comments with CRUD operations
- **AddMovie**: Form for adding new movies
- **Header**: Navigation with user status

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- SQL injection prevention
- Rate limiting (100 requests/15min)
- CORS configuration
- XSS protection

## 🧪 Sample Data

The seed script creates:
- 3 users (1 admin, 2 regular users)
- 10 popular movies
- Random votes and comments

### Test Accounts
- **Admin**: admin@moviehub.com / admin123
- **User 1**: alice@example.com / password123
- **User 2**: bob@example.com / password123

## 🚀 Deployment

### Live Application
🌐 **Deployment Link**: [Coming Soon - Will be updated after deployment]

### Backend Deployment (Render)
1. Push code to GitHub repository
2. Go to [render.com](https://render.com) and sign up/login
3. Click "New" → "Blueprint" 
4. Connect your GitHub repo and select `moviehub-backend/render.yaml`
5. Render will automatically:
   - Create PostgreSQL database
   - Deploy Node.js service
   - Set up environment variables
6. After deployment, run database schema:
   - Go to your database dashboard
   - Connect via psql and run: `\i database/schema.sql`
   - Run seed script: `node seed.js` (optional)

### Frontend Deployment (Vercel)
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project" and import your GitHub repo
3. Select `moviehub-frontend` folder
4. Vercel will auto-detect Vite framework
5. Deploy automatically - no additional config needed!
6. Update `VITE_API_URL` in environment variables if needed

### Deployment Configuration Files
- **Backend**: `render.yaml` - Render Blueprint configuration
- **Frontend**: `vercel.json` - Vercel deployment settings

## 🛠️ Development

### Backend Scripts
```bash
npm start          # Production server
npm run dev        # Development with nodemon
npm run seed       # Populate database with sample data
```

### Frontend Scripts
```bash
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -am 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
- Verify PostgreSQL is running
- Check DATABASE_URL in .env file
- Ensure database exists

**CORS Errors**
- Check FRONTEND_URL in backend .env
- Verify API_URL in frontend .env

**Authentication Issues**
- Check JWT_SECRET is set
- Verify token storage in browser
- Clear localStorage if needed

### Getting Help

1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure both servers are running
4. Check database connection and schema

## 🤖 AI Usage

This project was developed with assistance from Cascade AI. Here's how AI was utilized:

### Where AI was used:
- **Architecture Planning**: Designed the full-stack structure and database schema
- **Code Generation**: Generated boilerplate code for React components, Express routes, and middleware
- **Database Design**: Created SQL schema with proper relationships and constraints
- **Security Implementation**: Implemented JWT authentication, input validation, and security middleware
- **Frontend Components**: Built React components with modern hooks and context patterns
- **API Development**: Created RESTful endpoints with proper error handling
- **Documentation**: Generated comprehensive README and ERD documentation

### Why it was helpful:
- **Speed**: Rapidly prototyped the entire application structure
- **Best Practices**: Ensured modern development patterns and security practices
- **Consistency**: Maintained consistent code style across frontend and backend
- **Error Prevention**: Implemented proper validation and error handling from the start
- **Documentation**: Created thorough documentation alongside development

### What was learned:
- **Full-Stack Integration**: How to properly connect React frontend with Express backend
- **JWT Authentication**: Implementing secure token-based authentication
- **PostgreSQL Relationships**: Designing efficient database schemas with proper constraints
- **React Context**: Managing global state with Context API
- **Security Best Practices**: Rate limiting, CORS, input validation, and SQL injection prevention
- **Modern React Patterns**: Using hooks, context, and functional components effectively

## 🎯 Future Enhancements

- [ ] Movie search and filtering
- [ ] User profiles and avatars
- [ ] Movie categories and tags
- [ ] Email notifications
- [ ] Social media integration
- [ ] Movie trailers and images
- [ ] Advanced analytics dashboard
- [ ] Mobile app version
