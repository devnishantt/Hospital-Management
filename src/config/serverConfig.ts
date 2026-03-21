import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const DATABASE_URL = process.env.DATABASE_URL;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const BCRYPT_SALT_ROUND = process.env.BCRYPT_SALT_ROUND || "10";
export const LOG_LEVEL =
  process.env.LOG_LEVEL || (NODE_ENV === "development" ? "debug" : "info");
