import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { DATA_DIR } from '../db';

/**
 * Decode a Base64-encoded image string and save it as a file.
 * Returns the relative URL path for the saved file.
 * 
 * @param base64 - Full Base64 data URI (e.g., "data:image/png;base64,iVBOR...")
 * @param subdirectory - e.g., "signatures", "photos", "media"
 * @returns Relative path like "/uploads/signatures/abc123.png"
 */
export function decodeBase64ToFile(base64: string, subdirectory: string): string {
    // Extract MIME type and raw data from data URI
    const match = base64.match(/^data:image\/([\w+]+);base64,(.+)$/);
    if (!match) {
        throw new Error('Invalid Base64 image data URI');
    }

    let ext = match[1];
    const rawData = match[2];

    // Normalize extensions
    if (ext === 'jpeg') ext = 'jpg';
    if (ext === 'svg+xml') ext = 'svg';

    const filename = `${uuidv4()}.${ext}`;
    const dir = path.join(DATA_DIR, 'uploads', subdirectory);
    fs.mkdirSync(dir, { recursive: true });

    const filePath = path.join(dir, filename);
    fs.writeFileSync(filePath, Buffer.from(rawData, 'base64'));

    return `/uploads/${subdirectory}/${filename}`;
}

/**
 * Save a multer-uploaded file and return its relative URL path.
 */
export function saveUploadedFile(file: Express.Multer.File, subdirectory: string): string {
    const ext = path.extname(file.originalname) || '.bin';
    const filename = `${uuidv4()}${ext}`;
    const dir = path.join(DATA_DIR, 'uploads', subdirectory);
    fs.mkdirSync(dir, { recursive: true });

    const filePath = path.join(dir, filename);
    fs.writeFileSync(filePath, file.buffer);

    return `/uploads/${subdirectory}/${filename}`;
}

/**
 * Delete a file by its relative URL path.
 */
export function deleteFile(relativePath: string): boolean {
    try {
        const fullPath = path.join(DATA_DIR, relativePath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            return true;
        }
        return false;
    } catch {
        return false;
    }
}
