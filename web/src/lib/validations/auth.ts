import { z } from "zod";

/** Shared rules: 8+ chars, one uppercase letter, one non-alphanumeric symbol. */
export const passwordPolicy = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[A-Z]/, "Include at least one uppercase letter")
  .regex(/[^A-Za-z0-9]/, "Include at least one symbol (like ! or @)");

const registerBaseSchema = z.object({
  name: z.string().trim().max(80),
  email: z.string().trim().email("Invalid email"),
  password: passwordPolicy,
});

/** Used by API — no confirm field. */
export const registerSchema = registerBaseSchema;

/** Used by the client registration form. */
export const registerFormSchema = registerBaseSchema
  .extend({
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const forgotSchema = z.object({
  email: z.string().trim().email("Invalid email"),
});

export const resetSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: passwordPolicy,
});
