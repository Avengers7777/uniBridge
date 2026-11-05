import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads', 'resumes');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/[^a-z0-9_\-]/gi, '_').toLowerCase();
    cb(null, `${baseName}_${Date.now()}${ext}`);
  }
});

// File filter
const fileFilter = (_req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];
  const allowedExts = ['.pdf', '.doc', '.docx', '.txt'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'));
  }
};

export const resumeUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max
  },
});

/**
 * Extract plain text from an uploaded resume file (PDF, DOCX, TXT).
 */
export async function extractTextFromFile(filePath, originalName) {
  const ext = path.extname(originalName).toLowerCase();

  // TXT file
  if (ext === '.txt') {
    return fs.readFileSync(filePath, 'utf-8');
  }

  // DOCX file — use mammoth
  if (ext === '.docx') {
    try {
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } catch (err) {
      throw new Error('Failed to parse DOCX file. Please ensure it is a valid Word document.');
    }
  }

  // PDF file — use pdf-parse via createRequire
  if (ext === '.pdf') {
    try {
      const pdfParse = require('pdf-parse');
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } catch (err) {
      throw new Error('Failed to parse PDF file. Please ensure it is a text-based PDF (not an image-only scan).');
    }
  }

  if (ext === '.doc') {
    throw new Error('Legacy .doc format is not supported for text extraction. Please save as .docx or .pdf and re-upload.');
  }

  throw new Error(`Unsupported file format: ${ext}`);
}

