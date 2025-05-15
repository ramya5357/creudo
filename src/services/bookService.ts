import { Book, BookInput, createBook, ImportResult, validateBook, ValidationError } from '../models/book';

export class BookService {
  private books: Book[] = [];

  getAllBooks(): Book[] {
    return this.books;
  }

  getBookById(id: string): Book | undefined {
    return this.books.find(book => book.id === id);
  }

  addBook(bookInput: BookInput): Book {
    const newBook = createBook(bookInput);
    this.books.push(newBook);
    return newBook;
  }

  updateBook(id: string, bookInput: BookInput): Book | undefined {
    const index = this.books.findIndex(book => book.id === id);
    if (index === -1) return undefined;

    const updatedBook: Book = {
      id,
      ...bookInput
    };

    this.books[index] = updatedBook;
    return updatedBook;
  }

  deleteBook(id: string): boolean {
    const initialLength = this.books.length;
    this.books = this.books.filter(book => book.id !== id);
    return this.books.length !== initialLength;
  }

  importBooks(csvData: string): ImportResult {
    const result: ImportResult = {
      success: false,
      booksAdded: 0,
      errors: []
    };

    try {
      const rows = csvData.trim().split('\n');
      if (rows.length < 2) {
        result.errors.push({
          field: 'file',
          message: 'CSV file must contain at least a header row and one data row'
        });
        return result;
      }

      const header = rows[0].split(',');
      const expectedHeader = ['title', 'author', 'publishedYear'];
      
      // Validate header
      if (header.length !== expectedHeader.length || 
          !expectedHeader.every(col => header.includes(col))) {
        result.errors.push({
          field: 'header',
          message: `CSV header must contain ${expectedHeader.join(', ')}`
        });
        return result;
      }

      // Process each data row
      for (let i = 1; i < rows.length; i++) {
        if (!rows[i].trim()) continue; // Skip empty rows
        
        const values = rows[i].split(',');
        if (values.length !== header.length) {
          result.errors.push({
            row: i,
            field: 'format',
            message: `Row ${i} has ${values.length} values, expected ${header.length}`
          });
          continue;
        }

        const bookData: Partial<BookInput> = {
          title: values[header.indexOf('title')].trim(),
          author: values[header.indexOf('author')].trim(),
          publishedYear: parseInt(values[header.indexOf('publishedYear')].trim())
        };

        const validationErrors = validateBook(bookData, i);
        if (validationErrors.length > 0) {
          result.errors.push(...validationErrors);
          continue;
        }

        // If validation passes, add the book
        this.addBook(bookData as BookInput);
        result.booksAdded++;
      }

      result.success = result.errors.length === 0;
      return result;
    } catch (error) {
      result.errors.push({
        field: 'file',
        message: `Failed to parse CSV file: ${(error as Error).message}`
      });
      return result;
    }
  }
}

// Singleton instance
export const bookService = new BookService();