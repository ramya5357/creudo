import { v4 as uuidv4 } from 'uuid';

export interface Book {
  id: string;
  title: string;
  author: string;
  publishedYear: number;
}

export interface BookInput {
  title: string;
  author: string;
  publishedYear: number;
}

export interface ValidationError {
  row?: number;
  field: string;
  message: string;
}

export interface ImportResult {
  success: boolean;
  booksAdded: number;
  errors: ValidationError[];
}

export function validateBook(book: Partial<BookInput>, rowNumber?: number): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!book.title || typeof book.title !== 'string' || book.title.trim() === '') {
    errors.push({
      row: rowNumber,
      field: 'title',
      message: 'Title is required and must be a non-empty string'
    });
  }

  if (!book.author || typeof book.author !== 'string' || book.author.trim() === '') {
    errors.push({
      row: rowNumber,
      field: 'author',
      message: 'Author is required and must be a non-empty string'
    });
  }

  if (!book.publishedYear || 
      typeof book.publishedYear !== 'number' || 
      isNaN(book.publishedYear) || 
      book.publishedYear < 0 || 
      book.publishedYear > new Date().getFullYear()) {
    errors.push({
      row: rowNumber,
      field: 'publishedYear',
      message: `Published year must be a valid year between 0 and ${new Date().getFullYear()}`
    });
  }

  return errors;
}

export function createBook(bookInput: BookInput): Book {
  return {
    id: uuidv4(),
    ...bookInput
  };
}