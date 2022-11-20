import { user } from "./interfaces"

export{}

declare global{
  namespace NodeJS{
    interface ProcessEnv{
        PORT: number,
        DB_NAME: string,
        DB_USER: string,
        DB_PASSWORD: string,
        DB_HOST: string,
        DB_PORT: number,

        SECRET_KEY: string
    }
  }
  
  namespace Express {
      interface Request {
         user?: user 
      }
  }
}

