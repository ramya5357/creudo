import { Router } from 'express';
import { bookController } from '../controllers/bookController';
import multer from 'multer';

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

// Book CRUD routes
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.post('/', bookController.addBook);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

// Book import route
router.post('/import', upload.single('file'), bookController.importBooks);

export default router;