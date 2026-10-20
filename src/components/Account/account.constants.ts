export interface AccountFieldConfig {
  page: "selected" | "userfield";
  icon: string;
  link: string;
  linkMobile?: string;
}

export interface AccountConfig {
  title: string;
  accountFieldConfig: AccountFieldConfig[];
}

export const accountConfig: AccountConfig = {
  title: "Мой аккаунт",
  accountFieldConfig: [
    {
      page: "selected",
      icon: "little-heart__icon",
      link: "Избранные фильмы",
      linkMobile: "Избранное",
    },
    {
      page: "userfield",
      icon: "user__icon",
      link: "Настройка аккаунта",
      linkMobile: "Настройки",
    },
  ],
};
