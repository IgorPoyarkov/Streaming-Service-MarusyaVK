export interface AuthFieldConfig {
  name: string;
  placeholder: string;
  type: "text" | "email" | "password";
}

export interface AuthConfig {
  state: "login" | "authorization" | "success";
  title?: string;
  text?: string;
  buttons: { action: string; opposite?: string };
  authFieldConfig?: AuthFieldConfig[];
}

export const authConfigMap: Record<string, AuthConfig> = {
  login: {
    state: "login",
    buttons: { action: "Войти", opposite: "Регистрация" },
    authFieldConfig: [
      { name: "email", placeholder: "Электронная почта", type: "email" },
      { name: "password", placeholder: "Пароль", type: "password" },
    ],
  },
  register: {
    state: "authorization",
    title: "Регистрация",
    buttons: { action: "Создать аккаунт", opposite: "У меня есть аккаунт" },
    authFieldConfig: [
      { name: "email", placeholder: "Электронная почта", type: "email" },
      { name: "name", placeholder: "Имя", type: "text" },
      { name: "surname", placeholder: "Фамилия", type: "text" },
      { name: "password", placeholder: "Пароль", type: "password" },
      { name: "confirmPassword", placeholder: "Подтвердите пароль", type: "password" },
    ],
  },
  success: {
    state: "success",
    title: "Регистрация завершена",
    text: "Используйте вашу электронную почту для входа",
    buttons: { action: "Войти" },
  },
};