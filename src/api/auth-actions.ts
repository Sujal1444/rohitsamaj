import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  createRawToken,
  createUser,
  destroySession,
  getSessionUser,
  hashPassword,
  loginWithPassword,
  toPublicUser,
  verifyPassword,
} from "./auth.server";
import { usersCollection } from "./db.server";
import { getEnv } from "./env.server";
import { sendMail } from "./mail.server";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

const registerSchema = credentialsSchema.extend({
  name: z.string().min(2).max(80),
});

function authError(code: string) {
  return { ok: false as const, error: code };
}

export const registerFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => registerSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const user = await createUser({ name: data.name, email: data.email, password: data.password, role: "user" });
      await loginWithPassword(data.email, data.password);
      return { ok: true as const, user: toPublicUser(user) };
    } catch (error) {
      const message = error instanceof Error ? error.message : "FAILED";
      if (message === "EMAIL_IN_USE") return authError("EMAIL_IN_USE");
      return authError("FAILED");
    }
  });

export const loginFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => credentialsSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const user = await loginWithPassword(data.email, data.password);
      return { ok: true as const, user };
    } catch (error) {
      const message = error instanceof Error ? error.message : "FAILED";
      if (message === "DISABLED") return authError("DISABLED");
      return authError("INVALID_CREDENTIALS");
    }
  });

export const forgotPasswordFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ email: z.string().email() }).parse(data))
  .handler(async ({ data }) => {
    const users = await usersCollection();
    const user = await users.findOne({ email: data.email.trim().toLowerCase() });
    if (!user) return { ok: true as const };

    const token = createRawToken();
    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          resetToken: token,
          resetExpires: new Date(Date.now() + 60 * 60 * 1000),
          updatedAt: new Date(),
        },
      },
    );

    const resetUrl = `${getEnv().appUrl}/reset-password?token=${token}`;
    const mail = await sendMail({
      to: user.email,
      subject: "Reset your RohitSamaj password",
      text: `Reset your password using this link (valid for 1 hour):\n\n${resetUrl}\n`,
    });

    return {
      ok: true as const,
      ...(mail.delivered ? {} : { resetUrl }),
    };
  });

export const resetPasswordFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        token: z.string().min(20),
        password: z.string().min(6),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const users = await usersCollection();
    const user = await users.findOne({
      resetToken: data.token,
      resetExpires: { $gt: new Date() },
    });
    if (!user) return authError("INVALID_TOKEN");

    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          passwordHash: await hashPassword(data.password),
          resetToken: null,
          resetExpires: null,
          updatedAt: new Date(),
        },
      },
    );
    await destroySession();
    return { ok: true as const };
  });

export const updateProfileFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        name: z.string().min(2).max(80),
        email: z.string().email(),
        currentPassword: z.string().optional(),
        newPassword: z.string().min(6).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const current = await getSessionUser();
    if (!current) return authError("UNAUTHORIZED");
    const users = await usersCollection();
    const user = await users.findOne({ email: current.email });
    if (!user) return authError("UNAUTHORIZED");

    const email = data.email.trim().toLowerCase();
    if (email !== user.email) {
      const taken = await users.findOne({ email });
      if (taken) return authError("EMAIL_IN_USE");
    }

    const updates: Record<string, unknown> = {
      name: data.name.trim(),
      email,
      updatedAt: new Date(),
    };

    if (data.newPassword) {
      if (!data.currentPassword) return authError("PASSWORD_REQUIRED");
      const ok = await verifyPassword(data.currentPassword, user.passwordHash);
      if (!ok) return authError("INVALID_CREDENTIALS");
      updates["passwordHash"] = await hashPassword(data.newPassword);
    }

    await users.updateOne({ _id: user._id }, { $set: updates });
    const next = await users.findOne({ _id: user._id });
    return { ok: true as const, user: next ? toPublicUser(next) : current };
  });
