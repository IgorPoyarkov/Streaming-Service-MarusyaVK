import type { AuthFieldConfig } from "./auth.constants";
import { asset } from "../../utils/asset";

interface CustomInputAuthProps {
  field: AuthFieldConfig;
  value: string;
  onChange: (value: string) => void;
  isError?: boolean;
}

const sprite = asset("/sprite.svg");

const CustomInputAuth = ({
  field,
  value,
  onChange,
  isError,
}: CustomInputAuthProps) => {
  const fullIconId = `custom-input__auth-icon--${field.name}`;

  return (
    <div className={`custom-input ${isError ? "custom-input--error" : ""}`}>
      <div className="custom-input__wrapper">
        <input
          className="custom-input__input"
          type={field.type}
          placeholder={field.placeholder}
          name={field.name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <svg className="custom-input__icon">
          <use href={`${sprite}#${fullIconId}`} />
        </svg>
      </div>
    </div>
  );
};

export default CustomInputAuth;
