require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('./config/database');

const seedDatabase = async () => {
  const client = await pool.connect();
  
  try {
    console.log('Starting database seeding...');
    
    await client.query('BEGIN');

    // Clear existing data
    console.log('Clearing existing data...');
    await client.query('DELETE FROM comments');
    await client.query('DELETE FROM votes');
    await client.query('DELETE FROM movies');
    await client.query('DELETE FROM users');

    // Reset sequences
    await client.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE movies_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE votes_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE comments_id_seq RESTART WITH 1');

    // Create users
    console.log('Creating users...');
    const saltRounds = 10;
    
    const users = [
      { name: 'John Admin', email: 'admin@moviehub.com', password: 'admin123', role: 'admin' },
      { name: 'Alice User', email: 'alice@example.com', password: 'password123', role: 'user' },
      { name: 'Bob Smith', email: 'bob@example.com', password: 'password123', role: 'user' }
    ];

    const userIds = [];
    for (const user of users) {
      const passwordHash = await bcrypt.hash(user.password, saltRounds);
      const result = await client.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id',
        [user.name, user.email, passwordHash, user.role]
      );
      userIds.push(result.rows[0].id);
      console.log(`Created user: ${user.email} (password: ${user.password})`);
    }

    // Create movies
    console.log('Creating movies...');
    const movies = [
      { title: 'The Shawshank Redemption', description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.' },
      { title: 'The Godfather', description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.' },
      { title: 'The Dark Knight', description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.' },
      { title: 'Pulp Fiction', description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.' },
      { title: 'Inception', description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.' },
      { title: 'The Matrix', description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.' },
      { title: 'Interstellar', description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.' },
      { title: 'Parasite', description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.' },
      { title: 'The Lord of the Rings: The Fellowship of the Ring', description: 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring.' },
      { title: 'Fight Club', description: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.' }
    ];

    const movieIds = [];
    for (let i = 0; i < movies.length; i++) {
      const movie = movies[i];
      const addedBy = userIds[Math.floor(Math.random() * userIds.length)];
      const result = await client.query(
        'INSERT INTO movies (title, description, added_by) VALUES ($1, $2, $3) RETURNING id',
        [movie.title, movie.description, addedBy]
      );
      movieIds.push(result.rows[0].id);
      console.log(`Created movie: ${movie.title}`);
    }

    // Create random votes
    console.log('Creating votes...');
    for (const userId of userIds) {
      // Each user votes on 5-8 random movies
      const numVotes = 5 + Math.floor(Math.random() * 4);
      const votedMovies = new Set();
      
      for (let i = 0; i < numVotes; i++) {
        let movieId;
        do {
          movieId = movieIds[Math.floor(Math.random() * movieIds.length)];
        } while (votedMovies.has(movieId));
        
        votedMovies.add(movieId);
        const voteType = Math.random() > 0.3 ? 1 : -1; // 70% upvotes, 30% downvotes
        
        await client.query(
          'INSERT INTO votes (user_id, movie_id, vote_type) VALUES ($1, $2, $3)',
          [userId, movieId, voteType]
        );
      }
    }

    // Create sample comments
    console.log('Creating comments...');
    const sampleComments = [
      'Great movie! Highly recommended.',
      'One of my all-time favorites.',
      'The cinematography is outstanding.',
      'Brilliant storytelling and character development.',
      'A masterpiece of cinema.',
      'Not my cup of tea, but well made.',
      'Overrated in my opinion.',
      'The ending was perfect!',
      'I could watch this movie over and over.',
      'The soundtrack really adds to the experience.',
      'Acting performances were top-notch.',
      'A bit slow in the middle, but worth it.',
      'This movie changed my perspective on things.',
      'Classic film that everyone should see.',
      'The plot twists kept me on the edge of my seat.'
    ];

    for (const movieId of movieIds) {
      // Add 1-3 comments per movie
      const numComments = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < numComments; i++) {
        const userId = userIds[Math.floor(Math.random() * userIds.length)];
        const comment = sampleComments[Math.floor(Math.random() * sampleComments.length)];
        
        await client.query(
          'INSERT INTO comments (user_id, movie_id, body) VALUES ($1, $2, $3)',
          [userId, movieId, comment]
        );
      }
    }

    await client.query('COMMIT');
    console.log('\n✅ Database seeded successfully!');
    
    console.log('\n📧 Test accounts:');
    console.log('Admin: admin@moviehub.com / admin123');
    console.log('User 1: alice@example.com / password123');
    console.log('User 2: bob@example.com / password123');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    client.release();
    process.exit(0);
  }
};

// Run the seed function
seedDatabase().catch(error => {
  console.error('Failed to seed database:', error);
  process.exit(1);
});
