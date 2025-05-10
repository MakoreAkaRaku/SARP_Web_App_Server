import process from 'process';

export const configuration = {
    port: process.env.PORT ?? 8080,
    jwt_secret: process.env.JWT_SECRET,
    backend_url: process.env.BACKEND_URL ?? 'http://localhost:3030',    
    database: {
        url: process.env.DATABASE_URL ?? 'postgres',
        username: process.env.DATABASE_USERNAME ?? 'postgres',
        password: process.env.DATABASE_PASSWORD ?? 'postgres',
        name: process.env.DATABASE_NAME ?? 'postgres',
    },
    APP_ROOT: process.env.APP_ROOT ?? "root",
} as const;