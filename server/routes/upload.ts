import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth.ts';
import { saveUploadedFile } from '../utils/assets.ts';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

/**
 * POST /api/upload
 * General media upload (hero images, audio, QRIS barcodes)
 * Returns the relative URL path for the uploaded file.
 */
router.post('/', requireAuth, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'File tidak ditemukan' });
    }

    const subdirectory = (req.body.type as string) || 'media';
    const allowedSubdirs = ['media', 'signatures', 'photos'];
    if (!allowedSubdirs.includes(subdirectory)) {
        return res.status(400).json({ error: 'Tipe upload tidak valid' });
    }

    try {
        const filePath = saveUploadedFile(req.file, subdirectory);
        res.json({ url: filePath });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: 'Gagal mengupload file' });
    }
});

export default router;
