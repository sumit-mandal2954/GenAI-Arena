import {config} from 'dotenv'

config();

type CONFIG ={
   readonly GOOGLE_API_KEY: string;
   readonly GROQ_API_KEY: string;
   readonly MISTRAL_API_KEY: string;
   readonly COHERE_API_KEY: string;
   readonly JWT_SECRET: string;
   readonly GOOGLE_CLIENT_ID: string;
   readonly GOOGLE_CLIENT_SECRET: string;
   readonly GOOGLE_CALLBACK_URL: string;
   readonly MONGO_URI: string;
}

const config_key: CONFIG = {
    GOOGLE_API_KEY: process.env.GOOGLE_GENAI_API_KEY || '',
    GROQ_API_KEY: process.env.GROQ_API_KEY || '',
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY || '',
    COHERE_API_KEY: process.env.COHERE_API_KEY || '',
    JWT_SECRET: process.env.JWT_SECRET || '',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || '',
    MONGO_URI: process.env.MONGO_URI || ''
}

export default config_key;