import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService {
    private readonly logger = new Logger(StorageService.name);
    private readonly storagePath = path.resolve(process.cwd(), 'storage');

    private readonly allowedMimeTypes: string[] = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp'
    ];

    constructor() {
        this.ensureStorageDir();
    }

    private async ensureStorageDir() {
        try {
            await fs.mkdir(this.storagePath, { recursive: true });
        } catch (error) {
            this.logger.error(`Error creating storage directory: ${error.message}`);
        }
    }

    async uploadFile(key: string, body: Buffer | Uint8Array | string, contentType: string) {
        try {

            // Validar MIME type
            if (!this.allowedMimeTypes.includes(contentType)) {
                throw new BadRequestException(
                    `Tipo de archivi no admitido: ${contentType}. Permitidos: ${this.allowedMimeTypes.join(', ')}`,
                );
            }

            const filePath = path.join(this.storagePath, key);

            // Crear subdirectorios si es necesario
            await fs.mkdir(path.dirname(filePath), { recursive: true });

            if (typeof body === 'string') {
                await fs.writeFile(filePath, body, 'utf-8');
            } else {
                await fs.writeFile(filePath, body);
            }

            this.logger.log(`File uploaded successfully: ${filePath}`);
            return { path: filePath, key };
        } catch (error) {
            this.logger.error(`Error uploading file: ${error.message}`);
            throw error;
        }
    }

    async getFile(key: string) {
        try {
            const filePath = path.join(this.storagePath, key);
            const data = await fs.readFile(filePath);
            return data;
        } catch (error) {
            this.logger.error(`Error getting file: ${key}`, error.stack);
            throw error;
        }
    }

    async deleteFile(key: string) {
        try {
            const filePath = path.join(this.storagePath, key);
            await fs.unlink(filePath);
            this.logger.log(`File deleted: ${filePath}`);
            return true;
        } catch (error) {
            this.logger.error(`Error deleting file: ${key}`, error.stack);
            throw error;
        }
    }

    async listFiles(prefix = '') {
        try {
            const dirPath = path.join(this.storagePath, prefix);
            const files = await this.walk(dirPath, prefix);
            return files;
        } catch (error) {
            this.logger.error(`Error listing files in path ${prefix}`, error.stack);
            throw error;
        }
    }

    private async walk(dir: string, prefix: string, fileList: string[] = []): Promise<string[]> {
        try {
            const files = await fs.readdir(dir, { withFileTypes: true });
            for (const file of files) {
                const fullPath = path.join(dir, file.name);
                if (file.isDirectory()) {
                    await this.walk(fullPath, prefix, fileList);
                } else {
                    fileList.push(path.relative(this.storagePath, fullPath));
                }
            }
        } catch (error) {
            // si el directorio no existe, devolvemos lista vacía
        }
        return fileList;
    }
}