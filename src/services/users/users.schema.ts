import { z } from "zod";

export const UserSchema = z.object({
  name: z.string().optional(),
  surname: z.string().optional(),
  email: z.string().email().default(""),
  password: z.string().default(""),
  favorites: z.array(z.string()).optional(),
  result: z.boolean().default(false).optional(),
});

export type ApiUser = z.infer<typeof UserSchema>;

export const RegisterDataUserSchema = UserSchema.omit({
  favorites: true,
});

export type RegisterDataUser = z.infer<typeof RegisterDataUserSchema>;

export const UserFormSchema = RegisterDataUserSchema.omit({
  result: true,
});

export type UserForm = z.infer<typeof UserFormSchema>;

export const AuthInfoSchema = UserSchema.pick({
  name: true,
  email: true,
});

export type ApiAuthInfo = z.infer<typeof AuthInfoSchema>;

export const LoginCredentialsSchema = UserSchema.pick({
  email: true,
  password: true,
});

export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;

export const LogoutSchema = z.object({
  result: UserSchema.shape.result.unwrap().default(false),
});

export type Logout = z.infer<typeof LogoutSchema>;

export const DeleteFavoriteResponseSchema = UserSchema.omit({
  password: true,
  result: true,
});

export type DeleteFavoriteResponse = z.infer<
  typeof DeleteFavoriteResponseSchema
>;
