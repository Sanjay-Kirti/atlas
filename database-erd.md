# MovieHub Database ERD

## Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     USERS       │       │     MOVIES      │       │     VOTES       │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │
│ name            │       │ title           │       │ user_id (FK)    │
│ email (UNIQUE)  │       │ description     │       │ movie_id (FK)   │
│ password_hash   │       │ added_by (FK)   │       │ vote_type       │
│ role            │       │ created_at      │       │ created_at      │
│ created_at      │       └─────────────────┘       └─────────────────┘
└─────────────────┘                │                         │
         │                         │                         │
         │                         │                         │
         └─────────────────────────┼─────────────────────────┘
                                   │
                                   │
                         ┌─────────────────┐
                         │    COMMENTS     │
                         ├─────────────────┤
                         │ id (PK)         │
                         │ user_id (FK)    │
                         │ movie_id (FK)   │
                         │ body            │
                         │ created_at      │
                         └─────────────────┘
```

## Relationships

1. **USERS → MOVIES** (One-to-Many)
   - One user can add multiple movies
   - `movies.added_by` references `users.id`

2. **USERS → VOTES** (One-to-Many)
   - One user can vote on multiple movies
   - `votes.user_id` references `users.id`
   - **Constraint**: One vote per user per movie (UNIQUE on user_id, movie_id)

3. **MOVIES → VOTES** (One-to-Many)
   - One movie can receive multiple votes
   - `votes.movie_id` references `movies.id`

4. **USERS → COMMENTS** (One-to-Many)
   - One user can write multiple comments
   - `comments.user_id` references `users.id`

5. **MOVIES → COMMENTS** (One-to-Many)
   - One movie can have multiple comments
   - `comments.movie_id` references `movies.id`

## Table Details

### USERS
- **Primary Key**: `id` (SERIAL)
- **Unique Constraints**: `email`
- **Roles**: 'user' or 'admin'

### MOVIES
- **Primary Key**: `id` (SERIAL)
- **Foreign Key**: `added_by` → `users.id`
- **Indexes**: `added_by`, `created_at`

### VOTES
- **Primary Key**: `id` (SERIAL)
- **Foreign Keys**: `user_id` → `users.id`, `movie_id` → `movies.id`
- **Unique Constraint**: `(user_id, movie_id)` - prevents duplicate votes
- **Vote Types**: 'up' or 'down'
- **Cascade**: ON DELETE CASCADE for both foreign keys

### COMMENTS
- **Primary Key**: `id` (SERIAL)
- **Foreign Keys**: `user_id` → `users.id`, `movie_id` → `movies.id`
- **Indexes**: `movie_id`, `user_id`, `created_at`
- **Cascade**: ON DELETE CASCADE for both foreign keys
