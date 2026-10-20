import { NavLink, Outlet } from "react-router-dom";
import { accountConfig } from "./account.constants";

interface accountProps {}

const account = ({}: accountProps) => {
  const accountConfigRender = accountConfig;

  return (
    <div className="account">
      <h2 className="account-title">{accountConfigRender.title}</h2>
      <ul className="account-list">
        {accountConfigRender.accountFieldConfig.map((field) => {
          return (
            <li key={field.page} className="account-item">
              <NavLink
                to={`/account/${field.page}`}
                className={({ isActive }) =>
                  `account-wrapper ${isActive ? "account-wrapper--active" : ""}`
                }
              >
                <svg className="account-icon">
                  <use href={`/sprite.svg#${field.icon}`} />
                </svg>
                <span className="account-link">{field.link}</span>
                <span className="account-link account-link--mobile">
                  {field.linkMobile}
                </span>
              </NavLink>
            </li>
          );
        })}
      </ul>
      <div className="account-content">
        <Outlet />
      </div>
    </div>
  );
};

export default account;
