import 'reflect-metadata';
import * as fs from 'fs';
import path from 'path';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    schema: 'public',
    logging: true,
    //   ssl: isProd
    //     ? { ca: fs.readFileSync('/etc/secrets/prod-ca-2021.crt').toString() }
    //     : false,
    ssl: {
        ca: isProd
            ? fs.readFileSync('/etc/secrets/prod-ca-2021.crt').toString()
            : process.env.DB_CERT,
    },
    entities: [path.resolve(__dirname, '../models/*.model.{ts,js}')],
    migrations: [path.join(__dirname, '../../../database/migrations/*.{ts,js}')],
    migrationsTableName: 'migrations'
});