import multer from 'multer';

// Configuração do Multer (Armazenamento em memória)
export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // Limite de 50MB
  }
});
