const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('🔧 Setting up database...');
    
    // Read and execute schema
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    await pool.query(schema);
    console.log('✅ Database schema created successfully');

    // Check if users table is empty (first time setup)
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    
    if (parseInt(userCount.rows[0].count) === 0) {
      console.log('🌱 Seeding database with initial data...');
      
      // Create sample users with hashed passwords
      const bcrypt = require('bcrypt');
      const adminPassword = await bcrypt.hash('admin123', 10);
      const userPassword = await bcrypt.hash('password123', 10);

      // Insert users
      await pool.query(`
        INSERT INTO users (name, email, password_hash, role) VALUES 
        ('Admin User', 'admin@moviehub.com', $1, 'admin'),
        ('Alice Johnson', 'alice@example.com', $2, 'user'),
        ('Bob Smith', 'bob@example.com', $3, 'user')
      `, [adminPassword, userPassword, userPassword]);

      // Insert sample movies
      await pool.query(`
        INSERT INTO movies (title, description, added_by) VALUES 
        ('The Shawshank Redemption', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', 1),
        ('The Godfather', 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', 2),
        ('The Dark Knight', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.', 3),
        ('Pulp Fiction', 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.', 1),
        ('Inception', 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', 2)
      `);

      // Insert some sample votes
      await pool.query(`
        INSERT INTO votes (user_id, movie_id, vote_type) VALUES 
        (2, 1, 1), (3, 1, 1), (1, 2, 1),
        (2, 2, 1), (3, 3, 1), (1, 3, 1),
        (2, 4, -1), (3, 5, 1)
      `);

      // Insert sample comments
      await pool.query(`
        INSERT INTO comments (user_id, movie_id, body) VALUES 
        (2, 1, 'Absolutely incredible movie! A masterpiece of storytelling.'),
        (3, 1, 'One of the best films ever made. The character development is amazing.'),
        (1, 2, 'Classic Coppola. The cinematography and acting are top-notch.'),
        (2, 3, 'Heath Ledger''s Joker is unforgettable. Dark and gripping.'),
        (3, 4, 'Tarantino at his finest. Non-linear storytelling at its best.')
      `);

      console.log('✅ Database seeded with sample data');
    } else {
      console.log('ℹ️  Database already contains data, skipping seed');
    }

  } catch (error) {
    console.error('❌ Database setup error:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

module.exports = setupDatabase;
