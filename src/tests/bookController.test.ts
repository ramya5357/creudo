import request from 'supertest';
import app from '../index';
import { bookService } from '../services/bookService';

describe('Book Controller', () => {
  beforeEach(() => {
    // Clear books before each test
    bookService['books'] = [];
  });

  describe('GET /books', () => {
    it('should return empty array when no books exist', async () => {
      const response = await request(app).get('/books');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return all books', async () => {
      const testBook = {
        title: 'Test Book',
        author: 'Test Author',
        publishedYear: 2023
      };
      
      const createdBook = await request(app)
        .post('/books')
        .send(testBook);

      const response = await request(app).get('/books');
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe(testBook.title);
    });
  });

  describe('POST /books', () => {
    it('should create a new book', async () => {
      const testBook = {
        title: 'Test Book',
        author: 'Test Author',
        publishedYear: 2023
      };

      const response = await request(app)
        .post('/books')
        .send(testBook);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(testBook.title);
      expect(response.body.author).toBe(testBook.author);
      expect(response.body.publishedYear).toBe(testBook.publishedYear);
      expect(response.body.id).toBeDefined();
    });

    it('should return 400 for invalid book data', async () => {
      const invalidBook = {
        title: '',
        author: '',
        publishedYear: -1
      };

      const response = await request(app)
        .post('/books')
        .send(invalidBook);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.length).toBeGreaterThan(0);
    });
  });

  describe('GET /books/:id', () => {
    it('should return a specific book', async () => {
      const testBook = {
        title: 'Test Book',
        author: 'Test Author',
        publishedYear: 2023
      };

      const createdBook = await request(app)
        .post('/books')
        .send(testBook);

      const response = await request(app)
        .get(`/books/${createdBook.body.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(createdBook.body.id);
      expect(response.body.title).toBe(testBook.title);
    });

    it('should return 404 for non-existent book', async () => {
      const response = await request(app)
        .get('/books/non-existent-id');

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /books/:id', () => {
    it('should delete an existing book', async () => {
      const testBook = {
        title: 'Test Book',
        author: 'Test Author',
        publishedYear: 2023
      };

      const createdBook = await request(app)
        .post('/books')
        .send(testBook);

      const response = await request(app)
        .delete(`/books/${createdBook.body.id}`);

      expect(response.status).toBe(204);

      const getResponse = await request(app)
        .get(`/books/${createdBook.body.id}`);
      expect(getResponse.status).toBe(404);
    });
  });
});