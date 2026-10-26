import { config } from "dotenv";

config();

function required(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback;
  if (!value) throw new Error(`Missing required env: ${name}`);
  return value;
}

export function getEnv() {
  return {
    mongodbUri: required("MONGODB_URI", "mongodb://127.0.0.1:27017"),
    mongodbDb: required("MONGODB_DB", "rohitsamaj"),
    sessionSecret: required("SESSION_SECRET", "dev-session-secret"),
    adminEmail: required("ADMIN_EMAIL", "admin@rohitsamaj.com"),
    adminPassword: required("ADMIN_PASSWORD", "admin"),
    adminName: required("ADMIN_NAME", "Admin"),
    appUrl: required("APP_URL", "http://localhost:8080"),
    smtp: {
      host: process.env["SMTP_HOST"] ?? "",
      port: Number(process.env["SMTP_PORT"] ?? "587"),
      user: process.env["SMTP_USER"] ?? "",
      pass: process.env["SMTP_PASS"] ?? "",
      from: process.env["SMTP_FROM"] ?? "noreply@rohitsamaj.com",
    },
  };
}
