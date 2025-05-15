import { Request, Response } from 'express';
import { bookService } from '../services/bookService';
import { BookInput, validateBook } from '../models/book';

export class BookController {
  getAllBooks(req: Request, res: Response): void {
    const books = bookService.getAllBooks();
    res.json(books);
  }

  getBookById(req: Request, res: Response): void {
    const id = req.params.id;
    const book = bookService.getBookById(id);
    
    if (!book) {
      res.status(404).json({ error: `Book with id ${id} not found` });
      return;
    }
    
    res.json(book);
  }

  addBook(req: Request, res: Response): void {
    const bookInput: BookInput = {
      title: req.body.title,
      author: req.body.author,
      publishedYear: parseInt(req.body.publishedYear)
    };

    const errors = validateBook(bookInput);
    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    const newBook = bookService.addBook(bookInput);
    res.status(201).json(newBook);
  }

  updateBook(req: Request, res: Response): void {
    const id = req.params.id;
    const bookInput: BookInput = {
      title: req.body.title,
      author: req.body.author,
      publishedYear: parseInt(req.body.publishedYear)
    };

    const errors = validateBook(bookInput);
    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    const updatedBook = bookService.updateBook(id, bookInput);
    if (!updatedBook) {
      res.status(404).json({ error: `Book with id ${id} not found` });
      return;
    }

    res.json(updatedBook);
  }

  deleteBook(req: Request, res: Response): void {
    const id = req.params.id;
    const success = bookService.deleteBook(id);
    
    if (!success) {
      res.status(404).json({ error: `Book with id ${id} not found` });
      return;
    }
    
    res.status(204).send();
  }

  importBooks(req: Request, res: Response): void {
    if (!req.file) {
      res.status(400).json({ error: 'No CSV file uploaded' });
      return;
    }

    const csvData = req.file.buffer.toString('utf8');
    const result = bookService.importBooks(csvData);
    
    res.status(result.success ? 200 : 400).json(result);
  }
}

export const bookController = new BookController();