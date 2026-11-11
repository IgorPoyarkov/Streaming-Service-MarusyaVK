import { useProfileUser } from "../../services/users/users.api";
import Loader from "../Loader/Loader";
import { asset } from "../../utils/asset";

interface UserFieldProps {}

const UserField = ({}: UserFieldProps) => {
  const { data: profile, isLoading } = useProfileUser();

  return (
    <div className="user-field">
      {isLoading && <Loader count={7} size={200} />}
      <ul className="user-field__list">
        <li className="user-field__item">
          <span className="user-field__cell user-field__abbreviation">
            {profile?.name?.charAt(0).toUpperCase()}{" "}
            {profile?.surname?.charAt(0).toUpperCase()}
          </span>
          <span className="user-field__cell user-field__label">
            Имя Фамилия
          </span>
          <span className="user-field__cell user-field__content">
            {profile?.name} {profile?.surname}
          </span>
        </li>

        <li className="user-field__item">
          <span className="user-field__cell user-field__abbreviation">
            <svg className="user-field__icon">
              <use href={asset("/sprite.svg#custom-input__auth-icon--email")} />
            </svg>
          </span>
          <span className="user-field__cell user-field__label">
            Электронная почта
          </span>
          <span className="user-field__cell user-field__content">
            {profile?.email}
          </span>
        </li>
      </ul>
    </div>
  );
};

export default UserField;
