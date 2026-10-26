import nodemailer from "nodemailer";
import { getEnv } from "./env.server";

export async function sendMail(options: { to: string; subject: string; text: string }) {
  const env = getEnv();
  if (!env.smtp.host) {
    console.info(`[mail:dev] to=${options.to} subject=${options.subject}\n${options.text}`);
    return { delivered: false as const, preview: options.text };
  }

  const transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
  });

  await transporter.sendMail({
    from: env.smtp.from,
    to: options.to,
    subject: options.subject,
    text: options.text,
  });
  return { delivered: true as const };
}
