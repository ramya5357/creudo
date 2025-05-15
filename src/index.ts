import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import bookRoutes from './routes/bookRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/books', bookRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({
    message: 'Book Management API',
    endpoints: {
      books: {
        get: '/books',
        getById: '/books/:id',
        create: '/books',
        update: '/books/:id',
        delete: '/books/:id',
        import: '/books/import'
      }
    }
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Book Management API is available at http://localhost:${PORT}`);
  });
}

export default app;