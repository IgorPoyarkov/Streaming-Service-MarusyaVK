import { NavLink } from "react-router-dom";
import { useProfileUser } from "../../services/users/users.api";
import CustomSearch from "./CustomSearch";

interface HeaderProps {}

const Header = ({}: HeaderProps) => {
  const { data: profile } = useProfileUser();
  const isAuthorized = !!profile && !profile.result;

  return (
    <header className="header">
      <nav className="header__nav">
        <ul className="header__list">
          <li className="header__item header__item--logo">
            <NavLink className="header__link" to="/">
              <svg className="header__icon header__icon--logo">
                <use href="/sprite.svg#logo" />
              </svg>
            </NavLink>
          </li>

          <li className="header__item">
            <NavLink
              className={({ isActive }) =>
                `header__link ${isActive ? "header__link--active" : ""}`
              }
              to="/"
            >
              <span className="header__text">Главная</span>
            </NavLink>
          </li>

          <li className="header__item">
            <NavLink
              className={({ isActive }) =>
                `header__link ${isActive ? "header__link--active" : ""}`
              }
              to="/movie/genres"
            >
              <span className="header__text">Жанры</span>
              <svg className="header__icon">
                <use href={"/sprite.svg#genre-icon"} />
              </svg>
            </NavLink>
          </li>

          <li className="header__item header__item--search">
            <CustomSearch />
          </li>

          <li className="header__item header__item--auth">
            <NavLink
              className={({ isActive }) =>
                `header__link ${isAuthorized ? "header__link--user" : ""} ${isActive ? "header__link--active" : ""}`
              }
              to={isAuthorized ? "/account/selected" : "/?auth=login"}
            >
              <span className="header__text">
                {isAuthorized ? `${profile?.name}` : "Войти"}
              </span>
              <svg className="header__icon">
                <use href={"/sprite.svg#user__icon"} />
              </svg>
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
