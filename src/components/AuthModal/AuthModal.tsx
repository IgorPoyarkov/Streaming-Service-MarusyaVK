import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import CustomInputAuth from "./CustomInputAuth";
import { authConfigMap } from "./auth.constants";
import { asset } from "../../utils/asset";
import {
  useLoginMutation,
  useRegisterMutation,
} from "../../services/users/users.api";

const AuthModal = () => {
  const queryClient = useQueryClient();
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();

  const [searchParams, setSearchParams] = useSearchParams();
  const authState = searchParams.get("auth");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    surname: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

  if (!authState || !authConfigMap[authState]) return null;

  const currentConfig = authConfigMap[authState];

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => {
        const updatedErrors = { ...prev };
        delete updatedErrors[name];
        return updatedErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, boolean> = {};

    if (!formData.email.trim()) errors.email = true;
    if (!formData.password) errors.password = true;

    if (authState === "register") {
      if (!formData.name.trim()) errors.name = true;

      if (formData.password !== formData.confirmPassword) {
        errors.password = true;
        errors.confirmPassword = true;
      }
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (authState === "login") {
      loginMutation.mutate(
        { email: formData.email, password: formData.password },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profileUser"] });

            setSearchParams({});
            setFormData({
              email: "",
              password: "",
              name: "",
              surname: "",
              confirmPassword: "",
            });
            setFormErrors({});
          },
          onError: () => {
            setFormErrors({ email: true, password: true });
          },
        },
      );
    } else if (authState === "register") {
      registerMutation.mutate(
        {
          email: formData.email,
          password: formData.password,
          name: formData.name,
        },
        {
          onSuccess: () => {
            setSearchParams({ auth: "success" });
            setFormErrors({});
          },
          onError: () => {
            setFormErrors({ email: true });
          },
        },
      );
    }
  };

  const handleToggleAuth = () => {
    setFormErrors({});
    setSearchParams({ auth: authState === "login" ? "register" : "login" });
  };

  const handleCloseAuth = () => {
    setFormErrors({});
    setSearchParams({});
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className={`auth-modal auth-modal--open auth-modal--${authState}`}>
      <div className="auth-modal__wrapper">
        <button
          className="auth-modal__closs btn"
          type="button"
          onClick={handleCloseAuth}
        />

        <form className="auth-modal__form" onSubmit={handleSubmitForm}>
          <div className="auth-modal__logo">
            <svg className="auth-modal__logo-icon">
              <use href={asset("/sprite.svg#logo")} />
            </svg>
          </div>

          {currentConfig.title && (
            <h2 className="auth-modal__title">{currentConfig.title}</h2>
          )}

          {currentConfig.text && (
            <p className="auth-modal__text">{currentConfig.text}</p>
          )}

          <div className="auth-modal__fields">
            {currentConfig.authFieldConfig?.map((field) => (
              <CustomInputAuth
                key={field.name}
                field={field}
                value={formData[field.name as keyof typeof formData] || ""}
                onChange={(value) => handleInputChange(field.name, value)}
                isError={!!formErrors[field.name]}
              />
            ))}
          </div>
          <button
            className="auth-modal__action btn"
            type={authState === "success" ? "button" : "submit"}
            onClick={
              authState === "success"
                ? () => setSearchParams({ auth: "login" })
                : undefined
            }
            disabled={isPending}
          >
            {isPending ? "Загрузка..." : currentConfig.buttons.action}
          </button>

          {currentConfig.buttons.opposite && (
            <button
              className="auth-modal__action auth-modal__action--opposite btn"
              type="button"
              onClick={handleToggleAuth}
              disabled={isPending}
            >
              {currentConfig.buttons.opposite}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
