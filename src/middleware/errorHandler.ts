import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
): void {
  console.error('Error:', err.message);
  console.error(err.stack);
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
}

export function notFoundHandler(
  req: Request, 
  res: Response
): void {
  res.status(404).json({
    error: 'Not Found',
    message: `The requested resource at ${req.path} was not found`
  });
}