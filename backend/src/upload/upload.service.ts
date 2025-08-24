import { Injectable, BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
    private readonly uploadPath = path.join(process.cwd(), '..', 'public', 'uploads', 'profile-pictures');

    constructor() {
        // Ensure upload directory exists
        this.ensureUploadDirectory();
    }

    private ensureUploadDirectory() {
        if (!fs.existsSync(this.uploadPath)) {
            fs.mkdirSync(this.uploadPath, { recursive: true });
        }
    }

    getMulterConfig() {
        return {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    cb(null, this.uploadPath);
                },
                filename: (req, file, cb) => {
                    // Generate unique filename: timestamp-random-originalname
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    const ext = extname(file.originalname);
                    const filename = `profile-${uniqueSuffix}${ext}`;
                    cb(null, filename);
                },
            }),
            fileFilter: (req, file, cb) => {
                // Only allow image files
                if (!file.mimetype.match(/^image\/(jpeg|jpg|png)$/)) {
                    return cb(new BadRequestException('Only JPEG and PNG images are allowed'), false);
                }
                cb(null, true);
            },
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB limit
            },
        };
    }

    generateFileUrl(filename: string): string {
        return `/uploads/profile-pictures/${filename}`;
    }

    deleteFile(filename: string): boolean {
        try {
            const filePath = path.join(this.uploadPath, filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting file:', error);
            return false;
        }
    }
}