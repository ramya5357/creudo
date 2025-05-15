# Book Management API

A RESTful API for managing books, built with Node.js and TypeScript.

## Features

- Complete CRUD operations for books
- Bulk import of books via CSV
- Data validation
- Error handling

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /books | Get all books |
| GET | /books/:id | Get a specific book by ID |
| POST | /books | Create a new book |
| PUT | /books/:id | Update an existing book |
| DELETE | /books/:id | Delete a book |
| POST | /books/import | Bulk import books from CSV |

## Book Object Structure

```typescript
{
  id: string;         // UUID
  title: string;      // Book title
  author: string;     // Author name
  publishedYear: number; // Year published
}
```

## CSV Import Format

The CSV file for bulk import should have the following headers:
- title
- author
- publishedYear

Example:
```
title,author,publishedYear
The Great Gatsby,F. Scott Fitzgerald,1925
To Kill a Mockingbird,Harper Lee,1960
```

## Setup and Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Run the development server:
   ```
   npm run dev
   ```

3. Build for production:
   ```
   npm run build
   ```

4. Start the production server:
   ```
   npm start
   ```

## Testing the API

You can test the API using tools like Postman, cURL, or any HTTP client.

### Example: Creating a new book

```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "publishedYear": 1925
  }'
```

### Example: Importing books from CSV

```bash
curl -X POST http://localhost:3000/books/import \
  -F "file=@books.csv"
```