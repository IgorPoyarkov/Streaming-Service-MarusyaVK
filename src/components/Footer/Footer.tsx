import { useLocation } from "react-router-dom";

interface FooterProps {}

const Footer = ({}: FooterProps) => {
  const { pathname } = useLocation();

  const isAccountPage = pathname.includes("/selected");

  const containerClassName = `footer ${isAccountPage ? "footer--selected" : ""}`;

  return (
    <div className={containerClassName}>
      <div className="social-media">
        <ul className="social-media__list">
          <li className="social-media__item social-media__item--vk">
            <a className="social-media__link" href="#">
              <svg className="social-media__icon">
                <use href={"/sprite.svg#social-vk__icon"} />
              </svg>
            </a>
          </li>
          <li className="social-media__item social-media__item--yotube">
            <a className="social-media__link" href="#">
              <svg className="social-media__icon">
                <use href={"/sprite.svg#social-yotube__icon"} />
              </svg>
            </a>
          </li>
          <li className="social-media__item social-media__item--ok">
            <a className="social-media__link" href="#">
              <svg className="social-media__icon">
                <use href={"/sprite.svg#social-ok__icon"} />
              </svg>
            </a>
          </li>
          <li className="social-media__item social-media__item--telegram">
            <a className="social-media__link" href="#">
              <svg className="social-media__icon">
                <use href={"/sprite.svg#social-telegram__icon"} />
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
