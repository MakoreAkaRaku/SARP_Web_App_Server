import process from 'process';


function parseNodeEnv(): 'production' | 'development' {
  if(process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod') {
    return 'production'
  }

  return 'development'
}

export const configuration = {
    NODE_ENV: parseNodeEnv(),
    PORT: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    jwt_secret: process.env.JWT_SECRET,
    backend_url: process.env.BACKEND_URL ?? 'http://localhost:3030',    
    database: {
        url: process.env.DATABASE_URL ?? 'postgres',
        username: process.env.DATABASE_USERNAME ?? 'postgres',
        password: process.env.DATABASE_PASSWORD ?? 'postgres',
        name: process.env.DATABASE_NAME ?? 'postgres',
    },
    APP_ROOT: process.env.APP_ROOT ?? "root",
    PUBLIC_DIR: process.env.PUBLIC_DIR ?? './public'
} as const;