import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LogoutSchema,
  UserSchema,
  type ApiUser,
  type LoginCredentials,
  type Logout,
  type RegisterDataUser,
} from "./users.schema";

const BASE_URL = "https://cinemaguide.skillbox.cc";

const loginUser = async (credentials: LoginCredentials): Promise<ApiUser> => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Неверный логин или пароль");
  }

  const data = await response.json();
  return UserSchema.parse(data);
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiUser, Error, LoginCredentials>({
    mutationFn: loginUser,
    onSuccess: (serverUserData) => {
      queryClient.setQueryData(["profileUser"], serverUserData);
      queryClient.invalidateQueries({ queryKey: ["profileUser"] });
      queryClient.invalidateQueries({ queryKey: ["favoriteMovies"] });
    },
  });
};

const registerUser = async (userData: RegisterDataUser): Promise<ApiUser> => {
  const response = await fetch(`${BASE_URL}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",

    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Не удалось создать аккаунт. Возможно, email уже занят");
  }

  const data = await response.json();
  return UserSchema.parse(data);
};

export const useRegisterMutation = () => {
  return useMutation<ApiUser, Error, RegisterDataUser>({
    mutationFn: registerUser,
  });
};

const fetchProfileUser = async (): Promise<ApiUser> => {
  const response = await fetch(`${BASE_URL}/profile`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Не удалось загрузить сведения о пользователе");
  }

  const data = await response.json();
  return UserSchema.parse(data);
};

export const useProfileUser = () => {
  return useQuery<ApiUser, Error>({
    queryKey: ["profileUser"],
    queryFn: fetchProfileUser,
  });
};

const fetchLogoutUser = async (): Promise<Logout> => {
  const response = await fetch(`${BASE_URL}/auth/logout`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Не удалось выполнить выход из аккаунта");
  }

  const data = await response.json();
  return LogoutSchema.parse(data);
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Logout, Error, void>({
    mutationFn: fetchLogoutUser,
    onSuccess: () => {
      queryClient.setQueryData(["profileUser"], null);
      queryClient.invalidateQueries({ queryKey: ["profileUser"] });
    },
  });
};
