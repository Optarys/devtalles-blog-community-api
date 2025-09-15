import { Injectable, Logger } from '@nestjs/common';
import { InjectS3 } from 'nestjs-s3';
import type { S3 } from 'nestjs-s3';

@Injectable()
export class StorageService {
    private readonly logger = new Logger(StorageService.name);
    private readonly bucket = 'devtalles-blog-storage';

    constructor(@InjectS3() private readonly s3: S3) {
    }

    async uploadFile(key: string, body: Buffer | Uint8Array | Blob | string, contentType: string) {
        try {
            const a = await this.s3.putObject({
                Bucket: this.bucket,
                Key: key,
                Body: body,
                ContentType: contentType
            });

            console.log(a)

            this.logger.log(`File uploaded successfully: ${this.bucket}/${key}`);
            return { bucke: this.bucket, key };
        } catch (error) {
            this.logger.error(`Error uploading file: ${error.message}`);
            throw error;
        }
    }

    async getFile(key: string) {
        try {
            const result = await this.s3.getObject({
                Bucket: this.bucket,
                Key: key,
            });

            return result.Body; // Puede ser un stream
        } catch (error) {
            this.logger.error(`Error getting file: ${this.bucket}/${key}`, error.stack);
            throw error;
        }
    }

    async deleteFile(key: string) {
        try {
            await this.s3.deleteObject({
                Bucket: this.bucket,
                Key: key,
            });

            this.logger.log(`File deleted: ${this.bucket}/${key}`);
            return true;
        } catch (error) {
            this.logger.error(`Error deleting file: ${this.bucket}/${key}`, error.stack);
            throw error;
        }
    }

    async listFiles(prefix?: string) {
        try {
            const result = await this.s3.listObjectsV2({
                Bucket: this.bucket,
                Prefix: prefix,
            });

            return result.Contents?.map(item => item.Key) ?? [];
        } catch (error) {
            this.logger.error(`Error listing files in bucket ${this.bucket}`, error.stack);
            throw error;
        }
    }
}
