# MovieHub Frontend

A React/Vite frontend application for the MovieHub movie recommendation board.

## Features

- Modern React application with Vite
- Responsive design with Tailwind CSS
- JWT-based authentication
- Real-time voting system
- Comment system with CRUD operations
- Admin dashboard with analytics
- Protected routes and role-based access
- Toast notifications for user feedback
- Loading states and error handling

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MovieHub Backend API running

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm run preview
```

## Project Structure

```
moviehub-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   └── ProtectedRoute.jsx    # Route protection component
│   │   ├── Comments/
│   │   │   ├── CommentSection.jsx    # Comments container
│   │   │   ├── CommentForm.jsx       # Add/edit comment form
│   │   │   └── CommentItem.jsx       # Individual comment display
│   │   ├── Layout/
│   │   │   └── Header.jsx            # Navigation header
│   │   └── Movies/
│   │       ├── MovieList.jsx         # Movies container
│   │       ├── MovieCard.jsx         # Individual movie display
│   │       └── AddMovie.jsx          # Add movie form
│   ├── contexts/
│   │   └── AuthContext.jsx           # Authentication context
│   ├── pages/
│   │   ├── Home.jsx                  # Home page
│   │   ├── Login.jsx                 # Login page
│   │   ├── Register.jsx              # Registration page
│   │   └── AdminDashboard.jsx        # Admin dashboard
│   ├── utils/
│   │   └── api.js                    # API client and endpoints
│   ├── App.jsx                       # Main app component
│   ├── main.jsx                      # App entry point
│   └── index.css                     # Global styles
├── .env                              # Environment variables
├── index.html                        # HTML template
├── package.json                      # Dependencies and scripts
├── tailwind.config.js                # Tailwind configuration
├── postcss.config.js                 # PostCSS configuration
└── vite.config.js                    # Vite configuration
```

## Key Features

### Authentication
- User registration and login
- JWT token management
- Protected routes
- Role-based access control (User/Admin)
- Automatic token refresh handling

### Movies
- View all movies sorted by score
- Add new movie recommendations
- Real-time voting (upvote/downvote)
- Visual feedback for user votes
- Admin can delete movies

### Comments
- View comments for each movie
- Add new comments (authenticated users)
- Edit own comments
- Delete own comments (or admin can delete any)
- Real-time comment updates

### Admin Dashboard
- Platform statistics overview
- Top movies leaderboard
- Manage all movies
- Delete movies and comments
- User analytics

### UI/UX Features
- Responsive design for all screen sizes
- Loading states and spinners
- Toast notifications for user feedback
- Smooth animations and transitions
- Modern card-based layout
- Accessible form controls
- Error handling and validation

## API Integration

The frontend communicates with the backend API through:

- **Authentication**: Login, register, profile management
- **Movies**: CRUD operations, voting, statistics
- **Comments**: CRUD operations with permissions
- **Admin**: Dashboard data, user management

## Styling

Built with Tailwind CSS featuring:

- Custom color palette
- Responsive breakpoints
- Component classes for consistency
- Animations and transitions
- Dark mode ready (can be extended)

## State Management

- React Context API for authentication
- Local component state for UI interactions
- Optimistic updates for better UX
- Error boundaries for graceful error handling

## Security Features

- JWT token storage in localStorage
- Automatic token expiration handling
- Protected routes and components
- Input validation and sanitization
- XSS protection through React

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- ESLint configuration included
- Prettier recommended for formatting
- Component-based architecture
- Functional components with hooks
- Custom hooks for reusable logic

## Deployment

### Environment Variables for Production

```env
VITE_API_URL=https://your-api-domain.com/api
```

### Build and Deploy

1. Set production environment variables
2. Run `npm run build`
3. Deploy the `dist` folder to your hosting service

### Recommended Hosting Platforms

- **Netlify**: Automatic deployments from Git
- **Vercel**: Optimized for React applications
- **GitHub Pages**: Free hosting for static sites
- **AWS S3 + CloudFront**: Scalable hosting solution

### Deployment Steps for Netlify

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy automatically on Git push

## Testing

To add testing (recommended):

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC
