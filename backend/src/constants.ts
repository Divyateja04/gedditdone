export const PORT: number = 5000;
export const __prod__ = process.env.NODE_ENV as string === "production";
export const __test__ = process.env.NODE_ENV as string === "test";
export const SESSIONKEY: string = process.env.SESSIONKEY as string;
export const FRONTEND_URL: string = process.env.FRONTEND_URL as string;
export const google_client_id = process.env.GOOGLE_CLIENT_ID;
export const google_redirect_uri = process.env.GOOGLE_OAUTH_REDIRECT_URI;
export const google_client_secret = process.env.GOOGLE_OAUTH_SECRET;
export const DATABASE_URL = process.env.DATABASE_URL;